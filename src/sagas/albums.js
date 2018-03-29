import { takeLatest, call, put } from 'redux-saga/effects';

import { fetchJSON } from '../utils/requests';
import { ALBUMS } from '../actions/types';

export function* albumsList(evt) {
  try {
    const response = yield call(fetchJSON, `/albums?page=${evt.page}`);
    yield put({ type: ALBUMS.RECEIVED, data: response });
  } catch (e) {
    yield put({ type: ALBUMS.FAILED, error: e });
  }
}


export default function* scheduleWatcher() {
  yield takeLatest(ALBUMS.REQUESTED, albumsList);
}
