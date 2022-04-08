import { SET_FIREBASE_SETTINGS } from "../actions/authActions";
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
  LEAVE_TEAM,
  SHOW_REG,
  SET_PREFERRED_EQUIVALENCE,
} from "../actions/types";

const initialState = {
  info: undefined,
  todo: null,
  done: null,
  show_reg_status: false,
};

export default function (state = initialState, action) {
  switch (action.type) {

   
    case SET_FIREBASE_SETTINGS:
      return {
        ...state,
        userFirebaseSettings: action.payload,
      };
    case SET_PREFERRED_EQUIVALENCE:
      return {
        ...state,
        pref_equivalence: action.payload,
      };
    /**************************/
    case SHOW_REG:
      return {
        ...state,
        show_reg_status: action.payload,
      };
    case LOGIN:
      return {
        ...state,
        info: action.payload,
      };
    case LOGOUT:
      return initialState;
    /**************************/
    case LOAD_TODO:
      return {
        ...state,
        todo: action.payload,
      };
    case ADD_TO_TODO:
      return {
        ...state,
        // if action already on list, replace with updated version
        todo: [action.payload, ...state.todo.filter((element) => element.id !== action.payload.id)],
      };
    case REMOVE_FROM_TODO:
      return {
        ...state,
        todo: state.todo.filter((element) => element.id !== action.payload.id),
      };
    /**************************/
    case LOAD_DONE:
      return {
        ...state,
        done: action.payload,
      };
    case ADD_TO_DONE:
      return {
        ...state,
        // if action already on list, replace with updated version
        done: [action.payload, ...state.done.filter((element) => element.id !== action.payload.id)],
      };
    case REMOVE_FROM_DONE:
      return {
        ...state,
        done: state.done.filter((element) => element.id !== action.payload.id),
      };

    case MOVE_TO_DONE:
      return {
        ...state,
        done: [action.payload,...state.done ],
        todo: state.todo.filter((element) => element.id !== action.payload.id),
      };
    /**************************/
    case LOAD_HOUSEHOLDS:
      return {
        ...state,
        info: {
          ...state.info,
          households: action.payload,
        },
      };
    case ADD_HOUSEHOLD:
      return {
        ...state,
        info: {
          ...state.info,
          households: [...state.info.households, action.payload],
        },
      };
    case EDIT_HOUSEHOLD:
      return {
        ...state,
        info: {
          ...state.info,
          households: [
            ...state.info.households.filter(
              (element) => element.id !== action.payload.id
            ),
            action.payload,
          ],
        },
      };
    case REMOVE_HOUSEHOLD:
      return {
        ...state,
        info: {
          ...state.info,
          households: state.info.households.filter(
            (element) => element.id !== action.payload.id
          ),
        },
        todo: state.todo
          ? state.todo.filter(
              (a) => a.real_estate_unit.id !== action.payload.id
            )
          : [],
        done: state.done
          ? state.done.filter(
              (a) => a.real_estate_unit.id !== action.payload.id
            )
          : [],
      };
    /**************************/
    case LOAD_USER_COMMUNITIES:
      return {
        ...state,
        info: {
          ...state.info,
          communities: action.payload,
        },
      };
    case ADD_COMMUNITY:
      return {
        ...state,
        info: {
          ...state.info,
          communities: [...state.info.communities, action.payload],
        },
      };
    case REMOVE_COMMUNITY:
      return {
        ...state,
        info: {
          ...state.info,
          communities: state.info.communities.filter(
            (element) => element !== action.payload
          ),
        },
      };
    case JOIN_TEAM:
      return {
        ...state,
        info: {
          ...state.info,
          teams: [...state.info.teams, action.payload],
        },
      };
    case LEAVE_TEAM:
      return {
        ...state,
        info: {
          ...state.info,
          teams: state.info.teams.filter(
            (team) => team.id !== action.payload.id
          ),
        },
      };

    /**************************/
    default:
      return {
        ...state,
      };
  }
}
