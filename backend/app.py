from flask import Flask
from flask_restful import Api
from extensions import db, migrate, cors, jwt, swagger, logger
from config import Config
from utils.logging_config import configure_logging
from flask_mail import Mail

# Direct imports from resources modules
from resources.auth import Register, Login, Logout, Refresh, Me, ForgotPassword, ResetPassword
from resources.user import UserList, UserDetail
from resources.service import ServiceList, ServiceDetail
from resources.booking import BookingList, BookingDetail
from resources.payment import PaymentList, PaymentDetail, PaymentCallback
from resources.vehicle import VehicleList, VehicleDetail

from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError, WrongTokenError

def create_app():
    configure_logging()

    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # ----- CORS configuration (READS FROM config.ALLOWED_ORIGINS) -----
    allowed_origins = app.config.get('ALLOWED_ORIGINS', ['http://localhost:5173'])
    cors.init_app(app,
                  resources={r"/*": {"origins": allowed_origins}},
                  supports_credentials=True,
                  allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
                  methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    jwt.init_app(app)

    # JWT error handlers
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return {'message': 'Missing or invalid token'}, 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return {'message': 'Invalid token'}, 401

    @jwt.expired_token_loader
    def expired_token_response(callback):
        return {'message': 'Token has expired'}, 401

    # Explicit handler for NoAuthorizationError (and other JWT exceptions)
    @app.errorhandler(NoAuthorizationError)
    def handle_no_auth_error(e):
        return {'message': 'Missing or invalid token'}, 401

    @app.errorhandler(InvalidHeaderError)
    def handle_invalid_header_error(e):
        return {'message': 'Invalid authorization header'}, 401

    swagger.init_app(app)

    # Initialize Mail (for password reset)
    mail = Mail()
    mail.init_app(app)
    app.mail = mail

    # Create the API instance and bind it to the app
    api = Api(app)

    # Register API resources
    print("=== Registering Routes ===")
    api.add_resource(Register, '/auth/register')
    print("Registered /auth/register")
    api.add_resource(Login, '/auth/login')
    print("Registered /auth/login")
    api.add_resource(Logout, '/auth/logout')
    print("Registered /auth/logout")
    api.add_resource(Refresh, '/auth/refresh')
    print("Registered /auth/refresh")
    api.add_resource(Me, '/auth/me')
    print("Registered /auth/me")
    api.add_resource(ForgotPassword, '/auth/forgot-password')
    print("Registered /auth/forgot-password")
    api.add_resource(ResetPassword, '/auth/reset-password')
    print("Registered /auth/reset-password")
    api.add_resource(UserList, '/users')
    print("Registered /users")
    api.add_resource(UserDetail, '/users/<int:user_id>')
    print("Registered /users/<int:user_id>")
    api.add_resource(ServiceList, '/services')
    print("Registered /services")
    api.add_resource(ServiceDetail, '/services/<int:service_id>')
    print("Registered /services/<int:service_id>")
    api.add_resource(BookingList, '/bookings')
    print("Registered /bookings")
    api.add_resource(BookingDetail, '/bookings/<int:booking_id>')
    print("Registered /bookings/<int:booking_id>")
    api.add_resource(PaymentList, '/payments')
    print("Registered /payments")
    api.add_resource(PaymentDetail, '/payments/<int:payment_id>')
    print("Registered /payments/<int:payment_id>")
    api.add_resource(PaymentCallback, '/payments/callback')
    print("Registered /payments/callback")
    api.add_resource(VehicleList, '/vehicles')
    print("Registered /vehicles")
    api.add_resource(VehicleDetail, '/vehicles/<int:vehicle_id>')
    print("Registered /vehicles/<int:vehicle_id>")
    print("Done")

    logger.info("Application created successfully")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)