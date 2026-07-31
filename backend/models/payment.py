from extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False) #db.ForeignKey('bookings.id'),
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), default='mpesa')
    transaction_id = db.Column(db.String(100), unique=True)
    status = db.Column(db.String(20), default='pending')
    mpesa_receipt = db.Column(db.String(100))
    mpesa_phone = db.Column(db.String(20))
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)