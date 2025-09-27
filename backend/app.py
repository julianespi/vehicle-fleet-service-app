from flask import Flask, render_template
from flask_restful import Api
from components import resources

app = Flask(__name__,
            static_folder='../frontend/dist',
            template_folder='../frontend/dist')

api = Api(app)
api.add_resource(resources.HelloResource, '/', '/hello')


@app.route('/index')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
