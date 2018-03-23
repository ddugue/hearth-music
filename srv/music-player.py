from pydub import AudioSegment
from flask import Flask, jsonify, request, abort, send_file, Response
from models import db, Genre, Album, Track
import utils
import io

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
    """ Return a list of albums that is in the library """
    page = request.args.get('page', 1, type=int)
    paginator = Album.query.order_by(Album.name.desc()).paginate(page, 20)
    return jsonify({
        "page": page,
        "next": ("/albums?page=%s" % paginator.next_num) if paginator.has_next else None,
        "items": [album.serialize() for album in paginator.items],
    })

@app.route('/albums/<int:album_id>')
def album(album_id):
    """ Return information on a single album """
    album = Album.query.get(album_id)
    if not album: abort(404)
    return jsonify(album.serialize())

@app.route('/albums/<int:album_id>/tracks')
def album_tracks(album_id):
    """ Return tracks that are in an album """
    tracks = Track.query.filter_by(album_id=album_id).order_by(Track.disk.asc(), Track.track.asc())
    return jsonify([track.serialize() for track in tracks])

@app.route('/cover/<uuid>')
def cover(uuid):
    """ Return a cacheable cover for an album """
    album = Album.query.filter_by(uuid=uuid).first()
    if not album or not album.cover: abort(404)
    filename = album.cover
    if filename.endswith('png'):
        return send_file(filename, mimetype='image/png', cache_timeout=60 * 60 * 24 * 365)
    return send_file(filename, mimetype='image/jpg', cache_timeout=60 * 60 * 24 * 365)

@app.route('/songs/<uuid>')
def music(uuid):
    """ Return a cacheable track music """
    seek = request.args.get('seek', 0, type=int) # In seconds
    track = Track.query.filter_by(uuid=uuid).first()
    if not track or not track.filepath: abort(404)
    filename = track.filepath
    if filename.endswith('m4a'):
        f = AudioSegment.from_file(filename, "m4a")

        if seek:
            f = f[seek * 1000:]

        output = io.BytesIO()
        f.export(output)

        def generate():
            for chunk in iter(lambda: output.read(4096), b''):
                yield chunk
        return Response(generate(), mimetype='audio/mp4')
    else:
        def generate():
            f = open(filename, "rb")
            if seek:
                f.seek(track.bitrate * seek // 8)

            for chunk in iter(lambda: f.read(4096), b''):
                yield chunk
        return Response(generate(), mimetype='audio/mpeg')
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
            f = utils.convert_to_mp3(dirpath, f)
            track_info = metadata.get_track_info(dirpath, f)
            if dry_run:
                print(track_info)
                continue
            # If file is not an mp3 we convert it to an mp3
            # track_info["filepath"] = utils.convert_to_mp3(track_info)

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