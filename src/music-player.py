from flask import Flask
from models import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../var/musiclib.db'
db.init_app(app)

@app.route('/')
def hello_world():
    return 'Emilie est awesome'
