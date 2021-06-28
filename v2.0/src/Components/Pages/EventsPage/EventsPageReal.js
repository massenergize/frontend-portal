import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import PageTitle from "../../Shared/PageTitle";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "./../Errors/ErrorPage";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import {
  dateFormatString,
  filterTagCollections,
  applyTagsAndGetContent,
  searchIsActiveFindContent,
} from "../../Utils";
import NewEventsCard from "./NewEventsCard";
import HorizontalFilterBox from "./HorizontalFilterBox";
import { NONE } from "../Widgets/MELightDropDown";
import Tooltip from "../Widgets/CustomTooltip";
// import CONST from '../../Constants'
// import Funnel from "./Funnel";
// import notFound from "./not-found.jpg";
// import MECard from "../Widgets/MECard";
// import METextView from "../Widgets/METextView";

/**
 * Renders the event page
 */
class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    // this.handleBoxClick = this.handleBoxClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      events_search_toggled: false,
      userData: null,
      checked_values: null,
      mirror_events: [],
      searchText: null,
    };
    this.addMeToSelected = this.addMeToSelected.bind(this);
  }
  addMeToSelected(param, reset = false) {
    if (reset) return this.setState({ checked_values: null });
    var arr = this.state.checked_values ? this.state.checked_values : [];
    // remove previously selected tag of selected category and put the new one
    arr = arr.filter((item) => item.collectionName !== param.collectionName);
    if (!param || param.value !== NONE) arr.push(param);
    this.setState({ checked_values: arr });
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({ searchText: e.target.value });
  }

  searchIsActiveSoFindContentThatMatch() {
    return searchIsActiveFindContent(
      this.props.events,
      this.state.checked_values,
      this.state.searchText,
      (event, word) =>
        event.name.toLowerCase().includes(word) ||
        event.description.toLowerCase().includes(word) ||
        event.featured_summary.toLowerCase().includes(word)
    );
  }

  render() {
    const pageData = this.props.pageData;
    if (pageData == null) return <LoadingCircle />;

    if (!this.props.events || !this.props.tagCols) {
      return <LoadingCircle />;
    }

    const title =
      pageData && pageData.title ? pageData.title : "Events and Campaigns";
    const sub_title =
      pageData && pageData.sub_title ? pageData.sub_title : null;
    const description = pageData.description ? pageData.description : null;

    if (!this.props.homePageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Events data"
        />
      );

    const found =
      this.searchIsActiveSoFindContentThatMatch() ||
      applyTagsAndGetContent(this.props.events, this.state.checked_values);
    return (
      <>
        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          {/* renders the sidebar and events columns */}
          <div className="boxed-wrapper">
            <BreadCrumbBar links={[{ name: "Events" }]} />
            {/* <PageTitle>Events</PageTitle> */}
            <section className="eventlist">
              <div className="container override-container-width">
                <div className="row">
                  {/* <div
                    className="col-lg-3 col-md-3 col-12"
                  
                  >
                    {this.renderSideBar()}
                  </div> */}
                  <div className="col-lg-10 col-md-10 col-12 offset-md-1">
                    <div style={{ marginBottom: 30 }}>
                      <div className="text-center">
                        {description ? (
                          <Tooltip
                            text={description}
                            paperStyle={{ maxWidth: "100vh" }}
                          >
                            <PageTitle style={{ fontSize: 24 }}>
                              {title}
                              <span
                                className="fa fa-info-circle"
                                style={{ color: "#428a36", padding: "5px" }}
                              ></span>
                            </PageTitle>
                          </Tooltip>
                        ) : (
                          <PageTitle style={{ fontSize: 24 }}>
                            {title}
                          </PageTitle>
                        )}
                      </div>
                      <center>{sub_title ? <p>{sub_title}</p> : null}</center>
                    </div>
                    <HorizontalFilterBox
                      type="events"
                      tagCols={this.props.tagCols}
                      boxClick={this.addMeToSelected}
                      search={this.handleSearch}
                    />

                    <div
                      className="mob-event-cards-fix outer-box sec-padd event-style2 phone-marg-top-90"
                      style={{ paddingTop: 0, marginTop: 9, paddingRight: 40 }}
                    >
                      <div className="row">{this.renderEvents(found)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  /**
   * @param events - json list of events
   */
  renderEvents(events) {
    //when mirror_events.length ===0, it means no one is searching,so go on to check if
    //someone if user is using check_values
    //if check_values ===null, then it means it is probably the first time the user
    //is loading the page, so show everything from props
    if (this.state.mirror_events.length === 0) {
      events = this.state.check_values === null ? this.props.events : events;
    }
    if (this.props.events.length === 0) {
      return (
        <div className="text-center" style={{ width: "100%" }}>
          <p className="cool-font">
            {" "}
            Sorry, looks like there are no upcoming events in your community{" "}
          </p>
        </div>
      );
    }

    if (events) {
      return events.map((event) => {
        const dateString = dateFormatString(
          new Date(event.start_date_and_time),
          new Date(event.end_date_and_time)
        );

        return (
          <div key={event.id.toString()} className="col-md-6 col-lg-6 col-sm-6">
            <NewEventsCard
              {...event}
              dateString={dateString}
              links={this.props.links}
            />
          </div>
        );
      });
    }
  }

  userRSVP(event_id) {
    if (!this.props.user || !this.props.eventRSVPs) return null;
    const RSVPs = this.props.eventRSVPs.filter((rsvp) => {
      return (
        rsvp.attendee.id === this.props.user.id && rsvp.event.id === event_id
      );
    });
    if (RSVPs.length < 1) return null;
    return RSVPs[0];
  }
}

const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePage,
    collection: store.page.collection,
    auth: store.firebase.auth,
    user: store.user.info,
    pageData: store.page.eventsPage,
    events: store.page.events,
    eventRSVPs: store.page.rsvps,
    links: store.links,
    tagCols: filterTagCollections(store.page.events, store.page.tagCols),
  };
};
export default connect(mapStoreToProps, null)(EventsPage);
