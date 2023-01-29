import React, { Component } from "react";
import "./StorySheet.css";
import DefaultClass from "../../../Shared/Classes/DefaultClass";
import { getHumanFriendlyDate } from "../../../Utils";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

const hasLargeText = (body) => {
  if (!body) return [false, "...", "..."];

  if (body.length > 540) {
    return [true, body.substring(0, 530) + "...", body];
  }

  return [false, body, body];
};

const getHeightOfHTMLBody = (_body) => {
  const div = document.createElement("div");
  div.innerHTML = _body;
  div.classList.add("element-in-space");
  const body = document.querySelector("body");
  body.append(div);
  const height = div.offsetHeight;
  body.removeChild(div);
  return height;
};
const checkIfTextIsShort = (body) => {
  const height = getHeightOfHTMLBody(body);
  if (isMobile)
    return [height < Heights.WhenCollapsed.mobile.cutoff, height + "px"];
  return [height < Heights.WhenCollapsed.pc.cutoff, height + "px"];
};
const Heights = {
  WhenCollapsed: {
    pc: { cutoff: 100, cssHeight: "300px" },
    mobile: { cutoff: 100, cssHeight: "300px" },
    forBothScreens: ["300px", "300px"],
  },
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
    };
    this.setDefaultImage = this.setDefaultImage.bind(this);
  }

  componentDidMount() {
    if (!this.pcImageRef) return;
  }

  getUser() {
    const { preferred_name, user } = this.props;
    return preferred_name || user?.preferred_name || user?.full_name || "...";
  }

  static getDerivedStateFromProps(props) {
    const [textIsShort] = checkIfTextIsShort(props.body);
    const [yes] = hasLargeText(props.body);
    if (yes) return { textIsShort };
    return null;
  }

  getProperHeight() {
    const { textIsShort, readMore } = this.state;
    if (textIsShort || (!textIsShort && readMore)) return ["auto", "auto"];
    return [
      Heights.WhenCollapsed.mobile.cssHeight,
      Heights.WhenCollapsed.mobile.cssHeight,
    ];
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
    const [pcHeight, mobileHeight] = this.getProperHeight(body);
    return (
      <div
        className="z-depth-float"
        style={{
          width: "100%",
          paddingBottom: 10,
          marginBottom: 15,
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
          className="root-story-sheet"
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
              <div style={{ display: "flex" }}>
                <Link
                  style={{ marginLeft: "auto", marginRight: 10 }}
                  className="sheet-link test-story-sheet-full-view-link"
                  to={`${this.props.links.testimonials}/${id}`}
                >
                  {" "}
                  <i className="fa fa-copy" style={{ marginRight: 6 }}></i> Full
                  View
                </Link>

                {is_published ? (
                  <div />
                ) : (
                  <StoryFormButtonModal
                    ModalType="testimonial"
                    ButtonClasses="me-testi-btn-reset touchable-opacity"
                    draftTestimonialData={testimonialData}
                  >
                    Edit
                  </button>
                )}
              </div>
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
              <p
                className="sheet-text"
                // style={{ "--story-body-height": "300px" }}
                dangerouslySetInnerHTML={{ __html: body }}
              ></p>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: !this.state.textIsShort ? "10px 25px" : 0,
          }}
        >
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
    );
  }
}
