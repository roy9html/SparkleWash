import requests
import base64
from datetime import datetime
from extensions import logger
from flask import current_app

def get_access_token():
    """Get OAuth access token from Safaricom."""
    consumer_key = current_app.config['MPESA_CONSUMER_KEY']
    consumer_secret = current_app.config['MPESA_CONSUMER_SECRET']
    url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    if current_app.config['MPESA_ENVIRONMENT'] == 'production':
        url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    response = requests.get(url, auth=(consumer_key, consumer_secret))
    if response.status_code == 200:
        return response.json().get('access_token')
    logger.error(f"Failed to get M-Pesa token: {response.text}")
    return None

def generate_password(shortcode, passkey):
    """Generate base64 encoded password for STK push."""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    data = shortcode + passkey + timestamp
    encoded = base64.b64encode(data.encode()).decode()
    return encoded, timestamp

def stk_push(phone_number, amount, account_reference, transaction_desc, callback_url):
    """
    Initiate STK push.
    phone_number: 2547xxxxxxxx (no leading '+')
    amount: float
    account_reference: e.g., booking_id
    transaction_desc: e.g., "SparkleWash Payment"
    callback_url: the full callback URL
    """
    access_token = get_access_token()
    if not access_token:
        return None, "Failed to get access token"

    shortcode = current_app.config['MPESA_SHORTCODE']
    passkey = current_app.config['MPESA_PASSKEY']
    password, timestamp = generate_password(shortcode, passkey)

    url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    if current_app.config['MPESA_ENVIRONMENT'] == 'production':
        url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    payload = {
        'BusinessShortCode': shortcode,
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': int(amount),
        'PartyA': phone_number,
        'PartyB': shortcode,
        'PhoneNumber': phone_number,
        'CallBackURL': callback_url,
        'AccountReference': account_reference,
        'TransactionDesc': transaction_desc
    }

    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    logger.info(f"STK Push response: {data}")
    if response.status_code == 200 and data.get('ResponseCode') == '0':
        return data, None
    return None, data.get('errorMessage', 'STK push failed')