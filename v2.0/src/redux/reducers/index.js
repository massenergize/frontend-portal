import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { connectRouter } from 'connected-react-router'
import history from '../history';
import { firebaseReducer } from 'react-redux-firebase'

export default combineReducers({
  auth: authReducer,
  router: connectRouter(history),
  firebase: firebaseReducer
});


// export default rootReducer;