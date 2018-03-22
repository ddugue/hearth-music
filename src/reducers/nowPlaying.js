import { NEXT_TRACK, PREVIOUS_TRACK } from '../actions/types';

const DEFAULT_STATE = {
  index: 0,
  queue: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  ],
};

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case NEXT_TRACK:
      if (state.index < state.queue.length - 1) {
        return { ...state, index: state.index + 1 };
      }
      break;
    case PREVIOUS_TRACK:
      if (state.index > 0) {
        return { ...state, index: state.index - 1 };
      }
      break;
  }
  return state;
}
