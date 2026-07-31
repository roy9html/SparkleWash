from marshmallow import Schema, fields, validate, validates, ValidationError
from models.payment import Payment

class PaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    booking_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    payment_method = fields.Str(validate=validate.OneOf(['mpesa', 'cash', 'card']))
    transaction_id = fields.Str()
    status = fields.Str(validate=validate.OneOf(['pending', 'completed', 'failed']))
    mpesa_receipt = fields.Str()
    mpesa_phone = fields.Str()
    payment_date = fields.DateTime(dump_only=True)

    @validates('transaction_id')
    def validate_transaction_id(self, value):
        if value and Payment.query.filter_by(transaction_id=value).first():
            raise ValidationError('howdy your transaction ID already exists')
        return value
