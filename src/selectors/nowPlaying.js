import { createSelector } from 'reselect';

export const getCurrentIndex = state => state.nowPlaying.queue[state.nowPlaying.index];
export const getNextIndex = state => state.nowPlaying.queue[state.nowPlaying.index + 1] || null;
export const getHasNext = state => state.nowPlaying.index < (state.nowPlaying.queue.length - 1);
export const getHasPrevious = state => state.nowPlaying.index > 0;

export const getTracks = state => state.tracks;
export const getCurrentTrack = createSelector(
  getCurrentIndex,
  getTracks,
  (currentIndex, tracks) => currentIndex && tracks[currentIndex],
);

export const getNextTrack = createSelector(
  getNextIndex,
  getTracks,
  (nextIndex, tracks) => nextIndex && tracks[nextIndex].url,
);

const getAlbum = (state, props) => state.albums[props.match.params.uuid];
export const getAlbumTracks = createSelector(
  getAlbum,
  getTracks,
  (album, tracks) => album.tracks && album.tracks.map(track => tracks[track]).sort((itemA, itemB) => itemA.track - itemB.track),
);
