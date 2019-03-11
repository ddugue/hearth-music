# from pydub import AudioSegment
from flask import Flask, jsonify, request, abort, send_file, Response
from flask_cors import CORS, cross_origin
from models import db, Album, create_indexes
import utils
import io

app = Flask(__name__)
app.config.from_json('../etc/config.json')
db.init_app(app)
create_indexes(app)
CORS(app)

# @app.route('/')
# def hello_world():
#     genres = list(Genre.query.all())
#     albums = list(Album.query.all())
#     return '<audio src="http://localhost:5000/songs/f05370cf-6024-4b1a-9c4a-74edadcebcd3" controls type="audio/ogg" />'

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

@app.route('/albums/<album_id>')
def album_view(album_id):
    """ Return information on a single album """
    album = Album.query.filter_by(uuid=album_id).one_or_none()
    if not album: abort(404)
    return jsonify(album.serialize())

# @app.route('/albums/<album_id>/tracks')
# def album_tracks(album_id):
#     """ Return tracks that are in an album """
#     tracks = Track.query.filter_by(album_id=album_id).order_by(Track.track.asc())
#     return jsonify([track.serialize() for track in tracks])

@app.route('/cover/<album_id>')
def cover(album_id):
    """ Return a cacheable cover for an album """
    album = Album.query.filter_by(uuid=album_id).first()
    if not album or not album.cover: abort(404)

    filename = album.cover
    print("Filename is %s" % filename)
    mimetype = 'image/png' if filename.endswith(b'png') else 'image/jpg'
    cache = 60 * 60 * 24 * 365 # 1 Year

    return send_file(filename.decode('utf-8'),
                     mimetype=mimetype,
                     cache_timeout=cache,
                     conditional=True)

# @app.route('/songs/<uuid>')
# def music(uuid):
#     """ Return a cacheable track music """
#     track = Track.query.filter_by(uuid=uuid).first()
#     if not track or not track.filepath: abort(404)
#     # filename = track.filepath

#     # range_header = request.headers.get('Range', 'bytes=0-')
#     # from_bytes, until_bytes = range_header.replace('bytes=', '').split('-')
#     # from_bytes = int(from_bytes)
#     # if not until_bytes:
#     #     until_bytes = from_bytes + int(1024 * 1024 * 3) # Default size is 3MB

#     # until_bytes = min(int(until_bytes), track.size)

#     # # Build response
#     # fi = open(track.filepath, "rb")
#     # fi.seek(from_bytes)
#     # # def generate_data_from_response(f, chunk=8192):
#     # #     for data_chunk in iter(lambda: f.read(chunk), b''):
#     # #         yield data_chunk

#     # if request.headers.get('Range') is not None:
#     #     rv = Response(generate_data_from_response(fi), 206, mimetype='audio/ogg', direct_passthrough=True)
#     #     rv.headers.add('Accept-Ranges', 'bytes')
#     #     rv.headers.add('Content-Range', 'bytes %s-%s/%s' % (from_bytes, until_bytes, track.size))
#     #     rv.headers.add('Content-Length', str(until_bytes - from_bytes))
#     #     return rv
#     # rv = Response(generate_data_from_response(fi), 200, mimetype='audio/ogg', direct_passthrough=True)
#     # rv.headers.add('Accept-Ranges', 'bytes')

#     # return rv
#     return send_file(track.filepath, conditional=True)


#-- CLI Commands
# import click
# import os
# import mutagen
# import metadata
# from mutagen.easyid3 import EasyID3
# @app.cli.command()
# @click.option('--dry-run', is_flag=True)
# def scan(dry_run):
#     """Initialize the database."""
#     if dry_run: click.echo('Running in dry run')
#     click.echo('Clearing previous db...')
#     if not dry_run: db.drop_all()

#     click.echo('Initializing the db...')
#     if not dry_run: db.create_all()

#     # click.echo('Installing fixtures...')
#     # acid = Genre(name="Acid Jazz")
#     # db.session.add(acid)
#     # db.session.commit()

#     click.echo('Scanning music library...')
#     for dirpath, dirs, filenames in os.walk(app.config['MUSIC_LIBRARY']):
#         for f in filenames:
#             f = utils.convert_to_mp3(dirpath, f)
#             track_info = metadata.get_track_info(dirpath, f)
#             if dry_run:
#                 print(track_info)
#                 continue
#             # If file is not an mp3 we convert it to an mp3
#             # track_info["filepath"] = utils.convert_to_mp3(track_info)

#             if not album:
#                 album, created = Album.get_or_create(**track_info)
#                 if created:
#                     click.echo('Adding album {0.name} by {0.artist.name}...'.format(album))

#             if track_info:
#                 track_info['album'] = album
#                 track, created = Track.get_or_create(**track_info)
#                 if created:
#                     click.echo('Adding track {0.title} from {0.album.name}...'.format(track))
#         album = None
#         if not dry_run: db.session.commit()

#             # meta = EasyID3(os.path.join(dirpath, f))
#             # if meta:
#             #     print(meta.keys())
#             # if m:
#             #     print(m.info)
#             #     print(m.tags.keys())
