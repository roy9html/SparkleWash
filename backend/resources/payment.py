from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, current_app
from extensions import db, logger
from models.payment import Payment
from models.booking import Booking
from schemas.payment_schema import PaymentSchema
from utils.auth_helpers import role_required, get_current_user
from utils.mpesa import stk_push

payment_schema = PaymentSchema()

class PaymentList(Resource):
    @jwt_required()
    def get(self):
        user = get_current_user()
        if user.role == 'admin':
            payments = Payment.query.all()
        else:
            payments = Payment.query.filter_by(user_id=user.id).all()
        return [{
            'id': p.id,
            'user': p.user.name if p.user else None,
            'booking': p.booking.service.name if p.booking and p.booking.service else None,
            'amount': p.amount,
            'payment_method': p.payment_method,
            'status': p.status,
            'payment_date': p.payment_date.isoformat(),
            'mpesa_phone': p.mpesa_phone
        } for p in payments], 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('booking_id', type=int, required=True)
        parser.add_argument('amount', type=float, required=True)
        parser.add_argument('payment_method', type=str, default='mpesa')
        parser.add_argument('mpesa_phone', type=str, required=True)
        data = parser.parse_args()

        current_user_id = int(get_jwt_identity())
        logger.info(f"Payment attempt: user_id={current_user_id}, booking_id={data['booking_id']}, amount={data['amount']}")

        booking = Booking.query.get(data['booking_id'])
        if not booking:
            logger.warning(f"Booking not found: {data['booking_id']}")
            return {'message': 'Booking not found'}, 404

        logger.info(f"Booking found: user_id={booking.user_id}, total_amount={booking.total_amount}, status={booking.status}")

        if booking.user_id != current_user_id:
            logger.warning(f"User {current_user_id} tried to pay for booking {booking.id} owned by {booking.user_id}")
            return {'message': 'Tajiri! You can only pay for your own bookings'}, 403

        if booking.status in ['completed', 'cancelled']:
            logger.warning(f"Booking {booking.id} status is {booking.status}, cannot pay")
            return {'message': f'Booking is already {booking.status} and cannot be paid'}, 400

        if float(data['amount']) != float(booking.total_amount):
            logger.warning(f"Amount mismatch: sent {data['amount']}, expected {booking.total_amount}")
            return {'message': f'Amount must equal booking total: {booking.total_amount}'}, 400

        # build status ya payemnet
        payment = Payment(
            booking_id=data['booking_id'],
            user_id=current_user_id,
            amount=data['amount'],
            payment_method=data['payment_method'],
            status='pending',
            mpesa_phone=data.get('mpesa_phone')
        )
        db.session.add(payment)
        db.session.commit()
        logger.info(f"Payment record created with id {payment.id}")

        # start stk push 
        phone = data['mpesa_phone'].strip()
        #clean phone number input
        import re
        phone = re.sub(r'\s', '', phone)
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        elif phone.startswith('+'):
            phone = phone[1:]
        phone = re.sub(r'\D', '', phone)

        callback_url = current_app.config['MPESA_CALLBACK_URL']
        account_ref = f'BOOK-{booking.id}'
        result, error = stk_push(
            phone_number=phone,
            amount=float(data['amount']),
            account_reference=account_ref,
            transaction_desc='SparkleWash Payment',
            callback_url=callback_url
        )

        if error:
            logger.error(f"STK push failed: {error}")
            payment.status = 'failed'
            db.session.commit()
            return {'message': f'Payment initiation failed: {error}'}, 400

        # Store the CheckoutRequestID for callback matching
        payment.transaction_id = result.get('CheckoutRequestID')
        db.session.commit()

        logger.info(f"STK push initiated, CheckoutRequestID: {result.get('CheckoutRequestID')}")
        return {
            'id': payment.id,
            'status': payment.status,
            'message': 'STK push sent. Please complete payment on your phone.'
        }, 200

class PaymentDetail(Resource):
    @jwt_required()
    def get(self, payment_id):
        user = get_current_user()
        payment = Payment.query.get(payment_id)
        if not payment:
            return {'message': 'Payment not found'}, 404
        if user.role != 'admin' and payment.user_id != user.id:
            return {'message': 'Permission denied'}, 403
        return {
            'id': payment.id,
            'user': payment.user.name if payment.user else None,
            'booking': payment.booking.service.name if payment.booking and payment.booking.service else None,
            'amount': payment.amount,
            'payment_method': payment.payment_method,
            'status': payment.status,
            'transaction_id': payment.transaction_id,
            'mpesa_phone': payment.mpesa_phone,
            'payment_date': payment.payment_date.isoformat()
        }, 200

    @jwt_required()
    @role_required(['admin'])
    def put(self, payment_id):
        payment = Payment.query.get(payment_id)
        if not payment:
            return {'message': 'Payment not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('status', type=str)
        data = parser.parse_args()
        if data.get('status'):
            payment.status = data['status']
        db.session.commit()
        logger.info(f"Payment {payment_id} status updated to {payment.status}")
        return {'message': 'Payment updated'}, 200

    @jwt_required()
    @role_required(['admin'])
    def delete(self, payment_id):
        payment = Payment.query.get(payment_id)
        if not payment:
            return {'message': 'Payment not found'}, 404
        db.session.delete(payment)
        db.session.commit()
        logger.info(f"Payment {payment_id} deleted")
        return {'message': 'Payment deleted'}, 200

class PaymentCallback(Resource):
    def post(self):
        """M-Pesa callback endpoint."""
        data = request.get_json()
        logger.info(f"Received M-Pesa callback: {data}")

        body = data.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        result_code = stk_callback.get('ResultCode')
        checkout_request_id = stk_callback.get('CheckoutRequestID')

        payment = Payment.query.filter_by(transaction_id=checkout_request_id).first()
        if not payment:
            logger.error(f"Payment not found for CheckoutRequestID: {checkout_request_id}")
            return {'ResultCode': 1, 'ResultDesc': 'Payment not found'}, 404

        if result_code == 0:
            payment.status = 'completed'
            payment.mpesa_receipt = stk_callback.get('MerchantRequestID')
            booking = payment.booking
            if booking:
                booking.status = 'completed'
            logger.info(f"Payment {payment.id} completed successfully")
        else:
            payment.status = 'failed'
            logger.warning(f"Payment {payment.id} failed: {stk_callback.get('ResultDesc')}")

        db.session.commit()
        return {'ResultCode': 0, 'ResultDesc': 'Success'}, 200