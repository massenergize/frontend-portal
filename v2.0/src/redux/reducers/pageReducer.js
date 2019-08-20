import { LOAD_HOME_PAGE, LOAD_ACTIONS_PAGE, LOAD_EVENTS_PAGE, LOAD_SERVICE_PROVIDERS_PAGE, LOAD_TESTIMONIALS_PAGE, LOAD_TEAMS_PAGE, LOAD_ABOUT_US_PAGE, LOAD_COMMUNITIES_STATS, LOAD_DONATE_PAGE, LOAD_EVENTS, LOAD_ACTIONS, LOAD_SERVICE_PROVIDERS, LOAD_TESTIMONIALS, ADD_TESTIMONIAL, REMOVE_TESTIMONIAL, LOAD_MENU, LOAD_POLICIES, LOAD_EVENT_RSVPS, ADD_RSVP, REMOVE_RSVP, CHANGE_RSVP, ADD_TEAM_MEMBER, REMOVE_TEAM_MEMBER, LOAD_COMMUNITIES } from '../actions/types';

const initialState = {
    //page data for each page
    homePage: null,
    actionsPage: null,
    serviceProvidersPage: null,
    testimonialsPage: null,
    teamsPage: null,
    aboutUsPage: null,
    donatePage: null,
    eventsPage: null,
    //menu, navbar footer...
    menu: null,
    policies: null,
    //objects to be loaded
    actions: null,
    events: null,
    serviceProviders: null,
    testimonials: null,
    communitiesStats: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        /**************************/
        case LOAD_HOME_PAGE:
            return {
                ...state,
                homePage: action.payload
            }
        case LOAD_ACTIONS_PAGE:
            return {
                ...state,
                actionsPage: action.payload
            }
        case LOAD_SERVICE_PROVIDERS_PAGE:
            return {
                ...state,
                serviceProvidersPage: action.payload
            }
        case LOAD_TESTIMONIALS_PAGE:
            return {
                ...state,
                testimonialsPage: action.payload
            }
        case LOAD_TEAMS_PAGE:
            return {
                ...state,
                teamsPage: action.payload
            }
        case LOAD_ABOUT_US_PAGE:
            return {
                ...state,
                aboutUsPage: action.payload
            }
        case LOAD_COMMUNITIES_STATS:
            return {
                ...state,
                communitiesStats: action.payload
            }
        case LOAD_DONATE_PAGE:
            return {
                ...state,
                donatePage: action.payload
            }
        case LOAD_EVENTS_PAGE:
            return {
                ...state,
                eventsPage: action.payload
            }
        case LOAD_MENU:
            return {
                ...state,
                menu: action.payload
            }
        case LOAD_POLICIES:
            return {
                ...state,
                policies: action.payload
            }
        case LOAD_ACTIONS:
            return {
                ...state,
                actions: action.payload
            }
        case LOAD_EVENTS:
            return {
                ...state,
                events: action.payload
            }
        case LOAD_SERVICE_PROVIDERS:
            return {
                ...state,
                serviceProviders: action.payload
            }
        case LOAD_TESTIMONIALS:
            return {
                ...state,
                testimonials: action.payload
            }
        case LOAD_COMMUNITIES:
            return {
                ...state,
                communities: action.payload
            }
        case ADD_TESTIMONIAL:
            return {
                ...state,
                testimonials: [
                    ...state.testimonials,
                    action.payload
                ]
            }
        case REMOVE_TESTIMONIAL:
            return {
                ...state,
                testimonials: state.testimonials.filter(testimonial => testimonial.id !== action.payload.id)
            }
        case LOAD_EVENT_RSVPS:
            return {
                ...state,
                rsvps: action.payload
            }
        case ADD_RSVP:
            return {
                ...state,
                rsvps: [
                    ...state.rsvps,
                    action.payload
                ]
            }
        case REMOVE_RSVP:
            return {
                ...state,
                rsvps: state.rsvps.filter(rsvp => { return rsvp.id !== action.payload.id })
            }
        case CHANGE_RSVP:
            return {
                ...state,
                rsvps: [
                    ...state.rsvps.filter(rsvp => { return rsvp.id !== action.payload.id }),
                    action.payload
                ]
            }
        case ADD_TEAM_MEMBER:
            var team = state.teamsPage.filter(stats => { return stats.team.id === action.payload.team.id })[0]
            const newTeam = {
                ...team,
                households: team.households + action.payload.member.households,
                actions: team.actions + action.payload.member.actions,
                actions_completed: team.actions_completed + action.payload.member.actions_completed,
                actions_todo: team.actions_todo + action.payload.member.actions_todo
            }
            console.log(team)
            console.log(newTeam)
            return {
                ...state,
                teamsPage: [
                    ...state.teamsPage.filter(stats => { return stats.team.id !== action.payload.team.id }),
                    newTeam
                ]
            }
        case REMOVE_TEAM_MEMBER:
            var team = state.teamsPage.filter(stats => { return stats.team.id === action.payload.team.id })[0]
            return {
                ...state,
                teamsPage: [
                    ...state.teamsPage.filter(stats => { return stats.team.id !== action.payload.team.id }),
                    {
                        ...team,
                        households: team.households - action.payload.member.households,
                        actions: team.actions - action.payload.member.actions,
                        actions_completed: team.actions_completed - action.payload.membe.actions_completed,
                        actions_todo: team.actions_todo - action.payload.member.actions_todo
                    }
                ]
            }
        /**************************/
        default:
            return {
                ...state,
            };
    }
}