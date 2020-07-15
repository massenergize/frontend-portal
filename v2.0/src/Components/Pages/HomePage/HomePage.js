import React from "react";
import WelcomeImages from "../../Shared/WelcomeImages";
import Graphs from "./Graphs";
import ErrorPage from "./../Errors/ErrorPage"
import IconBoxTable from "./IconBoxTable";
import Events from "./EventHomepageSection";
import { connect } from "react-redux";

/*
 * The Home Page of the MassEnergize
 */
class HomePage extends React.Component {
  render() {
    if (!this.props.pageData) {
      return <ErrorPage
        errorMessage="Unable to load this Community"
        invalidCommunity
      />
    }
    const comGoals = this.props.pageData ? this.props.pageData.goal : null;
    const communityDescription = this.props.pageData.description;
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
    const title = this.props.pageData ? this.props.pageData.title : "";
    const graphs = [
      {
        title: "Actions Completed",
        data: comGoals
          ? {
            target: comGoals.target_number_of_actions,
            attained:
              comGoals.attained_number_of_actions +
              comGoals.organic_attained_number_of_actions,
          }
          : null,
      },
      {
        title: "Households Engaged",
        data: comGoals
          ? {
            target: comGoals.target_number_of_households,
            attained:
              comGoals.attained_number_of_households +
              comGoals.organic_attained_number_of_households,
          }
          : null,
      },
    ];
    if (comGoals && comGoals.target_carbon_footprint_reduction > 0) {
      graphs.push({
        title: "Carbon Reduction",
        data: comGoals
          ? {
            target: comGoals.target_carbon_footprint_reduction,
            attained:
              comGoals.attained_carbon_footprint_reduction +
              comGoals.organic_attained_carbon_footprint_reduction,
          }
          : null,
      });
    }

    return (
      <div className="boxed_wrapper">
        {welcomeImagesData ?

          <WelcomeImages
            data={welcomeImagesData}
            title={title}
          />
          : null
        }
        <div className="" style={{ padding: 30, background: 'white', color: "#383838" }}>
          <h4 align='center' className="cool-font mob-font-lg">{communityDescription ? communityDescription : "Welcome To Our Page"}</h4>
          {/* <p align='center' className=' col-md-8 col-lg-8 offset-md-2 cool-font ' style={{color:"#383838"}}>We believe that local leaders can engage their communities, but need better tools like fully customizable web platforms and strategies for outreach, networking and empowerment. Most groups just don’t have the bandwidth. But we do.</p> */}
        </div>

        {this.props.pageData.show_featured_links ? (
          <IconBoxTable
            title="Get started - See your local options!"
            boxes={iconQuickLinks}
          />
        ) : null}
        {this.props.pageData.show_featured_stats ? (
          <Graphs graphs={graphs} size={120} goals={comGoals} />
        ) : null}
 
        {this.props.pageData.show_featured_events ? (
          <Events events={events} />
        ) : null}
      </div>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    pageData: store.page.homePage,
    events: store.page.events,
    graphsData: store.page.communityData,
    links: store.links
  };
};
export default connect(mapStoreToProps, null)(HomePage);
