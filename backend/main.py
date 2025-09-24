from flask import Flask
from flask_restful import Api
from app import resources

app = Flask(__name__)
api = Api(app)


api.add_resource(resources.HelloResource, '/', '/hello')


if __name__ == '__main__':
    app.run(debug=True)
