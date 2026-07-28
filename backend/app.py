from flask import Flask
from flask_restful import Api
from extensions import db ,migrate 
from config import Config
from models import User,Payment
def create_app():
    

    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app = app)
    migrate.init_app(app, db)
    
#    #  CORS configuration
#     cors.init_app(app, 
#                   resources={r"/*": {"origins": "http://localhost:5173"}},
#                   supports_credentials=True,
#                   allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
#                   methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

#     jwt.init_app(app)
#     swagger.init_app(app)

#     # Initialize Mail
#     mail = Mail()
#     mail.init_app(app)
#     # Optionally attach to app for easy access
#     app.mail = mail

    # Create the API instance and bind it to the app
    api = Api(app)
    # In app.py or wherever you create the app
    return app 
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)