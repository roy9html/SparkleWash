import random
from datetime import datetime, timedelta, timezone
from extensions import db
from models.user import User
from models.service import Service
from models.booking import Booking
from models.payment import Payment
from models.vehicle import Vehicle

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

    # ----- SEED VEHICLES -----
    vehicle_data = [
        {'plate_number': 'KAA 123A', 'make': 'Toyota', 'model': 'Camry', 'year': 2020, 'color': 'Silver'},
        {'plate_number': 'KBB 456B', 'make': 'Honda', 'model': 'Civic', 'year': 2019, 'color': 'Red'},
        {'plate_number': 'KCC 789C', 'make': 'Ford', 'model': 'Mustang', 'year': 2021, 'color': 'Blue'},
        {'plate_number': 'KDD 012D', 'make': 'Nissan', 'model': 'Altima', 'year': 2022, 'color': 'White'},
    ]

    # Map customer id to list of their vehicle ids
    customer_vehicles = {}

    for idx, customer in enumerate(customers):
        v = vehicle_data[idx % len(vehicle_data)]
        vehicle = Vehicle(
            user_id=customer.id,
            plate_number=v['plate_number'],
            make=v['make'],
            model=v['model'],
            year=v['year'],
            color=v['color'],
            is_default=(idx == 0)
        )
        db.session.add(vehicle)
        # Store the vehicle object for later commit
        # We'll commit after adding all vehicles, but we need the ids, so we'll do a flush or commit.
        # Better: commit after adding all vehicles to get ids.

    # Add extra vehicle for customer 1 (idx 0)
    extra_vehicle = Vehicle(
        user_id=customers[0].id,
        plate_number='KEE 345E',
        make='BMW',
        model='X5',
        year=2023,
        color='Black',
        is_default=False
    )
    db.session.add(extra_vehicle)

    # Commit to get vehicle ids
    db.session.commit()

    # Now build customer_vehicles mapping
    all_vehicles = Vehicle.query.all()
    for vehicle in all_vehicles:
        if vehicle.user_id not in customer_vehicles:
            customer_vehicles[vehicle.user_id] = []
        customer_vehicles[vehicle.user_id].append(vehicle.id)

    # ----- SEED SERVICES -----
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

    # ----- SEED BOOKINGS AND PAYMENTS -----
    now = datetime.now(timezone.utc)
    for i in range(1, 5):
        # Pick a random customer
        customer = random.choice(customers)
        # Pick a random vehicle belonging to that customer
        vehicle_id = random.choice(customer_vehicles.get(customer.id, []))

        booking = Booking(
            user_id=customer.id,
            service_id=random.choice(services).id,
            vehicle_id=vehicle_id,   # <-- now we have a vehicle_id
            booking_date=now + timedelta(days=random.randint(1, 10)),
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
    print("Database seeded with sample data (users, vehicles, services, bookings, payments).")

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_database()