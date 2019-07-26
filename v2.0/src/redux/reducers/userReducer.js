import { 
  LOGIN, 
  LOGOUT, 
  REMOVE_FROM_DONE,
  REMOVE_FROM_TODO, 
  ADD_TO_TODO, 
  ADD_TO_DONE, 
  LOAD_TODO, 
  LOAD_DONE, 
  LOAD_HOUSEHOLDS, 
  LOAD_COMMUNITIES,
  ADD_HOUSEHOLD, 
  REMOVE_HOUSEHOLD, 
  ADD_COMMUNITY, 
  REMOVE_COMMUNITY 
} from '../actions/types';

const initialState = {
  info: null,
  todo: null,
  done: null,
  households: null,
  communities: null
};


export default function (state = initialState, action) {
  switch (action.type) {
    /**************************/
    case LOGIN:
      return {
        ...state,
        info: action.payload
      }
    case LOGOUT:
      return {
        ...state,
        info: null
      }
    /**************************/
    case LOAD_TODO:
      return {
        ...state,
        todo: action.payload
      }
    case ADD_TO_TODO:
      return {
        ...state,
        todo: [
          ...state.todo,
          action.payload
        ]
      }
    case REMOVE_FROM_TODO:
      return {
        ...state,
        todo: state.todo.filter(element => element !== action.payload)
      }
    /**************************/
    case LOAD_DONE:
      return {
        ...state,
        done: action.payload
      }
    case ADD_TO_DONE:
      return {
        ...state,
        done: [
          ...state.done,
          action.payload
        ]
      }
    case REMOVE_FROM_DONE:
      return {
        ...state,
        done: state.done.filter(element => element !== action.payload)
      }
    /**************************/
    case LOAD_HOUSEHOLDS:
      return {
        ...state,
        households: action.payload
      }
    case ADD_HOUSEHOLD:
      return {
        ...state,
        households: [
          ...state.households,
          action.payload
        ]
      }
    case REMOVE_HOUSEHOLD:
      return {
        ...state,
        households: state.households.filter(element => element !== action.payload)
      }
    /**************************/
    case LOAD_COMMUNITIES:
      return {
        ...state,
        communities: action.payload
      }
    case ADD_COMMUNITY:
      return {
        ...state,
        communities: [
          ...state.communities,
          action.payload
        ]
      }
    case REMOVE_COMMUNITY:
      return {
        ...state,
        communities: state.communities.filter(element => element !== action.payload)
      }
    /**************************/
    default:
      return {
        ...state,
      };
  }
}