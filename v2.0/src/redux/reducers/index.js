import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import history from '../history';
import { firebaseReducer } from 'react-redux-firebase'

import userReducer from './userReducer';
import pageReducer from './pageReducer';

export default combineReducers({
  user: userReducer,
  page: pageReducer,
  router: connectRouter(history),
  firebase: firebaseReducer
});


// export default rootReducer;