import { ALBUMS, ALBUM_TRACKS } from '../actions/types';

// List of all albums
const DEFAULT_STATE = {
};

function parseAlbum({ name, year, cover, artist, uuid }) {
  return {
    name,
    year,
    cover,
    artist,
    // id,
    uuid,
  };
}

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case ALBUMS.RECEIVED:
      return action.data.items.reduce((result, item) => {
        result[item.uuid] = Object.assign({}, state[item.uuid] || {}, parseAlbum(item));
        return result;
      }, state);
    case ALBUM_TRACKS.RECEIVED:
      state[action.album] = Object.assign(
        {},
        state[action.album],
        { tracks: action.data.map(t => t.uuid) },
      );
      return Object.assign({}, state);
    default:
      return state;
  }
}
