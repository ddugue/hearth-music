import { takeLatest, call, put } from 'redux-saga/effects';

import { fetchJSON } from '../utils/requests';
import { ALBUMS, ALBUM_TRACKS } from '../actions/types';

export function* albumsList(evt) {
  try {
    const response = yield call(fetchJSON, `/albums?page=${evt.page}&a=2`);
    yield put({ type: ALBUMS.RECEIVED, data: response });
  } catch (e) {
    yield put({ type: ALBUMS.FAILED, error: e });
  }
}


export function* albumsTrackList(evt) {
  try {
    const response = yield call(fetchJSON, `/albums/${evt.album}/tracks`);
    yield put({ type: ALBUM_TRACKS.RECEIVED, data: response, album: evt.album });
  } catch (e) {
    yield put({ type: ALBUM_TRACKS.FAILED, error: e });
  }
}
export default function* scheduleWatcher() {
  yield takeLatest(ALBUMS.REQUESTED, albumsList);
  yield takeLatest(ALBUM_TRACKS.REQUESTED, albumsTrackList);
}
