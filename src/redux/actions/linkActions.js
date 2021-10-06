import { LOAD_LINKS } from "./types";

export const reduxLoadLinks = (links) => dispatch => {
    return dispatch({
        type: LOAD_LINKS,
        payload: links
    })
}