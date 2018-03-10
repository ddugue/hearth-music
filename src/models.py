from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# class Artist(db.Model):
#     pass

class Genre(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(32))

# class Track(db.Model):
#     __tablename__ = 'track'

#     id = Column(Integer, primary_key=True)
#     artist = Column(String(200))
#     title = Column(String(240))
#     filename = Column(String(256))
#     track_num = Column(Integer)
#     mtime = Column(Integer)
#     album_id = Column(Integer, ForeignKey('album.id'))
#     album = relationship(
#         'Album',
#         backref=backref('tracks', lazy='dynamic')
#     )

#     def __repr__(self):
#         return u'<Track {0.artist} - {0.title}>'.format(self)

#     @property
#     def serialize(self):
#         return {
#             'artist': self.artist,
#             'title': self.title,
#             'album_id': self.album.id if self.album else None,
#             'track': self.track_num,
#             'id': self.id
#         }


# class Album(db.Model):
#     __tablename__ = 'album'

#     id = Column(Integer, primary_key=True)
#     artist = Column(String(200))
#     title = Column(String(240))
#     # TODO: Use a real date format.
#     date = Column(String(16))
#     label = Column(String(240))
#     cat_number = Column(String(32))
#     cover_art = Column(String(256))  # Filename of cover art, jpg/png.

#     def __init__(self, artist, title, date=None, label=None, cat_number=None,
#                  cover_art=None):
#         self.artist = artist
#         self.title = title
#         self.date = date
#         self.label = label
#         self.cat_number = cat_number
#         self.cover_art = cover_art

#     def __repr__(self):
#         return (
#             u'<Album {0.artist} - ' + u'{0.title} ({0.date})>'
#         ).format(self)

#     @property
#     def serialize(self):
#         tracks = Track.query.filter_by(album_id=self.id)\
#                             .order_by(Track.track_num)
#         cover_art = None
#         if self.cover_art is not None:
#             cover_art = '/static/music/' + self.cover_art
#         return {
#             'artist': self.artist,
#             'title': self.title,
#             'date': self.date,
#             'label': self.label,
#             'cat_number': self.cat_number,
#             'cover_art': cover_art,
#             'track_ids': [t.id for t in tracks],
#             'id': self.id,
#         }
