import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { connectRouter } from 'connected-react-router'
import history from '../history';

export default combineReducers({
  user: authReducer,
  router: connectRouter(history)
});


// export default rootReducer;