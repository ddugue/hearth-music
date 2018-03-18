import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// import auth from './auth'; // Manages authentication

export default combineReducers({
  // auth,
  router: routerReducer,
});
