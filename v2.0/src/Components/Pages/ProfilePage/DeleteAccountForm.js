import React from "react";
import { connect } from "react-redux";
import { reduxLogin, reduxLogout } from "../../../redux/actions/userActions";
import { apiCall } from "../../../api/functions";
import { compose } from "recompose";
import { withFirebase } from "react-redux-firebase";
import {
  facebookProvider,
  googleProvider,
} from "../../../config/firebaseConfig";
import MEButton from "../Widgets/MEButton";
import METextView from "../Widgets/METextView";
import MECard from "../Widgets/MECard";
import METextField from "../Widgets/METextField";

class DeleteAccountFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      are_you_sure: false,
      password: "",
    };
  }

  render() {
    return (
      <MECard className="me-anime-open-in" style={{ borderRadius: 10 }}>
        <form onSubmit={this.onSubmit}>
          <METextView>
            {" "}
            Are you sure you want to delete your profile?{" "}
          </METextView>
          <div>
            <input
              type="radio"
              id="yes_im_sure"
              checked={this.state.are_you_sure}
              onChange={() =>
                this.setState({ are_you_sure: !this.state.are_you_sure })
              }
              style={{ display: "inline-block", marginRight: 5 }}
            />
            <label
              htmlFor="yes_im_sure"
              style={{ display: "inline-block", marginRight: 15 }}
            >
              {" "}
              Yes{" "}
            </label>
            &nbsp;
            <input
              type="radio"
              id="nope_not_sure"
              checked={!this.state.are_you_sure}
              onChange={() =>
                this.setState({ are_you_sure: !this.state.are_you_sure })
              }
              style={{ display: "inline-block", marginRight: 5 }}
            />
            <label htmlFor="nope_not_sure" style={{ display: "inline-block" }}>
              {" "}
              No
            </label>
            {this.getProvider() === "email_and_password" ? (
              <perfect>
                <br />
                <small>
                  Password <span className="text-danger">*</span>
                </small>
                <METextField
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  placeholder="Enter Password..."
                  required
                />
              </perfect>
            ) : null}
          </div>
          <MEButton type="submit">{"Submit"}</MEButton>
          <MEButton
            variation="accent"
            type="button"
            onClick={() => this.props.closeForm()}
          >
            {" "}
            Cancel{" "}
          </MEButton>
        </form>
      </MECard>
    );
  }
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.are_you_sure) {
      this.deleteAccount();
    } else {
      this.props.closeForm();
    }
  };
  deleteAccount() {
    const provider = this.getProvider();
    if (provider === "email_and_password") {
      var cred = this.props.firebase.auth.EmailAuthProvider.credential(
        this.props.user.email,
        this.state.password
      );
      this.props.firebase
        .auth()
        .currentUser.reauthenticateWithCredential(cred)
        .then(() => {
          this.props.firebase
            .auth()
            .currentUser.delete()
            .then(() => {
              apiCall("users.delete", { user_id: this.props.user.id }).then(
                (json) => {
                  this.props.firebase.auth().signOut();
                  this.props.reduxLogout();
                }
              );
            });
        });
    } else if (provider === "google") {
      //this.setState({ error: 'Sorry, deleting profiles that use google sign in is not yet supported' });
      this.props.firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(() => {
          this.props.firebase
            .auth()
            .currentUser.delete()
            .then(() => {
              apiCall("users.delete", { user_id: this.props.user.id }).then(
                (json) => {
                  this.props.firebase.auth().signOut();
                  this.props.reduxLogout();
                }
              );
            })
            .catch((err) => {
              this.setState({ error: err.message });
            });
        });
      return;
    } else if (provider === "facebook") {
      //this.setState({ error: 'Sorry, deleting profiles that use facebook sign in is not yet supported' });
      this.props.firebase
        .auth()
        .signInWithPopup(facebookProvider)
        .then(() => {
          this.props.firebase
            .auth()
            .currentUser.delete()
            .then(() => {
              apiCall("users.delete", { user_id: this.props.user.id }).then(
                (json) => {
                  this.props.firebase.auth().signOut();
                  this.props.reduxLogout();
                }
              );
            })
            .catch((err) => {
              this.setState({ error: err.message });
            });
        });
      return;
    } else {
      this.setState({
        error: "Unknown authorization provider. Unable to delete profile",
      });
      return;
    }
  }

  getProvider() {
    if (this.props.auth && this.props.auth.providerData) {
      //if (this.props.auth.providerData.length === 1) {
      if (this.props.auth.providerData[0].providerId === "password") {
        return "email_and_password";
      } else if (
        this.props.auth.providerData[0].providerId
          .toLowerCase()
          .indexOf("google") > -1
      ) {
        return "google";
      } else if (
        this.props.auth.providerData[0].providerId
          .toLowerCase()
          .indexOf("facebook") > -1
      ) {
        return "facebook";
      }
      //}
    }
    return null;
  }
}

const DeleteAccountForm = compose(withFirebase)(DeleteAccountFormBase);

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    auth: store.firebase.auth,
  };
};
export default connect(mapStoreToProps, { reduxLogin, reduxLogout })(
  DeleteAccountForm
);
