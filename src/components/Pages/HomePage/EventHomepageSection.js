import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import defaultImg from "./../../../../src/assets/images/blog/i9.jpg";
import { dateFormatString } from "../../Utils";
import NewEventsCard from "./../EventsPage/NewEventsCard";
import Tooltip from "../Widgets/CustomTooltip";
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
        const dateString = dateFormatString(
          new Date(event.start_date_and_time),
          new Date(event.end_date_and_time)
        );
        return (
          <div
            key={event.id.toString()}
            className="col-md-6 col-lg-4 col-sm-6 col-xs-12"
          >
            <NewEventsCard
              {...event}
              dateString={dateString}
              links={this.props.links}
              body_limit={95}
              user={this.props.user}
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
          {this.props.info ? (
            <Tooltip
              title={this.props.subtitle || "Upcoming Events and Campaigns"}
              text={this.props.info}
              dir="right"
            >
              <h3
                className="cool-font text-center"
                style={{ fontSize: 20, marginBottom: 30 }}
              >
                {this.props.subtitle || "Upcoming Events and Campaigns"}
                <span
                  className="fa fa-info-circle"
                  style={{ color: "#428a36", padding: "5px" }}
                ></span>
              </h3>
            </Tooltip>
          ) : (
            <h3
              className="section-title text-center mob-cancel-title-white"
              style={{ fontSize: 20 }}
            >
              {this.props.subtitle || "Upcoming Events and Campaigns"}
            </h3>
          )}

          <div className="row">
            <div className="col-md-9 col-sm-10 col-xs-12 text-center text-sm-left"></div>
            <div
              style={{ marginLeft: -64 }}
              className="col-md-3 col-sm-2 col-xs-12 text-sm-right"
            ></div>
          </div>
          <div
            className="row mob-helper center-content"
            style={{
              justifyContent: this.props.events?.length > 3 ? "left" : "center",
            }}
          >
            {this.renderEvents()}
          </div>
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
    user: store.user.info,
  };
};
export default connect(mapStoreToProps)(Events);
