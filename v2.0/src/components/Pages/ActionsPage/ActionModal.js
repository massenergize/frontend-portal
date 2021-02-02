import React, { Component } from "react";
// import leafy from "./leafy.png";
// import defaultPhoto from "../StoriesPage/me_energy_default.png";
import ChooseHHForm from "./ChooseHHForm";

class ActionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <ChooseHHForm
        action={this.props.content}
        aid={this.props.content.id}
        status={this.props.status}
        open={true}
        user={this.props.user}
        addToCart={(aid, hid, status) => this.props.addToCart(aid, hid, status)}
        inCart={(aid, hid, cart) => this.props.inCart(aid, hid, cart)}
        moveToDone={(aid, hid) => this.props.moveToDone(aid, hid)}
        closeForm={this.props.closeModal}
      />
    );

  }
}

export default ActionModal;
