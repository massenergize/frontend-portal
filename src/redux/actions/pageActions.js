import GuestAuthenticationDialog from "../../components/Shared/GuestAuthenticationDialog";
import React from "react";
import {
  fetchAndParseStorageContent,
  PREFERRED_EQ,
  TOUR_STORAGE_KEY,
} from "../../components/Utils";
import {
  LOAD_HOME_PAGE,
  LOAD_ACTIONS_PAGE,
  LOAD_SERVICE_PROVIDERS_PAGE,
  LOAD_TEAMS_PAGE,
  LOAD_TEAMS,
  LOAD_ABOUT_US_PAGE,
  LOAD_COMMUNITIES_STATS,
  LOAD_CONTACT_US_PAGE,
  LOAD_DONATE_PAGE,
  LOAD_EVENTS_PAGE,
  LOAD_IMPACT_PAGE,
  LOAD_REGISTER_PAGE,
  LOAD_SIGNIN_PAGE,
  LOAD_MENU,
  LOAD_POLICIES,
  LOAD_ACTIONS,
  LOAD_SERVICE_PROVIDERS,
  ADD_TESTIMONIAL,
  REMOVE_TESTIMONIAL,
  LOAD_TESTIMONIALS_PAGE,
  LOAD_TESTIMONIALS,
  LOAD_EVENTS,
  LOAD_EVENT_RSVPS,
  LOAD_EVENT_EXCEPTIONS,
  ADD_RSVP,
  REMOVE_RSVP,
  CHANGE_RSVP,
  ADD_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER,
  LOAD_COMMUNITIES,
  LOAD_COMMUNITY,
  LOAD_TAG_COLS,
  LOAD_COMMUNITY_DATA,
  LOAD_COMMUNITY_ADMINS,
  CHANGE_DATA,
  TEAM_ADD_ACTION,
  TEAM_REMOVE_ACTION,
  TEAM_ADD_HOUSEHOLD,
  TEAM_REMOVE_HOUSEHOLD,
  LOAD_EQUIVALENCES,
  LOAD_COMMUNITY_INFORMATION,
  SET_TOUR_STATE,
  SET_TOUR_INFO,
  LOAD_COMMUNITY_ACTION_LIST,
  TOGGLE_UNIVERSAL_MODAL,
  LOAD_SETTINGS,
} from "./types";
import { reduxSetPreferredEquivalence } from "./userActions";

export const FIRST_SET = "first-set";
export const SECOND_SET = "second-set";

export const reduxLoadSettings = (data) => {
  return {
    type: LOAD_SETTINGS,
    payload: data,
  };
};
export const reduxToggleUniversalModal = (data) => {
  return {
    type: TOGGLE_UNIVERSAL_MODAL,
    payload: data,
  };
};
export const reduxToggleGuestAuthDialog =
  (state, componentProps, otherProps) => (dispatch) => {
    componentProps = componentProps || {};
    dispatch(
      reduxToggleUniversalModal({
        show: state,
        component: <GuestAuthenticationDialog {...componentProps} />,
        ...(otherProps || {}),
      })
    );
  };

export const reduxLoadCommunityActionList = (list) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITY_ACTION_LIST,
    payload: list,
  });
};
export const reduxSetTourInformation = (data = { stage: FIRST_SET }) => {
  return { type: SET_TOUR_INFO, payload: data };
};
export const reduxLoadEquivalences = (data) => {
  return (dispatch) => {
    data = data || [];
    const pref_eq = fetchAndParseStorageContent(PREFERRED_EQ);
    const found = data.find(
      (item) => item.id === pref_eq?.id && item.name === pref_eq?.name
    );
    if (found) dispatch(reduxSetPreferredEquivalence(found));
    return dispatch({ type: LOAD_EQUIVALENCES, payload: data });
  };
};

export const reduxSetTourState =
  (state, persist = false) =>
  (dispatch) => {
    if (persist) window.localStorage.setItem(TOUR_STORAGE_KEY, state);
    return dispatch({
      type: SET_TOUR_STATE,
      payload: state,
    });
  };
export const reduxLoadCommunityInformation = (data) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITY_INFORMATION,
    payload: data,
  });
};

export const reduxLoadCollection = (collection) => (dispatch) => {
  return dispatch({
    type: "LOAD_COLLECTION",
    payload: collection,
  });
};
export const reduxLoadCommunity = (community) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITY,
    payload: community,
  });
};

export const reduxLoadCommunityData = (data) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITY_DATA,
    payload: data,
  });
};

export const reduxLoadCommunityAdmins = (admins) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITY_ADMINS,
    payload: admins,
  });
};
export const reduxLoadHomePage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_HOME_PAGE,
    payload: page,
  });
};

export const reduxLoadActionsPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_ACTIONS_PAGE,
    payload: page,
  });
};

export const reduxLoadServiceProvidersPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_SERVICE_PROVIDERS_PAGE,
    payload: page,
  });
};

export const reduxLoadTestimonialsPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_TESTIMONIALS_PAGE,
    payload: page,
  });
};

export const reduxLoadTeamsPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_TEAMS_PAGE,
    payload: page,
  });
};

export const reduxLoadAboutUsPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_ABOUT_US_PAGE,
    payload: page,
  });
};

export const reduxLoadCommunitiesStats = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITIES_STATS,
    payload: page,
  });
};

export const reduxLoadContactUsPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_CONTACT_US_PAGE,
    payload: page,
  });
};

export const reduxLoadDonatePage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_DONATE_PAGE,
    payload: page,
  });
};

export const reduxLoadEventsPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_EVENTS_PAGE,
    payload: page,
  });
};

export const reduxLoadImpactPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_IMPACT_PAGE,
    payload: page,
  });
};

export const reduxLoadRegisterPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_REGISTER_PAGE,
    payload: page,
  });
};

export const reduxLoadSigninPage = (page) => (dispatch) => {
  return dispatch({
    type: LOAD_SIGNIN_PAGE,
    payload: page,
  });
};

export const reduxLoadMenu = (menu) => (dispatch) => {
  return dispatch({
    type: LOAD_MENU,
    payload: menu,
  });
};

export const reduxLoadPolicies = (policies) => (dispatch) => {
  return dispatch({
    type: LOAD_POLICIES,
    payload: policies,
  });
};

export const reduxLoadActions = (actions) => (dispatch) => {
  return dispatch({
    type: LOAD_ACTIONS,
    payload: actions,
  });
};

export const reduxLoadEvents = (events) => (dispatch) => {
  return dispatch({
    type: LOAD_EVENTS,
    payload: events,
  });
};

export const reduxLoadEventExceptions = (eventExceptions) => (dispatch) => {
  return dispatch({
    type: LOAD_EVENT_EXCEPTIONS,
    payload: eventExceptions,
  });
};

export const reduxLoadTeams = (teams) => (dispatch) => {
  return dispatch({
    type: LOAD_TEAMS,
    payload: teams,
  });
};

export const reduxLoadServiceProviders = (serviceProviders) => (dispatch) => {
  return dispatch({
    type: LOAD_SERVICE_PROVIDERS,
    payload: serviceProviders,
  });
};

export const reduxLoadTestimonials = (testimonials) => (dispatch) => {
  return dispatch({
    type: LOAD_TESTIMONIALS,
    payload: testimonials,
  });
};

export const reduxLoadCommunities = (communities) => (dispatch) => {
  return dispatch({
    type: LOAD_COMMUNITIES,
    payload: communities,
  });
};

export const reduxLoadTagCols = (tagCols) => (dispatch) => {
  return dispatch({
    type: LOAD_TAG_COLS,
    payload: tagCols,
  });
};

export const reduxAddTestimonial = (testimonial) => (dispatch) => {
  return dispatch({
    type: ADD_TESTIMONIAL,
    payload: testimonial,
  });
};

export const reduxRemoveTestimonial = (testimonial) => (dispatch) => {
  return dispatch({
    type: REMOVE_TESTIMONIAL,
    payload: testimonial,
  });
};

export const reduxLoadRSVPs = (RSVPs) => (dispatch) => {
  return dispatch({
    type: LOAD_EVENT_RSVPS,
    payload: RSVPs,
  });
};

export const reduxAddRSVP = (RSVP) => (dispatch) => {
  return dispatch({
    type: ADD_RSVP,
    payload: RSVP,
  });
};

export const reduxRemoveRSVP = (RSVP) => (dispatch) => {
  return dispatch({
    type: REMOVE_RSVP,
    payload: RSVP,
  });
};

export const reduxChangeRSVP = (RSVP) => (dispatch) => {
  return dispatch({
    type: CHANGE_RSVP,
    payload: RSVP,
  });
};
export const reduxAddTeamMember = (teamAndMember) => (dispatch, getState) => {
  const user = getState().user.info;
  return dispatch({
    type: ADD_TEAM_MEMBER,
    payload: teamAndMember,
    user: user,
  });
};
export const reduxRemoveTeamMember =
  (teamAndMember) => (dispatch, getState) => {
    const user = getState().user.info;
    return dispatch({
      type: REMOVE_TEAM_MEMBER,
      payload: teamAndMember,
      user: user,
    });
  };
export const reduxTeamAddAction = (team) => (dispatch, getState) => {
  const user = getState().user.info;
  return dispatch({
    type: TEAM_ADD_ACTION,
    payload: team,
    user: user,
  });
};
export const reduxTeamRemoveAction = (team) => (dispatch, getState) => {
  const user = getState().user.info;
  return dispatch({
    type: TEAM_REMOVE_ACTION,
    payload: team,
    user: user,
  });
};
export const reduxTeamAddHouse = (team) => (dispatch, getState) => {
  const user = getState().user.info;
  return dispatch({
    type: TEAM_ADD_HOUSEHOLD,
    payload: team,
    user: user,
  });
};
export const reduxTeamRemoveHouse = (team) => (dispatch, getState) => {
  const user = getState().user.info;
  return dispatch({
    type: TEAM_REMOVE_HOUSEHOLD,
    payload: team,
    user: user,
  });
};
export const reduxChangeData = (data) => (dispatch) => {
  return dispatch({
    type: CHANGE_DATA,
    payload: data,
  });
};
