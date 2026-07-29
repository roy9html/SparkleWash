from marshmallow import Schema, fields, validate

class ServiceSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str()
    price = fields.Float(required=True, validate=validate.Range(min=0))
    duration_minutes = fields.Int(required=True, validate=validate.Range(min=1))
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
