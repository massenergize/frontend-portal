import React, { Component } from "react";
// import leafy from "./leafy.png";
import defaultPhoto from "../StoriesPage/me_energy_default.png";
import * as moment from "moment";

class ActionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const format = "MMM, Do YYYY";
    const date = moment(
      this.props.content ? this.props.content.date : null
    ).format(format);
    var userName = "Anonymous";
    const anonymous = this.props.content ? this.props.content.ano : null;
    if (!anonymous) {
      userName = this.props.content.user ? this.props.content.user : userName; //else just pust the default user name
    }

    return (
      <div>
        <center>
          <h5
            style={{ marginBottom: 8, textTransform: "capitalize" }}
            className="mob-modal-tittle"
          >
            {this.props.content.title}
          </h5>
          <small className="story-name">{userName}</small>
          <small className="m-label round-me mob-line-break">{date}</small>
          <div style={{ marginTop: -20, position:"relative" }}>
            {!this.props.content.image ? (
              <img
                className="testi-green-monster mob-modal-pic-tweak z-depth-float "
                src={defaultPhoto}
                alt="IMG"
              />
            ) : (
              <img
                className="testi-modal-pic  mob-modal-pic-tweak z-depth-float"
                src={this.props.content.image.url}
                alt="IMG"
              />
            )}
            <div
            // style={{ marginTop: 30, maxHeight: 610, overflowY: "scroll" }}
            >
              <p className="mob-modal-p make-me-dark">
                {this.props.content.desc}
              </p>
            </div>
          </div>
        </center>
      </div>
    );
  }
}

export default ActionModal;
