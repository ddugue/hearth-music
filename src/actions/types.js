function HTTP_REQUEST(name) {
  return {
    REQUESTED: `${name}_REQUESTED`, // Request was requested
    RECEIVED: `${name}_RECEIVED`,   // Request data was received
    FAILED: `${name}_FAILED`,       // Request failed
  };
}
export const NEXT_TRACK = 'NEXT_TRACK';
export const PREVIOUS_TRACK = 'PREVIOUS_TRACK';

export const ALBUMS = HTTP_REQUEST('ALBUMS');
export const ALBUM_TRACKS = HTTP_REQUEST('ALBUM_TRACKS');
