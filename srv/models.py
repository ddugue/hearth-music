import uuid
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

    def __repr__(self):
        return u'<Track {0.title}>'.format(self)

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
