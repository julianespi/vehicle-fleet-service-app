# backend/resources.py
from flask import request
from flask_restful import Resource
from datetime import datetime

from components.models import (
    db,
    Truck,
    ServiceRequest,
    Technician,
    ServiceDispute,
    ServiceHistory,
    Driver,
    CheckInOutHistory,
)

# ---------- Serializers (model -> dict) ----------


def driver_to_dict(driver: Driver):
    return {
        "id": driver.id,
        "name": driver.name,
        "license_number": driver.license_number,
        "address": driver.address,
        "phone_number": driver.phone_number,
        "email": driver.email,
        "is_available": driver.is_available,
        "current_truck_id": driver.current_truck_id,
    }


def truck_to_dict(truck: Truck):
    return {
        "id": truck.id,
        "name": truck.name,
        "vin": truck.vin,
        "make": truck.make,
        "model": truck.model,
        "year": truck.year,
        "status": truck.status,
        "miles": truck.miles,
        "fuel_percent": truck.fuel_percent,
        "engine_status": truck.engine_status,
        "battery_status": truck.battery_status,
        "last_driver": truck.last_driver,
        "last_driven_date": truck.last_driven_date.isoformat()
        if truck.last_driven_date
        else None,
        "last_miles_driven": truck.last_miles_driven,
        "driver_id": truck.driver_id,
        "driver": driver_to_dict(truck.driver) if truck.driver else None,
    }


def service_request_to_dict(req: ServiceRequest):
    return {
        "id": req.id,
        "truck_id": req.truck_id,
        "service_type": req.service_type,
        "description": req.description,
        "preferred_date": req.preferred_date.isoformat()
        if req.preferred_date
        else None,
        "status": req.status,
        "technician_id": req.technician_id,
        "created_at": req.created_at.isoformat() if req.created_at else None,
        "truck": truck_to_dict(req.truck) if req.truck else None,
    }


def service_request_history_to_dict(req: ServiceRequest):
    """
    Flatten a ServiceRequest into a 'history line item'.
    'is_active' = True if the request is not done yet.
    """
    return {
        "id": req.id,
        "truck_id": req.truck_id,
        "truck_name": req.truck.name if req.truck else None,
        "service_type": req.service_type,
        "description": req.description,
        "preferred_date": req.preferred_date.isoformat()
        if req.preferred_date
        else None,
        "status": req.status,
        "is_active": req.status in ("Pending", "InProgress"),
        "technician_name": req.technician.name
        if getattr(req, "technician", None)
        else None,
        "created_at": req.created_at.isoformat() if req.created_at else None,
    }

def checkinout_to_dict(row: CheckInOutHistory):
    return {
        "id": row.id,
        "truck_id": row.truck_id,
        "truck_name": row.truck.name if row.truck else None,
        "driver_id": row.driver_id,
        "driver_name": row.driver.name if row.driver else None,
        "driver_email": row.driver.email if row.driver else None,
        "checked_out_at": row.checked_out_at.isoformat() if row.checked_out_at else None,
        "checked_in_at": row.checked_in_at.isoformat() if row.checked_in_at else None,
        "start_miles": row.start_miles,
        "end_miles": row.end_miles,
    }


# ---------- API Resources ----------


class HelloResource(Resource):
    def get(self):
        return {"message": "Hello World, from Flask!"}, 200


class TruckResource(Resource):
    # GET /api/trucks/<truck_id>
    def get(self, truck_id):
        truck = Truck.query.get_or_404(truck_id)
        return truck_to_dict(truck), 200

    # DELETE /api/trucks/<truck_id>
    def delete(self, truck_id):
        truck = Truck.query.get_or_404(truck_id)
        db.session.delete(truck)
        db.session.commit()
        return {"message": "Truck deleted"}, 204

    # PATCH /api/trucks/<truck_id>
    def patch(self, truck_id):
        data = request.get_json() or {}
        truck = Truck.query.get_or_404(truck_id)

        # --- Basic field updates ---
        if "miles" in data:
            truck.miles = data["miles"]

        if "fuel_percent" in data:
            truck.fuel_percent = data["fuel_percent"]

        if "engine_status" in data:
            truck.engine_status = data["engine_status"]

        if "battery_status" in data:
            truck.battery_status = data["battery_status"]

        if "last_driver" in data:
            truck.last_driver = data["last_driver"]

        if "last_driven_date" in data:
            val = data["last_driven_date"]
            if val:
                # accept ISO date string
                truck.last_driven_date = datetime.fromisoformat(val).date()
            else:
                truck.last_driven_date = None

        if "last_miles_driven" in data:
            truck.last_miles_driven = data["last_miles_driven"]

        # --- DRIVER CHECK-OUT / CHECK-IN ---
        if "status" in data:
            new_status = data["status"]

            # DRIVER CHECK-OUT (Active -> On Road)
            if new_status == "On Road":
                driver_id = data.get("driver_id")
                if not driver_id:
                    return {"error": "driver_id is required for checkout"}, 400

                driver = Driver.query.get(driver_id)
                if not driver:
                    return {"error": "Driver not found"}, 404
                if not driver.is_available:
                    return {"error": "Driver is not available"}, 400

                # Assign driver to truck
                truck.driver_id = driver.id
                truck.status = "On Road"

                # Update driver
                driver.is_available = False
                driver.current_truck_id = truck.id

                # NEW: create an "open" trip row (no checked_in_at yet)
                trip = CheckInOutHistory(
                    truck_id=truck.id,
                    driver_id=driver.id,
                    checked_out_at=datetime.utcnow(),
                    start_miles=truck.miles,
                )
                db.session.add(trip)

            # DRIVER CHECK-IN (On Road -> Active)
            elif new_status == "Active":
                # capture driver before clearing
                prev_driver_id = truck.driver_id

                # NEW: close the most recent open trip for this truck/driver
                if prev_driver_id:
                    trip = (
                        CheckInOutHistory.query
                        .filter_by(truck_id=truck.id, driver_id=prev_driver_id, checked_in_at=None)
                        .order_by(CheckInOutHistory.checked_out_at.desc())
                        .first()
                    )
                    if trip:
                        trip.checked_in_at = datetime.utcnow()
                        trip.end_miles = truck.miles

                if prev_driver_id:
                    driver = Driver.query.get(prev_driver_id)
                    if driver:
                        driver.is_available = True
                        driver.current_truck_id = None

                truck.driver_id = None
                truck.status = "Active"

            # Other statuses (In Shop etc.)
            else:
                truck.status = new_status

        db.session.commit()
        return truck_to_dict(truck), 200


class TruckListResource(Resource):
    # GET /api/trucks
    def get(self):
        trucks = Truck.query.all()
        return [truck_to_dict(t) for t in trucks], 200

    # POST /api/trucks
    def post(self):
        data = request.get_json() or {}
        try:
            truck = Truck(
                name=data["name"],
                vin=data["vin"],
                make=data.get("make"),
                model=data.get("model"),
                year=data.get("year"),
                status=data.get("status", "Active"),
                miles=data.get("miles", 0),
                fuel_percent=data.get("fuel_percent", 0),
                engine_status=data.get("engine_status", "Good"),
                battery_status=data.get("battery_status", "Normal"),
                last_driver=data.get("last_driver"),
                last_miles_driven=data.get("last_miles_driven"),
            )
        except KeyError as e:
            return {"error": f"Missing required field: {e.args[0]}"}, 400

        db.session.add(truck)
        db.session.commit()
        return truck_to_dict(truck), 201


class ServiceRequestListResource(Resource):
    # GET /api/service-requests?status=Pending&truckId=1
    def get(self):
        status = request.args.get("status")
        truck_id = request.args.get("truckId", type=int)

        query = ServiceRequest.query

        if status:
            query = query.filter_by(status=status)
        if truck_id is not None:
            query = query.filter_by(truck_id=truck_id)

        requests = query.order_by(ServiceRequest.created_at.desc()).all()
        return [service_request_to_dict(r) for r in requests], 200

    # POST /api/service-requests
    def post(self):
        data = request.get_json() or {}
        if "truck_id" not in data or "service_type" not in data:
            return {"error": "truck_id and service_type are required"}, 400

        preferred_date = None
        if data.get("preferred_date"):
            preferred_date = datetime.fromisoformat(
                data["preferred_date"]
            ).date()

        req = ServiceRequest(
            truck_id=data["truck_id"],
            service_type=data["service_type"],
            description=data.get("description"),
            preferred_date=preferred_date,
        )

        db.session.add(req)

        # when a service request is created, mark that truck as In Shop
        truck = Truck.query.get(data["truck_id"])
        if truck is not None:
            truck.status = "In Shop"

        db.session.commit()
        return service_request_to_dict(req), 201


class ServiceRequestResource(Resource):
    """
    Operations on a single service request.
    Right now we only need DELETE to 'finish' a job.
    """

    # DELETE /api/service-requests/<request_id>
    def delete(self, request_id):
        req = ServiceRequest.query.get(request_id)
        if not req:
            return {"error": "Service request not found"}, 404

        truck = req.truck
        if truck is not None:
            truck.status = "Active"

        req.status = "Done"

        db.session.commit()
        return service_request_to_dict(req), 200


class TechnicianWorkOrdersResource(Resource):
    # GET /api/technicians/<tech_id>/work-orders
    def get(self, tech_id):
        requests = ServiceRequest.query.filter_by(
            technician_id=tech_id, status="Pending"
        ).all()
        return [service_request_to_dict(r) for r in requests], 200


class ServiceDisputeListResource(Resource):
    # POST /api/disputes
    def post(self):
        data = request.get_json() or {}
        if "service_request_id" not in data or "reason" not in data:
            return {"error": "service_request_id and reason are required"}, 400

        dispute = ServiceDispute(
            service_request_id=data["service_request_id"],
            reason=data["reason"],
            preferred_resolution=data.get("preferred_resolution"),
        )

        db.session.add(dispute)
        db.session.commit()
        return {"id": dispute.id}, 201


class TruckServiceHistoryResource(Resource):
    # GET /api/trucks/<truck_id>/service-history
    def get(self, truck_id):
        truck = Truck.query.get(truck_id)
        if not truck:
            return {"error": "Truck not found"}, 404

        requests = (
            ServiceRequest.query.filter_by(truck_id=truck_id)
            .order_by(ServiceRequest.created_at.desc())
            .all()
        )

        return {
            "truck": truck_to_dict(truck),
            "history": [service_request_history_to_dict(r) for r in requests],
        }, 200


# ---------- DRIVER RESOURCES ----------

class DriverListResource(Resource):
    # GET /api/drivers?available=true
    def get(self):
        available = request.args.get("available")
        query = Driver.query
        if available == "true":
            query = query.filter_by(is_available=True)

        drivers = query.all()
        return [driver_to_dict(d) for d in drivers], 200

    # POST /api/drivers
    def post(self):
        data = request.get_json() or {}
        try:
            driver = Driver(
                name=data["name"],
                license_number=data["license_number"],
                address=data.get("address"),
                phone_number=data.get("phone_number"),
                email=data["email"],
                is_available=True,
            )
        except KeyError as e:
            return {"error": f"Missing required field: {e.args[0]}"}, 400

        db.session.add(driver)
        db.session.commit()
        return driver_to_dict(driver), 201


class DriverResource(Resource):
    # PATCH /api/drivers/<driver_id>
    def patch(self, driver_id):
        driver = Driver.query.get_or_404(driver_id)
        data = request.get_json() or {}

        if "is_available" in data:
            driver.is_available = data["is_available"]

        if "current_truck_id" in data:
            driver.current_truck_id = data["current_truck_id"]

        db.session.commit()
        return driver_to_dict(driver), 200

class CheckInOutHistoryListResource(Resource):
    # GET /api/checkinout-history?truckId=1&completed=true
    def get(self):
        truck_id = request.args.get("truckId", type=int)
        driver_id = request.args.get("driverId", type=int)
        completed = request.args.get("completed", "true")

        q = CheckInOutHistory.query

        if truck_id is not None:
            q = q.filter_by(truck_id=truck_id)
        if driver_id is not None:
            q = q.filter_by(driver_id=driver_id)

        if completed == "true":
            q = q.filter(CheckInOutHistory.checked_in_at.isnot(None))

        rows = q.order_by(CheckInOutHistory.checked_out_at.desc()).all()
        return [checkinout_to_dict(r) for r in rows], 200