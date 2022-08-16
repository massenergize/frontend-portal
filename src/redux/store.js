import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { IS_LOCAL } from '../config';
import rootReducer from './reducers';
const middleware = [thunk];


const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    IS_LOCAL && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;