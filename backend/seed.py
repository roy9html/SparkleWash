import random
from datetime import datetime, timedelta
from extensions import db
from models.user import User
from models.service import Service
from models.booking import Booking
from models.payment import Payment

def seed_database():
    db.drop_all()
    db.create_all()

    admin = User(name='Admin User', email='admin@example.com', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)

    customers = []
    for i in range(1, 3):
        user = User(name=f'Customer {i}', email=f'customer{i}@example.com', role='customer')
        user.set_password('password123')
        db.session.add(user)
        customers.append(user)

    db.session.commit()

    services_data = [
        {'name': 'Basic Wash', 'description': 'Exterior wash and dry', 'price': 800, 'duration_minutes': 30},
        {'name': 'Premium Wash', 'description': 'Exterior wash, wax, and interior vacuum', 'price': 1500, 'duration_minutes': 45},
        {'name': 'Deluxe Package', 'description': 'Full detailing: interior and exterior', 'price': 2800, 'duration_minutes': 60},
        {'name': 'Interior Detailing', 'description': 'Deep cleaning of interior', 'price': 3200, 'duration_minutes': 90},
        {'name': 'Engine Service', 'description': 'Engine diagnostics and cleaning', 'price': 2000, 'duration_minutes': 50}
    ]
    services = []
    for s in services_data:
        service = Service(**s)
        db.session.add(service)
        services.append(service)
    db.session.commit()

    for i in range(1, 5):
        booking = Booking(
            user_id=random.choice(customers).id,
            service_id=random.choice(services).id,
            booking_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)),
            status=random.choice(['pending', 'confirmed', 'completed', 'cancelled']),
            total_amount=random.choice([800, 1500, 2800, 3200, 2000]),
            notes=f'Booking {i} notes'
        )
        db.session.add(booking)
        db.session.commit()

        if booking.status == 'completed':
            payment = Payment(
                booking_id=booking.id,
                user_id=booking.user_id,
                amount=booking.total_amount,
                payment_method='mpesa',
                status='completed',
                transaction_id=f'TX{booking.id}{booking.user_id}',
                mpesa_phone=f'2547{random.randint(10000000, 99999999)}'
            )
            db.session.add(payment)
        elif booking.status in ['pending', 'confirmed']:
            payment = Payment(
                booking_id=booking.id,
                user_id=booking.user_id,
                amount=booking.total_amount * 0.5,
                payment_method='mpesa',
                status='pending',
                mpesa_phone=f'2547{random.randint(10000000, 99999999)}'
            )
            db.session.add(payment)

    db.session.commit()
    print("Database seeded with sample data.")

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_database()