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
import { apiCall } from "../../../api/functions";
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
      rescheduledEvents: []
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
      const page = events.map((event) => {
        let recurringDetailString = "";
        const dateString = dateFormatString(
          new Date(event.start_date_and_time),
          new Date(event.end_date_and_time)
        );
        if (event.is_recurring) {
          
          if (event.recurring_details.recurring_type === "week") {
            if (event.recurring_details.separation_count === 1) {
              recurringDetailString = `Every ${event.recurring_details.day_of_week}`
            } else {
              recurringDetailString = `Every ${event.recurring_details.separation_count} weeks on ${event.recurring_details.day_of_week}`
            }
          } else if (event.recurring_details.recurring_type === "month") {
            if (event.recurring_details.separation_count === 1) {
              recurringDetailString = `The ${event.recurring_details.week_of_month} ${event.recurring_details.day_of_week} of every month`
            } else {
              recurringDetailString = `Every ${event.recurring_details.separation_count} months on the ${event.recurring_details.week_of_month} ${event.recurring_details.day_of_week}`
            }
          }
          //can optimize this by only making the api call if the date is before today's date
          apiCall('events.date.update', {'event_id': event.id })
          .then((json) => {
            if (json.success) {
              console.log(json);
            }else {
              console.log(json.error);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          apiCall('events.exceptions.list', {'event_id': event.id })
          .then((json) => {
            if (json.success) {
              //jsondata[0]returns the event id - since the simple_json() function in the recurring..exception model returns the id
              if (json.data[0] && json.data[0].event ) {
                const id = json.data[0].event;
                if (this.state.rescheduledEvents.indexOf(json.data[0].event) === -1) {
                  this.setState({ rescheduledEvents: [...this.state.rescheduledEvents, id]});
                }
              }              
            } else {
              console.log(json.error);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
        
        return (
          // can we format the cancelled message to be an overlay instead of going above?
          <div style={{opacity: (event.recurring_details && event.recurring_details.is_cancelled)||(this.state.rescheduledEvents && this.state.rescheduledEvents.indexOf(event.id) > -1) ? 0.3 : 1}} key={event.id.toString()} className="col-md-6 col-lg-6 col-sm-6">
            <p style={{"color":"red"}} >{event.recurring_details && event.recurring_details.is_cancelled ? "This event has been cancelled temporarily." : ""}</p> 
            <p style={{"color":"red"}}>{this.state.rescheduledEvents && this.state.rescheduledEvents.indexOf(event.id) > -1 ? "This event has been rescheduled temporarily. See the rescheduled event.":""} </p>
            <NewEventsCard {...event} recurringDetailString={recurringDetailString} dateString={dateString} links={this.props.links}/>
          </div>
        );
          
          
      });
      
      return page; 
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

  getRescheduled(event_id) {
    apiCall('events.exceptions.list', {'event_id': event_id })
    .then((json) => {
      if (json.success) {
        console.log('rescheduled event in function!', json);
        return json;
      } else {
        console.log(json.error);
        return json.error;
      }
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
    
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
