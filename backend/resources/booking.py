from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, logger
from models.booking import Booking
from models.service import Service
from schemas.booking_schema import BookingSchema
from utils.auth_helpers import role_required, get_current_user
from datetime import datetime

booking_schema = BookingSchema()

def make_naive(dt):
    """Convert an offset-aware datetime to naive UTC (strip tzinfo)."""
    if dt is not None and dt.tzinfo is not None:
        return dt.replace(tzinfo=None)
    return dt

class BookingList(Resource):
    @jwt_required()
    def get(self):
        user = get_current_user()
        if user.role == 'admin':
            bookings = Booking.query.all()
        else:
            bookings = Booking.query.filter_by(user_id=user.id).all()
        return [{'id': b.id, 'service': b.service.name, 'booking_date': b.booking_date.isoformat(),
                 'status': b.status, 'total_amount': b.total_amount} for b in bookings], 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('service_id', type=int, required=True)
        parser.add_argument('booking_date', type=str, required=True)
        parser.add_argument('notes', type=str)
        data = parser.parse_args()

        service = Service.query.get(data['service_id'])
        if not service:
            return {'message': 'Service not found'}, 404

        try:
            booking_date = datetime.fromisoformat(data['booking_date'])
        except ValueError:
            return {'message': 'Invalid date format'}, 400

        # Remove timezone info for comparison with naive datetime.utcnow()
        booking_date = make_naive(booking_date)

        if booking_date < datetime.utcnow():
            return {'message': 'Booking date cannot be in the past'}, 400

        user_id = int(get_jwt_identity())
        booking = Booking(
            user_id=user_id,
            service_id=data['service_id'],
            booking_date=booking_date,
            total_amount=service.price,
            notes=data.get('notes')
        )
        db.session.add(booking)
        db.session.commit()
        logger.info(f"Booking created for user {user_id}")
        return {'id': booking.id, 'status': booking.status, 'total_amount': booking.total_amount}, 201

class BookingDetail(Resource):
    @jwt_required()
    def get(self, booking_id):
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        if not booking:
            return {'message': 'Booking not found'}, 404
        if user.role != 'admin' and booking.user_id != user.id:
            return {'message': 'Permission denied'}, 403
        return {'id': booking.id, 'service': booking.service.name, 'booking_date': booking.booking_date.isoformat(),
                'status': booking.status, 'total_amount': booking.total_amount, 'notes': booking.notes}, 200

    @jwt_required()
    def put(self, booking_id):
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        if not booking:
            return {'message': 'Booking not found'}, 404
        if user.role != 'admin' and booking.user_id != user.id:
            return {'message': 'Permission denied'}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('status', type=str)
        parser.add_argument('booking_date', type=str)
        parser.add_argument('notes', type=str)
        data = parser.parse_args()

        if data.get('status'):
            booking.status = data['status']
        if data.get('booking_date'):
            try:
                new_date = datetime.fromisoformat(data['booking_date'])
            except ValueError:
                return {'message': 'Invalid date format'}, 400
            # Strip timezone for consistency
            booking.booking_date = make_naive(new_date)
        if data.get('notes'):
            booking.notes = data['notes']
        db.session.commit()
        logger.info(f"Booking {booking_id} updated")
        return {'message': 'Booking updated'}, 200

    @jwt_required()
    def delete(self, booking_id):
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        if not booking:
            return {'message': 'Booking not found'}, 404
        if user.role != 'admin' and booking.user_id != user.id:
            return {'message': 'Permission denied'}, 403
        if booking.payments:
           return {'message': f'Cannot delete booking with existing payments. Delete the payments first.'}, 400
        db.session.delete(booking)
        db.session.commit()
        logger.info(f"Booking {booking_id} deleted")
        return {'message': 'Booking deleted'}, 200