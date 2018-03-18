import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createHashHistory';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';
// injectTapEventPlugin();

export const sagaMiddleware = createSagaMiddleware();
export const history = createHistory();
const routerMiddle = routerMiddleware(history);
const middleware = applyMiddleware(routerMiddle, sagaMiddleware);
export const store = createStore(reducers, composeWithDevTools(middleware));
