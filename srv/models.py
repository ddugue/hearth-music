import uuid
from urllib import parse
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey, Float, func, Binary, Index

from flask import Flask

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Album(db.Model):
    "Model to proxy objects on beets db 'albums' table"
    __tablename__ = 'albums'

    id = Column('id', Integer, primary_key=True)

    name = Column('album', String(128), index=True)
    year = Column('original_year', Integer)
    genre = Column('genre', String(32))

    album_type = Column('albumtype', String(32))

    cover = Column('artpath', Binary)
    artist = Column('albumartist', String(128))
    artist_id = Column('mb_albumartistid', String(32))

    uuid = Column('mb_albumid', String(32))

    def __repr__(self):
        return u'<Album {0.artist} - {0.name}>'.format(self)

    @property
    def cover_filepath(self):
        return self.cover.decode('utf-8')

    @classmethod
    def get(cls, pk):
        "Get an album by its uuid"
        return cls.query.filter_by(uuid=pk).one_or_none()

    @classmethod
    def list(cls):
        "Get a list of all albums"
        return cls.query.order_by(cls.name.desc())

    @classmethod
    def search(cls, query):
        "Return a list of albums that name match query"
        return cls.list().filter(Album.name.contains(query))

    @classmethod
    def of_genre(cls, genre):
        "Get albums of a specific genre"
        return cls.list().filter(Album.genre.ilike(genre))

    @classmethod
    def of_artist(cls, artist_id):
        "Get albums of a specific genre"
        return cls.list().filter_by(artist_id=artist_id)

    def serialize(self):
        "Return a JSON-serializable version of this object"
        return {
            "uri": "/albums/%s" % self.uuid,
            "tracks_uri": "/albums/%s/tracks" % self.uuid,
            "name": self.name,
            "cover": "/cover/%s" % self.uuid,
            "uuid": self.uuid,
            "artist": self.artist,
            "artist_id": self.artist_id,
            "year": self.year,
            "album_type": self.album_type,
            "genre": self.genre,
        }

class Track(db.Model):
    "Model to proxy objects on beets db 'items' table"
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)

    title = Column(String(128), index=True)
    album_id = Column(Integer, ForeignKey('albums.id'))

    path = Column(Binary)
    artist = Column(String(128))
    track = Column(Integer)
    tracktotal = Column(Integer)

    uuid = Column('mb_trackid', String(32))
    length = Column(Float)

    @property
    def filepath(self):
        "Return the filepath of the song file"
        return self.path.decode('utf-8')

    def serialize(self):
        "Return a JSON-serializable version of this object"
        return {
            # "id": self.id,
            "url": "/songs/%s" % self.uuid,
            "uuid": self.uuid,
            "title": self.title,
            "track": self.track,
            "length": self.length,
            "artist": self.artist,
        }

    @classmethod
    def get(cls, pk):
        "Get a track by its uuid"
        return cls.query.filter_by(uuid=pk).one_or_none()

    @classmethod
    def of_album(cls, album_id):
        "Get a tracks of a specific album id"
        return cls.query.join(Album)\
                        .filter(Album.uuid == album_id)\
                        .order_by(cls.track.asc())

    @classmethod
    def list(cls):
        "Return a list of all tracks "
        return cls.query.order_by(Track.title.desc())

    @classmethod
    def search(cls, query):
        "Return a list of tracks that title match query"
        return cls.list().filter(Track.title.contains(query))

    def __repr__(self):
        return u'<Track {0.title}>'.format(self)

class Artist:
    "Simple object to represent an Artist"

    def __init__(self, tup):
        self.uuid = tup[0]
        self.name = tup[1]

    def serialize(self):
        "Return a JSON-serializable version of this object"
        return {
            "url": "/artists/%s" % self.uuid,
            "uuid": self.uuid,
            "name": self.name
        }

    @classmethod
    def list(cls):
        "Return a list of Artist tuple, need to instantiate an object with it after"
        return Album.query.group_by(Album.artist)\
                          .with_entities(Album.artist_id, Album.artist)

    @classmethod
    def search(cls, query):
        """Return a list of Artist tuple that contains query

        need to instantiate an object with it after"""

        return cls.list().filter(Album.artist.contains(query))

class Genre:
    "Simple object to represent a Genre"

    def __init__(self, tup):
        self.genre = tup[0]

    def serialize(self):
        "Return a JSON-serializable version of this object"
        return {
            "url": "/genres/%s" % parse.quote(self.genre),
            "name": self.genre
        }

    @classmethod
    def list(cls):
        "Return a list of Genre tuple, need to instantiate an object with it after"
        return Album.query.group_by(Album.genre)\
                          .with_entities(Album.genre)


###################
# Utils functions #
###################

def index_exists(name):
    "Checks wether index currently exist on Table"
    result = db.engine.execute(
        "SELECT exists(SELECT 1 from sqlite_master where name = '{}' AND type='index') as ix_exists;"
            .format(name)
    ).first()
    return result.ix_exists

def create_indexes(app):
    "Used to create indexes in the beets database for better performance"
    print("Creating indexes...")
    with app.app_context():
        # Album model
        if not index_exists("album_artist_index"):
            Index("album_artist_index", Album.__table__.columns.albumartist).create(db.engine)
        if not index_exists("album_name_index"):
            Index("album_name_index", Album.__table__.columns.album).create(db.engine)
        if not index_exists("album_uuid_index"):
            Index("album_uuid_index", Album.__table__.columns.mb_albumid, unique=True).create(db.engine)
        if not index_exists("album_genre_index"):
            Index("album_genre_index", Album.__table__.columns.genre).create(db.engine)

        # Track model
        if not index_exists("track_uuid_index"):
            Index("track_uuid_index", Track.__table__.columns.mb_trackid, unique=True).create(db.engine)
        if not index_exists("track_title_index"):
            Index("track_title_index", Track.__table__.columns.title).create(db.engine)
