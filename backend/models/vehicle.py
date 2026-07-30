from extensions import db
from datetime import datetime

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_vehicles_user_id'), nullable=False)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer)
    color = db.Column(db.String(30))
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship back to User (already has vehicles via backref)
    user = db.relationship('User', backref='vehicles', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plate_number': self.plate_number,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'color': self.color,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat()
        }