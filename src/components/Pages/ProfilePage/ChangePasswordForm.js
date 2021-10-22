import React from "react";
import { connect } from "react-redux";
import { reduxLogin } from "../../../redux/actions/userActions";
import { compose } from "recompose";
import { withFirebase } from "react-redux-firebase";
import Tooltip from "../../Shared/Tooltip";
import METextField from "../Widgets/METextField";
import MEButton from "../Widgets/MEButton";
import MECard from "../Widgets/MECard";

class ChangePasswordFormBase extends React.Component {
  constructor(props) {
    super();
    this.state = {
      error: null,
      old_password: "",
      password1: "",
      password2: "",
    };
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <MECard className="me-anime-open-in">
          {this.state.error ? (
            <p className="text-danger" style={{ fontSize: 14 }}>
              {this.state.error}
            </p>
          ) : null}
          <small>
            Old Password <span className="text-danger">*</span>
          </small>
          <METextField
            type="password"
            name="old_password"
            value={this.state.old_password}
            onChange={this.onChange}
            placeholder="Enter old password here"
            required
          />

          <small>
            New Password <span className="text-danger">*</span>
          </small>
          <METextField
            type="password"
            name="password1"
            value={this.state.password1}
            onChange={this.onChange}
            placeholder="Enter new password"
            required
          />
          <small>
            Confirm Password <span className="text-danger">*</span>
          </small>
          <Tooltip text="Re-type your new password to confirm it. Passwords must match">
            <METextField
              type="password"
              name="password2"
              value={this.state.password2}
              onChange={this.onChange}
              placeholder="Confirm password"
              required
            />
          </Tooltip>

          <MEButton>{"Submit"}</MEButton>
          <MEButton variation="accent" onClick={() => this.props.closeForm()}>
            {" "}
            Cancel{" "}
          </MEButton>
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
    if (
      !this.state.password1 ||
      !this.state.password2 ||
      !this.state.old_password
    ) {
      this.setState({
        error:
          "Please provide your old password, a new one, and retype your new one to confirm",
      });
      return;
    }
    if (this.state.password1 !== this.state.password2) {
      this.setState({ error: "New Passwords Must Match" });
    } else {
      var cred = this.props.firebase.auth.EmailAuthProvider.credential(
        this.props.user.email,
        this.state.old_password
      );
      this.props.firebase
        .auth()
        .currentUser.reauthenticateWithCredential(cred)
        .then(() => {
          this.props.firebase
            .auth()
            .currentUser.updatePassword(this.state.password1)
            .then(() => {
              this.props.closeForm("Thank you, your password has been changed");
            })
            .catch((err) => {
              this.setState({ error: err.message ? err.message : err });
            });
        })
        .catch((err) => {
          this.setState({ error: err.message ? err.message : err });
        });
    }
  };
}

const ChangePasswordForm = compose(withFirebase)(ChangePasswordFormBase);

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    auth: store.firebase.auth,
  };
};
export default connect(mapStoreToProps, { reduxLogin })(ChangePasswordForm);
