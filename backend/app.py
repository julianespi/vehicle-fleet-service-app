# backend/app.py
from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from components.models import db, Truck
from components.resources import (
    HelloResource,
    TruckListResource,
    TruckResource,
    ServiceRequestListResource,
    ServiceRequestResource,
    TechnicianWorkOrdersResource,
    ServiceDisputeListResource,
    TruckServiceHistoryResource,
    DriverListResource,
    DriverResource,
    CheckInOutHistoryListResource
)

app = Flask(__name__)

# --- Database config ---
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fleet.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
CORS(app)
api = Api(app)

# --- API routes ---
api.add_resource(HelloResource, "/api/hello")
api.add_resource(TruckListResource, "/api/trucks")
api.add_resource(TruckResource, "/api/trucks/<int:truck_id>")
api.add_resource(ServiceRequestListResource, "/api/service-requests")
api.add_resource(
    TechnicianWorkOrdersResource,
    "/api/technicians/<int:tech_id>/work-orders",
)
api.add_resource(ServiceDisputeListResource, "/api/disputes")
api.add_resource(ServiceRequestResource, "/api/service-requests/<int:request_id>")
api.add_resource(
    TruckServiceHistoryResource,
    "/api/trucks/<int:truck_id>/service-history",
)
api.add_resource(DriverListResource, "/api/drivers")
api.add_resource(DriverResource, "/api/drivers/<int:driver_id>")
api.add_resource(CheckInOutHistoryListResource, "/api/checkinout-history")


@app.route("/")
def root():
    # Simple health check so hitting / doesn't error
    return "Fleet API is running", 200


# --- Ensure tables exist + seed demo trucks (runs on import) ---
with app.app_context():
    db.create_all()

    if not Truck.query.first():
        demo_trucks = [
            Truck(
                name="Truck 101",
                vin="1FTFW1E50LFA00001",
                make="Ford",
                model="F-150",
                year=2020,
                status="Active",
                miles=45210,
                fuel_percent=76,
                engine_status="Good",
                battery_status="Normal",
                last_driver="John Doe",
                last_miles_driven=120,
            ),
            Truck(
                name="Truck 202",
                vin="1HTMKADN43H561234",
                make="International",
                model="DuraStar",
                year=2018,
                status="In Shop",
                miles=89210,
                fuel_percent=34,
                engine_status="Check Engine",
                battery_status="Weak",
                last_driver="Jane Smith",
                last_miles_driven=80,
            ),
        ]
        db.session.add_all(demo_trucks)
        db.session.commit()
        print("Seeded demo trucks.")


if __name__ == "__main__":
    app.run(debug=True)

# debug: show routes and HTTP methods
print("Registered routes and methods:")
for rule in app.url_map.iter_rules():
    print(rule, sorted(rule.methods))
