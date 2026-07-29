from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flasgger import Swagger
from structlog import get_logger



db = SQLAlchemy()
migrate = Migrate()
cors = CORS(supports_credentials=True)
jwt = JWTManager()
api = Api()
swagger = Swagger()
logger = get_logger()