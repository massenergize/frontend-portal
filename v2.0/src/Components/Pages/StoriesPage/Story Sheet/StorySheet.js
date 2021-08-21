import React, { Component } from "react";
import "./StorySheet.css";
import DefaultClass from "../../../Shared/Classes/DefaultClass";
import { getHumanFriendlyDate } from "../../../Utils";

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
    };
    this.setDefaultImage = this.setDefaultImage.bind(this);
  }

  componentDidMount() {
    if (!this.pcImageRef) return;
  }

  getText() {
    const { readMore } = this.state;

    // console.log(
    //   `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
    // mollitia, molestiae quas vel sint commodi repudiandae
    // consequuntur voluptatum laborum numquam blanditiis harum
    // quisquam eius sed odit fugiat iusto fuga praesentium optio,
    // eaque rerum! Provident similique accusantium nemo autem.
    // Veritatis obcaecati tenetur iure eius earum ut molestias
    // architecto voluptate aliquam nihil, eveniet aliquid culpa
    // officia aut! Impedit sit sunt quaerat, odit, tenetur error,
    // harum nesciunt ipsum debitis quas aliquid.`.length
    // );
    if (!readMore)
      return `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
    mollitia, molestiae quas vel sint commodi repudiandae
    consequuntur voluptatum laborum numquam blanditiis harum
    quisquam eius sed odit fugiat iusto fuga praesentium optio,
    eaque rerum! Provident similique accusantium nemo autem.
    Veritatis obcaecati tenetur iure eius earum ut molestias
    architecto voluptate aliquam nihil, eveniet aliquid culpa
    officia aut! Impedit sit sunt quaerat, odit, tenetur error,
    harum nesciunt ipsum debitis quas aliquid.`;

    return `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
    mollitia, molestiae quas vel sint commodi repudiandae
    consequuntur voluptatum laborum numquam blanditiis harum
    quisquam eius sed odit fugiat iusto fuga praesentium optio,
    eaque rerum! Provident similique accusantium nemo autem.
    Veritatis obcaecati tenetur iure eius earum ut molestias
    architecto voluptate aliquam nihil, eveniet aliquid culpa
    officia aut! Impedit sit sunt quaerat, odit, tenetur error,
    harum nesciunt ipsum debitis quas aliquid.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
    mollitia, molestiae quas vel sint commodi repudiandae
    consequuntur voluptatum laborum numquam blanditiis harum
    quisquam eius sed odit fugiat iusto fuga praesentium optio,
    eaque rerum! Provident similique accusantium nemo autem.
    Veritatis obcaecati tenetur iure eius earum ut molestias
    architecto voluptate aliquam nihil, eveniet aliquid culpa
    officia aut! Impedit sit sunt quaerat, odit, tenetur error,
    harum nesciunt ipsum debitis quas aliquid.`;
  }

  getUser() {
    const { user, anonymous } = this.props;
    if (anonymous) return "Anonymous";

    return user?.full_name || user?.preferred_name || "...";
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
    if (textIsShort || (!textIsShort && readMore)) return "auto";
    return "400px";
  }

  setDefaultImage(e) {
    this.setState({ fallbackImg: DefaultClass.getTestimonialsDefaultPhoto() });
  }
  render() {
    const { created_at, title, file } = this.props;
    const date = getHumanFriendlyDate(created_at);
    const noImageProps = !file ? { display: "block", width: "100%" } : {};
    return (
      <div style={{ width: "100%" }}>
        {/* --------- FULL - IMAGE DISPLAY IN PHONE MODE ---------------- */}
        {this.state.showImage && (
          <>
            <div
              className="sheet-ghost"
              onClick={() => this.setState({ showImage: false })}
            ></div>
            <div className="phone-img-view-container">
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
            "--sheet-height-state": this.getProperHeight(),
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
            <h4>{this.getUser()}</h4>
            <div className="sheet-details">
              <p>{date}</p>

              <p style={{ marginLeft: "auto" }} className="sheet-link">
                {" "}
                <i
                  className="fa fa-copy"
                  style={{ marginRight: 6 }}
                  onClick={() => {
                    document.execCommand("copy");
                  }}
                ></i>{" "}
                Copy Link To Share
              </p>
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
                }}
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
