import React, { Component } from "react";
import Helmet from "react-helmet";
import { Switch, Route } from "react-router-dom";
import NavBarBurger from "./components/Menu/NavBarBurger";
import Footer from "./components/Menu/Footer";
import LoadingCircle from "./components/Shared/LoadingCircle";
import "./assets/css/style.css";

import HomePage from "./components/Pages/HomePage/HomePage";
import ActionsPage from "./components/Pages/ActionsPage/ActionsPage";
import OneActionPage from "./components/Pages/ActionsPage/OneActionPage";
import AboutUsPage from "./components/Pages/AboutUsPage/AboutUsPage.js";
import ServicesPage from "./components/Pages/ServicesPage/ServicesPage";
import OneServicePage from "./components/Pages/ServicesPage/OneServicePage";
import StoriesPage from "./components/Pages/StoriesPage/StoriesPage";
import OneTestimonialPage from "./components/Pages/StoriesPage/OneTestimonialPage";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import EventsPage from "./components/Pages/EventsPage/EventsPageReal";
import OneEventPage from "./components/Pages/EventsPage/OneEventPage";
import ProfilePage from "./components/Pages/ProfilePage/ProfilePage";
import ImpactPage from "./components/Pages/ImpactPage/ImpactPage";
import TeamsPage from "./components/Pages/TeamsPage/TeamsPage";
import OneTeamPage from "./components/Pages/TeamsPage/OneTeamPage";
import RegisterPage from "./components/Pages/RegisterPage/RegisterPage";
import PoliciesPage from "./components/Pages/PoliciesPage/PoliciesPage";
import DonatePage from "./components/Pages/DonatePage/DonatePage";
import ContactPage from "./components/Pages/ContactUs/ContactUsPage";
import firebase from "firebase/app";
import "firebase/auth";

import ErrorPage from "./components/Pages/Errors/ErrorPage";

import {
  reduxLoadCommunity,
  reduxLoadHomePage,
  reduxLoadActionsPage,
  reduxLoadServiceProvidersPage,
  reduxLoadTestimonialsPage,
  reduxLoadTeamsPage,
  reduxLoadTeams,
  reduxLoadAboutUsPage,
  reduxLoadCommunitiesStats,
  reduxLoadContactUsPage,
  reduxLoadDonatePage,
  reduxLoadEventsPage,
  reduxLoadImpactPage,
  reduxLoadMenu,
  reduxLoadPolicies,
  reduxLoadActions,
  reduxLoadEvents,
  reduxLoadServiceProviders,
  reduxLoadTestimonials,
  reduxLoadCommunities,
  reduxLoadRSVPs,
  reduxLoadTagCols,
  reduxLoadCommunityData,
  reduxLoadCollection,
  reduxLoadCommunityInformation,
  reduxLoadCommunityAdmins,
} from "./redux/actions/pageActions";
import {
  reduxLogout,
  reduxLogin,
  reduxLoadTodo,
  reduxLoadDone,
} from "./redux/actions/userActions";
import { reduxLoadLinks } from "./redux/actions/linkActions";

import { apiCall } from "./api/functions";
import { connect } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import Help from "./components/Pages/Help/Help";

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triedLogin: false,
      community: null,
      error: null,
      loading: true,
    };

    this.userHasAnIncompleteRegistration = this.userHasAnIncompleteRegistration.bind(
      this
    );
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const { subdomain } = this.props.match.params;
    const body = { subdomain: subdomain };

    // first set the domain for the current community
    this.props.reduxLoadCommunity({ subdomain });

    this.props.reduxLoadLinks({
      home: `/${subdomain}`,
      actions: `/${subdomain}/actions`,
      aboutus: `/${subdomain}/aboutus`,
      services: `/${subdomain}/services`,
      testimonials: `/${subdomain}/testimonials`,
      teams: `/${subdomain}/teams`,
      impact: `/${subdomain}/impact`,
      donate: `/${subdomain}/donate`,
      events: `/${subdomain}/events`,
      signin: `/${subdomain}/signin`,
      signup: `/${subdomain}/signup`,
      profile: `/${subdomain}/profile`,
      policies: `/${subdomain}/policies`,
      contactus: `/${subdomain}/contactus`,
    });

    /* first see if the community exists and is published (if not sandbox) */
    const json = await apiCall("communities.info", body);
		if (json.success) {
				this.props.reduxLoadCommunityInformation(json.data);
        this.setState({ community: json.data, 
                        loading: false ,
                        error: null });
		}
    else {
      this.setState({ community: null,
        loading: false ,        
        error: json.error });        
    }

    if (this.state.community) {
      // for lazy loading: load these first
      Promise.all([
        apiCall("home_page_settings.info", body),
        apiCall("menus.list", body), //should add all communities to the menus.list
      ])
      .then((res) => {
        const [homePageResponse, mainMenuResponse] = res;
        this.props.reduxLoadHomePage(homePageResponse.data);
        this.props.reduxLoadMenu(mainMenuResponse.data);
      })
      .catch((err) => {
        this.setState({ error: err });
        console.log(err);
      });

      Promise.all([
        apiCall("about_us_page_settings.info", body),
        apiCall("actions_page_settings.info", body),
        apiCall("actions.list", body),
        apiCall("graphs.actions.completed", body),
        apiCall("graphs.communities.impact", body),
        apiCall("contact_us_page_settings.info", body),        
        apiCall("donate_page_settings.info", body),
        apiCall("events_page_settings.info", body),
        apiCall("events.list", body),
        apiCall("impact_page_settings.info", body),
        apiCall("policies.list", body),
        apiCall("teams_page_settings.info", body),
        apiCall("teams.stats", body),
        apiCall("tag_collections.list", body),
        apiCall("testimonials_page_settings.info", body),
        apiCall("testimonials.list", body),
        apiCall("vendors_page_settings.info", body),
        apiCall("vendors.list", body),
      ])
      .then((res) => {
        const [
          aboutUsPageResponse,
          actionsPageResponse,
          actionsResponse,
          actionsCompletedResponse,
          communityStatsResponse,
          contactUsPageResponse,
          donatePageResponse,
          eventsPageResponse,
          eventsResponse,
          impactPageResponse,
          policiesResponse,
          teamsPageResponse,
          teamResponse,
          tagCollectionsResponse,
          testimonialsPageResponse,
          testimonialsResponse,
          vendorsPageResponse,
          vendorsResponse,
        ] = res;
        this.props.reduxLoadAboutUsPage(aboutUsPageResponse.data);
        this.props.reduxLoadActionsPage(actionsPageResponse.data);
        this.props.reduxLoadContactUsPage(contactUsPageResponse.data);
        this.props.reduxLoadDonatePage(donatePageResponse.data);
        this.props.reduxLoadEventsPage(eventsPageResponse.data);
        this.props.reduxLoadEvents(eventsResponse.data);
        this.props.reduxLoadImpactPage(impactPageResponse.data);
        this.props.reduxLoadActions(actionsResponse.data);
        this.props.reduxLoadServiceProvidersPage(vendorsPageResponse.data);
        this.props.reduxLoadServiceProviders(vendorsResponse.data);
        this.props.reduxLoadTestimonialsPage(testimonialsPageResponse.data);
        this.props.reduxLoadTestimonials(testimonialsResponse.data);
        this.props.reduxLoadPolicies(policiesResponse.data);
        this.props.reduxLoadTeamsPage(teamsPageResponse.data);
        this.props.reduxLoadTeams(teamResponse.data);
        this.props.reduxLoadTagCols(tagCollectionsResponse.data);
        this.props.reduxLoadCommunityData(actionsCompletedResponse.data);
        this.props.reduxLoadCommunitiesStats(communityStatsResponse.data);
      })
      .catch((err) => {
        this.setState({ error: err });
        console.log(err);
      });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async getUser() {
    await this.setStateAsync({ triedLogin: true });
    let { data } = await apiCall("auth.whoami");
    let user = null;
    
    if (data) {
      user = data;
    } else {
      if (this.props.auth && firebase.auth().currentUser) {
        const idToken = await firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true);
        const newLoggedInUserResponse = await apiCall("auth.login", {
          idToken: idToken,
        });
        user = newLoggedInUserResponse.data;
      }
    }

    if (user) {
      // set the user in the redux state
      this.props.reduxLogin(user);

      // we know that the user is already signed in so proceed
      const [
        userActionsTodoResponse,
        userActionsCompletedResponse,
        eventsRsvpListResponse,
      ] = await Promise.all([
        apiCall("users.actions.todo.list", { email: user.email }),
        apiCall("users.actions.completed.list", { email: user.email }),
        apiCall("users.events.list", { email: user.email }),
      ]);
      console.log('we pinged the users.events.list endpoint');

      if (userActionsTodoResponse && userActionsCompletedResponse) {
        this.props.reduxLoadTodo(userActionsTodoResponse.data);
        this.props.reduxLoadDone(userActionsCompletedResponse.data);
        this.props.reduxLoadRSVPs(eventsRsvpListResponse.data);
        return true;
      } else {
        console.log(`no user with this email: ${user.email}`);
        return false;
      }
    }
  }

  modifiedMenu(menu) {
    var oldAbout = menu[3];
    var oldActions = menu[1];
    if (oldAbout) {
      var abtSliced = oldAbout.children.filter(
        (item) => item.name.toLowerCase() !== "impact"
      );
      const contactUsItem = { link: "/contactus", name: "Contact Us" };

      var newAbout = {
        name: "About Us",
        children: [
          { link: "/impact", name: "Our Impact" },
          ...abtSliced,
          contactUsItem,
        ],
      };
      if (menu[4]) {
        newAbout.children = [...newAbout.children, menu.pop()];
      }
      menu[3] = newAbout;
    }
    if (oldActions) {
      var actionsSliced = oldActions.children.slice(1);
      actionsSliced = actionsSliced.filter((items) => items.name !== "Teams");
      var newAction = {
        name: "Actions",
        children: [{ link: "/actions", name: "Actions" }, ...actionsSliced],
      };
      menu[1] = newAction;
    }
    const actionsIndex = menu.findIndex((item) => item.name === "Actions");
    const menuPostActions = menu.splice(actionsIndex + 1);
    menu = [
      ...menu.splice(0, actionsIndex + 1),
      { link: "/teams", name: "Teams" },
      ...menuPostActions,
    ];
    return menu;
  }

  saveCurrentPageURL() {
    let host = window.location.host;
    const loginURL = host + this.props.links.signin;
    const registerURL = host + this.props.links.signup;
    const profileURL = host + this.props.links.profile;
    const currentURL = window.location.href.split("//")[1]; //just remove the "https or http from the url and return the remaining"
    const realRoute = window.location.pathname;
    if (
      this.props.links.signup &&
      this.props.links.signin &&
      this.props.links.profile &&
      currentURL !== loginURL &&
      currentURL !== registerURL &&
      currentURL !== profileURL
    ) {
      window.localStorage.setItem("last_visited", realRoute);
    }
  }

  userHasAnIncompleteRegistration() {
    return (
      (this.state.triedLogin && // we tried to check who this user is
        !this.props.user && // we didnt find a profile
        this.props.auth.uid) || // but we found a firebase userID.  This means they did not finish creating their profile
      (this.props.auth.uid && // firebase userID is created
        !this.props.auth.emailVerified) // but user did not verify their email yet
    );
  }

  render() {
    const { subdomain } = this.props.match.params;
    this.saveCurrentPageURL();
    document.body.style.overflowX = "hidden";
    if (!isLoaded(this.props.auth)) {
      return <LoadingCircle />;
    }

    if (this.state.loading) {
      return <LoadingCircle />;
    }

    /* error page if community isn't published */
    if (!this.state.community) {
      return (<ErrorPage
        errorMessage="Page not found"
        errorDescription="This community page is not accessible.  Please contact the community administrator to resolve the problem."
      />)
    }

    if (!this.state.triedLogin && !this.props.user) {
      this.getUser().then((success) => {
        console.log(`User Logged in: ${success}`);
      });
    }

    if (this.props.user && !this.state.triedLogin) {
      return <LoadingCircle />;
    }

    const { links } = this.props;
    var finalMenu = [];
    if (this.props.menu) {
      const navMenus = this.props.menu.filter((menu) => {
        return menu.name === "PortalMainNavLinks";
      })[0].content;
      finalMenu = [...navMenus];
    }
    finalMenu = finalMenu.filter((item) => item.name !== "Home");
    const communitiesLink = {
      name: "All MassEnergize Community Sites",
      link: "http://" + window.location.host,
      special: true,
    };
    const droppyHome = [{ name: "Home", link: "/" }];
    finalMenu = [...droppyHome, ...finalMenu];
    //modify again
    finalMenu = this.modifiedMenu(finalMenu);
    const communityInfo = this.state.community || {};
    const footerInfo = {
      name: communityInfo.owner_name,
      phone: communityInfo.owner_phone_number,
      email: communityInfo.owner_email,
      allCommunities: communitiesLink,
    };
    return (
      <div className="boxed-wrapper">
        <div className="burger-menu-overlay"></div>
        <Helmet>
          <meta charset="UTF-8" />
          <title>Mass Energize</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </Helmet>
        {this.props.menu ? (
          <div>
            <NavBarBurger navLinks={finalMenu} />
          </div>
        ) : (
          <LoadingCircle />
        )}
        {
          /**if theres a half finished account the only place a user can go is the register page */
          this.userHasAnIncompleteRegistration() ? (
            <Switch>
              <Route component={RegisterPage} />
            </Switch>
          ) : (
            <Switch>
              {/* ---- This route is a facebook app requirement. -------- */}
              <Route
                path={`/${subdomain}/how-to-delete-my-data`}
                component={Help}
              />
              <Route exact path={links.home} component={HomePage} />
              <Route exact path={`${links.home}/home`} component={HomePage} />
              <Route exact path={links.actions} component={ActionsPage} />
              <Route
                exact
                path={`${links.actions}/:id`}
                component={OneActionPage}
              />

              <Route path={links.aboutus} component={AboutUsPage} />
              <Route exact path={links.services} component={ServicesPage} />
              <Route
                path={`${links.services}/:id`}
                component={OneServicePage}
              />

              <Route exact path={links.testimonials} component={StoriesPage} />
              <Route
                path={`${links.testimonials}/:id`}
                component={OneTestimonialPage}
              />
              <Route exact path={links.teams} component={TeamsPage} />
              <Route path={`${links.teams}/:id`} component={OneTeamPage} />
              <Route path={links.impact} component={ImpactPage} />
              <Route path={links.donate} component={DonatePage} />
              <Route exact path={links.events} component={EventsPage} />
              <Route path={`${links.events}/:id`} component={OneEventPage} />
              <Route path={links.signin} component={LoginPage} />
              <Route path={links.signup} component={RegisterPage} />
              <Route path={links.profile} component={ProfilePage} />
              <Route path={links.policies} component={PoliciesPage} />
              <Route path={links.contactus} component={ContactPage} />
              <Route
                component={() => (
                  <ErrorPage
                    errorMessage="Page not found"
                    errorDescription="The page you are trying to access does not exist"
                  />
                )}
              />
            </Switch>
          )
        }
        {this.props.menu ? (
          <Footer
            footerLinks={
              this.props.menu.filter((menu) => {
                return menu.name === "PortalFooterQuickLinks";
              })[0].content
            }
            footerInfo={footerInfo}
          />
        ) : (
          <LoadingCircle />
        )}
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    auth: store.firebase.auth,
    menu: store.page.menu,
    links: store.links,
  };
};
const mapDispatchToProps = {
  reduxLogout,
  reduxLoadCommunity,
  reduxLoadHomePage,
  reduxLoadActionsPage,
  reduxLoadServiceProvidersPage,
  reduxLoadTestimonialsPage,
  reduxLoadTeamsPage,
  reduxLoadAboutUsPage,
  reduxLoadCommunitiesStats,
  reduxLoadContactUsPage,
  reduxLoadDonatePage,
  reduxLoadEventsPage,
  reduxLoadImpactPage,
  reduxLoadMenu,
  reduxLoadPolicies,
  reduxLoadActions,
  reduxLoadTeams,
  reduxLoadEvents,
  reduxLoadServiceProviders,
  reduxLoadTestimonials,
  reduxLoadCommunities,
  reduxLogin,
  reduxLoadTodo,
  reduxLoadDone,
  reduxLoadRSVPs,
  reduxLoadTagCols,
  reduxLoadCommunityData,
  reduxLoadLinks,
  reduxLoadCollection,
  reduxLoadCommunityInformation,
  reduxLoadCommunityAdmins,
};
export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);