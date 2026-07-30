from marshmallow import Schema, fields, validate, validates, ValidationError
from models.user import User
import re

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, validate=validate.Length(min=6))
    role = fields.Str(validate=validate.OneOf(['customer', 'admin']))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('email')
    def validate_email(self, value):
        if User.query.filter_by(email=value).first():
            raise ValidationError('Email already registered')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValidationError('Invalid email format')
        return value