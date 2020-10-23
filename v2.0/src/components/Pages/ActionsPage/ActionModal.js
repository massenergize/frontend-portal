import React, { Component } from "react";
// import leafy from "./leafy.png";
import defaultPhoto from "../StoriesPage/me_energy_default.png";
import ChooseHHForm from "./ChooseHHForm";
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
    const anonymous = this.props.user ? this.props.user.ano : null;
    if (!anonymous) {
      userName = this.props.user ? this.props.user : userName; //else just pust the default user name
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

          <small> {this.props.user.full_name}'s Actions </small> <small className="m-label round-me mob-line-break">{date}</small>
          <div style={{ marginTop: -20, position:"relative"}}>
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
            <br></br>

            {/* <ul style={{ textAlign: "center", listStyle: "none", display: "inline", columns: 2,  webkitColumns: 2, mozColumns: 2}}>
              <li style={{display: "inline", margin: "0 5em 0 0"}}>  </li>
              <li style={{display: "inline"}}> Adding Action to your {this.props.status} list! </li>
            </ul> */}

            <p> Adding Action to your {this.props.status} list! </p>

            <ChooseHHForm
              aid={this.props.content.id}
              status={this.props.status}
              open={true}
              user={this.props.user}
              addToCart={(aid, hid, status) =>
                this.props.addToCart(aid, hid, status)
              }
              inCart={(aid, hid, cart) => this.props.inCart(aid, hid, cart)}
              moveToDone={(aid, hid) => this.props.moveToDone(aid, hid)}
              closeForm={this.props.closeModal}
            />

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
