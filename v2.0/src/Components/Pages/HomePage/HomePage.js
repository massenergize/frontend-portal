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

import { Steps, Hints } from "intro.js-react";
import "./tour.css";

/*'
 * The Home Page of the MassEnergize
 */
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    //first, check if the user has visited the page before - using localStorage
    /*if (!localStorage.getItem('repeatUser')) {
      //this is the user's first visit to the portal
      //change state to include tour
      this.state = {
        stepsEnabled: true, 
        initialStep: 0, 
        steps: [
          {
            element: ".iconBoxTable", 
            intro: "Icon Box Table", 
          },
          {
            element: ".welcomeImages",
            intro: "World step"
          }
        ],
        hintsEnabled: true,
        hints: []
      };
      localStorage.setItem('repeatUser', true);
    } else {
      //this is not the user's first visit to the website
      //state is empty - no tour
      this.state = {
        stepsEnabled: false,
        steps:[],
        hintsEnabled: false, 
        hints:[]
      };
    }*/
    //testing only
    this.state = {
      stepsEnabled: true, 
      initialStep: 0, 
      steps: [
        {
          element: ".iconBoxTable", 
          intro: "Icon Box Table", 
        },
        {
          element: ".welcomeImages",
          intro: "World step"
        }
      ],
      hintsEnabled: true,
      hints: []
    };
  }
  componentDidMount() {
    const version = getFilterVersionFromURL(this.props.location);
    if (version) window.sessionStorage.setItem(FILTER_BAR_VERSION, version);
  }
  onExit = () => {
    this.setState(() => ({ stepsEnabled: false }));
  };
  toggleSteps = () => {
    this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
  };
  addStep = () => {
    const newStep = {
      element: ".alive",
      intro: "Alive step"
    };
    this.setState(prevState => ({ steps: [...prevState.steps, newStep] }));
  };
  toggleHints = () => {
    this.setState(prevState => ({ hintsEnabled: !prevState.hintsEnabled }));
  };
  addHint = () => {
    const newHint = {
      element: ".alive",
      hint: "Alive hint",
      hintPosition: "middle-right"
    };
  }
  render() {
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
    const graphs = [
      {
        title: "Actions Completed",
        data: goals
          ? {
              target: goals.target_number_of_actions,
              attained:
                goals.attained_number_of_actions +
                goals.organic_attained_number_of_actions,
            }
          : null,
      },
      {
        title: "Households Engaged",
        data: goals
          ? {
              target: goals.target_number_of_households,
              attained:
                goals.attained_number_of_households +
                goals.organic_attained_number_of_households,
            }
          : null,
      },
    ];
    if (goals && goals.target_carbon_footprint_reduction > 0) {
      graphs.push({
        title: "Carbon Reduction",
        data: goals
          ? {
              target: goals.target_carbon_footprint_reduction,
              attained:
                goals.attained_carbon_footprint_reduction +
                goals.organic_attained_carbon_footprint_reduction,
            }
          : null,
      });
    }
    const {
      stepsEnabled,
      steps,
      initialStep, 
      hintsEnabled, 
      hints
    } = this.state;
    return (
      <div className="boxed_wrapper">
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={initialStep}
          onExit={this.onExit}
        />
        <Hints enabled={hintsEnabled} hints={hints} />
        {welcomeImagesData ? (
          <WelcomeImages  className="welcomeImages" data={welcomeImagesData} title={title} />
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
          <IconBoxTable
            className="iconBoxTable"
            title="Get started - See your local options!"
            boxes={iconQuickLinks}
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
  };
};
export default connect(mapStoreToProps, null)(HomePage);
