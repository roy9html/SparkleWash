from extensions import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = 'bookings'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_bookings_user_id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id', name='fk_bookings_service_id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id', name='fk_bookings_vehicle_id'), nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='pending')
    total_amount = db.Column(db.Float, nullable=False)
    paid_amount = db.Column(db.Float, default=0.0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    payments = db.relationship('Payment', backref='booking', lazy=True)
    vehicle = db.relationship('Vehicle', backref='bookings', lazy=True)

    @property
    def remaining_amount(self):
        return self.total_amount - self.paid_amount

    @property
    def is_fully_paid(self):
        return self.paid_amount >= self.total_amount