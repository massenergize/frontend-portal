import React, { Component } from "react";
import photo from "./me_energy_default.png";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";
import METextView from "../Widgets/METextView";

export default class METestimonialCard extends Component {
  getPhoto() {
    const { file } = this.props;
    if (file) return file;
    return photo;
  }
  getBody() {
    const { body } = this.props;
    if (body.length > 90) {
      return (
        <>
         { body.slice(0,90)+"..."}
          <MELink href="#" style={{ marginLeft: 6 }}>
            {" "}
            Read more
          </MELink>
        </>
      );
    }
    return body;
  }
  componentDidMount() {
    document.addEventListener("error", (e)=>{
      if(e.target.tagName.toLowerCase() !== "img") return ; 
      e.target.src = photo;
      e.target.alt = "The real img is missing this is a default image";
    },true);
  }
  
  render() {
    const {
      className,
      action,
      prefered_name,
      title,
      body,
      name,
      created_at,
    } = this.props;
    return (
      <div>
        <MECard
          style={{ padding: 0, position: "relative" }}
          className={className}
        >
          <img src={this.getPhoto()} className="me-testimonial-img" />
          <div className="me-testimonial-content-box">
            <div className="me-testimonial-about">
              <small>
                <b>
                  <span className="fa fa-user" style={{ marginRight: 5 }} />
                  By {prefered_name}
                </b>
              </small>
              <small style={{ marginLeft: "auto" }}>
                <b>
                  {" "}
                  <span className="fa fa-clock-o" style={{ marginRight: 5 }} />
                  {created_at}
                </b>
              </small>
            </div>
            <div style={{ padding: 15 }}>
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
                <MELink href="#" style={{ fontSize: 14 }}>
                  The frog is playing piano, and the lizard is playing guitar
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
};
