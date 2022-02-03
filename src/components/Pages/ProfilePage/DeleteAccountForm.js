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
import {
  Auth,
  fetchUserSignInMethods,
  firebaseDeleteEmailPasswordAccount,
  firebaseDeleteFacebookAuthAccount,
  firebaseDeleteGoogleAuthAccount,
  FirebaseEmailAuthProvider,
  usesEmailLinkProvider,
  usesEmailProvider,
  usesFacebookProvider,
  usesGoogleProvider,
} from "../Auth/shared/firebase-helpers";
import {
  completeUserDeletion,
  signMeOut,
} from "../../../redux/actions/authActions";
import PasswordLessDeleteBox from "./PasswordLessDeleteBox";
import Notification from "../Widgets/Notification/Notification";
class DeleteAccountFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      are_you_sure: false,
      password: "",
      error: null,
      usesEmailLink: false,
      loading: false,
      specialLink: "",
    };
  }

  componentDidMount() {
    usesEmailLinkProvider(null, (state) => {
      this.setState({ usesEmailLink: state });
    });
  }
  render() {
    return (
      <MECard className="me-anime-open-in" style={{ borderRadius: 10 }}>
        <form onSubmit={this.onSubmit}>
          <METextView>
            The current email assosciated with your account is
            <span
              style={{
                fontWeight: "bold",
                color: "var(--app-theme-orange)",
                marginRight: 5,
                marginLeft: 5,
              }}
            >
              {this.props.user?.email}.
              <br />
            </span>
            Are you sure you want to delete your profile?
          </METextView>
          {this.state.error && (
            <Notification good={false}>{this.state.error}</Notification>
            // <small style={{ color: "red" }}>{this.state.error}</small>
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
              Yes
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
            {this.state.askForSpecialLink && (
              <PasswordLessDeleteBox
                onChange={(e) => this.setState({ speciaLink: e.target.value })}
              />
            )}
            {usesEmailProvider() && !this.state.usesEmailLink && (
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
            )}
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

  deletePasswordlessAccount() {
    const { speciaLink } = this.state;
    if (!speciaLink)
      return this.setState({
        error: "We need that special link we sent you! ",
      });
  }
  onSubmit = (event) => {
    event.preventDefault();
    this.setState({ error: false, loading: true });
    const { are_you_sure, usesEmailLink, askForSpecialLink } = this.state;
    if (askForSpecialLink) return this.deletePasswordlessAccount();
    if (are_you_sure) {
      if (usesEmailLink) return this.setState({ askForSpecialLink: true });
      this.deleteAccount();
      return;
    }
    this.props.closeForm();
  };

  // deleteAccount() {
  //   const provider = this.getProvider();
  //   if (provider === "email_and_password") {
  //     var cred = FirebaseEmailAuthProvider.credential(
  //       this.props.user.email,
  //       this.state.password
  //     );
  //     Auth.currentUser.reauthenticateWithCredential(cred).then(() => {
  //       Auth.currentUser.delete().then(() => {
  //         apiCall("users.delete", {user_id: this.props.user.id}).then(
  //           (json) => {
  //             this.props.signOut();
  //           }
  //         );
  //       });
  //     });
  //   } else if (provider === "google") {
  //     //this.setState({ error: 'Sorry, deleting profiles that use google sign in is not yet supported' });
  //     Auth.signInWithPopup(googleProvider).then(() => {
  //       Auth.currentUser
  //         .delete()
  //         .then(() => {
  //           apiCall("users.delete", {user_id: this.props.user.id}).then(
  //             (json) => {
  //               this.props.signOut();
  //             }
  //           );
  //         })
  //         .catch((err) => {
  //           this.setState({error: err.message});
  //         });
  //     });
  //     return;
  //   } else if (provider === "facebook") {
  //     //this.setState({ error: 'Sorry, deleting profiles that use facebook sign in is not yet supported' });
  //     Auth.signInWithPopup(facebookProvider).then(() => {
  //       Auth.currentUser
  //         .delete()
  //         .then(() => {
  //           apiCall("users.delete", {user_id: this.props.user.id}).then(
  //             (json) => {
  //               this.props.signOut();
  //             }
  //           );
  //         })
  //         .catch((err) => {
  //           this.setState({error: err.message});
  //         });
  //     });
  //     return;
  //   } else {
  //     this.setState({
  //       error: "Unknown authorization provider. Unable to delete profile",
  //     });
  //     return;
  //   }
  // }
  deleteAccount() {
    const { deleteUserFromMEAndLogout } = this.props;
    if (usesGoogleProvider())
      return firebaseDeleteGoogleAuthAccount((done) => {
        if (done) deleteUserFromMEAndLogout();
      });
    if (usesFacebookProvider())
      return firebaseDeleteFacebookAuthAccount((done) => {
        if (done) deleteUserFromMEAndLogout();
      });

    if (usesEmailProvider())
      return firebaseDeleteEmailPasswordAccount((done) => {
        if (done) deleteUserFromMEAndLogout();
      });
  }

  getProvider() {
    const providers = Auth.currentUser?.providerData;
    fetchUserSignInMethods(this.props.user.email, (methods) =>
      console.log("I AM THE SIGN IN METHODS", methods)
    );
    console.log("I am the providers", providers);
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
export default connect(mapStoreToProps, {
  reduxLogin,
  reduxLogout,
  deleteUserFromMEAndLogout: completeUserDeletion,
})(DeleteAccountForm);
