import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';

import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';
import Application from './components/Application';
import HomeView from './views/Home';
import AlbumsView from './views/Albums';
import AlbumView from './views/Album';
import ArtistsView from './views/Artists';
import SongsView from './views/Songs';
import SearchView from './views/Search';
import PlayerView from './views/Player';
import Navbar from './components/Navbar';
import View from './components/View';


import runSaga from './sagas';
import { store, sagaMiddleware, history } from './store';
// injectTapEventPlugin();

runSaga(sagaMiddleware);
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
      <Application>
        <Navbar />
        <View exact path="/" component={HomeView} />
        <View exact path="/albums" component={AlbumsView} />
        <Route path="/album/:uuid" component={AlbumView} />
        <View exact path="/songs" component={SongsView} />
        <View exact path="/artists" component={ArtistsView} />
        <View exact path="/search" component={SearchView} />
        <PlayerView />
      </Application>
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
