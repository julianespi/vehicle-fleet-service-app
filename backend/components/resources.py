# backend/resources.py
from flask_restful import Resource
from flask import request
from datetime import datetime
from flask_restful import Resource
from components.models import db
from components.models import Truck, ServiceRequest, Technician, ServiceDispute, ServiceHistory


# ---------- Serializers (model -> dict) ----------

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
        "last_driven_date": truck.last_driven_date.isoformat() if truck.last_driven_date else None,
        "last_miles_driven": truck.last_miles_driven,
    }


def service_request_to_dict(req: ServiceRequest):
    return {
        "id": req.id,
        "truck_id": req.truck_id,
        "service_type": req.service_type,
        "description": req.description,
        "preferred_date": req.preferred_date.isoformat() if req.preferred_date else None,
        "status": req.status,
        "technician_id": req.technician_id,
        "created_at": req.created_at.isoformat() if req.created_at else None,
        "truck": truck_to_dict(req.truck) if req.truck else None,
    }


# ---------- API Resources ----------

class HelloResource(Resource):
    def get(self):
        return {"message": "Hello World, from Flask!"}, 200
    
class TruckResource(Resource):
    """
    GET / DELETE / PATCH for a single truck resource.
    """
    def get(self, truck_id):
        truck = Truck.query.get(truck_id)
        if not truck:
            return {"error": "Truck not found"}, 404
        return truck_to_dict(truck), 200

    def delete(self, truck_id):
        truck = Truck.query.get(truck_id)
        if not truck:
            return {"error": "Truck not found"}, 404

        db.session.delete(truck)
        db.session.commit()
        return {"message": "Truck deleted"}, 200

    def patch(self, truck_id):
        truck = Truck.query.get(truck_id)
        if not truck:
            return {"error": "Truck not found"}, 404

        data = request.get_json() or {}

        # allow tech to update these fields
        for field in ["status", "miles", "fuel_percent", "engine_status", "battery_status"]:
            if field in data:
                setattr(truck, field, data[field])

        db.session.commit()
        return truck_to_dict(truck), 200


class TruckListResource(Resource):
    # GET /api/trucks
    def get(self):
        trucks = Truck.query.all()
        return [truck_to_dict(t) for t in trucks], 200

    # POST /api/trucks
    def post(self):
        data = request.get_json()
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
    # GET /api/service-requests?status=Pending
    def get(self):
        status = request.args.get("status")
        query = ServiceRequest.query
        if status:
            query = query.filter_by(status=status)
        requests = query.order_by(ServiceRequest.created_at.desc()).all()
        return [service_request_to_dict(r) for r in requests], 200

    # POST /api/service-requests
    def post(self):
        data = request.get_json()
        if "truck_id" not in data or "service_type" not in data:
            return {"error": "truck_id and service_type are required"}, 400

        preferred_date = None
        if data.get("preferred_date"):
            preferred_date = datetime.fromisoformat(data["preferred_date"]).date()

        req = ServiceRequest(
            truck_id=data["truck_id"],
            service_type=data["service_type"],
            description=data.get("description"),
            preferred_date=preferred_date,
        )

        db.session.add(req)
        db.session.commit()
        return service_request_to_dict(req), 201


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
        data = request.get_json()
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
    
    class TruckCreateResource(Resource):
        def post(self):
            data = request.get_json()

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
            )

            db.session.add(truck)
            db.session.commit()
            return {"message": "Truck created", "id": truck.id}, 201

