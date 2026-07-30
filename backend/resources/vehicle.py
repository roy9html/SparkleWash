from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, logger
from models.vehicle import Vehicle
from schemas.vehicle_schema import VehicleSchema
from utils.auth_helpers import role_required, get_current_user

vehicle_schema = VehicleSchema()

class VehicleList(Resource):
    @jwt_required()
    def get(self):
        user = get_current_user()
        if user.role == 'admin':
            vehicles = Vehicle.query.all()
        else:
            vehicles = Vehicle.query.filter_by(user_id=user.id).all()
        return [v.to_dict() for v in vehicles], 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('plate_number', type=str, required=True)
        parser.add_argument('make', type=str, required=True)
        parser.add_argument('model', type=str, required=True)
        parser.add_argument('year', type=int)
        parser.add_argument('color', type=str)
        parser.add_argument('is_default', type=bool)
        data = parser.parse_args()

        current_user_id = int(get_jwt_identity())

        # Validate input with schema
        errors = vehicle_schema.validate(data)
        if errors:
            return {'errors': errors}, 400

        # Check if plate already exists
        existing = Vehicle.query.filter_by(plate_number=data['plate_number']).first()
        if existing:
            return {'message': 'Vehicle with this plate number already exists'}, 409

        vehicle = Vehicle(
            user_id=current_user_id,
            plate_number=data['plate_number'],
            make=data['make'],
            model=data['model'],
            year=data.get('year'),
            color=data.get('color'),
            is_default=data.get('is_default', False)
        )
        db.session.add(vehicle)
        db.session.commit()
        logger.info(f"Vehicle added for user {current_user_id}")
        return vehicle.to_dict(), 201

class VehicleDetail(Resource):
    @jwt_required()
    def get(self, vehicle_id):
        user = get_current_user()
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return {'message': 'Vehicle not found'}, 404
        if user.role != 'admin' and vehicle.user_id != user.id:
            return {'message': 'Permission denied'}, 403
        return vehicle.to_dict(), 200

    @jwt_required()
    def put(self, vehicle_id):
        user = get_current_user()
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return {'message': 'Vehicle not found'}, 404
        if user.role != 'admin' and vehicle.user_id != user.id:
            return {'message': 'Permission denied'}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('plate_number', type=str)
        parser.add_argument('make', type=str)
        parser.add_argument('model', type=str)
        parser.add_argument('year', type=int)
        parser.add_argument('color', type=str)
        parser.add_argument('is_default', type=bool)
        data = parser.parse_args()

        if data.get('plate_number'):
            # Check uniqueness if changed
            existing = Vehicle.query.filter_by(plate_number=data['plate_number']).first()
            if existing and existing.id != vehicle_id:
                return {'message': 'Plate number already used'}, 409
            vehicle.plate_number = data['plate_number']
        if data.get('make'):
            vehicle.make = data['make']
        if data.get('model'):
            vehicle.model = data['model']
        if data.get('year'):
            vehicle.year = data['year']
        if data.get('color'):
            vehicle.color = data['color']
        if data.get('is_default') is not None:
            vehicle.is_default = data['is_default']

        db.session.commit()
        logger.info(f"Vehicle {vehicle_id} updated")
        return vehicle.to_dict(), 200

    @jwt_required()
    def delete(self, vehicle_id):
        user = get_current_user()
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return {'message': 'Vehicle not found'}, 404
        if user.role != 'admin' and vehicle.user_id != user.id:
            return {'message': 'Permission denied'}, 403
        db.session.delete(vehicle)
        db.session.commit()
        logger.info(f"Vehicle {vehicle_id} deleted")
        return {'message': 'Vehicle deleted'}, 200