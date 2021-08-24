import React, { Component } from "react";
import photo from "./not-found.jpg";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";
import * as moment from "moment";
import MEAnimation from "../../Shared/Classes/MEAnimation";
import Dropdown from "react-bootstrap/Dropdown";
import { ButtonGroup } from 'react-bootstrap'
import { apiCall } from "../../../api/functions";
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
    apiCall('events.rsvp.update',{ event_id: this.props.id, status: "RSVP" }).then(json => {
      if (json.success) {
        this.getRSVPStatus();
      } 
      else {
//          TODO: notify about error?
      }
    })
  }

  RSVPInterested() {
    apiCall('events.rsvp.update',{ event_id: this.props.id, status: "Interested" }).then(json => {
      if (json.success) {
        this.getRSVPStatus();
      } 
      else {
//          TODO: notify about error
      }
    })
  }

  RSVPNotGoing() {
    apiCall('events.rsvp.remove',{ event_id: this.props.id }).then(json => {
      if (json.success) {
        this.getRSVPStatus();
      } 
      else {
//          TODO: notify about error
      }
    })
  }

  handleEventRsvpChange() {
 // nothing happening here for now
  }

  getRSVPStatus() {
    apiCall('events.rsvp.get',{ event_id: this.props.id }).then(json => {
      if (json.success) {
        const rsvp_status = json.data;
        if (rsvp_status){
          const rsvpStatus = (rsvp_status.status === 'RSVP') ? "Going" : rsvp_status.status;
          this.setState({rsvpStatus: rsvpStatus})
        }
        else {
          this.setState({rsvpStatus: null})
        }
      } 
      else {
        console.log("failed to get event rsvp status")
      }
    })
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
    const style = {
      borderTop: "5px solid #8dc63f",
      borderRadius: "0",
      padding: "0",
      minwidth: "100px",
    };
    return (
      <div>
        <MECard
          to={`${this.props.links.events + "/" + id}`}
          style={{ padding: 0, position: "relative", borderRadius: 15 }}
          className={`${MEAnimation.getAnimationClass()} ${className}`}
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

          <div className="bottom-date-area">
            <span>{dateString}</span>
                <br />
                <METextView
                  type="small"
                  style={{ color: "green" }}
                >
                  {recurringDetailString ? recurringDetailString : recurringDetailString}
                </METextView>
          </div>
        </MECard>
        <div
        style={{float:"right"}}>
          <Dropdown as={ButtonGroup} onSelect={e => this.handleEventRsvpChange(e)}>
            {//modify the default to be whether the user has RSVPed to the event or not
            true ? "":"nope"
            }
            <Dropdown.Toggle id="dropdown-basic">{this.state.rsvpStatus || "RSVP?"}</Dropdown.Toggle>
            <Dropdown.Menu
              style={style}
              className="me-dropdown-theme me-anime-show-up-from-top z-depth-1">
              <Dropdown.Item onClick={this.RSVPInterested}>Interested</Dropdown.Item>
              <Dropdown.Item onClick={this.RSVPGoing}>Going</Dropdown.Item>
              <Dropdown.Item onClick={this.RSVPNotGoing}>Not Going</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
        
</div>
    );
  }
  render() {
    // var { className, location, dateString, id } = this.props;

    return this.renderNewCardDesign();
    // ----- Will be removed when the new card design is approved...
    // return (
    //   <div>
    //     <MECard
    //       to={`${this.props.links.events + "/" + id}`}
    //       style={{ padding: 0, position: "relative", borderRadius: 15 }}
    //       className={`${MEAnimation.getAnimationClass()} ${className}`}
    //     >
    //       <img
    //         src={this.getPhoto()}
    //         className="me-testimonial-img"
    //         alt="event"
    //       />
    //       <div className="me-testimonial-content-box">
    //         <div className="me-testimonial-about">
    //           <small style={{ fontSize: 17 }}>
    //             <b>
    //               {this.getEventTitle()}
    //               {/* <br />
    //               <i className="fa fa-clock-o" style={{ marginRight: 5 }} />
    //               {dateString} */}
    //             </b>
    //           </small>
    //         </div>
    //         <div style={{ padding: 15 }}>
    //           <METextView
    //             className="me-testimonial-content"
    //             style={{ fontSize: 15, color: "#282828" }}
    //           >
    //             {this.getBody()}
    //           </METextView>

    //           <div className="testimonial-link-holder">
    //             <METextView
    //               mediaType="icon"
    //               icon="fa fa-clock-o"
    //               type="small"
    //               style={{ color: "green" }}
    //             >
    //               {dateString}
    //             </METextView>
    //             <br />
    //             <METextView
    //               type="small"
    //               style={{ color: "green" }}
    //               mediaType="icon"
    //               icon="fa fa-map-marker"
    //             >
    //               {location ? locationFormatJSX(location) : "No Location"}
    //             </METextView>
    //           </div>
    //         </div>
    //       </div>
    //     </MECard>
    //   </div>
    // );
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
