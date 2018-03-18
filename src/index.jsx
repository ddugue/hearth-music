import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';

import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';


/* import runSaga from './sagas';*/
import { store, sagaMiddleware, history } from './store';
// injectTapEventPlugin();

/* runSaga(sagaMiddleware);*/
/* console.log('Init', ConnectedRouter);*/
/* if (_FIXTURE && _DEBUG) {
 *   store = createStore(reducers, composeWithDevTools(applyMiddleware(middleware, sagaMiddleware)));
 * } else {
 *   store = createStore(reducers, applyMiddleware(middleware, sagaMiddleware));
 * }*/
// Organize routes alphabetically to match file order.
render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <h1> Hello React World </h1>
      {/* <ApplicationWrapper>
          <VersionChecker />
          <PrivateRoute exact path="/" component={HomeView} />
          <Route path="/update-app" component={UpdateAppView} />
          <Route path="/login" component={LoginView} />
          <Route path="/register" component={RegisterView} />
          <Route path="/recover" component={RecoverView} />
          <PrivateRoute path="/account" component={AccountView} />
          <PrivateRoute path="/advanced" component={AdvancedSettingsView} />
          <PrivateRoute path="/add-blind" component={BlindAddWizardView} />
          <PrivateRoute path="/controllers" component={ControllersView} />
          <PrivateRoute path="/add-controller" component={ControllerAddWizardView} />
          <PrivateRoute path="/rooms/:id" component={RoomView} />
          <PrivateRoute path="/edit-room/:id" component={RoomEditView} />
          <PrivateRoute path="/blinds/:id" component={BlindView} />
          <PrivateRoute path="/edit-blind/:id" component={BlindEditView} />
          <PrivateRoute path="/schedules/:id" component={ScheduleView} />
          </ApplicationWrapper> */}
    </ConnectedRouter>
  </Provider>
), document.getElementById('main'), () => console.log('Rendered initial component'));
