/**
 * Listing all the types of actions that can take place in this app
 */

/** USER ACTIONS */
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SHOW_REG ='SHOW_REG';

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

export const LOAD_USER_COMMUNITIES = 'LOAD_USER_COMMUNITIES'
export const ADD_COMMUNITY = 'ADD_COMMUNITY'
export const REMOVE_COMMUNITY = 'LEAVE_COMMUNITY'

export const JOIN_TEAM = 'JOIN_TEAM' //adds the team to the users list of teams
export const LEAVE_TEAM = 'LEAVE_TEAM'

/** PAGE ACTIONS
 * these actions load the database data for the pages
 * find the pagedata at store.pages.[pagename]
 */
export const LOAD_COMMUNITY = 'LOAD_COMMUNITY'

export const LOAD_HOME_PAGE = 'LOAD_HOME_PAGE' //home_page
export const LOAD_ACTIONS_PAGE = 'LOAD_ACTIONS_PAGE' //actions_page
export const LOAD_SERVICE_PROVIDERS_PAGE = 'LOAD_SERVICE_PROVIDERS_PAGE' //service_provider_page
export const LOAD_TESTIMONIALS_PAGE = 'LOAD_TESTIMONIALS_PAGE' //testimonials_page
export const LOAD_TEAMS_PAGE = 'LOAD_TEAMS_PAGE' //teams_page
export const LOAD_ABOUT_US_PAGE = 'LOAD_ABOUT_US_PAGE' //about_us
export const LOAD_COMMUNITIES_STATS = 'LOAD_COMMUNITIES_STATS' //impact_page stats
export const LOAD_CONTACT_US_PAGE = 'LOAD_CONTACT_US_PAGE'
export const LOAD_DONATE_PAGE = 'LOAD_DONATE_PAGE'
export const LOAD_EVENTS_PAGE = 'LOAD_EVENTS_PAGE'
export const LOAD_IMPACT_PAGE = 'LOAD_IMPACT_PAGE'
export const LOAD_MENU = 'LOAD_MENU' //menu (technically not a page but useful to store)
export const LOAD_POLICIES = 'LOAD_POLICIES' //events_page/events
export const LOAD_COMMUNITY_DATA = 'LOAD_COMMUNITY_DATA'
export const LOAD_COMMUNITY_ADMINS = 'LOAD_COMMUNITY_ADMINS'

/** these actions load data that is not stored in the page data in the database into our redux pages*/
export const LOAD_ACTIONS = 'LOAD_ACTIONS' //actions_page/actions
export const LOAD_EVENTS = 'LOAD_EVENTS' //events_page/events
export const LOAD_SERVICE_PROVIDERS= 'LOAD_SERVICE_PROVIDERS' //service_providers_page/service_providers
export const LOAD_TESTIMONIALS = 'LOAD_TESTIMONIALS' //testimonials_page/testimonials
export const LOAD_TEAMS = 'LOAD_TEAMS'
export const LOAD_COMMUNITIES = 'LOAD_COMMUNITIES'
export const LOAD_TAG_COLS = 'LOAD_TAG_COLS'

export const LOAD_EVENT_RSVPS = 'LOAD_EVENT_RSVPS' //load the user's rsvps
export const ADD_RSVP = 'ADD_RSVP'
export const REMOVE_RSVP = 'REMOVE_RSVP'
export const CHANGE_RSVP = 'CHANGE_RSVP'

/** these actions will change page data */
export const ADD_TESTIMONIAL = 'ADD_TESTIMONIAL'
export const REMOVE_TESTIMONIAL = 'REMOVE_TESTIMONIAL'

export const ADD_TEAM_MEMBER = 'ADD_TEAM_MEMBER' //similar to join team, and must be called at the same time, but adds the team member numbers to the team stats (team page)
export const REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER'
export const TEAM_ADD_ACTION = 'TEAM_ADD_ACTION'
export const TEAM_REMOVE_ACTION = 'TEAM_REMOVE_ACTION'
export const TEAM_ADD_HOUSEHOLD = 'TEAM_ADD_HOUSEHOLD'
export const TEAM_REMOVE_HOUSEHOLD = 'TEAM_REMOVE_HOUSEHOLD'

export const CHANGE_DATA = 'CHANGE_DATA'


/****
 * Links 
 */

export const LOAD_LINKS = 'LOAD_LINKS'