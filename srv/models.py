import uuid
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey, Float, func

from flask import Flask

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Genre(db.Model):
    __tablename__ = 'genre'

    id = Column(Integer, primary_key=True)
    name = Column(String(32), nullable=False)
    cover = Column(String(128))

    @classmethod
    def get_or_create(cls, genre, *args, **kwargs):
        created = False
        name = genre.strip()
        instance = Genre.query.filter(func.lower(Genre.name) == func.lower(name)).first()
        if not instance:
            created = True
            instance = Genre(name=name)
            db.session.add(instance)
            db.session.flush()
        return instance, created

    def serialize(self):
        return {
            "id": self.id,
            "uri":"/genres/%s" % self.id,
            "name": self.name,
        }

    def __repr__(self):
        return u'<Genre {0.name}>'.format(self)

class Artist(db.Model):
    __tablename__ = 'artist'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(32), index=True)
    name = Column(String(128), index=True, nullable=False)
    cover = Column(String(128))
    albums = relationship('Album', backref=db.backref('artist', lazy='joined'))

    @classmethod
    def get_or_create(cls, artist, musicbrainz_id=None, *args, **kwargs):
        created = False
        name = artist.strip()
        instance = Artist.query.filter(func.lower(Artist.name) == func.lower(name)).first()
        if not instance:
            created = True
            instance = Artist(name=name, uuid=musicbrainz_id)
            db.session.add(instance)
            db.session.flush()

        if instance and musicbrainz_id:
            instance.uuid = musicbrainz_id
            db.session.add(instance)
            db.session.flush()
        return instance, created

    def serialize(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "uri":"/artists/%s" % self.uuid if self.uuid else None,
            "name": self.name,
        }

    def __repr__(self):
        return u'<Artist {0.name}>'.format(self)

class Album(db.Model):
    __tablename__ = 'album'

    # id = Column(Integer, primary_key=True)
    name = Column(String(128), index=True)
    year = Column(Integer)

    cover = Column(String(128))
    artist_id = Column(Integer, ForeignKey('artist.id'), nullable=False)

    tracks = relationship('Track', backref=db.backref('album', lazy='joined'), lazy=True)
    uuid = Column(String(32), primary_key=True)

    def __repr__(self):
        return u'<Album {0.artist} - {0.name}>'.format(self)

    def serialize(self):
        return {
            "uri": "/albums/%s" % self.uuid,
            "tracks_uri": "/albums/%s/tracks" % self.uuid,
            # "id": self.id,
            "name": self.name,
            "cover": "/cover/%s" % self.uuid,
            "uuid": self.uuid,
            "artist": self.artist.serialize(),
        }

    @classmethod
    def get_or_create(cls, album, albumartist, year, cover,
                      musicbrainz_album_id, musicbrainz_albumartist_id,
                      *args, **kwargs):

        created = False
        name = album.strip()
        uuid = None
        instance = Album.query.filter_by(uuid=musicbrainz_album_id).first()
        if not instance:
            created = True
            artist, _ = Artist.get_or_create(albumartist, musicbrainz_albumartist_id)
            instance = Album(
                name=name, year=year, cover=cover, artist=artist,
                uuid=musicbrainz_album_id)
            db.session.add(instance)
            db.session.flush()
        return instance, created


tracks_genre = db.Table('track_genre',
    Column('track_id', Integer, ForeignKey('track.uuid'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genre.id'), primary_key=True)
)

tracks_artist = db.Table('track_artist',
    Column('track_id', Integer, ForeignKey('track.uuid'), primary_key=True),
    Column('artist_id', Integer, ForeignKey('artist.id'), primary_key=True)
)

class Track(db.Model):
    __tablename__ = 'track'

    # id = Column(Integer, primary_key=True)

    title = Column(String(128), index=True)
    filepath = Column(String(128))
    # bitrate = Column(Integer)
    size = Column(Integer)
    length = Column(Float)

    track = Column(Integer, index=True)

    album_id = Column(Integer, ForeignKey('album.uuid'))

    artists = relationship('Artist', secondary=tracks_artist, lazy='subquery',
                           backref=backref('tracks', lazy=True))
    genres = relationship('Genre', secondary=tracks_genre, lazy='subquery',
                           backref=backref('tracks', lazy=True))

    uuid = Column(String(32), primary_key=True) #Musicbrainz id

    def serialize(self):
        return {
            # "id": self.id,
            "url": "/songs/%s" % self.uuid,
            "uuid": self.uuid,
            "title": self.title,
            "track": self.track,
            "length": self.length,
            "album": self.album.serialize(),
            "artists": [artist.serialize() for artist in self.artists],
            "genres": [genre.serialize() for genre in self.genres],
        }

    @classmethod
    def get_or_create(cls, title, filepath, size, length, track,
                      musicbrainz_song_id, album, artists, genres,
                      *args, **kwargs):

        created = False
        title = title.strip()
        instance = Track.query.filter_by(uuid=musicbrainz_song_id).first()
        if not instance:
            created = True
            instance = Track(
                title=title, filepath=filepath, size=size,
                length=length, track=track, album=album,
                uuid=musicbrainz_song_id
            )
            for artist in artists:
                instance.artists.append(Artist.get_or_create(artist)[0])
            for genre in genres:
                instance.genres.append(Genre.get_or_create(genre)[0])
            db.session.add(instance)
            db.session.flush()
        return instance, created

    def __repr__(self):
        return u'<Track {0.title}>'.format(self)
