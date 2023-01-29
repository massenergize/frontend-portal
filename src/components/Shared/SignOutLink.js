import React from "react";
import { connect } from "react-redux";
import { withFirebase } from "react-redux-firebase";
import { reduxLogout } from "../../redux/actions/userActions";

class SignOutLink extends React.Component {
  render() {
    return (
      <span id="test-dropdown-signout" onClick={this.onClick}>
        {this.props.children}
      </span>
    );
  }
  onClick = () => {
    this.props.firebase.auth().signOut();
    this.props.reduxLogout();
  };
}

export default connect(null, { reduxLogout })(withFirebase(SignOutLink));
