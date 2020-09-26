import React, { Component } from "react";
import photo from "./me_energy_default.png";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";
import * as moment from "moment";
import { getRandomIntegerInRange } from "../../Utils";

export default class METestimonialCard extends Component {
  constructor(props) {
    super(props);
    this.handleReadMore = this.handleReadMore.bind(this);
  }
  getPhoto() {
    const { file } = this.props;
    if (file && file.url) return file.url;
    return photo;
  }
  getBody() {
    const { body } = this.props;
    if (body.length > 90) {
        return (
        <>
          {body.slice(0, 90) + "..."}
          <MELink
            href="#"
            style={{ marginLeft: 6 }}
            onClick={(e) => {
              this.handleReadMore(e);
            }}
          >
            {" "}
            Read more
          </MELink>
        </>
      );
    }
    return body;
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
  getAnimationClass() {
    const classes = ["me-open-in", "me-open-in-slower", "me-open-in-slowest"];
    const index = getRandomIntegerInRange(3);
    return classes[index];
  }
  render() {
    var { className, action, preferred_name, links, created_at, title } = this.props;
    action = action ? action :{}
    return (
      <div>
        <MECard
          style={{ padding: 0, position: "relative" }}
          className={`${this.getAnimationClass()} ${className}`}
        >
          <img src={this.getPhoto()} className="me-testimonial-img" />
          <div className="me-testimonial-content-box">
            <div className="me-testimonial-about">
              <small>
                <b>
                  <span className="fa fa-user" style={{ marginRight: 5 }} />
                  By {preferred_name}
                </b>
              </small>
              <small style={{ marginLeft: "auto" }}>
                <b>
                  {" "}
                  <span className="fa fa-clock-o" style={{ marginRight: 5 }} />
                  {this.getFormatedTime(created_at)}
                </b>
              </small>
            </div>
            <div style={{ padding: 12 }}>
              <METextView 
                className="me-testimonial-content"
                style={{ fontSize: 18, color: "#282828" }}
              >
                {title}
              </METextView>
              <METextView
                className="me-testimonial-content"
                style={{ fontSize: 15, color: "#282828" }}
              >
                {this.getBody()}
              </METextView>

              <div className="testimonial-link-holder">
                <METextView type="small" style={{ color: "#282828" }}>
                  Related Action
                </METextView>
                <br />
                <MELink
                  to={`${links.actions}/${action.id}`}
                  style={{ fontSize: 14 }}
                >
                  {action.title > 70
                    ? action.title.substring(0, 70) + "..."
                    : action.title}
                </MELink>
              </div>
            </div>
          </div>
        </MECard>
      </div>
    );
  }
}

METestimonialCard.defaultProps = {
  body:
    "This is some more information about this testimonial. This is the default text...",
  prefered_name: "Anonymous",
  action: {},
  created_at: "1st January 2020",
  links: {},
};
