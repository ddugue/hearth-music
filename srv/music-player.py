import utils
import io

from flask import Flask, jsonify, request, abort, send_file, Response
from flask_cors import CORS, cross_origin

from models import db, Album, Track, Artist, Genre, create_indexes

app = Flask(__name__)
app.config.from_json('../etc/config.json')
db.init_app(app)
create_indexes(app)
CORS(app)

@app.route('/albums')
def albums_view():
    """ Return a list of albums that is in the library """
    page = request.args.get('page', 1, type=int)
    paginator = Album.list().paginate(page, 20)
    return jsonify({
        "page": page,
        "next": ("/albums?page=%s" % paginator.next_num) if paginator.has_next else None,
        "items": [album.serialize() for album in paginator.items],
    })

@app.route('/albums/<album_id>')
def album_view(album_id):
    """ Return information on a single album """
    album = Album.get(album_id)
    if not album: abort(404)
    return jsonify(album.serialize())

@app.route('/albums/<album_id>/tracks')
def album_tracks_view(album_id):
    """ Return tracks that are in an album """
    tracks = Track.of_album(album_id)
    return jsonify([track.serialize() for track in tracks])

@app.route('/cover/<album_id>')
def cover_view(album_id):
    """ Return a cacheable cover for an album """
    album = Album.get(album_id)
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
    track = Track.get(uuid)
    if not track or not track.filepath: abort(404)

    return send_file(track.filepath, conditional=True)

@app.route('/artists')
def artists_view():
    """ Return a list of artist from the database """
    page = request.args.get('page', 1, type=int)
    paginator = Artist.list().paginate(page, 20)
    return jsonify({
        "page": page,
        "next": ("/artists?page=%s" % paginator.next_num) if paginator.has_next else None,
        "items": [Artist(item).serialize() for item in paginator.items],
    })

@app.route('/artists/<artist_id>')
def artist_view(artist_id):
    """ Return albums of a specific artist """
    albums = Album.of_artist(artist_id)
    return jsonify(
        [album.serialize() for album in albums],
    )

@app.route('/genres')
def genres_view():
    """ Return a list of artist from the database """
    genres = Genre.list()
    return jsonify([Genre(genre).serialize() for genre in genres])

@app.route('/genres/<genre>')
def genre_view(genre):
    """ Return a list of artist from the database """
    page = request.args.get('page', 1, type=int)
    paginator = Album.of_genre(genre).paginate(page, 20)
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

    albums = Album.search(query).limit(length)
    artists = Artist.search(query).limit(length)
    songs = Track.search(query).limit(length)

    return jsonify({
        "albums": [album.serialize() for album in albums],
        "artists": [Artist(artist).serialize() for artist in artists],
        "songs": [song.serialize() for song in songs],
    })
