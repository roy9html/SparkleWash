from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from extensions import logger
from models.user import User

def get_current_user():
    try:
        user_id = get_jwt_identity()
        return User.query.get(user_id)
    except Exception as e:
        logger.error("Failed to get current user", error=str(e))
        return None

def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = get_current_user()
            if not user:
                return jsonify({'message': 'User not found'}), 404
            if user.role not in allowed_roles:
                return jsonify({'message': 'Insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
