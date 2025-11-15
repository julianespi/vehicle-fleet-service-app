# backend/app.py
from flask import Flask, render_template
from flask_restful import Api
from flask_cors import CORS

from components.models import db
from components.resources import (
    HelloResource,
    TruckListResource,
    ServiceRequestListResource,
    TechnicianWorkOrdersResource,
    ServiceDisputeListResource,
)

app = Flask(
    __name__,
    static_folder="../frontend/dist",
    template_folder="../frontend/dist",
)

# --- Database config ---
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fleet.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
CORS(app)

api = Api(app)

# -------- API ROUTES (your “PI rounds”) --------

# Simple test endpoint
api.add_resource(HelloResource, "/api/hello")

# Fleet data
api.add_resource(TruckListResource, "/api/trucks")
api.add_resource(ServiceRequestListResource, "/api/service-requests")
api.add_resource(
    TechnicianWorkOrdersResource,
    "/api/technicians/<int:tech_id>/work-orders",
)
api.add_resource(ServiceDisputeListResource, "/api/disputes")


# -------- Serve the React app --------
# You’re using HashRouter, so really "/" is what matters,
# but this catch-all also works if you add other routes later.
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    return render_template("index.html")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
