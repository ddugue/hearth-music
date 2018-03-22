import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import nowPlaying from './nowPlaying';

// import auth from './auth'; // Manages authentication

export default combineReducers({
  // auth,
  nowPlaying,
  router: routerReducer,
});
