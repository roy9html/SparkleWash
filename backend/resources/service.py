from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from extensions import db, logger
from models.service import Service
from schemas.service_schema import ServiceSchema
from utils.auth_helpers import role_required

service_schema = ServiceSchema()

class ServiceList(Resource):
    def get(self):
        services = Service.query.filter_by(is_active=True).all()
        return [{'id': s.id, 'name': s.name, 'description': s.description,
                 'price': s.price, 'duration_minutes': s.duration_minutes} for s in services], 200

    @jwt_required()
    @role_required(['admin'])
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('description', type=str)
        parser.add_argument('price', type=float, required=True)
        parser.add_argument('duration_minutes', type=int, required=True)
        data = parser.parse_args()

        errors = service_schema.validate(data)
        if errors:
            return {'errors': errors}, 400

        service = Service(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            duration_minutes=data['duration_minutes']
        )
        db.session.add(service)
        db.session.commit()
        logger.info(f"Service added: {service.name}")
        return {'id': service.id, 'name': service.name, 'price': service.price}, 201

class ServiceDetail(Resource):
    @jwt_required()
    @role_required(['admin'])
    def put(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {'message': 'Service not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('price', type=float)
        parser.add_argument('duration_minutes', type=int)
        parser.add_argument('is_active', type=bool)
        data = parser.parse_args()

        if data.get('name'): service.name = data['name']
        if data.get('description'): service.description = data['description']
        if data.get('price'): service.price = data['price']
        if data.get('duration_minutes'): service.duration_minutes = data['duration_minutes']
        if data.get('is_active') is not None: service.is_active = data['is_active']
        db.session.commit()
        logger.info(f"Service updated: {service.name}")
        return {'id': service.id, 'name': service.name, 'price': service.price}, 200

    @jwt_required()
    @role_required(['admin'])
    def delete(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {'message': 'Service not found'}, 404

        # Prevent deletion if there are bookings linked to this service
        if service.bookings:
            return {
                'message': 'Cannot delete service with existing bookings. Remove or reassign bookings first.'
            }, 400

        db.session.delete(service)
        db.session.commit()
        logger.info(f"Service deleted: {service.name}")
        return {'message': 'Service deleted'}, 200