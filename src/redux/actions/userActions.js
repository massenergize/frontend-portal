/**
 * I am naming all actions redux{ACTIONNAME} because
 * it makes it less confusing when I use them in the code for me
 */
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
  USER_IS_GUEST,
} from "./types";

import { apiCall } from "../../api/functions";
const GUEST_USER = "guest_user";
const STANDARD_USER = "standard_user";
export const reduxSetPreferredEquivalence = (value) => {
  return {
    type: SET_PREFERRED_EQUIVALENCE,
    payload: value,
  };
};
/** used to identify weather or not the registration page should be shown or not */
export const reduxShowReg = (value) => (dispatch) => {
  return dispatch({
    type: SHOW_REG,
    payload: value,
  });
};
/** stores the user data when a user logs in */
export const reduxLogin = (user) => (dispatch) => { 
  const { user_info } = user || {};

  // Hopefully this does exactly what we want
  const user_type = user.is_super_admin ? 'super_admin' : 
            user.is_community_admin ? 'community_admin' : 
            user.user_info?.user_type === GUEST_USER ? 'guest_user' : 'standard_user';
  window.gtag('set', 'user_properties', {user_type: user_type});

  if (user_info) {
    dispatch({
      type: USER_IS_GUEST,
      payload: user_info?.user_type === GUEST_USER,
    });
  }
  return dispatch({
    type: LOGIN,
    payload: {
      ...user,
      isStandardUser: user && user.user_info && user.user_info.user_type === STANDARD_USER ? true:false
    },
  });
};

/** nulls the stored user after logout*/
export const reduxLogout = () => async (dispatch) => {
  window.gtag('set', 'user_properties', {user_type: 'anonymous'});
  await apiCall("auth.logout");
  return dispatch({
    type: LOGOUT,
  });
};

/** stores the todo actions*/
export const reduxLoadTodo = (todo) => (dispatch) => {
  return dispatch({
    type: LOAD_TODO,
    payload: todo,
  });
};

/** adds a action to todo */
export const reduxAddToTodo = (item) => (dispatch) => {
  return dispatch({
    type: ADD_TO_TODO,
    payload: item,
  });
};

/** you get it im going to stop commmenting them now */
export const reduxRemoveFromTodo = (item) => (dispatch) => {
  return dispatch({
    type: REMOVE_FROM_TODO,
    payload: item,
  });
};

/** stores the done actions*/
export const reduxLoadDone = (done) => (dispatch) => {
  return dispatch({
    type: LOAD_DONE,
    payload: done,
  });
};

export const reduxAddToDone = (item) => (dispatch) => {
  return dispatch({
    type: ADD_TO_DONE,
    payload: item,
  });
};

export const reduxRemoveFromDone = (item) => (dispatch) => {
  return dispatch({
    type: REMOVE_FROM_DONE,
    payload: item,
  });
};

export const reduxMoveToDone = (item) => (dispatch) => {
  return dispatch({
    type: MOVE_TO_DONE,
    payload: item,
  });
};

export const reduxLoadHouseholds = (houses) => (dispatch) => {
  return dispatch({
    type: LOAD_HOUSEHOLDS,
    payload: houses,
  });
};

export const reduxAddHousehold = (house) => (dispatch) => {
  return dispatch({
    type: ADD_HOUSEHOLD,
    payload: house,
  });
};

export const reduxEditHousehold = (house) => (dispatch) => {
  return dispatch({
    type: EDIT_HOUSEHOLD,
    payload: house,
  });
};

export const reduxRemoveHousehold = (houseRel) => (dispatch) => {
  return dispatch({
    type: REMOVE_HOUSEHOLD,
    payload: houseRel,
  });
};

export const reduxLoadUserCommunities = (communities) => (dispatch) => {
  return dispatch({
    type: LOAD_USER_COMMUNITIES,
    payload: communities,
  });
};

export const reduxJoinCommunity = (community) => (dispatch) => {
  return dispatch({
    type: ADD_COMMUNITY,
    payload: community,
  });
};

export const reduxLeaveCommunity = (community) => (dispatch) => {
  return dispatch({
    type: REMOVE_COMMUNITY,
    payload: community,
  });
};

export const reduxJoinTeam = (team) => (dispatch) => {
  return dispatch({
    type: JOIN_TEAM,
    payload: team,
  });
};

export const reduxLeaveTeam = (team) => (dispatch) => {
  return dispatch({
    type: LEAVE_TEAM,
    payload: team,
  });
};
