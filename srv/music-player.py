import utils
import io

from flask import Flask, jsonify, request, abort, send_file, Response
from flask_cors import CORS, cross_origin

from models import db, Album, Track, create_indexes

app = Flask(__name__)
app.config.from_json('../etc/config.json')
db.init_app(app)
create_indexes(app)
CORS(app)

@app.route('/albums')
def albums_view():
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

@app.route('/albums/<album_id>/tracks')
def album_tracks_view(album_id):
    """ Return tracks that are in an album """
    tracks = Track.query.join(Album)\
                        .filter(Album.uuid == album_id)\
                        .order_by(Track.track.asc())
    return jsonify([track.serialize() for track in tracks])

@app.route('/cover/<album_id>')
def cover_view(album_id):
    """ Return a cacheable cover for an album """
    album = Album.query.filter_by(uuid=album_id).one_or_none()
    if not album or not album.cover: abort(404)

    filename = album.cover_filepath
    mimetype = 'image/png' if filename.endswith('png') else 'image/jpg'
    cache = 60 * 60 * 24 * 365 # 1 Year

    return send_file(filename,
                     mimetype=mimetype,
                     cache_timeout=cache,
                     conditional=True)

@app.route('/songs/<uuid>')
def music_view(uuid):
    """ Return a cacheable track music """
    track = Track.query.filter_by(uuid=uuid).first()
    if not track or not track.filepath: abort(404)

    return send_file(track.filepath, conditional=True)

@app.route('/artists')
def artists_view():
    """ Return a list of artist from the database """
    page = request.args.get('page', 1, type=int)
    paginator = Album.query.group_by(Album.artist)\
                           .with_entities(Album.artist_id, Album.artist)\
                           .paginate(page, 20)
    return jsonify({
        "page": page,
        "next": ("/artists?page=%s" % paginator.next_num) if paginator.has_next else None,
        "items": dict(paginator.items)
    })

@app.route('/artists/<artist_id>')
def artist_view(artist_id):
    """ Return albums of a specific artist """
    albums = Album.query.order_by(Album.name.desc()).filter_by(artist_id=artist_id)
    return jsonify(
        [album.serialize() for album in albums],
    )

@app.route('/genres')
def genres_view():
    """ Return a list of artist from the database """
    genres = Album.query.group_by(Album.genre)\
                        .with_entities(Album.genre)
    return jsonify([genre[0] for genre in genres])

@app.route('/genres/<genre>')
def genre_view(genre):
    """ Return a list of artist from the database """
    page = request.args.get('page', 1, type=int)
    paginator = Album.query.filter(Album.genre.ilike(genre))\
                           .paginate(page, 20)
    return jsonify({
        "page": page,
        "next": ("/genres?page=%s" % paginator.next_num) if paginator.has_next else None,
        "items": [album.serialize() for album in paginator.items],
    })

@app.route('/search')
def search_view():
    """ Return object matching a search """
    query = request.args.get('q')
    length = request.args.get('n', 20, type=int)

    if not query or len(query) <= 3:
        abort(400, "Must provide a query longer than 3 characters")

    if length > 100:
        abort(400, "Maximum 100 of results")

    albums = Album.query.filter(Album.name.contains(query))\
                        .order_by(Album.name.desc())\
                        .limit(length)
    artists = Album.query.filter(Album.artist.contains(query))\
                         .group_by(Album.artist)\
                         .with_entities(Album.artist_id, Album.artist)\
                         .limit(length)
    songs = Track.query.filter(Track.title.contains(query))\
                       .order_by(Track.title.desc())\
                       .limit(length)

    return jsonify({
        "albums": [album.serialize() for album in albums],
        "artists": dict(artists),
        "songs": [song.serialize() for song in songs],
    })
