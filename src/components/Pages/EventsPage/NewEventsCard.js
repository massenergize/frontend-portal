import React, { Component } from "react";
import photo from "./not-found.jpg";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";
import * as moment from "moment";
import MEAnimation from "../../Shared/Classes/MEAnimation";
import { apiCall } from "../../../api/functions";
import { Link } from "react-router-dom";
import MELightDropDown from "../Widgets/MELightDropDown";
import { makeStringFromArrOfObjects } from "../../Utils";
import { isMobile } from "react-device-detect";
export const RSVP_STATUS = {
  GOING: "Going",
  INTERESTED: "Interested",
  NOT_GOING: "Not Going",
  RSVP: "RSVP",
};
export default class NewEventsCard extends Component {
  constructor(props) {
    super(props);
    this.handleReadMore = this.handleReadMore.bind(this);
    this.itemSelected = this.itemSelected.bind(this);
    this.getRSVPStatus = this.getRSVPStatus.bind(this);

    this.state = {
      img: null,
      pastEvent: null,
      rsvpStatus: null,
      loading: false,
      error: null,
    };
  }

  getPhoto() {
    const { image } = this.props;
    if (image && image.url) return image.url;
    return photo;
  }

  getBody() {
    var body = this.props.featured_summary;
    var limit = this.props.body_limit;
    const id = this.props.id;
    if (body && body.length > limit) {
      return (
        <>
          {body.slice(0, 90) + "..."}
          <MELink
            to={`${this.props.links.events + "/" + id}`}
            style={{ marginLeft: 6 }}
          >
            {" "}
            Read more
          </MELink>
        </>
      );
    }
    return body;
  }

  updateRSVP(status) {
    if (status === MELightDropDown.NONE) return;
    const LINK =
      status === RSVP_STATUS.NOT_GOING
        ? "events.rsvp.remove"
        : "events.rsvp.update";
    this.setState({ loading: true });
    apiCall(LINK, {
      event_id: this.props.id,
      status: status,
    }).then((json) => {
      if (json.success) {
        this.setState({
          rsvpStatus: json.data?.status,
          loading: false,
          error: null,
        });
      } else {
        console.log("RSVP Error::", json.error);
        this.setState({ error: json.error?.toString(), loading: false });
      }
    });
  }

  getRSVPStatus() {
    apiCall("events.rsvp.get", { event_id: this.props.id }).then((json) => {
      if (json.success) {
        const rsvp_status = json.data;
        if (rsvp_status) {
          const rsvpStatus =
            rsvp_status.status === "RSVP" ? "Going" : rsvp_status.status;
          this.setState({ rsvpStatus: rsvpStatus });
        } else {
          this.setState({ rsvpStatus: null });
        }
      } else {
        console.log("failed to get event rsvp status");
      }
    });
  }

  componentDidMount() {
    const rightNow = moment().format();
    const pastEvent = rightNow > this.props.start_date_and_time;
    this.setState({ pastEvent: pastEvent });
    if (!pastEvent && this.props.user) this.getRSVPStatus(); // @TODO We need to take a look at why we are doing this here(maybe restructure recurring events if need be?). (What if a community has 150 events...? 150 requests to the backend everytime we visit the all events )
  }

  handleReadMore(e) {
    e.preventDefault();
    const { id, file, date, user, title, body } = this.props;
    const params = {
      id,
      content: {
        image: file,
        title: title,
        desc: body,
        user: user.preferred_name,
        date: date,
      },
    };
    this.props.readMore(params);
  }
  getFormatedTime(created_at) {
    const format = "MMM, Do YYYY";
    const date = moment(created_at).format(format);
    return date;
  }

  getEventTitle() {
    var { name } = this.props;
    if (name.length > 48) return name.substr(0, 48) + "...";
    return name;
  }

  itemSelected(status) {
    this.updateRSVP(status);
  }
  renderNewCardDesign() {
    var {
      className,
      dateString,
      id,
      recurringDetailString,
      user,
      links,
      customDropAnimation,
      dropDirection,
      rsvp_enabled,
      tags,
      toggleGuestAuthDialog,
    } = this.props;

    const { rsvpStatus, loading, error } = this.state;
    const title = this.getEventTitle();
    return (
      <div
        data-tag-names={makeStringFromArrOfObjects(tags, (e) => e.name)}
        className="test-one-event-card"
        data-is-logged-in={this.props.user}
        data-rsvp-status={this.state.rsvpStatus}
      >
        <MECard
          style={{
            padding: 0,
            position: "relative",
            borderRadius: 15,
            background: "white",
          }}
          className={`${MEAnimation.getAnimationClass()} ${className} ${
            isMobile && "z-depth-1"
          }`}
        >
          <Link to={`${links.events + "/" + id}`} style={{ width: "100%" }} className="test-one-event-card-clickable">
            <img
              src={this.getPhoto()}
              className="new-me-testimonial-img"
              alt="event media"
              onError={() => photo}
            />
            <h1
              style={{
                fontSize: 17,
                fontWeight: "bold",
                padding: "6px 18px",
                minHeight: 52,
                display: "flex",
                alignItems: "center",
              }}
              className="test-event-card-title"
              data-event-title={title}
            >
              {title}
            </h1>
          </Link>

          <div className="bottom-date-area">
            <div style={{ padding: 13 }}>
              <span className="date-string">{dateString}</span>
              <br />
              {!user && rsvp_enabled && (
                <>
                  <small style={{ fontSize: "90%" }}>
                    <Link
                      className="test-sign-in-to-rsvp"
                      to={links.signin}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleGuestAuthDialog(true);
                      }}
                    >
                      Sign In to RSVP
                    </Link>
                  </small>
                  <br />
                </>
              )}

              {recurringDetailString && (
                <METextView type="small" style={{ color: "green" }}>
                  {recurringDetailString}
                </METextView>
              )}
            </div>

            {user && rsvp_enabled && !this.state.pastEvent && (
              <div style={{ marginLeft: "auto" }}>
                <MELightDropDown
                  direction={dropDirection}
                  onItemSelected={this.itemSelected}
                  animate={false}
                  customAnimation={customDropAnimation || "rsvp-drop-anime"}
                  controlLabel={true}
                  label={
                    (loading && <i className="fa fa-spinner fa-spin"></i>) ||
                    rsvpStatus ||
                    "RSVP"
                  }
                  labelClassNames="me-rsvp-btn z-depth-float test-card-rsvp-toggler"
                  data={[
                    RSVP_STATUS.INTERESTED,
                    RSVP_STATUS.GOING,
                    RSVP_STATUS.NOT_GOING,
                  ]}
                />
              </div>
            )}
          </div>
        </MECard>
        {error && (
          <small style={{ color: "red" }} className="test-rsvp-error">
            Sorry, couldnt perform task: {error}
          </small>
        )}
        {/* ---- Just used as a confirmation div when testing rsvp-ing  (Is not shown to the end user) ----- */}
        {this.state.rsvpStatus && (
          <div className="test-rsvp-status-div" style={{ opacity: 0 }}>
            {this.state.rsvpStatus}
          </div>
        )}
      </div>
    );
  }
  render() {
    return this.renderNewCardDesign();
  }
}

NewEventsCard.defaultProps = {
  body: "This is some more information about this event. This is the default text...",
  preferred_name: "Anonymous",
  action: {},
  created_at: "1st January 2020",
  links: {},
  name: "New Event",
  body_limit: 150,
  dropDirection: "down",
};
