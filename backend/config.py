import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = True

    SWAGGER = {
        'title': 'SparkleWash API',
        'description': 'Car wash booking system API',
        'version': '1.0.0',
        'termsOfService': '/terms',
        'contact': {'email': 'info@sparklewash.com'},
        'license': {'name': 'MIT'}
    }

    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

    MPESA_CONSUMER_KEY = os.environ.get('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.environ.get('MPESA_CONSUMER_SECRET')
    MPESA_PASSKEY = os.environ.get('MPESA_PASSKEY')
    MPESA_SHORTCODE = os.environ.get('MPESA_SHORTCODE', '174379')
    MPESA_SHORTCODE_TYPE = os.environ.get('MPESA_SHORTCODE_TYPE', 'paybill')
    MPESA_CALLBACK_URL = os.environ.get('MPESA_CALLBACK_URL')
    MPESA_ENVIRONMENT = os.environ.get('MPESA_ENVIRONMENT', 'sandbox')



    BREVO_API_KEY = os.environ.get('BREVO_API_KEY')
    BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL')
    BREVO_SENDER_NAME = os.environ.get('BREVO_SENDER_NAME', 'SparkleWash')



 