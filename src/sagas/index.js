import albums from './albums';

export default function runSaga(sagaMiddleware) {
  sagaMiddleware.run(albums);
}
