import React from "react";
import WelcomeImages from "../../Shared/WelcomeImages";
import Graphs from "./Graphs";
import ErrorPage from "./../Errors/ErrorPage";
import IconBoxTable from "./IconBoxTable";
import Events from "./EventHomepageSection";
import Tooltip from "../Widgets/CustomTooltip";
import Cookies from 'universal-cookie';
import { connect } from "react-redux";
import { getFilterVersionFromURL } from "../../Utils";
import { FILTER_BAR_VERSION } from "../EventsPage/HorizontalFilterBox";

/*'
 * The Home Page of the MassEnergize
 */
class HomePage extends React.Component {
  componentDidMount() {
    const version = getFilterVersionFromURL(this.props.location);
    if (version) window.sessionStorage.setItem(FILTER_BAR_VERSION, version);

  }

  render() {
    const { __is_custom_site, community } = this.props;
    const { subdomain } =  community || {}

    const prefix = !__is_custom_site && subdomain ? `/${subdomain}` : ''
    
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
    //const header = section(pageData, "HomeHeader");

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
    const cookies = new Cookies();

    cookies.set('myCookie', 'cookie-id-1', { path: '/' });
    console.log(cookies.get('myCookie')); // Pacman

    return (
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
              <Tooltip
                text={communityDescription}
                paperStyle={{ maxWidth: "100vh" }}
              >
                <h4
                  align="center"
                  className="cool-font mob-font-lg me-section-title"
                >
                  {communityTagline}
                  <span
                    className="fa fa-info-circle"
                    style={{ color: "#428a36", padding: "5px" }}
                  ></span>
                </h4>
              </Tooltip>
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
          <IconBoxTable
            title="Get started - See your local options!"
            boxes={iconQuickLinks}
            prefix={prefix}
          />
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
    __is_custom_site: store.page.__is_custom_site
  };
};
export default connect(mapStoreToProps, null)(HomePage);
