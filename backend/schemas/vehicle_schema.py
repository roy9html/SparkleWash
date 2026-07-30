from marshmallow import Schema, fields, validate, validates, ValidationError
from models.vehicle import Vehicle

class VehicleSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    plate_number = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    make = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    model = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    year = fields.Int(validate=validate.Range(min=1900, max=2100))
    color = fields.Str(validate=validate.Length(max=30))
    is_default = fields.Bool()
    created_at = fields.DateTime(dump_only=True)

    @validates('plate_number')
    def validate_plate(self, value):
        # Check uniqueness (except when updating)
        # You can also add regex for plate format
        return value