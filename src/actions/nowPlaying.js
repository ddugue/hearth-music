import { NEXT_TRACK, PREVIOUS_TRACK } from '../actions/types';

export function nextTrack() {
  return {
    type: NEXT_TRACK,
  };
}

export function previousTrack() {
  return {
    type: PREVIOUS_TRACK,
  };
}
