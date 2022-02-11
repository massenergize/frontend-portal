import React from "react";
import WelcomeImages from "../../Shared/WelcomeImages";
import Graphs from "./Graphs";
import ErrorPage from "./../Errors/ErrorPage";
import IconBoxTable from "./IconBoxTable";
import Events from "./EventHomepageSection";
import Tooltip from "../Widgets/CustomTooltip";
import { connect } from "react-redux";
import {
  getFilterVersionFromURL,
  handleTourCallback,
  TOUR_STORAGE_KEY,
} from "../../Utils";
import { FILTER_BAR_VERSION } from "../EventsPage/HorizontalFilterBox";
import ProductTour, { ACTIONS, STATUS } from "react-joyride";
import { Link, withRouter } from "react-router-dom";
import {
  FIRST_SET,
  reduxSetTourState,
  SECOND_SET,
} from "../../../redux/actions/pageActions";

/*'
 * The Home Page of the MassEnergize
 */
class HomePage extends React.Component {
  componentDidMount() {
    const version = getFilterVersionFromURL(this.props.location);
    if (version) window.sessionStorage.setItem(FILTER_BAR_VERSION, version);
  }

  closeTourCompletely() {
    const { setTourValueInRedux } = this.props;
    setTourValueInRedux(false);
    window.localStorage.setItem(TOUR_STORAGE_KEY, false);
  }
  tourCallback = (data) => {
    const { history, links } = this.props;

    handleTourCallback(data, ({ action, index, status, step }) => {
      const userHasGoneFullCircle =
        step?.identifier === "the-end" &&
        action === ACTIONS.NEXT &&
        status === STATUS.FINISHED;

      if (action === ACTIONS.CLOSE || userHasGoneFullCircle)
        return this.closeTourCompletely();

      if (ACTIONS.NEXT === action && index === 1 && STATUS.FINISHED === status)
        history.push(links?.actions); // This is triggered when user presses enter on "got it" instead of clicking
    });
  };

  render() {
    const { showTour, tourInfo } = this.props;
    const { __is_custom_site, community } = this.props;
    const { subdomain } = community || {};

    const prefix = !__is_custom_site && subdomain ? `/${subdomain}` : "";

    if (!this.props.pageData) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Community"
          invalidCommunity
        />
      );
    }
    const is_sandbox = this.props.is_sandbox;
    if (!is_sandbox && !this.props.pageData.is_published) {
      return (
        <ErrorPage
          errorMessage="Sorry, your community isn't live at the moment."
          invalidCommunity
        />
      );
    }
    const title = this.props.pageData ? this.props.pageData.title : "";

    // switching Tagline from description to sub_title (if filled), to use description for description
    const communityTagline =
      this.props.pageData.sub_title || this.props.pageData.description;
    // description now will show on hover if filled
    const communityDescription =
      this.props.pageData.description.length > 1 &&
      communityTagline !== this.props.pageData.description
        ? this.props.pageData.description
        : null;
    const events = this.props.pageData
      ? this.props.pageData.featured_events
      : [];
    const welcomeImagesData = this.props.pageData
      ? this.props.pageData.images
      : [];
    const iconQuickLinks = this.props.pageData
      ? this.props.pageData.featured_links
      : [];

    const goals = this.props.community ? this.props.community.goal : null;
    // Note: these titles aren't used - defined in Graphs
    const graphs = [
      {
        title: "Actions Completed",
      },
      {
        title: "Households Engaged",
      },
    ];
    if (goals && goals.target_carbon_footprint_reduction > 0) {
      graphs.push({
        title: "Carbon Reduction",
      });
    }

    const about_community = `${this.props.community.about_community}`;
    const community_name = `${this.props.community.name}`;
    const actionName = iconQuickLinks
      .filter((e) => e.link === "/actions")
      .map((e) => e.title);

    const firstSet = [
      {
        target: "body",
        title: (
          <strong style={{ fontSize: 16 }}>Welcome to {community_name}</strong>
        ),
        content: (
          <div>
            {about_community}
            <br />
            This website is where you and your neighbors can take climate action
            together. There’s so much YOU can do, so let us show you around!{" "}
            {""}It’ll take only two minutes.
          </div>
        ),
        locale: {
          next: <span>Show me!</span>,
          skip: <span>Skip Tour</span>,
        },
        placement: "center",
        disableBeacon: true,
        disableOverlayClose: true,
      },
      {
        target: ".icon-panel",
        title: (
          <strong style={{ fontSize: 16 }}>
            Start taking action right away!
          </strong>
        ),
        content: (
          <>
            These 4 buttons take you places. The one called "{actionName}" will
            show you many good actions to take.
          </>
        ),
        locale: {
          skip: <span>Skip Tour</span>,
          last: (
            <Link style={{ color: "white" }} to={this.props.links.actions}>
              Got it!
            </Link>
          ),
        },
        placement: "auto",
        disableBeacon: true,
        spotlightClicks: false,
        disableOverlayClose: true,
      },
    ];
    const secondSet = [
      {
        target: ".tour-graph-pointer",
        content:
          "When you take an action, your household and action are added to the community total!",
        locale: {
          next: <span>Got it!</span>,
          skip: <span>Skip Tour</span>,
        },
        placement: "auto",
        disableBeacon: true,
        disableOverlayClose: true,
        disableScrolling: false,
      },
      {
        target: ".new-sign-in",
        title: (
          <strong style={{ fontSize: 16 }}>It only takes a minute!</strong>
        ),
        content:
          "Join our community, so that you can join teams, and your actions can be counted. Only your email is needed!",
        locale: {
          skip: <span>Skip Tour</span>,
          last: <span style={{ color: "white" }}>Got it!</span>,
        },
        spotlightPadding: 20,
        placement: "bottom-end",
        disableBeacon: true,
        spotlightClicks: false,
        disableOverlayClose: true,
        disableScrolling: false,
        identifier: "the-end",
      },
    ];

    var steps = { [FIRST_SET]: firstSet, [SECOND_SET]: secondSet };

    return (
      <>
        {showTour && (
          <ProductTour
            steps={steps[tourInfo.stage]}
            continuous
            showSkipButton
            callback={this.tourCallback}
            spotlightPadding={-70}
            disableScrolling={true}
            styles={{
              options: {
                arrowColor: "#eee",
                backgroundColor: "#eee",
                primaryColor: "#8CC43C",
                textColor: "black",
                width: 400,
                zIndex: 1000,
              },
            }}
          />
        )}

        <div className="boxed_wrapper">
          {welcomeImagesData ? (
            <WelcomeImages data={welcomeImagesData} title={title} />
          ) : null}
          <div
            className=""
            style={{ padding: 30, background: "white", color: "#383838" }}
          >
            <div className="text-center">
              {communityDescription ? (
                <>
                  <Tooltip text={communityDescription} placement="top">
                    <h4
                      align="center"
                      className="cool-font mob-font-lg me-section-title"
                    >
                      {communityTagline}
                      <span
                        className="fa fa-info-circle"
                        style={{ color: "#428a36", padding: "5px" }}
                      />
                    </h4>
                  </Tooltip>
                </>
              ) : (
                <h4
                  align="center"
                  className="cool-font mob-font-lg me-section-title"
                >
                  {communityTagline}
                </h4>
              )}
            </div>
          </div>

          {this.props.pageData.show_featured_links ? (
            <div className="icon-panel">
              <IconBoxTable
                title="Get started - See your local options!"
                boxes={iconQuickLinks}
                prefix={prefix}
              />
            </div>
          ) : null}
          {this.props.pageData.show_featured_stats ? (
            <Graphs
              graphs={graphs}
              size={120}
              goals={goals}
              subtitle={this.props.pageData.featured_stats_subtitle}
              info={this.props.pageData.featured_stats_description}
            />
          ) : null}

          {this.props.pageData.show_featured_events ? (
            <Events
              events={events}
              subtitle={this.props.pageData.featured_events_subtitle}
              info={this.props.pageData.featured_events_description}
            />
          ) : null}
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    pageData: store.page.homePage,
    events: store.page.events,
    communityData: store.page.communityData,
    community: store.page.community,
    links: store.links,
    is_sandbox: store.page.__is_sandbox,
    __is_custom_site: store.page.__is_custom_site,
    showTour: store.page.showTour,
    tourInfo: store.page.tourInfo,
  };
};

export default connect(mapStoreToProps, {
  setTourValueInRedux: reduxSetTourState,
})(withRouter(HomePage));
