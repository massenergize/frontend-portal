import {
	LOAD_COMMUNITY,
	LOAD_HOME_PAGE,
	LOAD_ACTIONS_PAGE,
	LOAD_EVENTS_PAGE,
	LOAD_SERVICE_PROVIDERS_PAGE,
	LOAD_TESTIMONIALS_PAGE,
	LOAD_TEAMS_PAGE,
	LOAD_TEAMS,
	LOAD_ABOUT_US_PAGE,
	LOAD_COMMUNITIES_STATS,
	LOAD_CONTACT_US_PAGE,
	LOAD_DONATE_PAGE,
	LOAD_IMPACT_PAGE,
	LOAD_EVENTS,
	LOAD_ACTIONS,
	LOAD_SERVICE_PROVIDERS,
	LOAD_TESTIMONIALS,
	ADD_TESTIMONIAL,
	REMOVE_TESTIMONIAL,
	LOAD_MENU,
	LOAD_POLICIES,
	LOAD_EVENT_RSVPS,
	ADD_RSVP,
	REMOVE_RSVP,
	CHANGE_RSVP,
	ADD_TEAM_MEMBER,
	REMOVE_TEAM_MEMBER,
	LOAD_COMMUNITIES,
	LOAD_TAG_COLS,
	LOAD_COMMUNITY_DATA,
	LOAD_COMMUNITY_ADMINS,
	CHANGE_DATA,
	TEAM_ADD_ACTION,
	TEAM_REMOVE_ACTION,
	TEAM_ADD_HOUSEHOLD,
	TEAM_REMOVE_HOUSEHOLD
} from '../actions/types';

import { getTeamData, inSubTeam, inThisTeam } from '../../components/Pages/TeamsPage/utils';

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
	impactPage: null,
	//menu, navbar footer...
	menu: null,
	policies: null,
	//objects to be loaded
	actions: null,
	events: null,
	teams: null,
	serviceProviders: null,
	testimonials: null,
	tagCols: null,

	communities: null,
	communitiesStats: null,
	community: null,
	communityData: null,
	communityAdmins: null,
};


function alreadyInSubTeam(state, action) {
  const teamsStats = state.teams;
  const teamStats = teamsStats.filter(stats => { return stats.team.id === action.payload.team.id })[0]
  const teamData = getTeamData(teamsStats, teamStats);
  return (!inThisTeam(action.user, teamData.team) && inSubTeam(action.user, teamData)) 
}


export default function (state = initialState, action) {
	var team;
	switch (action.type) {
		/**************************/
		
		case "LOAD_COMMUNITY_INFORMATION":
			return {
				...state,
				comInformation: action.payload,
				community: action.payload
			}
		case "LOAD_COLLECTION":
			return {
				...state,
				collection: action.payload
			}
		case LOAD_COMMUNITY:
			return {
				...state,
				community: action.payload
			}
		case LOAD_COMMUNITY_DATA:
			return {
				...state,
				communityData: action.payload
			}
		case LOAD_COMMUNITY_ADMINS:
			return {
				...state,
				communityAdmins: action.payload
			}
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

		case LOAD_CONTACT_US_PAGE:
			return {
				...state,
				contactUsPage: action.payload
			}

		case LOAD_DONATE_PAGE:
			return {
				...state,
				donatePage: action.payload
			}

		case LOAD_IMPACT_PAGE:
			return {
				...state,
				impactPage: action.payload
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
		case LOAD_TEAMS:
			return {
				...state,
				teams: action.payload
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
		case LOAD_TAG_COLS: 
			return {
				...state,
				tagCols: action.payload,
				collection:  (action.payload || []).filter(t => t.name === "Category")
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
      		if (alreadyInSubTeam(state, action)) return state;
      
      		team = state.teams.filter(stats => { return stats.team.id === action.payload.team.id })[0]
			const newTeam = {
				...team,
				members: team.members + 1,
				households: team.households + action.payload.member.households,
				actions: team.actions + action.payload.member.actions,
				actions_completed: team.actions_completed + action.payload.member.actions_completed,
				actions_todo: team.actions_todo + action.payload.member.actions_todo
			}
			return {
				...state,
				teams: [
					...state.teams.filter(stats => { return stats.team.id !== action.payload.team.id }),
					newTeam
				]
			} 
    	case REMOVE_TEAM_MEMBER:
      		if (alreadyInSubTeam(state, action)) return state;
      
			team = state.teams.filter(stats => { return stats.team.id === action.payload.team.id })[0]
			return {
				...state,
				teams: [
					...state.teams.filter(stats => { return stats.team.id !== action.payload.team.id }),
					{
						...team,
						members: team.members - 1,
						households: team.households - action.payload.member.households,
						actions: team.actions - action.payload.member.actions,
						actions_completed: team.actions_completed - action.payload.member.actions_completed,
						actions_todo: team.actions_todo - action.payload.member.actions_todo
					}
				]
			}
    	case TEAM_ADD_ACTION:
      		if (alreadyInSubTeam(state, action)) return state;

			team = state.teams.filter(stats => { return stats.team.id === action.payload.id })[0]
			return { 
				...state,
				teams: [
					...state.teams.filter(stats => { return stats.team.id !== action.payload.id }),
					{
						...team,
						actions_completed: team.actions_completed + 1
					}
				]
			}
    	case TEAM_REMOVE_ACTION:
      		if (alreadyInSubTeam(state, action)) return state;
      
			team = state.teams.filter(stats => { return stats.team.id === action.payload.id })[0]
			return {
				...state,
				teamsPage: [
					...state.teams.filter(stats => { return stats.team.id !== action.payload.id }),
					{
						...team,
						actions_completed: team.actions_completed - 1,
					}
				]
			}
    	case TEAM_ADD_HOUSEHOLD:
      		if (alreadyInSubTeam(state, action)) return;

			team = state.teams.filter(stats => { return stats.team.id === action.payload.id })[0]
			return {
				...state,
				teams: [
					...state.teams.filter(stats => { return stats.team.id !== action.payload.id }),
					{
						...team,
						households: team.households + 1
					}
				]
			}
    	case TEAM_REMOVE_HOUSEHOLD:
      		if (alreadyInSubTeam(state, action)) return;

			team = state.teams.filter(stats => { return stats.team.id === action.payload.id })[0]
			return {
				...state,
				teams: [
					...state.teams.filter(stats => { return stats.team.id !== action.payload.id }),
					{
						...team,
						households: team.households - 1
					}
				]
			}
		case CHANGE_DATA:
			return {
				...state,
				communityData: [
					...state.communityData.filter(data => { return data.id !== action.payload.id }),
					action.payload
				]
			}
		/**************************/
		default:
			return {
				...state,
			};
	}
}