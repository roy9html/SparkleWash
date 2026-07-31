import requests
import os
from extensions import logger
from flask import current_app

def send_email_via_brevo(to_email, to_name, subject, body_html=None, body_text=None):
    """
    Send an email using Brevo (SendinBlue) API.
    Returns (success, error_message).
    """
    api_key = current_app.config.get('BREVO_API_KEY')
    sender_email = current_app.config.get('BREVO_SENDER_EMAIL')
    sender_name = current_app.config.get('BREVO_SENDER_NAME', 'SparkleWash')

    if not api_key or not sender_email:
        logger.error("Brevo API key or sender email not configured")
        return False, "Email service not configured"

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": to_email, "name": to_name or to_email}],
        "subject": subject,
    }

    if body_html:
        payload["htmlContent"] = body_html
    else:
        payload["textContent"] = body_text or ""

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code in (200, 201):
            logger.info(f"Email sent to {to_email} via Brevo")
            return True, None
        else:
            error = response.json().get('message', 'Unknown error')
            logger.error(f"Brevo API error: {error}")
            return False, error
    except Exception as e:
        logger.error(f"Failed to send email via Brevo: {str(e)}")
        return False, str(e)