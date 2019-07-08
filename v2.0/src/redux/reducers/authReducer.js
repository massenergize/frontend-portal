import { 
  LOGIN,
  LOGOUT
} from '../actions/types';

const initialState = {
  user:null
};


export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload.user
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      }
    default:
      return {
        ...state,
      };
  }
}