import { ALBUMS, ALBUM_TRACKS } from '../actions/types';

export function albums(page = 1) {
  return {
    type: ALBUMS.REQUESTED,
    page,
  };
}

export function albumTracks(album) {
  return {
    type: ALBUM_TRACKS.REQUESTED,
    album,
  };
}
