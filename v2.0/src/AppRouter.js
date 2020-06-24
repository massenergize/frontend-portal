import React, { Component } from "react";
import Helmet from "react-helmet";
import { Switch, Route } from "react-router-dom";
import NavBarBurger from "./components/Menu/NavBarBurger";
import NavBarOffset from "./components/Menu/NavBarOffset";
import Footer from "./components/Menu/Footer";
import LoadingCircle from "./components/Shared/LoadingCircle";
import "./assets/css/style.css";

import HomePage from "./components/Pages/HomePage/HomePage";
import ActionsPage from "./components/Pages/ActionsPage/ActionsPage";
import OneActionPage from "./components/Pages/ActionsPage/OneActionPage";
import AboutUsPage from "./components/Pages/AboutUsPage/AboutUsPage";
import ServicesPage from "./components/Pages/ServicesPage/ServicesPage";
import OneServicePage from "./components/Pages/ServicesPage/OneServicePage";
import StoriesPage from "./components/Pages/StoriesPage/StoriesPage";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import EventsPage from "./components/Pages/EventsPage/EventsPageReal";
import OneEventPage from "./components/Pages/EventsPage/OneEventPage";
import ProfilePage from "./components/Pages/ProfilePage/ProfilePage";
import ImpactPage from "./components/Pages/ImpactPage/ImpactPage";
import TeamsPage from "./components/Pages/TeamsPage/TeamsPage";
import OneTeamPage from "./components/Pages/TeamsPage/OneTeamPage";
import CompareTeamsPage from "./components/Pages/TeamsPage/CompareTeamsPage";
import RegisterPage from "./components/Pages/RegisterPage/RegisterPage";
import PoliciesPage from "./components/Pages/PoliciesPage/PoliciesPage";
import DonatePage from "./components/Pages/DonatePage/DonatePage";
import ContactPage from "./components/Pages/ContactUs/ContactUsPage";

import Error404 from "./components/Pages/Errors/404";
import {
  reduxLoadCommunity,
  reduxLoadHomePage,
  reduxLoadActionsPage,
  reduxLoadServiceProvidersPage,
  reduxLoadTestimonialsPage,
  reduxLoadTeamsPage,
  reduxLoadAboutUsPage,
  reduxLoadCommunitiesStats,
  reduxLoadDonatePage,
  reduxLoadEventsPage,
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
  reduxLoadCommunityAdmins
} from "./redux/actions/pageActions";
import {
  reduxLogout,
  reduxLogin,
  reduxLoadTodo,
  reduxLoadDone
} from "./redux/actions/userActions";
import { reduxLoadLinks } from "./redux/actions/linkActions";

import { apiCall } from "./api/functions";
import { connect } from "react-redux";
import { isLoaded } from "react-redux-firebase";

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triedLogin: false,
      community: null
    };
  }

  componentDidMount() {
    const { subdomain } = this.props.match.params;
    const body = { subdomain: subdomain };

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
      contactus: `/${subdomain}/contactus`
    });

    // for lazy loading: load these first
    Promise.all([
      apiCall("communities.info", body),
      apiCall("home_page_settings.info", body),
      apiCall("menus.list", body)
    ])
      .then(res => {
        const [communityInfoResponse, homePageResponse, mainMenuResponse] = res;
        this.setState({ community: communityInfoResponse.data });
        this.props.reduxLoadCommunityInformation(communityInfoResponse.data);
        this.props.reduxLoadHomePage(homePageResponse.data);
        this.props.reduxLoadMenu(mainMenuResponse.data);
      })
      .catch(err => {
        this.setState({ error: err });
        console.log(err);
      });

    Promise.all([
      apiCall("about_us_page_settings.info", body),
      apiCall("actions.list", body),
      apiCall("graphs.actions.completed", body),
      apiCall("graphs.communities.impact", body),
      apiCall("donate_page_settings.info", body),
      apiCall("events.list", body),
      apiCall("users.events.list", body),
      apiCall("policies.list", body),
      apiCall("teams.stats", body),
      apiCall("tag_collections.list", body),
      apiCall("testimonials.list", body),
      apiCall("vendors.list", body)
    ])
      .then(res => {
        const [
          aboutUsPageResponse,
          actionsResponse,
          actionsCompletedResponse,
          communityStatsResponse,
          donatePageResponse,
          eventsResponse,
          eventsRsvpListResponse,
          policiesResponse,
          teamResponse,
          tagCollectionsResponse,
          testimonialsResponse,
          vendorsResponse
        ] = res;

        this.props.reduxLoadAboutUsPage(aboutUsPageResponse.data);
        this.props.reduxLoadTeamsPage(teamResponse.data);
        this.props.reduxLoadDonatePage(donatePageResponse.data);
        this.props.reduxLoadEvents(eventsResponse.data);
        this.props.reduxLoadActions(actionsResponse.data);
        this.props.reduxLoadServiceProviders(vendorsResponse.data);
        this.props.reduxLoadTestimonials(testimonialsResponse.data);
        this.props.reduxLoadPolicies(policiesResponse.data);
        this.props.reduxLoadRSVPs(eventsRsvpListResponse.data);
        this.props.reduxLoadTagCols(tagCollectionsResponse.data);
        this.props.reduxLoadCommunityData(actionsCompletedResponse.data);
        this.props.reduxLoadCommunitiesStats(communityStatsResponse.data);
      })
      .catch(err => {
        this.setState({ error: err });
        console.log(err);
      });
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async getUser(email) {
    if (!email) return false;
    await this.setStateAsync({ triedLogin: true });

    const [
      userInfoResponse,
      userActionsTodoResponse,
      userActionsCompletedResponse
    ] = await Promise.all([
      apiCall("users.info", { email }),
      apiCall("users.actions.todo.list", { email }),
      apiCall("users.actions.completed.list", { email })
    ]);

    if (userInfoResponse && userInfoResponse.success && userInfoResponse.data) {
      this.props.reduxLogin(userInfoResponse.data);
      this.props.reduxLoadTodo(userActionsTodoResponse.data);
      this.props.reduxLoadDone(userActionsCompletedResponse.data);
      return true;
    } else {
      console.log(`no user with this email: ${email}`);
      return false;
    }
  }

  modifiedMenu(menu) {
    var oldAbout = menu[3];
    var oldActions = menu[1];
    if (oldAbout) {
      var abtSliced = oldAbout.children.filter(item => item.name.toLowerCase() !== "impact");
      var newAbout = {
        name: "About Us",
        children: [{ link: "/impact", name: "Our Impact" }, ...abtSliced]
      };
      menu[3] = newAbout;
    }
    if (oldActions) {
      var actionsSliced = oldActions.children.slice(1);
      var newAction = {
        name: "Actions",
        children: [{ link: "/actions", name: "Actions" }, ...actionsSliced]
      };
      menu[1] = newAction;
    }
    return menu;
  }

  render() {
    document.body.style.overflowX = "hidden";
    if (!isLoaded(this.props.auth)) {
      return <LoadingCircle />;
    }

    if (
      !this.state.triedLogin &&
      this.props.auth &&
      this.props.auth.uid &&
      !this.props.user
    ) {
      this.getUser(this.props.auth.email).then(success => {
        this.setState({
          triedLogin: true
        });
      });
    }

    if (this.props.auth.uid && !this.state.triedLogin) {
      return <LoadingCircle />;
    }
    const { links } = this.props;
    var finalMenu = [];
    if (this.props.menu) {
      const contactUsItem = { link: "/contactus", name: "Contact Us" };
      const navMenus = this.props.menu.filter(menu => {
        return menu.name === "PortalMainNavLinks";
      })[0].content;
      finalMenu = [...navMenus, contactUsItem];
    }
    finalMenu = finalMenu.filter(item => item.name !== "Home");
    const homeChil = [
      { name: "current-home", link: "/" },
      {
        name: "All Communities",
        link: "http://" + window.location.host,
        special: true
      }
    ];
    const droppyHome = { name: "Home", children: homeChil };
    finalMenu = [droppyHome, ...finalMenu];
    //modify again
    finalMenu = this.modifiedMenu(finalMenu);
    const communityInfo = this.state.community || {};
    const footerInfo = {
      name: communityInfo.owner_name,
      phone: communityInfo.owner_phone_number,
      email: communityInfo.owner_email
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
        {/**if theres a half finsished account the only place a user can go is the register page */
        (this.state.triedLogin && !this.props.user && this.props.auth.uid) ||
        (this.props.auth.uid && !this.props.auth.emailVerified) ? (
          <Switch>
            <Route component={RegisterPage} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path={links.home} component={HomePage} />
            <Route exact path={`${links.home}/home`} component={HomePage} />
            <Route exact path={links.actions} component={ActionsPage} />
            <Route path={links.aboutus} component={AboutUsPage} />
            <Route exact path={links.services} component={ServicesPage} />
            <Route path={`${links.services}/:id`} component={OneServicePage} />
            <Route path={`${links.actions}/:id`} component={OneActionPage} />
            <Route path={links.testimonials} component={StoriesPage} />
            <Route exact path={links.teams} component={TeamsPage} />
            <Route path={`${links.teams}/compare`} component={CompareTeamsPage} />
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
              component={() => {
                return <Error404 />;
              }}
            />
          </Switch>
        )}
        {this.props.menu ? (
          <Footer
            footerLinks={
              this.props.menu.filter(menu => {
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
const mapStoreToProps = store => {
  return {
    user: store.user.info,
    auth: store.firebase.auth,
    menu: store.page.menu,
    links: store.links
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
  reduxLoadDonatePage,
  reduxLoadEventsPage,
  reduxLoadMenu,
  reduxLoadPolicies,
  reduxLoadActions,
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
  reduxLoadCommunityAdmins
};
export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);
