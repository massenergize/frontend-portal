import React, { Component } from "react";
import photo from "./not-found.jpg";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";
import * as moment from "moment";
import MEAnimation from "../../Shared/Classes/MEAnimation";
// import Dropdown from "react-bootstrap/Dropdown";
// import { ButtonGroup } from "react-bootstrap";
import { apiCall } from "../../../api/functions";
import { Link } from "react-router-dom";
import MELightDropDown from "../Widgets/MELightDropDown";
export default class NewEventsCard extends Component {
  constructor(props) {
    super(props);
    this.handleReadMore = this.handleReadMore.bind(this);
    this.RSVPInterested = this.RSVPInterested.bind(this);
    this.RSVPGoing = this.RSVPGoing.bind(this);
    this.RSVPNotGoing = this.RSVPNotGoing.bind(this);

    this.state = {
      img: null,
      rsvpStatus: null,
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

  RSVPGoing() {
    apiCall("events.rsvp.update", {
      event_id: this.props.id,
      status: "RSVP",
    }).then((json) => {
      if (json.success) {
        this.getRSVPStatus();
      } else {
        //          TODO: notify about error?
      }
    });
  }

  RSVPInterested() {
    apiCall("events.rsvp.update", {
      event_id: this.props.id,
      status: "Interested",
    }).then((json) => {
      if (json.success) {
        this.getRSVPStatus();
      } else {
        //          TODO: notify about error
      }
    });
  }

  RSVPNotGoing() {
    apiCall("events.rsvp.remove", { event_id: this.props.id }).then((json) => {
      if (json.success) {
        this.getRSVPStatus();
      } else {
        //          TODO: notify about error
      }
    });
  }

  handleEventRsvpChange() {
    // nothing happening here for now
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
    document.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName.toLowerCase() !== "img") return;
        e.target.src = photo;
        e.target.alt = "The real img is missing, this is a default image";
      },
      true
    );
    this.getRSVPStatus();
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
  renderNewCardDesign() {
    var { className, dateString, id, recurringDetailString } = this.props;
    // const style = {
    //   borderTop: "5px solid #8dc63f",
    //   borderRadius: "0",
    //   padding: "0",
    //   minwidth: "100px",
    // };
    return (
      <div>
        <MECard
          style={{
            padding: 0,
            position: "relative",
            borderRadius: 15,
            background: "white",
          }}
          className={`${MEAnimation.getAnimationClass()} ${className}`}
        >
          <Link
            to={`${this.props.links.events + "/" + id}`}
            style={{ width: "100%" }}
          >
            <img
              src={this.getPhoto()}
              className="new-me-testimonial-img"
              alt="event media"
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
            >
              {this.getEventTitle()}
              {/* <i
              className="fa fa-long-arrow-right"
              style={{ marginLeft: 6, fontSize: 23 }}
            ></i> */}
            </h1>
          </Link>

          <div className="bottom-date-area">
            <div style={{ padding: 13 }}>
              <span className="date-string">{dateString}</span>
              <br />
              {recurringDetailString && (
                <METextView type="small" style={{ color: "green" }}>
                  {recurringDetailString}
                </METextView>
              )}
            </div>

            <div style={{ marginLeft: "auto" }}>
              <MELightDropDown
                animate={false}
                customAnimation="rsvp-drop-anime"
                controlLabel={true}
                label="RSVP"
                labelClassNames="me-rsvp-btn z-depth-float"
              />
            </div>
            {/* <div className="me-rsvp-btn z-depth-float">
              RSVP <i className="fa fa-caret-down"></i>
            </div> */}
          </div>
        </MECard>
        {/* <div style={{ float: "right" }}>
          <Dropdown
            as={ButtonGroup}
            onSelect={(e) => this.handleEventRsvpChange(e)}
          >
            {
              //modify the default to be whether the user has RSVPed to the event or not
              true ? "" : "nope"
            }
            <Dropdown.Toggle id="dropdown-basic">
              {this.state.rsvpStatus || "RSVP?"}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={style}
              className="me-dropdown-theme me-anime-show-up-from-top z-depth-1"
            >
              <Dropdown.Item onClick={this.RSVPInterested}>
                Interested
              </Dropdown.Item>
              <Dropdown.Item onClick={this.RSVPGoing}>Going</Dropdown.Item>
              <Dropdown.Item onClick={this.RSVPNotGoing}>
                Not Going
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> */}
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
};
