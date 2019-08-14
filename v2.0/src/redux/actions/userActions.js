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
  LOAD_COMMUNITIES,
  ADD_HOUSEHOLD, 
  EDIT_HOUSEHOLD,
  REMOVE_HOUSEHOLD, 
  ADD_COMMUNITY, 
  REMOVE_COMMUNITY,
  JOIN_TEAM
} from './types'

/** stores the user data when a user logs in */
export const reduxLogin = (user) => dispatch => {
    return dispatch({
      type: LOGIN,
      payload: user
    });
}

/** nulls the stored user after logout*/
export const reduxLogout = () => dispatch => {
  return dispatch({
    type: LOGOUT,
  });
}

/** stores the todo actions*/
export const reduxLoadTodo = (todo) => dispatch => { 
  return dispatch({
    type: LOAD_TODO,
    payload: todo
  });
}

/** adds a action to todo */
export const reduxAddToTodo = (item) => dispatch => {
  return dispatch({
    type: ADD_TO_TODO,
    payload: item
  });
}

/** you get it im going to stop commmenting them now */
export const reduxRemoveFromTodo = (item) => dispatch => {
  return dispatch({
    type: REMOVE_FROM_TODO,
    payload: item
  });
}

/** stores the done actions*/
export const reduxLoadDone = (done) => dispatch => { 
  return dispatch({
    type: LOAD_DONE,
    payload: done
  });
}

export const reduxAddToDone = (item) => dispatch => {
  return dispatch({
    type: ADD_TO_DONE,
    payload: item
  });
}

export const reduxRemoveFromDone = (item) => dispatch => {
  return dispatch({
    type: REMOVE_FROM_DONE,
    payload: item
  });
}

export const reduxMoveToDone = (item) => dispatch => {
  return dispatch({
    type: MOVE_TO_DONE,
    payload: item
  })
}

export const reduxLoadHouseholds = (houses) => dispatch => {
  return dispatch({
    type: LOAD_HOUSEHOLDS,
    payload: houses
  });
}

export const reduxAddHousehold = (house) => dispatch => {
  return dispatch({
    type: ADD_HOUSEHOLD,
    payload: house
  });
}

export const reduxEditHousehold = (house) => dispatch => {
  return dispatch({
    type: EDIT_HOUSEHOLD,
    payload: house
  });
}


export const reduxRemoveHousehold = (houseRel) => dispatch => {
  return dispatch({
    type: REMOVE_HOUSEHOLD,
    payload: houseRel
  });
}

export const reduxLoadCommunities = (communities) => dispatch => {
  return dispatch({
    type: LOAD_COMMUNITIES,
    payload: communities
  });
}

export const reduxJoinCommunity = (community) => dispatch => {
  return dispatch({
    type: ADD_COMMUNITY,
    payload: community
  });
}

export const reduxLeaveCommunity = (community) => dispatch => {
  return dispatch({
    type: REMOVE_COMMUNITY,
    payload: community
  });
}


export const reduxJoinTeam = (team) => dispatch => {
  return dispatch({
      type: JOIN_TEAM,
      payload: team
  })
}