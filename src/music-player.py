
from flask import Flask
from models import db, Genre

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../var/musiclib.db'
db.init_app(app)

@app.route('/')
def hello_world():
    genres = list(Genre.query.all())

    for g in genres:
        print(g)
    return ",".join(map(repr,genres))

#-- CLI Commands
import click
import mutagen
@app.cli.command()
def scan():
    """Initialize the database."""
    click.echo('Clearing previous db...')
    db.drop_all()

    click.echo('Initializing the db...')
    db.create_all()

    click.echo('Installing fixtures...')
    acid = Genre(name="Acid Jazz")
    db.session.add(acid)
    db.session.commit()
