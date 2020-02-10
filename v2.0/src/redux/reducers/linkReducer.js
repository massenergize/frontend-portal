import {
    LOAD_LINKS
  } from '../actions/types';
  
  const initialState = {};
  
  export default function (state = initialState, action) {
    switch (action.type) {
      /**************************/
      case LOAD_LINKS:
          return {
              ...action.payload
          }
      /**************************/
      default:
        return {
          ...state,
        };
    }
  }