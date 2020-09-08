import React, { Component } from "react";
import photo from "./not-found.jpg";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";
import * as moment from "moment";
import { getRandomIntegerInRange, locationFormatJSX } from "../../Utils";
import LoadingCircle from "../../Shared/LoadingCircle";

export default class METestimonialCard extends Component {
  constructor(props) {
    super(props);
    this.handleReadMore = this.handleReadMore.bind(this);
  }
  getPhoto() {
    const { image } = this.props;
    if (image && image.url) return image.url;
    return photo;
  }
  getBody() {
    var body = this.props.featured_summary;
    const id = this.props.id;
    if (body.length > 180) {
      return (
        <>
          {body.slice(0, 180) + "..."}
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

  lazyLoadImage(id, imageSource) {
    const loaderRef = "event-img-loader-" + id;
    const loader = document.getElementById(loaderRef);
    const imageRef = "event-img-" + id;
    const image = document.getElementById(imageRef);
    if (!imageSource || !imageSource.url) {
      image.src = photo;
      return;
    }
    const tempImg = new Image();
    tempImg.src = imageSource.url;
    tempImg.addEventListener("load",(e) => {
      console.log("I  HAVE FINISHED LOADING BRO", e);
      // loader.style.display = "none";
      image.src = tempImg.src;
    });
  }

  componentWillMount(){
    const { image , id } = this.props;
    // this.lazyLoadImage(id, image);
  }
  render() {
    var { className, location, dateString, id, image } = this.props;
    
   const  imageRef = "event-img-" + id;
    return (
      <div>
        <MECard
          to={`${this.props.links.events + "/" + id}`}
          style={{ padding: 0, position: "relative" }}
          className={`${this.getAnimationClass()} ${className}`}
        >
          <img
            id={imageRef}
            src={this.getPhoto()}
            className="me-testimonial-img"
            style={{ opacity: 0 }}
          />

          <div className="me-testimonial-content-box">
            <LoadingCircle
              height={50}
              width={50}
              id={"event-img-loader-" + id}
              style={{ transform: "translate(300%, -160%)" }}
            />
            <div className="me-testimonial-about">
              <small>
                <b>
                  <span className="fa fa-clock-o" style={{ marginRight: 5 }} />
                  {dateString}
                </b>
              </small>
              {/* <small style={{ marginLeft: "auto" }}>
                <b>
                  {" "}
                  <span className="fa fa-clock-o" style={{ marginRight: 5 }} />
                  {this.getFormatedTime(created_at)}
                </b>
              </small> */}
            </div>
            <div style={{ padding: 15 }}>
              <METextView
                className="me-testimonial-content"
                style={{ fontSize: 15, color: "#282828" }}
              >
                {this.getBody()}
              </METextView>

              <div className="testimonial-link-holder z-depth-float-half">
                <METextView type="small" style={{ color: "green" }}>
                  Venue
                </METextView>
                <br />
                <METextView
                  type="small"
                  style={{ color: "green" }}
                  mediaType="icon"
                  icon="fa fa-map-marker"
                >
                  {location ? locationFormatJSX(location) : "No Location"}
                </METextView>
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
