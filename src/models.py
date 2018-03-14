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

    def __repr__(self):
        return u'<Genre {0.name}>'.format(self)

class Artist(db.Model):
    __tablename__ = 'artist'

    id = Column(Integer, primary_key=True)
    name = Column(String(128), index=True, nullable=False)
    albums = relationship('Album', backref=db.backref('artist', lazy='joined'))

    @classmethod
    def get_or_create(cls, artist, *args, **kwargs):
        created = False
        name = artist.strip()
        instance = Artist.query.filter(func.lower(Artist.name) == func.lower(name)).first()
        if not instance:
            created = True
            instance = Artist(name=name)
            db.session.add(instance)
            db.session.flush()
        return instance, created

    def __repr__(self):
        return u'<Artist {0.name}>'.format(self)

class Album(db.Model):
    __tablename__ = 'album'

    id = Column(Integer, primary_key=True)
    uuid =  Column(String(33), index=True)
    name = Column(String(128), index=True)
    year = Column(Integer)

    cover = Column(String(128))
    artist_id = Column(Integer, ForeignKey('artist.id'), nullable=False)

    tracks = relationship('Track', backref='album', lazy=True)
    discogs_id = Column(String(32))
    musicbrainz_id = Column(String(32))

    def __repr__(self):
        return u'<Album {0.artist} - {0.name}>'.format(self)

    def serialize(self):
        return {
            "name": self.name,
            "cover": self.cover,
            "uuid": self.uuid,
            "artistId": self.artist_id,
            "artistName": self.artist.name,
        }

    @classmethod
    def get_or_create(cls, album, albumartist, year, cover, discogs_id,
                      musicbrainz_id, *args, **kwargs):

        created = False
        name = album.strip()
        uuid = None
        if discogs_id:
            instance = Album.query.filter_by(discogs_id=discogs_id).first()
            uuid = 'd%s' % discogs_id
        elif musicbrainz_id:
            instance = Album.query.filter_by(musicbrainz_id=musicbrainz_id).first()
            uuid = 'm%s' % musicbrainz_id
        else:
            instance = Album.query.filter(func.lower(Album.name) == func.lower(name)).first()
        if not instance:
            created = True
            artist, _ = Artist.get_or_create(albumartist)
            if not uuid:
                uuid = 'u%s' % uuid.uuid3(uuid.NAMESPACE_DNS, name)
            instance = Album(
                uuid=uuid, name=name, year=year, cover=cover, artist=artist,
                discogs_id=discogs_id, musicbrainz_id=musicbrainz_id)
            db.session.add(instance)
            db.session.flush()
        return instance, created


tracks_genre = db.Table('track_genre',
    Column('track_id', Integer, ForeignKey('track.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genre.id'), primary_key=True)
)

tracks_artist = db.Table('track_artist',
    Column('track_id', Integer, ForeignKey('track.id'), primary_key=True),
    Column('artist_id', Integer, ForeignKey('artist.id'), primary_key=True)
)

class Track(db.Model):
    __tablename__ = 'track'

    id = Column(Integer, primary_key=True)
    uuid =  Column(String(36), index=True)

    title = Column(String(128), index=True)
    filepath = Column(String(128))
    bitrate = Column(Integer)
    size = Column(Integer)
    length = Column(Float)

    track = Column(Integer, index=True)
    disk = Column(Integer, index=True)

    album_id = Column(Integer, ForeignKey('album.id'))

    artists = relationship('Artist', secondary=tracks_artist, lazy='subquery',
                           backref=backref('tracks', lazy=True))
    genres = relationship('Genre', secondary=tracks_genre, lazy='subquery',
                           backref=backref('tracks', lazy=True))

    @classmethod
    def get_or_create(cls, title, filepath, bitrate, size, length, track, disk,
                      album, artists, genres, *args, **kwargs):

        created = False
        title = title.strip()
        instance = Track.query.filter(func.lower(Track.title) == func.lower(title))\
                              .filter_by(album_id=album.id).first()
        if not instance:
            created = True
            instance = Track(
                title=title, filepath=filepath, bitrate=bitrate, size=size,
                length=length, track=track, disk=disk, album=album,
                uuid="%s-%s" % (album.uuid, track)
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
