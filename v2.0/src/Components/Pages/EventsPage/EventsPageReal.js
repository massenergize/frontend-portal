import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import PageTitle from "../../Shared/PageTitle";
import LoadingCircle from "../../Shared/LoadingCircle";
// import { Link } from "react-router-dom";
import ErrorPage from "./../Errors/ErrorPage";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
// import CONST from '../../Constants'
import Funnel from "./Funnel";
// import notFound from "./not-found.jpg";
import { dateFormatString } from "../../Utils";
import MECard from "../Widgets/MECard";
// import METextView from "../Widgets/METextView";
import NewEventsCard from './NewEventsCard';
import { apiCall } from "../../../api/functions";
/**
 * Renders the event page
 */
class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      events_search_toggled: false,
      userData: null,
      check_values: null,
      mirror_events: [],
    };
  }
  /**
   * check_values is intentionally "null" to help identify (first time loading, and when all boxes have been unselected)
   * How filtering is done
   * add the tag Ids to "check_values"(states) array as they are selected,
   * loop through events and see which events have tags with those Ids,
   * ( happens in "findCommon")
   * pass the return values into "renderEvents"
   */

  addMeToSelected(tagID) {
    tagID = Number(tagID);
    const arr = this.state.check_values ? this.state.check_values : [];
    if (arr.includes(tagID)) {
      var filtered = arr.filter((item) => item !== tagID);
      this.setState({ check_values: filtered.length === 0 ? null : filtered });
    } else {
      this.setState({ check_values: [tagID, ...arr] });
    }
  }

  handleBoxClick(id) {
    // var id = event.target.value;
    this.addMeToSelected(id);
  }
  findCommon() {
    //everytime there is a change in "check_values",
    //loop through all the events again, and render events
    //with the tag IDs  in "check_values"
    //then pass it on to "renderEvents(...)"
    const events = this.props.events;
    const values = this.state.check_values ? this.state.check_values : [];
    const common = [];
    if (events) {
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        for (let i = 0; i < ev.tags.length; i++) {
          const tag = ev.tags[i];
          //only push events if they arent there already
          if (values.includes(tag.id) && !common.includes(ev)) {
            common.push(ev);
          }
        }
      }
    }
    return common;
  }

  handleSearch = (event) => {
    const value = event.target.value;
    const events = this.props.events;
    const common = [];
    if (value.trim() !== "") {
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        if (ev.name.toLowerCase().includes(value.toLowerCase())) {
          common.push(ev);
        }
      }
      this.setState({ mirror_events: [...common] });
    } else {
      this.setState({ mirror_events: [] });
    }
  };
  renderSideBar() {
    return (
      <div className="blog-sidebar sec-padd">
        <MECard
          className="phone-vanish mob-login-white-cleaner z-depth-float me-anime-open-in"
          style={{
            marginBottom: 10,
            marginTop: 48,
            padding: "45px 14px",
            borderRadius: 15,
          }}
        >
          <h4>Filter by...</h4>
          <Funnel
            type="event"
            boxClick={this.handleBoxClick}
            search={this.handleSearch}
            foundNumber={this.state.mirror_events.length}
          />
        </MECard>
        {/* <div
          className="phone-vanish mob-event-white-cleaner z-depth-float"
          style={{ padding: "45px 13px", borderRadius: 15 }}
        >
          <h4>Filter by...</h4>
        </div> */}
      </div>
    );
  }
  render() {
    
    if (!this.props.events || !this.props.tagCols) {
      return <LoadingCircle />;
    }

    if (!this.props.homePageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Events data"
        />
      );
      
    const found =
      this.state.mirror_events.length > 0
        ? this.state.mirror_events
        : this.findCommon();
    return (
      <>
        <div className="boxed_wrapper" style={{ marginBottom: 70 }}>
          {/* renders the sidebar and events columns */}
          <div className="boxed-wrapper">
            <BreadCrumbBar links={[{ name: "Events" }]} />
            {/* <PageTitle>Events</PageTitle> */}
            <section className="eventlist">
              <div className="container override-container-width">
                <div className="row">
                  <div
                    className="col-lg-3 col-md-3 col-12"
                  
                  >
                    {this.renderSideBar()}
                  </div>
                  <div className="col-lg-9 col-md-9 col-12">
                    <PageTitle>Events and Campaigns</PageTitle>
                    <div
                      className="mob-event-cards-fix outer-box sec-padd event-style2"
                      style={{ paddingTop: 0, marginTop: 9, paddingRight: 40 }}
                    >
                      <div className="row">
                      {this.renderEvents(found)}
                      </div>
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
        <div className="text-center" style={{width:"100%"}}>
          <p className="cool-font">
            {" "}
            Sorry, looks like there are no upcoming events in your community{" "}
          </p>
        </div>
      );
    }
    if (events) {
      return events.map((event) => {
        const body = {
          'event_id': event.id
        }
        
        let rescheduledEvent = {endTime: "", startTime: ""};
        let recurringDetailString = "";
        apiCall('events.exceptions.list', body)
        .then((json) => {
          if (json.success) {
            console.log(json);
            recurringDetailString += "Rescheduled to " + json.data[0].rescheduled_start_time + "- " + json.data[0].rescheduled_end_time;
            rescheduledEvent.startTime = json.data[0].rescheduled_start_time;
            console.log("TYPE", typeof(rescheduledEvent.startTime));
            rescheduledEvent.endTime = json.data[0].rescheduled_end_time;

          } else {
            console.log(json.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
        const dateString = dateFormatString(
          new Date(event.start_date_and_time),
          new Date(event.end_date_and_time)
        );
        
        if (event.is_recurring) {
          if (event.recurring_details.recurring_type == "week") {
            if (event.recurring_details.separation_count == 1) {
              recurringDetailString = `Every ${event.recurring_details.day_of_week}`
            } else {
              recurringDetailString = `Every ${event.recurring_details.separation_count} weeks on ${event.recurring_details.day_of_week}`
            }
          } else if (event.recurring_details.recurring_type == "month") {
            if (event.recurring_details.separation_count == 1) {
              recurringDetailString = `The ${event.recurring_details.week_of_month} ${event.recurring_details.day_of_week} of every month`
            } else {
              recurringDetailString = `Every ${event.recurring_details.separation_count} months on the ${event.recurring_details.week_of_month} ${event.recurring_details.day_of_week}`
            }
          }
          //split the datetime strings to format them and display them in the card
          //startString = rescheduledEvent.event
          console.log(rescheduledEvent);
          /*if (rescheduledEvent != {}) {
            console.log(rescheduledEvent.startTime)
            recurringDetailString += `\nRescheduled to ${rescheduledEvent.startTime}-${rescheduledEvent.endTime}`;
          }*/
        }
        //if (event.name)
        // need to check if event name contains "(rescheduled) at the end; then don't display the card"
          return (
            <div style={{opacity: event.recurring_details.is_cancelled ? 0.5 : 1}} key={event.id.toString()} className="col-md-6 col-lg-6 col-sm-6">
              <p style={{"color":"red"}} >{rescheduledEvent ? "This event has been rescheduled." : ""}</p> 
              <p style={{"color":"red"}} >{event.recurring_details.is_cancelled ? "This event has been cancelled temporarily." : ""}</p> 
              <NewEventsCard {...event} recurringDetailString={recurringDetailString} dateString={dateString} links={this.props.links}/>
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
    events: store.page.events,
    eventRSVPs: store.page.rsvps,
    links: store.links,
    tagCols: store.page.tagCols
      ? store.page.tagCols.filter((col) => {
          return col.name === "Category";
        })
      : null,
  };
};
export default connect(mapStoreToProps, null)(EventsPage);
