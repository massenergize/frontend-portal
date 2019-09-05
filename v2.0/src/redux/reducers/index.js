import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import history from '../history';
import { firebaseReducer } from 'react-redux-firebase'

import userReducer from './userReducer';
import pageReducer from './pageReducer';
import linkReducer from './linkReducer';

export default combineReducers({
  user: userReducer,
  page: pageReducer,
  links: linkReducer,
  router: connectRouter(history),
  firebase: firebaseReducer
});


// export default rootReducer;