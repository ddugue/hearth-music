import { ALBUMS } from '../actions/types';

// List of all albums
const DEFAULT_STATE = {
  '1': {
    name: 'Let it bleed',
    year: 1969,
    cover: 'http://farm8.staticflickr.com/7221/7296163316_35cb233684_b.jpg',
    artist: {
      id: '1',
      name: 'Rolling Stones',
    },
    tracks: {},
  },
  '2': {
    name: 'Let it be',
    year: 1970,
    cover: 'http://www.wordsintoapapercup.com/images/uploads/beatles-let-it-be-cover-art.jpg',
    artist: {
      id: '2',
      name: 'Beatles',
    },
    tracks: {},
  },
  '3': {
    name: 'Abbey Road',
    year: 1968,
    cover: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg',
    artist: {
      id: '2',
      name: 'Beatles',
    },
    tracks: {},
  },
  '4': {
    name: 'Coco',
    year: 2002,
    cover: 'https://img.discogs.com/8z12zYvEUlsiDwkq_SFUXVbTuBg=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-2896218-1306170664.jpeg.jpg',
    artist: {
      id: '3',
      name: 'Parov Stelar',
    },
    tracks: {},
  },
  '5': {
    name: 'The princess',
    year: 2002,
    cover: 'https://s-media-cache-ak0.pinimg.com/736x/d9/f8/bd/d9f8bd65549194ab5986c4ca2c158eb1.jpg',
    artist: {
      id: '3',
      name: 'Parov Stelar',
    },
    tracks: {},
  },
  '6': {
    name: 'True',
    year: 2002,
    cover: 'http://inyourspeakers.com/files/images/reviews/avicii_true-portada-8996.jpg',
    artist: {
      id: '4',
      name: 'Avicii',
    },
    tracks: {},
  },
};

function parseAlbum({ name, year, cover, artist }) {
}

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
  case ALBUMS.RECEIVED:
    return parseAlbum

  }
  return state;
}
