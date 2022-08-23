import React from "react";
import { connect } from "react-redux";
import { reduxLogin } from "../../../redux/actions/userActions";
import { compose } from "recompose";
import { withFirebase } from "react-redux-firebase";
import { apiCall } from "../../../api/functions";
import METextField from "../Widgets/METextField";
import MECard from "../Widgets/MECard";
import {
  Auth,
  FirebaseEmailAuthProvider,
} from "../Auth/shared/firebase-helpers";
import MELightFooter from "../Widgets/MELightFooter";

class ChangeEmailFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      are_you_sure: false,
      loading: false,
    };
  }

  render() {
    const { loading } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <MECard className="me-anime-open-in" style={{ padding: 0 }}>
          <div style={{ padding: 20 }}>
            {this.state.error ? (
              <p className="text-danger" style={{ fontSize: 14 }}>
                {this.state.error}
              </p>
            ) : null}
            <small>
              New Email <span className="text-danger">*</span>
            </small>

            <METextField
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              placeholder="Enter new email"
              required
            />

            <small>
              Current Password <span className="text-danger">*</span>
            </small>

            <METextField
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              placeholder="Enter password"
              required
            />
          </div>
          <MELightFooter
            loading={loading}
            okText={loading ? "CHANGING..." : "SUBMIT"}
            onCancel={(e) => {
              e.preventDefault();
              this.props.closeForm();
            }}
          />
        </MECard>
      </form>
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

    if (!this.state.password || !this.state.email) {
      this.setState({
        error:
          "Please make sure you have provided a new email and your current password",
      });
      return;
    }
    this.setState({ loading: true });
    var cred = FirebaseEmailAuthProvider.credential(
      this.props.user.email,
      this.state.password
    );
    Auth.currentUser
      .reauthenticateWithCredential(cred)
      .then(() => {
        Auth.currentUser
          .updateEmail(this.state.email)
          .then(() => {
            Auth.currentUser.sendEmailVerification();
            apiCall("users.update", {
              user_id: this.props.user.id,
              email: this.state.email,
            });

            this.props.closeForm(
              "Great start! Your email has been changed. Please check your inbox to verify your new email"
            );
          })
          .catch((err) => {
            this.setState({
              error: err.message ? err.message : err,
              loading: false,
            });
          });
      })
      .catch((err) => {
        this.setState({
          error: err.message ? err.message : err,
          loading: false,
        });
      });
  };
  deleteAccount() {
    this.setState({ error: "Sorry, we don't support deleting profiles yet" });
  }
}

const ChangeEmailForm = compose(withFirebase)(ChangeEmailFormBase);

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
  };
};
export default connect(mapStoreToProps, { reduxLogin })(ChangeEmailForm);
