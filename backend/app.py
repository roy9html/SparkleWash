from flask import Flask
from flask_restful import Api
from extensions import db, migrate 
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # IMPORTANT: Import models here so they are registered with SQLAlchemy
    from models import User, Booking, Payment
    
    # Create the API instance
    api = Api(app)
    
    return app