/**
 * 
 * @param {*} transferId 
 */
import {LOGIN} from './types'

export const sendSignInSignal = (user)  => dispatch => {
  return dispatch({
    type: LOGIN,
    payload: user
  });
}