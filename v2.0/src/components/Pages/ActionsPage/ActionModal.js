import React, { Component } from "react";
// import leafy from "./leafy.png";
import defaultPhoto from "../StoriesPage/me_energy_default.png";
import MEButton from "../Widgets/MEButton";
import METextView from "../Widgets/METextView";
import ChooseHHForm from "./ChooseHHForm";
// import * as moment from "moment";

class ActionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }



  ejectStuff(){ 
    return [1,2,3,4,5,5,5,5,5].map( item  =>{
      return (<div className="act-item">
      <div className = "act-rect"></div>
      <p>Here we go again</p>
    </div>)
    })
  }
  render() {
    // const format = "MMM, Do YYYY";
    // const date = moment(
    //   this.props.content ? this.props.content.date : null
    // ).format(format);
    // var userName = "Anonymous";
    // const anonymous = this.props.user ? this.props.user.ano : null;
    // if (!anonymous) {
    //   userName = this.props.user ? this.props.user : userName; //else just pust the default user name
    // }

    return (
      <div className="act-modal-whole">
        <div class="act-title-bar">
          <h3>Name Of Action</h3>
        </div>
        <METextView
          mediaType="icon"
          icon="fa fa-exclamation"
          className="act-error"
          containerStyle = {{display:"block"}}
        >
          Here is your first error
        </METextView>

        <div className="act-modal-body">
          {this.ejectStuff()}
          {/* <div className="act-item">
            <div className = "act-rect"></div>
            <p>Here we go again</p>
          </div> */}
          {/* <div className="act-item">
          <div className = "act-rect act-selected"></div>
            <p>Here we go again </p>
          </div> */}
          {/* <div className="act-item">
            <p>Here we go again</p>
          </div> */}
        </div>
        <div class="act-status-bar">
          <h4 style={{ margin: 20, fontWeight: "bold", color: "green" }}>
            TODO
          </h4>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            <button className="flat-btn">Submit</button>
            <button className="flat-btn close-flat">Cancel</button>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <center>
          <h5
            style={{ marginBottom: 8, textTransform: "capitalize" }}
            className="mob-modal-tittle"
          >
            {this.props.content.title}
          </h5>
          <small> {this.props.user.full_name}'s Actions </small>{" "}
          {/* <small className="m-label round-me mob-line-break">{date}</small> */}
          <div style={{ marginTop: -20, padding: "1em", position: "relative" }}>
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

            <p>
              {" "}
              Adding Action to your{" "}
              {this.props.status && this.props.status.toLowerCase()} list!{" "}
            </p>

            <ChooseHHForm
              action={this.props.content}
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
