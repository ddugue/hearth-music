import { ALBUMS, ALBUM_TRACKS } from '../actions/types';

export function albums(page = 0) {
  return {
    type: ALBUMS.REQUESTED,
    page,
  };
}

export function albumTracks(album, page = 0) {
  return {
    type: ALBUM_TRACKS.FETCH,
    album,
    page,
  };
}
