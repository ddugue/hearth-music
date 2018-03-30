import { ALBUMS, ALBUM_TRACKS } from '../actions/types';

// List of all albums
const DEFAULT_STATE = {
};

function parseAlbum({ id, name, year, cover, artist }) {
  return {
    name,
    year,
    cover,
    artist,
    id,
  }
}

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
  case ALBUMS.RECEIVED:
    const items = action.data.items;
    for (let i = 0; i < items.length; i++) {
      state[items[i].id] = Object.assign({}, state[items[i].id] || {}, parseAlbum(items[i]));
    }
    return state;

  case ALBUM_TRACKS.RECEIVED:
    console.log(action.album, action.data);
    state[action.album] = Object.assign({}, state[action.album], {tracks: action.data});
    return Object.assign({}, state);
  }
  return state;
}
