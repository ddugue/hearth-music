// import { createSelector } from 'reselect';

export const getCurrentTrack = state => state.nowPlaying.queue[state.nowPlaying.index];
export const getNextTrack = state => state.nowPlaying.queue[state.nowPlaying.index + 1] || null;
export const getHasNext = state => state.nowPlaying.index < state.nowPlaying.queue.length - 1;
export const getHasPrevious = state => state.nowPlaying.index > 0;
