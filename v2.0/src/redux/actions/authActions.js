/**
 * 
 * @param {*} transferId 
 */
import {LOGIN, LOGOUT} from './types'
import {sendToBackend} from '../../api/index'

export const sendSignInSignal = (user)  => dispatch => {
    return dispatch({
    type: LOGIN,
    payload: user
  });
}

export const sendSignOutSignal = ()  => dispatch => {
  console.log("did this");
  return dispatch({
    type: LOGOUT,
  });
}