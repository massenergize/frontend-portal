import React from "react";
import { connect } from "react-redux";
import { reduxLogin } from "../../../redux/actions/userActions";
import { apiCall } from "../../../api/functions";
import MEButton from "../Widgets/MEButton";
import METextField from "../Widgets/METextField";

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/

class EditingProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      full_name: props.full_name ? props.full_name : "",
      preferred_name: props.preferred_name ? props.preferred_name : "",
      email: props.email ? props.email : "",
      delete_account: false,
      change_password: false,
      are_you_sure: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div
          className="z-depth-float me-anime-open-in"
          style={{
            border: "solid 1px 1px solid rgb(243, 243, 243)",
            borderRadius: 10,
            padding: 30,
          }}
        >
          <h5>Edit Your Profile</h5>
          {this.state.error ? (
            <p className="text-danger">{this.state.error}</p>
          ) : null}
          <small>
            Full Name <span className="text-danger">*</span>
          </small>
          <METextField
            type="text"
            name="full_name"
            defaultValue={this.state.full_name}
            onChange={this.onChange}
            required={true}
          />

          {/* <small>
            Email ( Not Editable ) <span className="text-default">*</span>
          </small>
          <METextField
            type="email"
            name="email"
            defaultValue={this.state.email}
            onChange={this.onChange}
            required={true}
            readonly="true"
          /> */}

          <small>
            Preferred Name <span className="text-danger">*</span>
          </small>
          <METextField
            type="text"
            name="preferred_name"
            defaultValue={this.state.preferred_name}
            onChange={this.onChange}
            required={true}
          />

          <br />
          <MEButton type="submit">{"Submit"}</MEButton>
          <MEButton
            variation="accent"
            type="button"
            onClick={() => this.props.closeForm()}
          >
            {" "}
            Cancel{" "}
          </MEButton>
        </div>
      </form>
    );
  }

  //updates the state when form elements are changed
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.delete_account && this.state.are_you_sure) {
      this.deleteAccount();
    } else {
      const body = {
        user_id: this.props.user.id,
        full_name: this.state.full_name,
        preferred_name: this.state.preferred_name,
      };

      /** Collects the form data and sends it to the backend */
      apiCall("users.update", body)
        .then((json) => {
          if (json.success && json.data) {
            this.props.reduxLogin(json.data);
            this.props.closeForm();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  deleteAccount() {
    this.setState({ error: "Sorry, we don't support deleting profiles yet" });
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    auth: store.firebase.auth,
  };
};
export default connect(mapStoreToProps, { reduxLogin })(EditingProfileForm);
