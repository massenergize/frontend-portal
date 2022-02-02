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
import { Auth } from "../Auth/shared/firebase-helpers";
import { signMeOut } from "../../../redux/actions/authActions";

class DeleteAccountFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      are_you_sure: false,
      password: "",
      error: null,
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
          {this.state.error && (
            <small style={{ color: "red" }}>{this.state.error}</small>
          )}
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
              <>
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
              </>
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
      Auth.currentUser.reauthenticateWithCredential(cred).then(() => {
        Auth.currentUser.delete().then(() => {
          apiCall("users.delete", { user_id: this.props.user.id }).then(
            (json) => {
              this.props.signOut();
            }
          );
        });
      });
    } else if (provider === "google") {
      //this.setState({ error: 'Sorry, deleting profiles that use google sign in is not yet supported' });
      Auth.signInWithPopup(googleProvider).then(() => {
        Auth.currentUser
          .delete()
          .then(() => {
            apiCall("users.delete", { user_id: this.props.user.id }).then(
              (json) => {
                this.props.signOut();
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
      Auth.signInWithPopup(facebookProvider).then(() => {
        Auth.currentUser
          .delete()
          .then(() => {
            apiCall("users.delete", { user_id: this.props.user.id }).then(
              (json) => {
                this.props.signOut();
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
    const providers = Auth.currentUser?.providerData;
    if (!providers) return null;
    const provider = providers[0];
    if (provider.providerId === "password") return "email_and_password";
    else if (provider?.providerId.toLowerCase().indexOf("google") > -1)
      return "google";
    else if (provider?.providerId.toLowerCase().indexOf("facebook") > -1)
      return "facebook";
  }
}

const DeleteAccountForm = compose(withFirebase)(DeleteAccountFormBase);

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    signOut: signMeOut,
  };
};
export default connect(mapStoreToProps, { reduxLogin, reduxLogout })(
  DeleteAccountForm
);
