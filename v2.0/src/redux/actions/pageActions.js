import { LOAD_HOME_PAGE, LOAD_ACTIONS_PAGE, LOAD_SERVICE_PROVIDERS_PAGE, LOAD_TEAMS_PAGE, LOAD_ABOUT_US_PAGE, LOAD_IMPACT_PAGE, LOAD_DONATE_PAGE, LOAD_EVENTS_PAGE, LOAD_MENU, LOAD_POLICIES, LOAD_ACTIONS, LOAD_SERVICE_PROVIDERS, ADD_TESTIMONIAL, REMOVE_TESTIMONIAL, LOAD_TESTIMONIALS_PAGE, LOAD_TESTIMONIALS, LOAD_EVENTS, LOAD_EVENT_RSVPS, ADD_RSVP, REMOVE_RSVP, CHANGE_RSVP } from './types'

export const reduxLoadHomePage = (page) => dispatch => {
    return dispatch({
        type: LOAD_HOME_PAGE,
        payload: page
    })
}

export const reduxLoadActionsPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_ACTIONS_PAGE,
        payload: page
    })
}

export const reduxLoadServiceProvidersPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_SERVICE_PROVIDERS_PAGE,
        payload: page
    })
}

export const reduxLoadTestimonialsPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_TESTIMONIALS_PAGE,
        payload: page
    })
}

export const reduxLoadTeamsPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_TEAMS_PAGE,
        payload: page
    })
}

export const reduxLoadAboutUsPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_ABOUT_US_PAGE,
        payload: page
    })
}

export const reduxLoadImpactPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_IMPACT_PAGE,
        payload: page
    })
}

export const reduxLoadDonatePage = (page) => dispatch => {
    return dispatch({
        type: LOAD_DONATE_PAGE,
        payload: page
    })
}

export const reduxLoadEventsPage = (page) => dispatch => {
    return dispatch({
        type: LOAD_EVENTS_PAGE,
        payload: page
    })
}

export const reduxLoadMenu = (menu) => dispatch => {
    return dispatch({
        type: LOAD_MENU,
        payload: menu
    })
}

export const reduxLoadPolicies = (policies) => dispatch => {
    return dispatch({
        type: LOAD_POLICIES,
        payload: policies
    })
}

export const reduxLoadActions= (actions) => dispatch => {
    return dispatch({
        type: LOAD_ACTIONS,
        payload: actions
    })
}

export const reduxLoadEvents = (events) => dispatch => {
    return dispatch({
        type: LOAD_EVENTS,
        payload: events
    })
}

export const reduxLoadServiceProviders = (serviceProviders) => dispatch => {
    return dispatch({
        type: LOAD_SERVICE_PROVIDERS,
        payload: serviceProviders
    })
}

export const reduxLoadTestimonials = (testimonials) => dispatch => {
    return dispatch({
        type: LOAD_TESTIMONIALS,
        payload: testimonials
    })
}

export const reduxAddTestimonial = (testimonial) => dispatch => {
    return dispatch({
        type: ADD_TESTIMONIAL,
        payload: testimonial
    })
}

export const reduxRemoveTestimonial = (testimonial) => dispatch => {
    return dispatch({
        type: REMOVE_TESTIMONIAL,
        payload: testimonial
    })
}

export const reduxLoadRSVPs = (RSVPs) => dispatch => {
    return dispatch({
        type: LOAD_EVENT_RSVPS, 
        payload: RSVPs
    })
}

export const reduxAddRSVP = (RSVP) => dispatch => {
    return dispatch({
        type: ADD_RSVP, 
        payload: RSVP
    })
}

export const reduxRemoveRSVP = (RSVP) => dispatch => {
    return dispatch({
        type: REMOVE_RSVP, 
        payload: RSVP
    })
}

export const reduxChangeRSVP = (RSVP) => dispatch => {
    return dispatch({
        type: CHANGE_RSVP, 
        payload: RSVP
    })
}