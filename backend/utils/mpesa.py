import requests
import base64
from datetime import datetime
from extensions import logger
from flask import current_app

def get_access_token():
    """Get OAuth access token from Safaricom."""
    consumer_key = current_app.config.get('MPESA_CONSUMER_KEY')
    consumer_secret = current_app.config.get('MPESA_CONSUMER_SECRET')

    # Log if any are None
    if not consumer_key or not consumer_secret:
        logger.error("MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET is missing or None")
        return None

    url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    if current_app.config.get('MPESA_ENVIRONMENT') == 'production':
        url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    logger.info(f"Token URL: {url}")
    logger.info(f"Consumer key (first 6 chars): {consumer_key[:6]}...")
    logger.info(f"Consumer secret (first 4 chars): {consumer_secret[:4]}...")

    headers = {
        'Accept': 'application/json',
        'User-Agent': 'SparkleWash/1.0'
    }

    try:
        response = requests.get(
            url,
            auth=(consumer_key, consumer_secret),
            headers=headers,
            timeout=10
        )
        logger.info(f"Token request status: {response.status_code}")
        logger.info(f"Token response headers: {response.headers}")
        logger.info(f"Token response body: {response.text}")

        if response.status_code == 200:
            token = response.json().get('access_token')
            if token:
                return token
            else:
                logger.error("Access token not found in response")
                return None
        else:
            # Try to parse error from JSON
            try:
                error_data = response.json()
                logger.error(f"Token request failed: {response.status_code} - {error_data}")
            except:
                logger.error(f"Token request failed: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.Timeout:
        logger.error("Token request timed out")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Token request exception: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in token request: {str(e)}")
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
        logger.error("Failed to obtain access token for STK push")
        return None, "Failed to get access token"

    shortcode = current_app.config.get('MPESA_SHORTCODE', '174379')
    passkey = current_app.config.get('MPESA_PASSKEY')
    password, timestamp = generate_password(shortcode, passkey)

    url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    if current_app.config.get('MPESA_ENVIRONMENT') == 'production':
        url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

    # Log payload (mask sensitive fields)
    safe_payload = payload.copy()
    safe_payload['Password'] = '***'
    safe_payload['PartyA'] = '***'
    safe_payload['PhoneNumber'] = '***'
    logger.info(f"STK Push request payload: {safe_payload}")

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        logger.info(f"STK Push response status: {response.status_code}")
        logger.info(f"STK Push response body: {response.text}")

        if response.status_code == 200:
            data = response.json()
            if data.get('ResponseCode') == '0':
                logger.info("STK Push accepted successfully")
                return data, None
            else:
                error_msg = data.get('errorMessage') or data.get('ResponseDescription') or 'STK push failed'
                logger.error(f"STK Push returned error: {error_msg}")
                return None, error_msg
        else:
            try:
                error_data = response.json()
                error_msg = error_data.get('errorMessage') or error_data.get('ResponseDescription') or f"HTTP {response.status_code}"
            except:
                error_msg = f"HTTP {response.status_code} - {response.text}"
            logger.error(f"STK Push request failed: {error_msg}")
            return None, error_msg
    except requests.exceptions.Timeout:
        logger.error("STK Push request timed out")
        return None, "Request timed out"
    except requests.exceptions.RequestException as e:
        logger.error(f"STK Push request exception: {str(e)}")
        return None, f"Request error: {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected error in STK Push: {str(e)}")
        return None, f"Unexpected error: {str(e)}"