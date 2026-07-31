from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime

class BookingSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    service_id = fields.Int(required=True)
    booking_date = fields.DateTime(required=True)
    status = fields.Str(validate=validate.OneOf(['pending', 'confirmed', 'completed', 'cancelled']))
    total_amount = fields.Float(required=True, validate=validate.Range(min=0))
    notes = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('booking_date')
    def validate_booking_date(self, value):
        if value < datetime.utcnow():
            raise ValidationError('Booking date cannot be in the past')
        return value
