import { NEXT_TRACK, PREVIOUS_TRACK, PLAY } from '../actions/types';

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

export function play(track) {
  return {
    type: PLAY,
    track,
  };
}
