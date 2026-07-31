from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask import current_app
from extensions import db, logger
from models.user import User
from schemas.user_schema import UserSchema
from utils.auth_helpers import get_current_user
from utils.email import send_email_via_brevo   
import jwt
from datetime import datetime, timedelta

user_schema = UserSchema()
user_parser = reqparse.RequestParser()
user_parser.add_argument('name', type=str, required=True, help='Name is required')
user_parser.add_argument('email', type=str, required=True, help='Email is required')
user_parser.add_argument('password', type=str, required=True, help='Password is required')

class Register(Resource):
    def post(self):
        data = user_parser.parse_args()
        errors = user_schema.validate(data)
        if errors:
            logger.warning("Registration validation failed", errors=errors)
            return {'errors': errors}, 400

        user = User(name=data['name'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        logger.info(f"User registered: {user.email}")
        return {'message': 'User created successfully'}, 201

class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        data = parser.parse_args()

        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            logger.warning(f"Failed login attempt for {data['email']}")
            return {'message': 'Invalid credentials'}, 401

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        logger.info(f"User logged in: {user.email}")
        return {'access_token': access_token, 'refresh_token': refresh_token, 'user': user.to_dict()}, 200

class Refresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=str(user_id))
        return {'access_token': new_access_token}, 200

class Logout(Resource):
    @jwt_required()
    def delete(self):
        return {'message': 'Successfully logged out'}, 200

class Me(Resource):
    @jwt_required()
    def get(self):
        user = get_current_user()
        if not user:
            return {'message': 'User not found'}, 404
        return user.to_dict(), 200

class ForgotPassword(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)
        data = parser.parse_args()

        user = User.query.filter_by(email=data['email']).first()
        if not user:
            # For security, don't reveal if email exists
            return {'message': 'If that email exists, a reset link has been sent.'}, 200

        # Generate JWT token valid for 1 hour
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )

        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/reset-password?token={token}"

        # Send email via Brevo
        subject = "SparkleWash Password Reset"
        body_html = f"""
        <h2>Hello {user.name},</h2>
        <p>You requested to reset your password for SparkleWash.</p>
        <p><a href="{reset_url}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a></p>
        <p>Or copy this link into your browser:</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p>This link will expire in <strong>1 hour</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Regards,<br>SparkleWash Team</p>
        """
        body_text = f"Hello {user.name},\n\nYou requested to reset your password for SparkleWash.\n\nClick the link below:\n{reset_url}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nRegards,\nSparkleWash Team"

        success, error = send_email_via_brevo(
            to_email=user.email,
            to_name=user.name,
            subject=subject,
            body_html=body_html,
            body_text=body_text
        )

        if not success:
            logger.warning(f"Email failed, but reset link is: {reset_url}")
            # Log the link for manual testing
            logger.info(f"Password reset link for {user.email}: {reset_url}")

        return {'message': 'If that email exists, a reset link has been sent.'}, 200

class ResetPassword(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=str, required=True)
        parser.add_argument('new_password', type=str, required=True)
        data = parser.parse_args()

        try:
            payload = jwt.decode(
                data['token'],
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return {'message': 'Reset link has expired'}, 400
        except jwt.InvalidTokenError:
            return {'message': 'Invalid reset token'}, 400

        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404

        user.set_password(data['new_password'])
        db.session.commit()
        logger.info(f"Password reset for user {user.email}")
        return {'message': 'Password reset successfully'}, 200