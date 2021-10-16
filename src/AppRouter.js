import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import NavBarBurger from "./components/Menu/NavBarBurger";
import Footer from "./components/Menu/Footer";
import LoadingCircle from "./components/Shared/LoadingCircle";
import "./assets/css/style.css";
import URLS from "./api/urls";

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
  reduxLoadEventExceptions,
  reduxLoadServiceProviders,
  reduxLoadTestimonials,
  reduxLoadCommunities,
  reduxLoadRSVPs,
  reduxLoadTagCols,
  reduxLoadCommunityData,
  reduxLoadCollection,
  reduxLoadCommunityInformation,
  reduxLoadCommunityAdmins,
  reduxLoadEquivalences,
} from "./redux/actions/pageActions";
import {
  reduxLogout,
  reduxLogin,
  reduxLoadTodo,
  reduxLoadDone,
  reduxSetPreferredEquivalence,
} from "./redux/actions/userActions";
import { reduxLoadLinks } from "./redux/actions/linkActions";

import { apiCall } from "./api/functions";
import { connect } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import Help from "./components/Pages/Help/Help";
import Seo from "./components/Shared/Seo";

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triedLogin: false,
      community: null,
      error: null,
      pagesEnabled: {},
      menu: null,
      prefix: "",
    };

    this.userHasAnIncompleteRegistration =
      this.userHasAnIncompleteRegistration.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const { community, __is_custom_site } = this.props;
    const { subdomain } = community || {};
    const body = { subdomain: subdomain };

    // // first set the domain for the current community
    this.props.reduxLoadCommunity(community);

    const prefix = !__is_custom_site ? `/${subdomain}` : "";

    this.props.reduxLoadLinks({
      home: `${prefix}/`,
      actions: `${prefix}/actions`,
      aboutus: `${prefix}/aboutus`,
      services: `${prefix}/services`,
      testimonials: `${prefix}/testimonials`,
      teams: `${prefix}/teams`,
      impact: `${prefix}/impact`,
      donate: `${prefix}/donate`,
      events: `${prefix}/events`,
      signin: `${prefix}/signin`,
      signup: `${prefix}/signup`,
      profile: `${prefix}/profile`,
      policies: `${prefix}/policies`,
      contactus: `${prefix}/contactus`,
    });

    if (community) {
      // for lazy loading: load these first
      Promise.all([
        apiCall("home_page_settings.info", body),
        apiCall("menus.list", body), //should add all communities to the menus.list
        apiCall("about_us_page_settings.info", body),
        apiCall("actions_page_settings.info", body),
        apiCall("contact_us_page_settings.info", body),
        apiCall("donate_page_settings.info", body),
        apiCall("events_page_settings.info", body),
        apiCall("impact_page_settings.info", body),
        apiCall("teams_page_settings.info", body),
        apiCall("testimonials_page_settings.info", body),
        apiCall("vendors_page_settings.info", body),
      ])
        .then((res) => {
          const [
            homePageResponse,
            mainMenuResponse,
            aboutUsPageResponse,
            actionsPageResponse,
            contactUsPageResponse,
            donatePageResponse,
            eventsPageResponse,
            impactPageResponse,
            teamsPageResponse,
            testimonialsPageResponse,
            vendorsPageResponse,
          ] = res;
          this.props.reduxLoadHomePage(homePageResponse.data);
          this.props.reduxLoadMenu(mainMenuResponse.data);
          this.props.reduxLoadAboutUsPage(aboutUsPageResponse.data);
          this.props.reduxLoadActionsPage(actionsPageResponse.data);
          this.props.reduxLoadContactUsPage(contactUsPageResponse.data);
          this.props.reduxLoadDonatePage(donatePageResponse.data);
          this.props.reduxLoadEventsPage(eventsPageResponse.data);
          this.props.reduxLoadImpactPage(impactPageResponse.data);
          this.props.reduxLoadTeamsPage(teamsPageResponse.data);
          this.props.reduxLoadTestimonialsPage(testimonialsPageResponse.data);
          this.props.reduxLoadServiceProvidersPage(vendorsPageResponse.data);
          this.setState({
            pagesEnabled: {
              aboutUsPage: aboutUsPageResponse.data.is_published,
              actionsPage: actionsPageResponse.data.is_published,
              contactUsPage: contactUsPageResponse.data.is_published,
              donatePage: donatePageResponse.data.is_published,
              eventsPage: eventsPageResponse.data.is_published,
              impactPage: impactPageResponse.data.is_published,
              vendorsPage: vendorsPageResponse.data.is_published,
              testimonialsPage: testimonialsPageResponse.data.is_published,
              teamsPage: teamsPageResponse.data.is_published,
            },
            prefix,
          });
        })
        .catch((err) => {
          this.setState({ error: err });
          console.log(err);
        });
      apiCall("events.date.update", body)
        .then((json) => {
          if (json.success) {
          } else {
            console.log(json.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      Promise.all([
        apiCall("actions.list", body),
        apiCall("graphs.actions.completed", body),
        apiCall("graphs.communities.impact", body),
        apiCall("events.list", body),
        apiCall("events.exceptions.list", body),
        apiCall("policies.list", body),
        apiCall("teams.stats", body),
        apiCall("tag_collections.list", body),
        apiCall("testimonials.list", body),
        apiCall("vendors.list", body),
        apiCall("data.carbonEquivalency.get", body),
      ])
        .then((res) => {
          const [
            actionsResponse,
            actionsCompletedResponse,
            communityStatsResponse,
            eventsResponse,
            eventExceptionsResponse,
            policiesResponse,
            teamResponse,
            tagCollectionsResponse,
            testimonialsResponse,
            vendorsResponse,
            eqResponse,
          ] = res;
          this.props.reduxLoadEvents(eventsResponse.data);
          this.props.reduxLoadEventExceptions(eventExceptionsResponse);
          this.props.reduxLoadActions(actionsResponse.data);
          this.props.reduxLoadServiceProviders(vendorsResponse.data);
          this.props.reduxLoadTestimonials(testimonialsResponse.data);
          this.props.reduxLoadPolicies(policiesResponse.data);
          this.props.reduxLoadTeams(teamResponse.data);
          this.props.reduxLoadTagCols(tagCollectionsResponse.data);
          this.props.reduxLoadCommunityData(actionsCompletedResponse.data);
          this.props.reduxLoadCommunitiesStats(communityStatsResponse.data);
          this.props.reduxLoadEquivalences(eqResponse.data);
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
      // remove menu items for pages which cadmins have selected as not enabled
      newAbout.children = newAbout.children.filter((item) => {
        switch (item.link) {
          case "/impact":
            return this.state.pagesEnabled.impactPage;
          case "/aboutus":
            return this.state.pagesEnabled.aboutUsPage;
          case "/donate":
            return this.state.pagesEnabled.donatePage;
          case "/contactus":
            return this.state.pagesEnabled.contactUsPage;
          default:
            return true;
        }
      });
      menu[3] = newAbout;
    }

    if (oldActions) {
      var actionsSliced = oldActions.children.slice(1);
      actionsSliced = actionsSliced.filter((items) => items.name !== "Teams");
      var newAction = {
        name: "Actions",
        children: [{ link: "/actions", name: "Actions" }, ...actionsSliced],
      };
      // remove menu items for pages which cadmins have selected as not enabled
      newAction.children = newAction.children.filter((item) => {
        switch (item.link) {
          case "/actions":
            return this.state.pagesEnabled.actionsPage;
          case "/services":
            return this.state.pagesEnabled.vendorsPage;
          case "/testimonials":
            return this.state.pagesEnabled.testimonialsPage;
          default:
            return true;
        }
      });
      menu[1] = newAction;
    }

    const actionsIndex = menu.findIndex((item) => item.name === "Actions");
    const menuPostActions = menu.splice(actionsIndex + 1);
    menu = [
      ...menu.splice(0, actionsIndex + 1),
      { link: "/teams", name: "Teams" },
      ...menuPostActions,
    ];

    // remove menu items for pages which cadmins have selected as not enabled
    menu = menu.filter((item) => {
      switch (item.link) {
        case "/teams":
          return this.state.pagesEnabled.teamsPage;
        case "/events":
          return this.state.pagesEnabled.eventsPage;
        case "/home":
          return true;
        default:
          return item.children ? item.children.length > 0 : true;
      }
    });

    return this.addPrefix(menu);
  }

  /**
   * Adds the prefix to the subdomains where possible
   * @param {*} menu 
   * @returns 
   */
  addPrefix(menu) {
    menu = menu.map((m) => {
      if (
        this.state.prefix !== "" &&
        m.link &&
        !m.link.startsWith(this.state.prefix)
      )
        m.link = `${this.state.prefix}${m.link.endsWith("/")? "": "/"}${m.link}`;
      if (m.children && m.children.length > 0) {
        m.children = this.addPrefix(m.children);
      }

      return m;
    });

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
    const { community } = this.props;

    this.saveCurrentPageURL();
    document.body.style.overflowX = "hidden";

    if (!isLoaded(this.props.auth)) {
      return <LoadingCircle />;
    }

    /* error page if community isn't published */
    if (!community) {
      return (
        <ErrorPage
          errorMessage="Page not found"
          errorDescription="This community page is not accessible.  Please contact the community administrator to resolve the problem."
        />
      );
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
      const [{ content }] = this.props.menu.filter((menu) => {
        return menu.name === "PortalMainNavLinks";
      });
      finalMenu = content;
    }

    finalMenu = finalMenu.filter((item) => item.name !== "Home");
    const droppyHome = [{ name: "Home", link: "/" }];
    finalMenu = [...droppyHome, ...finalMenu];
    //modify again
    finalMenu = this.modifiedMenu(finalMenu);
    
    var footerLinks = []
    if(this.props.menu){
      const [{ content }] = this.props.menu.filter((menu) => {
        return menu.name === "PortalFooterQuickLinks";
      })
      footerLinks = this.addPrefix(content)
    }


    const communityInfo = community || {};

    const communitiesLink = {
      name: "All MassEnergize Community Sites",
      link: URLS.COMMUNITIES, //"http://" + window.location.host,
      special: true,
    };
    const footerInfo = {
      name: communityInfo.owner_name,
      phone: communityInfo.owner_phone_number,
      email: communityInfo.owner_email,
      allCommunities: communitiesLink,
    };

    return (
      <div className="boxed-wrapper">
        <div className="burger-menu-overlay"></div>

        {Seo({
          title: community.name,
          description: community.about,
          url: `${window.location.pathname}`,
          image: community.logo && community.logo.url,
          keywords: [],
          updated_at: community.updated_at,
          created_at: community.updated_at,
          tags: [community.name, community.subdomain],
        })}

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
              <Route path={`/how-to-delete-my-data`} component={Help} />
              <Route exact path="/" component={HomePage} />
              <Route exact path={links.home} component={HomePage} />
              <Route exact path={`${links.home}home`} component={HomePage} />
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
              <Route path="/completeRegistration?" component={RegisterPage} />
              <Route path={links.profile} component={ProfilePage} />
              <Route path={links.policies} component={PoliciesPage} />
              <Route path={links.contactus} component={ContactPage} />
              <Route component={HomePage} />
            </Switch>
          )
        }
        {this.props.menu ? (
          <Footer
            footerLinks={footerLinks}
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
    __is_custom_site: store.page.__is_custom_site,
    community: store.page.community,
    auth: store.firebase.auth,
    menu: store.page.menu,
    links: store.links,
    eq: store.page.equivalences,
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
  reduxLoadEventExceptions,
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
  reduxLoadEquivalences,
  reduxSetPreferredEquivalence,
};
export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);
