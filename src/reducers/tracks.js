import { ALBUM_TRACKS } from '../actions/types';
import { ROOT_URL } from '../constants';

// List of all albums
const DEFAULT_STATE = {
};

function parseTrack({ id, uuid, title, track, length, url, album, artists, genre }) {
  return {
    id,
    uuid,
    title,
    track,
    length,
    url: ROOT_URL + url,
    albumName: album.name,
    albumUUID: album.uuid,
    artist: artists.map(artist => artist.name).join(', '),
    genre,
  };
}
export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case ALBUM_TRACKS.RECEIVED:
      return action.data.reduce((result, item) => {
        result[item.uuid] = parseTrack(item);
        return result;
      }, state);
    default:
      return state;
  }
}
