import React, { Component } from "react";
import DefaultClass from "../../Shared/Classes/DefaultClass";
import MECard from "../Widgets/MECard";
import MELink from "../Widgets/MELink";

export default class MiniTestimonial extends Component {
  constructor(props) {
    super();
    this.state = { expanded: null, limit: 140 };
  }
  storyHasImage() {
    const { story } = this.props;
    if (story && story.file && story.file.url)
      return { url: story.file.url, status: true };
    return { status: true, url: DefaultClass.getTestimonialsDefaultPhoto() };
  }

  render() {
    const { story } = this.props;
    const image = this.storyHasImage();
    const format = "MMMM Do YYYY";
    const date = DefaultClass.getMoment()(story.created_at).format(format);
    var creatorName = "Unknown user";
    if (!story.anononymous) {
      creatorName = story.preferred_name ? story.preferred_name : creatorName;
    }
    
    const url = story ? this.props.links.testimonials+"/" + story.id :""; 
    return (
      <div style={{ padding: 0 }}>
        <MECard className="me-anime-open-in" style={{ borderRadius: 10 }} to={url}>
          <div>
            <img
              src={image.url}
              className="v-story-img phone-vanish"
              alt="testimonial media"
            />
            <div
              className="text-holder"
              style={{
                padding: 20,
                display: "inline-block",
                marginLeft: "15%",
              }}
            >
              <div className="top">
                <div className="name">
                  <h4>{story.title} </h4>
                </div>
              </div>
              <div className="text">
                <h6>
                  <small className="story-name">{creatorName}</small>
                  <small className="m-label round-me">{date}</small>
                  {this.state.expanded && this.state.expanded === story.id ? (
                    <button
                      className="as-link"
                      style={{ float: "right" }}
                      onClick={() => {
                        this.setState({ expanded: null });
                      }}
                    >
                      See Less
                    </button>
                  ) : null}
                </h6>
                <p>
                  {this.state.expanded && this.state.expanded === story.id
                    ? story.body
                    : story.body.substring(0, this.state.limit)}
                  {this.state.limit < story.body.length &&
                    this.state.expanded !== story.id ? (
                      <button
                        className="as-link"
                        style={{ float: "right" }}
                        onClick={() => {
                          this.setState({ expanded: story.id });
                        }}
                      >
                        Read More...
                      </button>
                    ) : null}
                </p>
              </div>
              {story.action ? (
                <div className="text">
                  <p>
                    Linked Action:{" "}
                    <MELink
                      to={`${this.props.links.actions}/${story.action.id}`}
                    >
                      {story.action.title}
                    </MELink>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </MECard>
      </div>
    );
  }
}
