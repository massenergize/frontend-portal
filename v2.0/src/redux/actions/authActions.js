/**
 * 
 * @param {*} transferId 
 */
import { LOGIN, LOGOUT } from './types'
import { getJson } from '../../api/functions';
import URLS from '../../api/urls'

export const reduxLogin = (user) => dispatch => {
    return dispatch({
      type: LOGIN,
      payload: user
    });
}

export const reduxLogout = () => dispatch => {
  return dispatch({
    type: LOGOUT,
  });
}