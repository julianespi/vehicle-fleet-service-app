# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()


class Truck(db.Model):
    __tablename__ = "truck"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)          # "Truck 101"
    vin = db.Column(db.String(50), unique=True, nullable=False)  # Vehicle Identification Number
    make = db.Column(db.String(50))                           # "Ford"
    model = db.Column(db.String(50))                          # "F-150"
    year = db.Column(db.Integer)                              # 2020
    status = db.Column(db.String(20), default="Active")      # Active / Inactive
    miles = db.Column(db.Integer, default=0)
    fuel_percent = db.Column(db.Integer, default=0)
    engine_status = db.Column(db.String(50), default="Good")
    battery_status = db.Column(db.String(50), default="Normal")

    last_driver = db.Column(db.String(80))
    last_driven_date = db.Column(db.Date)
    last_miles_driven = db.Column(db.Integer)

    service_requests = db.relationship("ServiceRequest", backref="truck", lazy=True)
    service_history = db.relationship("ServiceHistory", backref="truck", lazy=True)

class Driver(db.Model):
    __tablename__ = "driver"

    id = db.Column(db.Integer, primary_key=True)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(200))
    phone_number = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True, nullable=False)


class Technician(db.Model):
    __tablename__ = "technician"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    work_orders = db.relationship("ServiceRequest", backref="technician", lazy=True)


class ServiceRequest(db.Model):
    __tablename__ = "service_request"

    id = db.Column(db.Integer, primary_key=True)

    truck_id = db.Column(db.Integer, db.ForeignKey("truck.id"), nullable=False)
    service_type = db.Column(db.String(80), nullable=False)     # Oil Change, etc.
    description = db.Column(db.Text)
    preferred_date = db.Column(db.Date)

    status = db.Column(db.String(20), default="Pending")        # Pending, InProgress, Done
    technician_id = db.Column(db.Integer, db.ForeignKey("technician.id"))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    disputes = db.relationship("ServiceDispute", backref="service_request", lazy=True)


class ServiceHistory(db.Model):
    __tablename__ = "service_history"

    id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String(120), nullable=False)
    truck_id = db.Column(db.Integer, db.ForeignKey("truck.id"), nullable=False)
    service_type = db.Column(db.String(80), nullable=False)
    cost = db.Column(db.Float)
    technician_name = db.Column(db.String(80))
    service_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_time_hours = db.Column(db.Float)


class ServiceDispute(db.Model):
    __tablename__ = "service_dispute"

    id = db.Column(db.Integer, primary_key=True)

    service_request_id = db.Column(
        db.Integer, db.ForeignKey("service_request.id"), nullable=False
    )
    reason = db.Column(db.Text, nullable=False)
    preferred_resolution = db.Column(db.String(80))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
