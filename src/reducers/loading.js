import { ALBUMS } from '../actions/types';

// List of all loading states
const DEFAULT_STATE = {
  albums: false,
  albumsTracks: false,
};

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case ALBUMS.REQUESTED:
      return {
        ...state,
        albums: true,
      };
    case ALBUMS.RECEIVED:
    case ALBUMS.FAILED:
      return {
        ...state,
        albums: false,
      };
  }
  return state;
}
