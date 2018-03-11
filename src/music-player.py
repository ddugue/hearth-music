
from flask import Flask
from models import db, Genre

app = Flask(__name__)
app.config.from_json('../etc/config.json')
db.init_app(app)

@app.route('/')
def hello_world():
    genres = list(Genre.query.all())

    for g in genres:
        print(g)
    return ",".join(map(repr,genres))

#-- CLI Commands
import click
import os
import mutagen
import metadata
from mutagen.easyid3 import EasyID3
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

    click.echo('Scanning music library...')
    for dirpath, dirs, filenames in os.walk(app.config['MUSIC_LIBRARY']):
        for f in filenames:
            # meta = EasyID3(os.path.join(dirpath, f))
            # if meta:
            #     print(meta.keys())
            print(metadata.get_track_info(dirpath, f))
            # if m:
            #     print(m.info)
            #     print(m.tags.keys())
