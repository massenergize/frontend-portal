import React  from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
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
import Help from "./components/Pages/Help/Help";

import "firebase/auth";

import ErrorPage from "./components/Pages/Errors/ErrorPage";

const AppRouter = () => {
  const { links } = this.props;
  const { subdomain } = this.props.match.params;

  return (
    <Route>
      {
        /**if theres a half finished account the only place a user can go is the register page */
        userHasAnIncompleteRegistration() ? (
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
            <Route path={`${links.services}/:id`} component={OneServicePage} />

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
    </Route>
  );
};

function userHasAnIncompleteRegistration() {
  return (
    (this.state.triedLogin && // we tried to check who this user is
      !this.props.user && // we didnt find a profile
      this.props.auth.uid) || // but we found a firebase userID.  This means they did not finish creating their profile
    (this.props.auth.uid && // firebase userID is created
      !this.props.auth.emailVerified) // but user did not verify their email yet
  );
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    auth: store.firebase.auth,
    menu: store.page.menu,
    links: store.links,
  };
};
const mapDispatchToProps = {};

export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);
