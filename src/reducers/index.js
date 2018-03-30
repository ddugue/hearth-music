import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import nowPlaying from './nowPlaying';
import albums from './albums';
import tracks from './tracks';
import loading from './loading';

export default combineReducers({
  // auth,
  nowPlaying,
  router: routerReducer,
  albums,
  tracks,
  loading,
});
