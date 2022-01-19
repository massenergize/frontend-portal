import React, { Component } from "react";
import "./StorySheet.css";
import DefaultClass from "../../../Shared/Classes/DefaultClass";
import { getHumanFriendlyDate } from "../../../Utils";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import StoryForm from "../../ActionsPage/StoryForm";

const hasLargeText = (body) => {
  if (!body) return [false, "...", "..."];

  if (body.length > 540) {
    return [true, body.substring(0, 530) + "...", body];
  }

  return [false, body, body];
};

export default class StorySheet extends Component {
  constructor(props) {
    super(props);
    this.pcImageRef = React.createRef();
    this.state = {
      showImage: false,
      readMore: false,
      textIsShort: true,
      fallbackImg: null,
	  OpenModal: false
    };
    this.setDefaultImage = this.setDefaultImage.bind(this);
  }

  componentDidMount() {
    if (!this.pcImageRef) return;
  }

  getUser() {
    const { preferred_name, user } = this.props;
    //if (anonymous) return "Anonymous";
    return preferred_name || user?.preferred_name || user?.full_name || "...";
  }

  static getDerivedStateFromProps(props, state) {
    const [yes] = hasLargeText(props.body);
    if (yes) return { textIsShort: false };

    return null;
  }

  getBody() {
    const { body } = this.props;
    const [yes, substring, fullBody] = hasLargeText(body);
    if (yes && !this.state.readMore) return substring;
    return fullBody;
  }

  getProperHeight() {
    const { textIsShort, readMore } = this.state;
    if (textIsShort || (!textIsShort && readMore)) return ["auto", "auto"];
    return ["400px", "530px"];
  }

  setDefaultImage(e) {
    this.setState({ fallbackImg: DefaultClass.getTestimonialsDefaultPhoto() });
  }
  render() {
    const {
      action,
      body,
      other_vendor,
      preferred_name,
      title,
      vendor,
      is_approved,
      community,
      created_at,
      file,
      id,
      is_published,
    } = this.props;
    //builds out the edit testimonial data to be passed down to the submit testimonial form when edit button is clicked
    var testimonialData = {
      id: id,
      is_approved: is_approved,
      is_published: is_published,
      community: community?.id,
      key: Math.random(),
      action_id: action?.id,
      tags: [],
      body: body,
      other_vendor: other_vendor,
      preferred_name: preferred_name,
      title: title,
      vendor_id: vendor ? vendor.id : "",
      image: file,
    };
    const date = getHumanFriendlyDate(created_at);
    const creatorName = this.getUser();

    const noImageProps = !file ? { display: "block", width: "100%" } : {};
    const [pcHeight, mobileHeight] = this.getProperHeight();
    return (
      <div
        style={{
          width: "100%",
        }}
        id={`sheet-content-${id}`}
      >
        {/* --------- FULL - IMAGE DISPLAY IN PHONE MODE ---------------- */}
        {this.state.showImage && (
          <>
            <div className="sheet-ghost"></div>
            <div
              className="phone-img-view-container"
              onClick={() => this.setState({ showImage: false })}
            >
              <img
                src={
                  this.state.fallbackImg ||
                  file?.url ||
                  DefaultClass.getTestimonialsDefaultPhoto()
                }
                className="sheet-image"
                alt="sheet media"
                onError={this.setDefaultImage}
              />
            </div>
          </>
        )}
        {/* ------------------------------------------------------------- */}
        <div
          className="root-story-sheet z-depth-float"
          style={{
            "--sheet-height-state": pcHeight,
            "--sheet-height-state-mobile": mobileHeight,
            ...noImageProps,
          }}
        >
          {file && (
            <img
              ref={this.pcImageRef}
              src={
                this.state.fallbackImg ||
                file?.url ||
                DefaultClass.getTestimonialsDefaultPhoto()
              }
              className="sheet-image phone-vanish"
              alt="sheet media"
              onError={this.setDefaultImage}
            />
          )}

          <div className="sheet-content-area">
            <h4>
              {creatorName} {is_published ? "" : " (Pending Approval) "}{" "}
            </h4>
            <div className="sheet-details">
              <p>{date}</p>
              <div>
                <Link
                  style={{ marginLeft: "auto" }}
                  className="sheet-link test-story-sheet-full-view-link"
                  to={`${this.props.links.testimonials}/${id}`}
                >
                  {" "}
                  <i
                    className="fa fa-copy"
                    style={{ marginRight: 6 }}
                    onClick={() => {
                      document.execCommand("copy");
                    }}
                  ></i>{" "}
                  Full View
                </Link>

                {
                is_published ? (
                    <div />
                ) : (
                    <Button
                    onClick={() => {
                        this.setState({ OpenModal: true });
                        this.props.isModalOpen(true);
                    }}
                    className="testimonial_edit_button"
                    variant="outline-dark"
                    >
                    {" "}
                    Edit{" "}
                    </Button>
                )
                }
              </div>
 
              <Modal
              size="lg"
              show={this.state.OpenModal}
              onHide={() => {
                  this.setState({ OpenModal: false });
                  this.props.isModalOpen(false);
              }}
              >
              <StoryForm draftTestimonialData={testimonialData} />
              </Modal>
 
            </div>
            <div>
              {file && (
                <div
                  onClick={() => this.setState({ showImage: true })}
                  className="every-day-flex pc-vanish"
                  style={{
                    justifyContent: "flex-start",
                    marginBottom: 10,
                    padding: 10,
                    background: "#fff1f1",
                    borderRadius: 6,
                  }}
                >
                  <img
                    className="sheet-media"
                    alt="mobile story media"
                    style={{
                      marginRight: 7,
                      height: 35,
                      width: 45,
                      objectFit: "cover",
                      borderRadius: 5,
                    }}
                    src={
                      this.state.fallbackImg ||
                      file?.url ||
                      DefaultClass.getTestimonialsDefaultPhoto()
                    }
                    onError={this.setDefaultImage}
                  />

                  <small>See full attached image</small>
                </div>
              )}
              <h6
                style={{
                  textTransform: "uppercase",
                  color: "var(--app-theme-orange)",
                  fontSize: "0.85rem",
                }}
                className="test-story-sheet-title"
              >
                {title}
              </h6>
              <p className="sheet-text">{this.getBody()}</p>
            </div>
            <div style={{ display: "flex" }}>
              {!this.state.textIsShort && (
                <>
                  {!this.state.readMore ? (
                    <a
                      href="#void"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ readMore: true });
                      }}
                      className="sheet-link"
                    >
                      Read more...
                    </a>
                  ) : (
                    <a
                      href="#void"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ readMore: false });
                      }}
                      className="sheet-link"
                    >
                      Close
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
