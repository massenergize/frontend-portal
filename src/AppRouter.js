import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import NavBarBurger from "./components/Menu/NavBarBurger";
import Footer from "./components/Menu/Footer";
import LoadingCircle from "./components/Shared/LoadingCircle";
import "./assets/css/style.css";
import URLS, { isValidUrl, MASSENERGIZE_PRODUCTION_URL } from "./api/urls";

import HomePage from "./components/Pages/HomePage/HomePage";
import ActionsPage from "./components/Pages/ActionsPage/ActionsPage";
import OneActionPage from "./components/Pages/ActionsPage/OneActionPage";
import AboutUsPage from "./components/Pages/AboutUsPage/AboutUsPage.js";
import ServicesPage from "./components/Pages/ServicesPage/ServicesPage";
import OneServicePage from "./components/Pages/ServicesPage/OneServicePage";
import StoriesPage from "./components/Pages/StoriesPage/StoriesPage";
import OneTestimonialPage from "./components/Pages/StoriesPage/OneTestimonialPage";
import EventsPage from "./components/Pages/EventsPage/EventsPageReal";
import OneEventPage from "./components/Pages/EventsPage/OneEventPage";
import ProfilePage from "./components/Pages/ProfilePage/ProfilePage";
import ImpactPage from "./components/Pages/ImpactPage/ImpactPage";
import TeamsPage from "./components/Pages/TeamsPage/TeamsPage";
import OneTeamPage from "./components/Pages/TeamsPage/OneTeamPage";
import PoliciesPage from "./components/Pages/PoliciesPage/PoliciesPage";
import DonatePage from "./components/Pages/DonatePage/DonatePage";
import ContactPage from "./components/Pages/ContactUs/ContactUsPage";
import Cookies from "universal-cookie";
import { device_checkin } from "./api/functions";

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
  reduxLoadRegisterPage,
  reduxLoadSigninPage,
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
  reduxSetTourState,
  reduxToggleGuestAuthDialog,
  reduxLoadCommunityActionList,
  reduxToggleUniversalModal,
  reduxLoadSettings,
  reduxToggleUniversalToastAction,
  reduxSaveFeatureFlagsAction,
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
import Help from "./components/Pages/Help/Help";
import Seo from "./components/Shared/Seo";
import CookieBanner from "./components/Shared/CookieBanner";
import AuthEntry from "./components/Pages/Auth/AuthEntry";
import {
  setAuthStateAction,
  subscribeToFirebaseAuthChanges,
} from "./redux/actions/authActions";
import { getTakeTourFromURL, TOUR_STORAGE_KEY } from "./components/Utils";
import ProfilePasswordlessRedirectPage from "./components/Pages/ProfilePage/ProfilePasswordlessRedirectPage";
import UniversalModal from "./components/Shared/UniversalModal";
import {
  AUTH_STATES,
  browswerIsSafari,
  siteUsesCustomDomain,
} from "./components/Pages/Auth/shared/utils";
import Settings from "./components/Pages/Settings/Settings";
import ProfileSettings from "./components/Pages/ProfilePage/ProfileSettings";
import Celebrate from "./components/Pages/Widgets/Celebrate";
import METoast from "./components/Pages/Widgets/METoast/METoast";
import { child } from "firebase/database";
import RewiringAmerica from "./components/Pages/RewiringAmerica.js";
import OneTestimonialV2 from "./components/Pages/StoriesPage/OneTestimonialV2.js";
import RenderCustomPage from "./components/Pages/Custom Pages/RenderCustomPage.js";

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triedLogin: false,
      community: null,
      error: null,
      pagesEnabled: {},
      navBarMenu: null,
      footerLinks: null,
      prefix: "",
    };
  }

  cleanURL(string) {
    if (!string) return "";
    const noSlash = string.split("/").join("");
    return noSlash.split("?")[0];
  }

  isHomepage(menu) {
    // let cpy = JSON.parse(JSON.stringify(menu));
    const main = (menu || []).find((m) => m.name === "PortalMainNavLinks");
    if (!main) return false;
    const content = [...main.content];
    const homeFxn = (m) => m.name === "Home";
    const homeGroup = content.find(homeFxn);

    const home = homeGroup?.children?.find(homeFxn);
    var location = this.cleanURL(window.location.href);
    var rebuilt = this.cleanURL(
      window.location.protocol + window.location.host + home.link
    );
    return location === rebuilt;
  }

  /**
   * IDEA: The idea is that we use this function to determine the value of the tour
   * The first time the site loads. Only the first time!
   * So, we check where the user is currently entering from first. If the user is not entering
   * through the homepage, we wont bother finding the state of the tour, from the url or local storage,
   * the tour will be set to never display inside redux.
   * Otherwise, we go ahead and determine the tour state;
   * By initially checking if anything is passed via url, or  checking local storage if nothing.
   * In the end we either get a value of the current tour state from (url or localStorage), or we get nothing.
   * Nothing means user is new, so show tour!
   * @param {*} menu
   * @returns
   */
  checkTourState = (menu) => {
    if (!this.isHomepage(menu)) return this.props.setTourState(false); // TODO: will be back
    var valueFromURL = getTakeTourFromURL();
    var valueFromStorage = window.localStorage.getItem(TOUR_STORAGE_KEY);
    //----- value passed via url should take precedence over one in storage if provided, and should overwrite local storage value -------
    const evaluated = valueFromURL === "true";
    if (valueFromURL) return this.props.setTourState(evaluated);
    valueFromStorage = valueFromStorage !== "false";
    this.props.setTourState(valueFromStorage);
  };

  componentDidMount() {
    const { community } = this.props;
    const subdomain = community?.subdomain || "undefined";
    const { pathname } = new URL(window.location.href);
    if (browswerIsSafari() && siteUsesCustomDomain()) {
      const subd =
        pathname.toLowerCase().indexOf(subdomain.toLowerCase()) > -1
          ? ""
          : "/" + subdomain;
      window.location.href = MASSENERGIZE_PRODUCTION_URL + subd + pathname;
    }
    const community_id = community?.id;
    const cookies = new Cookies();
    device_checkin(cookies, community_id).then(null, (err) => console.log(err));
    this.props.checkFirebaseAuthentication();
    this.fetch();
  }

  static getDerivedStateFromProps(props, state) {
    const isJustFromGoogleAUth = props.authState?.split("::");
    if (isJustFromGoogleAUth[1] === AUTH_STATES.JUST_FROM_GOOGLE_AUTH) {
      props.history.push(props.links.signup);
      props.setAuthState(isJustFromGoogleAUth[0]);
      return null;
    }
    if (getTakeTourFromURL() === "true" && !props.showTour) {
      props.setTourState(true);
      return null;
    }
    return null;
  }

  async fetch() {
    const { community, __is_custom_site } = this.props;
    const { subdomain } = community || {};
    const body = { subdomain };

    // // first set the domain for the current community
    this.props.reduxLoadCommunity(community);

    // save as a custom property for Google Analytics
    window.gtag("set", "user_properties", { community: community.subdomain });

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
      rewiring_america: `${prefix}/rewiring-america`,
    });

    if (community) {
      // for lazy loading: load these first
      Promise.all([
        apiCall("communities.features.flags.list", body),
        apiCall("home_page_settings.info", body),
        apiCall("user.portal.menu.list", body),
        apiCall("impact_page_settings.info", body),
      ])
        .then((res) => {
          const [
            communityFeatures,
            homePageResponse,
            mainMenuResponse,
            impactPageResponse,
          ] = res;
          this.props.saveCommunityFeatureFlags(communityFeatures.data);
          this.props.reduxLoadHomePage(homePageResponse.data);
          this.props.reduxLoadMenu(mainMenuResponse.data);
          this.props.reduxLoadImpactPage(impactPageResponse.data);

          // this.setState({
          //   pagesEnabled: {
          //     aboutUsPage: aboutUsPageResponse.data.is_published,
          //     actionsPage: actionsPageResponse.data.is_published,
          //     contactUsPage: contactUsPageResponse.data.is_published,
          //     donatePage: donatePageResponse.data.is_published,
          //     eventsPage: eventsPageResponse.data.is_published,
          //     impactPage: impactPageResponse.data.is_published,
          //     vendorsPage: vendorsPageResponse.data.is_published,
          //     testimonialsPage: testimonialsPageResponse.data.is_published,
          //     teamsPage: teamsPageResponse.data.is_published,
          //   },
          //   prefix,
          // });
          this.loadMenu(mainMenuResponse.data, prefix);
          // this.checkTourState(mainMenuResponse.data);
        })
        .catch((err) => {
          this.setState({ error: err });
          console.log(err);
        });
    }

    // if (community) {
    //   // for lazy loading: load these first
    //   Promise.all([
    //     apiCall("communities.features.flags.list", body),
    //     apiCall("home_page_settings.info", body),
    //     apiCall("menus.list", body),
    //     apiCall("about_us_page_settings.info", body),
    //     apiCall("actions_page_settings.info", body),
    //     apiCall("contact_us_page_settings.info", body),
    //     apiCall("donate_page_settings.info", body),
    //     apiCall("events_page_settings.info", body),
    //     apiCall("impact_page_settings.info", body),
    //     apiCall("register_page_settings.info", body),
    //     apiCall("signin_page_settings.info", body),
    //     apiCall("teams_page_settings.info", body),
    //     apiCall("testimonials_page_settings.info", body),
    //     apiCall("vendors_page_settings.info", body),
    //     apiCall("communities.actions.completed", body),
    //     apiCall("settings.list", body),
    //   ])
    //     .then((res) => {
    //       const [
    //         communityFeatures,
    //         homePageResponse,
    //         mainMenuResponse,
    //         aboutUsPageResponse,
    //         actionsPageResponse,
    //         contactUsPageResponse,
    //         donatePageResponse,
    //         eventsPageResponse,
    //         impactPageResponse,
    //         registerPageResponse,
    //         signinPageResponse,
    //         teamsPageResponse,
    //         testimonialsPageResponse,
    //         vendorsPageResponse,
    //         communityActionList,
    //         settings,
    //       ] = res;
    //       this.props.saveCommunityFeatureFlags(communityFeatures.data);

    //       this.props.reduxLoadHomePage(homePageResponse.data);
    //       this.props.reduxLoadMenu(mainMenuResponse.data);
    //       this.props.reduxLoadAboutUsPage(aboutUsPageResponse.data);
    //       this.props.reduxLoadActionsPage(actionsPageResponse.data);
    //       this.props.reduxLoadContactUsPage(contactUsPageResponse.data);
    //       this.props.reduxLoadDonatePage(donatePageResponse.data);
    //       this.props.reduxLoadEventsPage(eventsPageResponse.data);
    //       this.props.reduxLoadImpactPage(impactPageResponse.data);
    //       this.props.reduxLoadRegisterPage(registerPageResponse.data);
    //       this.props.reduxLoadSigninPage(signinPageResponse.data);
    //       this.props.reduxLoadTeamsPage(teamsPageResponse.data);
    //       this.props.reduxLoadTestimonialsPage(testimonialsPageResponse.data);
    //       this.props.reduxLoadServiceProvidersPage(vendorsPageResponse.data);
    //       this.props.setCommunityActionListInRedux(communityActionList?.data);
    //       this.props.reduxLoadSettings(settings.data);
    //       this.setState({
    //         pagesEnabled: {
    //           aboutUsPage: aboutUsPageResponse.data.is_published,
    //           actionsPage: actionsPageResponse.data.is_published,
    //           contactUsPage: contactUsPageResponse.data.is_published,
    //           donatePage: donatePageResponse.data.is_published,
    //           eventsPage: eventsPageResponse.data.is_published,
    //           impactPage: impactPageResponse.data.is_published,
    //           vendorsPage: vendorsPageResponse.data.is_published,
    //           testimonialsPage: testimonialsPageResponse.data.is_published,
    //           teamsPage: teamsPageResponse.data.is_published,
    //         },
    //         prefix,
    //       });
    //       this.loadMenu(mainMenuResponse.data);
    //       this.checkTourState(mainMenuResponse.data);
    //     })
    //     .catch((err) => {
    //       this.setState({ error: err });
    //       console.log(err);
    //     });

    //   apiCall("events.date.update", body)
    //     .then((json) => {
    //       if (json.success) {
    //       } else {
    //         console.log(json.error);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   Promise.all([
    //     apiCall("actions.list", body),
    //     apiCall("graphs.actions.completed", body),
    //     apiCall("graphs.communities.impact", body),
    //     apiCall("events.list", body),
    //     apiCall("events.exceptions.list", body),
    //     apiCall("policies.list", body),
    //     apiCall("teams.stats", body),
    //     apiCall("tag_collections.list", body),
    //     apiCall("testimonials.list", body),
    //     apiCall("vendors.list", body),
    //     apiCall("data.carbonEquivalency.get", body),
    //     apiCall("communities.list", body),
    //   ])
    //     .then((res) => {
    //       const [
    //         actionsResponse,
    //         actionsCompletedResponse,
    //         communityStatsResponse,
    //         eventsResponse,
    //         eventExceptionsResponse,
    //         policiesResponse,
    //         teamResponse,
    //         tagCollectionsResponse,
    //         testimonialsResponse,
    //         vendorsResponse,
    //         eqResponse,
    //         listOfCommunitiesResponse,
    //       ] = res;
    //       this.props.reduxLoadEvents(eventsResponse.data);
    //       this.props.reduxLoadEventExceptions(eventExceptionsResponse);
    //       this.props.reduxLoadActions(actionsResponse.data);
    //       this.props.reduxLoadServiceProviders(vendorsResponse.data);
    //       this.props.reduxLoadTestimonials(testimonialsResponse.data);
    //       this.props.reduxLoadPolicies(policiesResponse.data);
    //       this.props.reduxLoadTeams(teamResponse.data);
    //       this.props.reduxLoadTagCols(tagCollectionsResponse.data);
    //       this.props.reduxLoadCommunityData(actionsCompletedResponse.data);
    //       this.props.reduxLoadCommunitiesStats(communityStatsResponse.data);
    //       this.props.reduxLoadEquivalences(eqResponse.data);
    //       this.props.reduxLoadCommunities(listOfCommunitiesResponse.data);
    //     })
    //     .catch((err) => {
    //       this.setState({ error: err });
    //       console.log(err);
    //     });
    // }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  prependPrefix(linkObj, prefix) {
    if (!linkObj) return "";
    let { children, link, ...rest } = linkObj;
    if (children && children.length > 0) {
      children = children.map((child) => this.prependPrefix(child, prefix));
    }
    if (!rest?.is_link_external && !link?.startsWith("/")) {
      link = `/${link}`;
    }
    return {
      ...rest,
      link: rest?.is_link_external ? link : `${prefix}${link}`,
      children,
    };
  }

  loadMenu(menus, prefix) {
    if (!menus) {
      console.log("Menus not loaded!");
      return;
    }

    const { content } =
      menus.find((menu) => {
        return menu.name === "PortalMainNavLinks";
      }) || {};
    const initialMenu =
      content?.map((m) => this.prependPrefix(m, prefix)) || [];
    // const finalMenu = this.modifiedMenu(initialMenu);
    const finalMenu = initialMenu;

    this.setState({ navBarMenu: finalMenu });

    const footerContent = menus.filter((menu) => {
      return menu.name === "PortalFooterQuickLinks";
    });
    // const footerLinks = this.addPrefix(footerContent[0].content.links);
    let footerLinks = footerContent[0]?.content?.links || [];

    const communitiesLink = {
      name: "All MassEnergize Community Sites",
      link: URLS.COMMUNITIES, //"http://" + window.location.host,
      special: true,
    };
    footerLinks = footerLinks.map((m) => this.prependPrefix(m, prefix));
    footerLinks.push(communitiesLink);
    this.setState({ footerLinks: footerLinks });
  }

  /**
   * Adds the prefix to the subdomains where possible
   * @param {*} menu
   * @returns
   */
  addPrefix(menu) {
    if (!menu) {
      return [];
    }
    let menus = menu.map((m) => {
      if (
        this.state.prefix !== "" &&
        m.link &&
        !isValidUrl(m.link) &&
        !m.link.startsWith(this.state.prefix)
      ) {
        m.link = `${this.state.prefix}/${m.link}`.replace("//", "/");
      }
      if (m.children && m.children.length > 0) {
        m.children = this.addPrefix(m.children);
      }
      return m;
    });

    return menus;
  }

  saveCurrentPageURL() {
    const currentURL = window.location.href.split("//")[1]; //just remove the "https or http from the url and return the remaining"
    let realRoute = window.location.pathname;
    const queryString = window.location.search;
    if (!currentURL?.includes("signin") && !currentURL?.includes("signup")) {
      if (queryString) {
        realRoute += queryString;
      }
      window.localStorage.setItem("last_visited", realRoute);
    }
  }

  render() {
    const {
      community,
      modalOptions,
      toggleUniversalModal,
      links,
      is_sandbox,
      confettiOptions,
      toastOptions,
      toggleToast,
    } = this.props;
    this.saveCurrentPageURL();
    document.body.style.overflowX = "hidden";

    /* error page if community isn't published */
    if (!community) {
      return (
        <ErrorPage
          errorMessage="Page not found"
          errorDescription="This community page is not accessible.  Please contact the community administrator to resolve the problem."
        />
      );
    }

    const communityInfo = community || {};

    if (!this.state.navBarMenu) {
      return <LoadingCircle />;
    }
    const navBarMenu = this.state.navBarMenu;
    const footerLinks = this.state.footerLinks;
    const footerInfo = {
      name: communityInfo.owner_name,
      phone: communityInfo.owner_phone_number,
      email: communityInfo.owner_email,
    };

    return (
      <>
        <Celebrate {...(confettiOptions || {})} />
        <div className="boxed-wrapper">
          <div className="burger-menu-overlay"></div>
          {is_sandbox && (
            <div className="sandbox-ribbon z-depth-1">
              <small>SANDBOX</small>
            </div>
          )}
          <UniversalModal
            {...(modalOptions || {})}
            close={() =>
              toggleUniversalModal({
                ...(modalOptions || {}),
                show: !modalOptions?.show,
              })
            }
          />
          <METoast
            {...(toastOptions || {})}
            open={toastOptions?.open}
            onClose={() => {
              toggleToast({ open: false, component: null });
              return false;
            }}
            message={toastOptions?.message}
          />
          {/* {Seo({
            title: "",
            description: community.about,
            url: `${window.location.pathname}`,
            image: community.logo && community.logo.url,
            keywords: [],
            updated_at: community.updated_at,
            created_at: community.updated_at,
            tags: [community.name, community.subdomain],
            site_name: community.name,
          })} */}
          <Seo
            title=""
            description={community.about}
            site_name={community.name}
            url={`${window.location.pathname}`}
            image={community.logo && community.logo.url}
            keywords={[]}
            updated_at={community.updated_at}
            created_at={community.updated_at}
            tags={[community.name, community.subdomain]}
          />

          {navBarMenu ? (
            <div>
              <NavBarBurger navLinks={navBarMenu} />
            </div>
          ) : null}
          {
            <Switch>
              {/* ---- This route is a facebook app requirement. -------- */}
              <Route path={`/how-to-delete-my-data`} component={Help} />
              <Route
                exact
                path={`/${community?.subdomain}/c/:pageId`}
                component={RenderCustomPage}
              />
              <Route
                exact
                path={`${links.profile}/password-less/manage`}
                component={ProfilePasswordlessRedirectPage}
              />
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
                // component={OneTestimonialV2}
                component={OneTestimonialPage}
              />
              <Route exact path={links.teams} component={TeamsPage} />
              <Route path={`${links.teams}/:id`} component={OneTeamPage} />
              <Route path={links.impact} component={ImpactPage} />
              <Route path={links.donate} component={DonatePage} />
              <Route exact path={links.events} component={EventsPage} />
              <Route path={`${links.events}/:id`} component={OneEventPage} />
              <Route path={links.signin} component={AuthEntry} />
              <Route path={links.signup} component={AuthEntry} />
              <Route
                exact
                path={`${links.profile}/settings`}
                component={Settings}
              />
              <Route
                exact
                path={`${links.profile}/changes`}
                component={ProfileSettings}
              />
              <Route exact path={links.profile} component={ProfilePage} />
              <Route path={links.policies} component={PoliciesPage} />
              <Route path={links.contactus} component={ContactPage} />
              {/* <Route path={links.rewiring_america} component={RewiringAmerica} /> */}
              <Route
                path={links.rewiring_america}
                component={RewiringAmerica}
              />
              <Route component={HomePage} />
              {/* This was something for completeing registration for invited users, not needed? <Route path="/completeRegistration?" component={RegisterPage} />*/}
            </Switch>
            // )
          }
          {footerLinks ? (
            <Footer footerLinks={footerLinks} footerInfo={footerInfo} />
          ) : null}
          <CookieBanner policyPath={links.policies} />
        </div>
      </>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    __is_custom_site: store.page.__is_custom_site,
    community: store.page.community,
    menu: store.page.menu,
    links: store.links,
    eq: store.page.equivalences,
    showTour: store.page.showTour,
    modalOptions: store.page.modalOptions,
    is_sandbox: store.page.__is_sandbox,
    confettiOptions: store.page.confettiOptions,
    authState: store.authState,
    toastOptions: store.page.toastOptions,
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
  reduxLoadRegisterPage,
  reduxLoadSigninPage,
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
  checkFirebaseAuthentication: subscribeToFirebaseAuthChanges,
  setTourState: reduxSetTourState,
  setCommunityActionListInRedux: reduxLoadCommunityActionList,
  toggleGuestDialog: reduxToggleGuestAuthDialog,
  toggleUniversalModal: reduxToggleUniversalModal,
  reduxLoadSettings,
  setAuthState: setAuthStateAction,
  toggleToast: reduxToggleUniversalToastAction,
  saveCommunityFeatureFlags: reduxSaveFeatureFlagsAction,
};
export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);
