import {
  LOGIN,
  LOGOUT,
  MOVE_TO_DONE,
  REMOVE_FROM_DONE,
  REMOVE_FROM_TODO,
  ADD_TO_TODO,
  ADD_TO_DONE,
  LOAD_TODO,
  LOAD_DONE,
  LOAD_HOUSEHOLDS,
  LOAD_USER_COMMUNITIES,
  ADD_HOUSEHOLD,
  EDIT_HOUSEHOLD,
  REMOVE_HOUSEHOLD,
  ADD_COMMUNITY,
  REMOVE_COMMUNITY,
  JOIN_TEAM,
  LEAVE_TEAM
} from '../actions/types';

const initialState = {
  info: null,
  todo: null,
  done: null,
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
      return initialState;
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
        todo: state.todo.filter(element => element.id !== action.payload.id)
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
        done: state.done.filter(element => element.id !== action.payload.id)
      }

    case MOVE_TO_DONE:
      return {
        ...state,
        done: [
          ...state.done,
          action.payload
        ],
        todo: state.todo.filter(element => element.id !== action.payload.id)
      }
    /**************************/
    case LOAD_HOUSEHOLDS:
      return {
        ...state,
        info: {
          ...state.info,
          households: action.payload
        }
      }
    case ADD_HOUSEHOLD:
      return {
        ...state,
        info: {
          ...state.info,
          households: [
            ...state.info.households,
            action.payload
          ]
        }

      }
    case EDIT_HOUSEHOLD:
      return {
        ...state,
        info: {
          ...state.info,
          households: [
            ...state.info.households.filter(element => element.id !== action.payload.id),
            action.payload
          ]
        }
      }
    case REMOVE_HOUSEHOLD:
      return {
        ...state,
        info: {
          ...state.info,
          households: state.info.households.filter(element => element.id !== action.payload.id)
        },
        todo: state.todo.filter(a => a.real_estate_unit.id !== action.payload.id),
        done: state.done.filter(a => a.real_estate_unit.id !== action.payload.id)
      }
    /**************************/
    case LOAD_USER_COMMUNITIES:
      return {
        ...state,
        info: {
          ...state.info,
          communities: action.payload
        }
      }
    case ADD_COMMUNITY:
      return {
        ...state,
        info: {
          ...state.info,
          communities: [
            ...state.info.communities,
            action.payload
          ]
        }
      }
    case REMOVE_COMMUNITY:
      return {
        ...state,
        info: {
          ...state.info,
          communities: state.info.communities.filter(element => element !== action.payload)
        }
      }
    case JOIN_TEAM:
      return {
        ...state,
        info: {
          ...state.info,
          teams: [
            ...state.info.teams,
            action.payload
          ]
        }
      }
    case LEAVE_TEAM:
      return {
        ...state,
        info: {
          ...state.info,
          teams: state.info.teams.filter(team => team.id !== action.payload.id)
        }
      }

    /**************************/
    default:
      return {
        ...state,
      };
  }
}