import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import defaultImg from "./../../../../src/assets/images/blog/i9.jpg";
import { dateFormatString, locationFormatJSX } from "../../Utils";
import NewEventsCard from "./../EventsPage/NewEventsCard";

/**
 * Events section displays upcoming events,
 * @props
    events: list of the events to show
        title
        time
        day
        month
        year
        link //may need to rethink this/do it more like actions so it links to a single event view by id
        image
        organizer
        address
        //may need to add in id
 */

class Events extends React.Component {
  renderEvents() {
    const events = this.props.events;

    if (!events) {
      return (
        <div>
          <p>
            No upcoming events. See{" "}
            <Link to={this.props.links.events}>all events</Link>{" "}
          </p>
        </div>
      );
    }
    if (events.length !== 0) {
      return events.map((event, index) => {
        const ev_name =
          event.name.length > 40
            ? event.name.substring(0, 35) + "..."
            : event.name;
        const dateString = dateFormatString(
          new Date(event.start_date_and_time),
          new Date(event.end_date_and_time)
        );

        const location = event.location;
        const img = event.image && event.image.url ? event.image.url : defaultImg;
    
        return (
          <div key={event.id.toString()} className="col-md-6 col-lg-4 col-sm-6 col-xs-12">
            <NewEventsCard
              {...event}
              dateString={dateString}
              links={this.props.links}
              body_limit={95}
            />
          </div>
        );
      });
    } else {
      return (
        <div style={{ width: "100%", marginTop: 10 }}>
          <center>
            <p>
              No upcoming events. See{" "}
              <Link to={this.props.links.events}>all events</Link>{" "}
            </p>
          </center>
        </div>
      );
    }
  }
  render() {
    return (
      <section
        className="event-style1 mob-event-section"
        style={{ background: "white" }}
      >
        <div className="container">
          <h3 className="cool-font text-center" style={{ fontSize: 20 }}>
            Upcoming Events and Campaigns
          </h3>
          <div className="row">
            <div className="col-md-9 col-sm-10 col-xs-12 text-center text-sm-left">
              {/* <div className="section-title m-0">
                <h3 className="cool-font">Upcoming Events</h3>
              </div> */}
            </div>
            <div
              style={{ marginLeft: -64 }}
              className="col-md-3 col-sm-2 col-xs-12 text-sm-right"
            >
              {/* <div className="pull-right">  */}
              {/* <Link to={`${this.props.links.events}`} className="cool-font thm-btn mb-4 btn-finishing raise pull-right float-right mob-btn-left-fix">All Events</Link> */}
            </div>
          </div>
          <div className="row mob-helper">{this.renderEvents()}</div>
          {this.props.events.length !== 0 ? (
            <center>
              <Link
                to={`${this.props.links.events}`}
                className="homepage-all-events-btn round-me z-depth-1"
              >
                See All Events
              </Link>
            </center>
          ) : null}
        </div>
      </section>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    links: store.links,
  };
};
export default connect(mapStoreToProps)(Events);
