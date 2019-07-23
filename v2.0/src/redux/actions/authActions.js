/**
 * 
 * @param {*} transferId 
 */
import {LOGIN, LOGOUT} from './types'

export const sendSignInSignal = (user)  => dispatch => {
    return dispatch({
    type: LOGIN,
    payload: user
  });
}

export const sendSignOutSignal = ()  => dispatch => {
  return dispatch({
    type: LOGOUT,
  });
}