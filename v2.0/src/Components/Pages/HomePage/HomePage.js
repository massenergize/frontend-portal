import React from "react";
import WelcomeImages from "../../Shared/WelcomeImages";
import Graphs from "./Graphs";
import ErrorPage from "./../Errors/ErrorPage";
import IconBoxTable from "./IconBoxTable";
import Events from "./EventHomepageSection";
import Tooltip from "../Widgets/CustomTooltip";
import { connect } from "react-redux";
import { IS_SANDBOX } from "../../../config";
import { getFilterVersionFromURL } from "../../Utils";
import { FILTER_BAR_VERSION } from "../EventsPage/HorizontalFilterBox";

import Tour from 'reactour';
/*'
 * The Home Page of the MassEnergize
 */
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    //first, check if the user has visited the page before - using localStorage
    //if (!localStorage.getItem('repeatUser')) {
    //CONDITION IS FOR TESTING ONLY
    if (1 === 1) {
      //this is the user's first visit to the portal
      //change state to include tour
      console.log('not repeat user');
      this.state = {
        tourIsOpen: true
      };
      console.log('state', this.state);
      localStorage.setItem('repeatUser', true);
    }
    else {
      this.state = {
        tourIsOpen: false
      };
    }
      
    
  }
  componentDidMount() {
    const version = getFilterVersionFromURL(this.props.location);
    if (version) window.sessionStorage.setItem(FILTER_BAR_VERSION, version);
  }
  
  
  render() {

    const steps = [
      {
        selector: '#welcome',
        content: 'Welcome to this MassEnergize community! We are a group of people dedicated to addressing climate change by reducing our greenhouse gas emissions. This portal exists to empower you and your family to fight climate change by providing you with tools, strategies, and resources. By creating an account, you can track how much CO2 you save and participate in community initiatives and events.',
      },
      {
        selector: '#panel', 
        content: "These buttons allow you to engage with the community and take you to different pages of the website."
      }, 
      {
        selector: '#nav-bar', 
        content: "Here is the navigation menu. Let's go to the Actions page. Close out of this popup and click on Actions. (If you're on mobile, click the horizontal bars and then Actions.)"
      }
      // ...
    ];
    if (!this.props.pageData) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Community"
          invalidCommunity
        />
      );
    }
    if (!IS_SANDBOX && !this.props.pageData.is_published) {
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
    console.log('STATE IN RENDER', this.state);
    return (
      <div className="boxed_wrapper">
        <Tour
          accentColor="#8CC43C"
          steps={steps}
          isOpen={this.state.tourIsOpen}
          rounded="20"
          onRequestClose={() => {
            this.setState({
              tourIsOpen: false
            });
          }}
        />
        {welcomeImagesData ? (
          <WelcomeImages  className="welcomeImages" data={welcomeImagesData} title={title} />
        ) : null}
        <div
          style={{ padding: 30, background: "white", color: "#383838" }}
        >
          <div className="text-center">
            {communityDescription ? (
              <Tooltip
                text={communityDescription}
                paperStyle={{ maxWidth: "100vh" }}
              >
                <h4 align="center" className="cool-font mob-font-lg">
                  {communityTagline}
                  <span
                    className="fa fa-info-circle"
                    style={{ color: "#428a36", padding: "5px" }}
                  ></span>
                </h4>
              </Tooltip>
            ) : (
              <h4 align="center" className="cool-font mob-font-lg">
                {communityTagline}
              </h4>
            )}
          </div>
        </div>

        {this.props.pageData.show_featured_links ? (
          <div id="panel"> 
            <IconBoxTable
              className="iconBoxTable"
              title="Get started - See your local options!"
              boxes={iconQuickLinks}
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
  };
};
export default connect(mapStoreToProps, null)(HomePage);
