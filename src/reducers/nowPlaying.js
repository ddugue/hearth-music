import { NEXT_TRACK, PREVIOUS_TRACK, PLAY } from '../actions/types';

const DEFAULT_STATE = {
  index: 0,
  queue: [
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
    case PLAY:
      return {
        ...state,
        queue: state.queue.concat([action.track]),
        index: state.queue.length,
      };
  }
  return state;
}
