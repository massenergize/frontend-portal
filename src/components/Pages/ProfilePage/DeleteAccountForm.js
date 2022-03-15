import React from "react";
import { connect } from "react-redux";
import { reduxLogin, reduxLogout } from "../../../redux/actions/userActions";
import { compose } from "recompose";
import { withFirebase } from "react-redux-firebase";
import MEButton from "../Widgets/MEButton";
import METextView from "../Widgets/METextView";
import MECard from "../Widgets/MECard";
import METextField from "../Widgets/METextField";
import {
  firebaseDeleteEmailPasswordAccount,
  firebaseDeleteFacebookAuthAccount,
  firebaseDeleteGoogleAuthAccount,
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
          <METextView style={{color:"black"}}>
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
                user={this.props.user}
              />
            )}
            {usesEmailProvider() && !this.state.usesEmailLink ? (
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
          <MEButton type="submit" loading={this.state.loading}>
            {this.state.loading ? "Deleting..." : "Submit"}
          </MEButton>
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

  deleteFromMassEnergize() {
    const { user, deleteUserFromMEAndLogout } = this.props;
    deleteUserFromMEAndLogout(user?.id, (res, error) => {
      this.setState({ error });
    });
  }
  deletePasswordlessAccount() {
    const { speciaLink } = this.state;
    const { deleteUserFromMEAndLogout, user } = this.props;
    if (!speciaLink)
      return this.setState({
        error: "We need that special link we sent you! ",
      });

    const data = {
      isPasswordFree: true,
      emailLink: speciaLink,
      email: user?.email,
    };
    this.setState({ error: false, loading: true });
    return firebaseDeleteEmailPasswordAccount(data, (done, error) => {
      if (error) return this.setState({ error, loading: false });
      if (done) deleteUserFromMEAndLogout();
    });
  }
  onSubmit = (event) => {
    event.preventDefault();
    const { are_you_sure, usesEmailLink, askForSpecialLink } = this.state;
    if (askForSpecialLink) return this.deletePasswordlessAccount();
    if (are_you_sure) {
      if (usesEmailLink) return this.setState({ askForSpecialLink: true });
      this.setState({ error: null, loading: true });
      this.deleteAccount();
      return;
    }
    this.props.closeForm();
  };

  deleteAccount() {
    const { user } = this.props;
    if (usesGoogleProvider())
      return firebaseDeleteGoogleAuthAccount((done, error) => {
        if (error) return this.setState({ error, loading: false });
        if (done) this.deleteFromMassEnergize();
      });
    if (usesFacebookProvider())
      return firebaseDeleteFacebookAuthAccount((done, error) => {
        if (error) return this.setState({ error, loading: false });
        if (done) this.deleteFromMassEnergize();
      });

    if (usesEmailProvider()) {
      const data = { email: user?.email, password: this.state.password };
      return firebaseDeleteEmailPasswordAccount(data, (done, error) => {
        if (error) return this.setState({ error, loading: false });
        if (done) this.deleteFromMassEnergize();
      });
    }
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
