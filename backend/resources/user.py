from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from extensions import db, logger
from models.user import User
from schemas.user_schema import UserSchema
from utils.auth_helpers import role_required

user_schema = UserSchema()

class UserList(Resource):
    @jwt_required()
    @role_required(['admin'])
    def get(self):
        users = User.query.all()
        return [u.to_dict() for u in users], 200

    @jwt_required()
    @role_required(['admin'])
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('role', type=str)
        data = parser.parse_args()

        errors = user_schema.validate(data)
        if errors:
            return {'errors': errors}, 400

        user = User(name=data['name'], email=data['email'], role=data.get('role', 'customer'))
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        logger.info(f"Admin created user: {user.email}")
        return user.to_dict(), 201

class UserDetail(Resource):
    @jwt_required()
    @role_required(['admin'])
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        return user.to_dict(), 200

    @jwt_required()
    @role_required(['admin'])
    def put(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('email', type=str)
        parser.add_argument('role', type=str)
        parser.add_argument('password', type=str)
        data = parser.parse_args()

        if data.get('name'): user.name = data['name']
        if data.get('email'): user.email = data['email']
        if data.get('role'): user.role = data['role']
        if data.get('password'): user.set_password(data['password'])
        db.session.commit()
        logger.info(f"Admin updated user: {user.email}")
        return user.to_dict(), 200

    @jwt_required()
    @role_required(['admin'])
    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404

        # Check for existing bookings
        if user.bookings:
            return {
                'message': f'User has {len(user.bookings)} booking(s). Please delete or reassign them first.'
            }, 400

        # Check for existing payments
        if user.payments:
            return {
                'message': f'User has {len(user.payments)} payment(s). Please delete or reassign them first.'
            }, 400

        # Prevent deleting the last admin
        admin_count = User.query.filter_by(role='admin').count()
        if user.role == 'admin' and admin_count <= 1:
            return {'message': 'Cannot delete the last admin user.'}, 400

        db.session.delete(user)
        db.session.commit()
        logger.info(f"Admin deleted user: {user.email}")
        return {'message': 'User deleted'}, 200