from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask import current_app
from extensions import db, logger
from models.user import User
from schemas.user_schema import UserSchema
from utils.auth_helpers import get_current_user
from flask_mail import Message   # <-- new import
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

        # Generate a JWT token valid for 1 hour
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )

        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/reset-password?token={token}"

        # Send email
        mail = current_app.mail if hasattr(current_app, 'mail') else current_app.extensions.get('mail')
        if mail:
            try:
                msg = Message(
                    subject="SparkleWash Password Reset",
                    recipients=[user.email],
                    body=f"Hello {user.name},\n\nClick the link below to reset your password:\n\n{reset_url}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nRegards,\nSparkleWash Team"
                )
                mail.send(msg)
                logger.info(f"Password reset email sent to {user.email}")
            except Exception as e:
                logger.error(f"Failed to send email to {user.email}: {str(e)}")
                # Fallback: log the link
                logger.info(f"Password reset link for {user.email}: {reset_url}")
        else:
            logger.warning("Mail extension not initialized. Reset link logged only.")
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