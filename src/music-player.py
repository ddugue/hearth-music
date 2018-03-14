
from flask import Flask, jsonify, request, abort, send_file
from models import db, Genre, Album, Track

app = Flask(__name__)
app.config.from_json('../etc/config.json')
db.init_app(app)

@app.route('/')
def hello_world():
    genres = list(Genre.query.all())
    albums = list(Album.query.all())

    return jsonify(albums)

@app.route('/albums')
def albums():
    page = request.args.get('page', 1, type=int)
    paginator = Album.query.order_by(Album.name.desc()).paginate(page, 20)
    return jsonify({
        "page": page,
        "next": ("/albums?page=%s" % paginator.next_num) if paginator.has_next else None,
        "items": [album.serialize() for album in paginator.items],
    })

@app.route('/albums/<int:album_id>')
def album(album_id):
    album = Album.query.get(album_id)
    if not album: abort(404)
    return jsonify(album.serialize())

@app.route('/albums/<int:album_id>/tracks')
def album_tracks(album_id):
    tracks = Track.query.filter_by(album_id=album_id).order_by(Track.disk.asc(), Track.track.asc())
    return jsonify([track.serialize() for track in tracks])

@app.route('/cover/<uuid>')
def cover(uuid):
    album = Album.query.filter_by(uuid=uuid).first()
    if not album or not album.cover: abort(404)
    filename = album.cover
    if filename.endswith('png'):
        return send_file(filename, mimetype='image/png', cache_timeout=60 * 60 * 24 * 365)
    return send_file(filename, mimetype='image/jpg', cache_timeout=60 * 60 * 24 * 365)

#-- CLI Commands
import click
import os
import mutagen
import metadata
from mutagen.easyid3 import EasyID3
@app.cli.command()
@click.option('--dry-run', is_flag=True)
def scan(dry_run):
    """Initialize the database."""
    if dry_run: click.echo('Running in dry run')
    click.echo('Clearing previous db...')
    if not dry_run: db.drop_all()

    click.echo('Initializing the db...')
    if not dry_run: db.create_all()

    # click.echo('Installing fixtures...')
    # acid = Genre(name="Acid Jazz")
    # db.session.add(acid)
    # db.session.commit()

    click.echo('Scanning music library...')
    for dirpath, dirs, filenames in os.walk(app.config['MUSIC_LIBRARY']):
        for f in filenames:
            track_info = metadata.get_track_info(dirpath, f)
            if dry_run:
                print(track_info)
                continue
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
        if not dry_run: db.session.commit()

            # meta = EasyID3(os.path.join(dirpath, f))
            # if meta:
            #     print(meta.keys())
            # if m:
            #     print(m.info)
            #     print(m.tags.keys())
