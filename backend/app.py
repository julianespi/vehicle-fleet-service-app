from flask import Flask, request, jsonify, session
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = 'TODO: Change me'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/db_name'
db = SQLAlchemy(app)
api = Api(app)

# Define resources here (Users, UsersById)


# Define routes here
@app.route('/')
def hello_world():
    return 'Hello World, from Flask!'


if __name__ == '__main__':
    app.run(debug=True)
