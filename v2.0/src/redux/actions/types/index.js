/**
 * Listing all the types of actions that can take place in this app
 */

/** USER ACTIONS */
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const LOAD_TODO = 'LOAD_TODO'
export const ADD_TO_TODO = 'ADD_TO_TODO'
export const REMOVE_FROM_TODO = 'REMOVE_FROM_TODO'

export const LOAD_DONE = 'LOAD_DONE'
export const ADD_TO_DONE = 'ADD_TO_DONE'
export const REMOVE_FROM_DONE = 'REMOVE_FROM_DONE'

export const MOVE_TO_DONE = 'MOVE_TO_DONE'

export const LOAD_HOUSEHOLDS = 'LOAD_HOUSEHOLDS'
export const ADD_HOUSEHOLD = 'ADD_HOUSEHOLD'
export const EDIT_HOUSEHOLD = 'EDIT_HOUSEHOLD'
export const REMOVE_HOUSEHOLD = 'DELETE_HOUSHOLD'

export const LOAD_COMMUNITIES = 'LOAD_COMMUNITIES'
export const ADD_COMMUNITY = 'ADD_COMMUNITY'
export const REMOVE_COMMUNITY = 'LEAVE_COMMUNITY'

/** PAGE ACTIONS
 * these actions load the database data for the pages
 * find the pagedata at store.pages.[pagename]
 */
export const LOAD_HOME_PAGE = 'LOAD_HOME_PAGE' //home_page
export const LOAD_ACTIONS_PAGE = 'LOAD_ACTIONS_PAGE' //actions_page
export const LOAD_SERVICE_PROVIDERS_PAGE = 'LOAD_SERVICE_PROVIDERS_PAGE' //service_provider_page
export const LOAD_TESTIMONIALS_PAGE = 'LOAD_TESTIMONIALS_PAGE' //testimonials_page
export const LOAD_TEAMS_PAGE = 'LOAD_TEAMS_PAGE' //teams_page
export const LOAD_ABOUT_US_PAGE = 'LOAD_ABOUT_US_PAGE' //about_us
export const LOAD_IMPACT_PAGE = 'LOAD_IMPACT_PAGE' //impact_page
export const LOAD_DONATE_PAGE = 'LOAD_DONATE_PAGE' //donate_page
export const LOAD_EVENTS_PAGE = 'LOAD_EVENTS_PAGE' //events_page
export const LOAD_MENU = 'LOAD_MENU' //menu (technically not a page but useful to store)
export const LOAD_POLICIES = 'LOAD_POLICIES' //events_page/events

/** these actions load data that is not stored in the page data in the database into our redux pages*/
export const LOAD_ACTIONS = 'LOAD_ACTIONS' //actions_page/actions
export const LOAD_EVENTS = 'LOAD_EVENTS' //events_page/events
export const LOAD_SERVICE_PROVIDERS= 'LOAD_SERVICE_PROVIDERS' //service_providers_page/service_providers
export const LOAD_TESTIMONIALS = 'LOAD_TESTIMONIALS' //testimonials_page/testimonials

/** these actions will change page data */
export const ADD_TESTIMONIAL = 'ADD_TESTIMONIAL'
export const REMOVE_TESTIMONIAL = 'REMOVE_TESTIMONIAL'

export const JOIN_TEAM = 'JOIN_TEAM'


