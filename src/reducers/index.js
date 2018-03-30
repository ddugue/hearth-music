import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import nowPlaying from './nowPlaying';
import albums from './albums';
import loading from './loading';

export default combineReducers({
  // auth,
  nowPlaying,
  router: routerReducer,
  albums,
  loading,
});
