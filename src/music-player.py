
from flask import Flask, jsonify
from models import db, Genre, Album, Track

app = Flask(__name__)
app.config.from_json('../etc/config.json')
db.init_app(app)

@app.route('/')
def hello_world():
    genres = list(Genre.query.all())
    albums = list(Album.query.all())

    return jsonify(albums)

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

    # click.echo('Installing fixtures...')
    # acid = Genre(name="Acid Jazz")
    # db.session.add(acid)
    # db.session.commit()

    click.echo('Scanning music library...')
    for dirpath, dirs, filenames in os.walk(app.config['MUSIC_LIBRARY']):
        for f in filenames:
            track_info = metadata.get_track_info(dirpath, f)
            if not album:
                album, created = Album.get_or_create(**track_info)
                if created:
                    click.echo('Adding album {0.name} by {0.artist.name}...'.format(album))

            if track_info:
                track_info['album'] = album
                track, created = Track.get_or_create(**track_info)
                if created:
                    click.echo('Adding track {0.title} from {0.album.name}...'.format(track))
        album = None
        db.session.commit()

            # meta = EasyID3(os.path.join(dirpath, f))
            # if meta:
            #     print(meta.keys())
            # if m:
            #     print(m.info)
            #     print(m.tags.keys())
