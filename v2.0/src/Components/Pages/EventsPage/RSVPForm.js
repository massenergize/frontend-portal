import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import {
  reduxAddRSVP,
  reduxRemoveRSVP,
  reduxChangeRSVP,
} from "../../../redux/actions/pageActions";

/********************************************************************/
/**                        RSVP FORM                               **/
/********************************************************************/
const INITIAL_STATE = {
  value: "--",
  oldvalue: "--",
};

class RSVPForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.rsvp ? props.rsvp.status : INITIAL_STATE.value,
      oldvalue: props.rsvp ? props.rsvp.status : INITIAL_STATE.oldvalue,
    };

    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <>
        {this.props.noText ? null : (
          <>
            <h6 style={{ display: "inline-block" }}> RSVP </h6>
            {"\u00A0"}
          </>
        )}
        <select value={this.state.value} onChange={this.onChange}>
          <option value="--">--</option>
          <option value="INTERESTED">Interested</option>
          <option value="RSVP">Going</option>
          <option value="SAVE">Save For Later</option>
        </select>
        &nbsp;
        {this.state.oldvalue !== this.state.value ? (
          <button className="thm-btn style-4" onClick={this.handleSubmit}>
            Submit
          </button>
        ) : null}
      </>
    );
  }

  //updates the state when form elements are changed
  onChange(event) {
    this.setState({
      value: event.target.value,
    });
  }
  handleSubmit = (event) => {
    if (this.state.oldvalue === "--") {
      this.addRSVP(this.state.value);
    } else if (this.state.value === "--") {
      this.removeRSVP(this.state.value);
    } else {
      this.changeRSVP(this.state.value);
    }
    this.setState({
      oldvalue: this.state.value,
    });
  };

  addRSVP = (status) => {
    apiCall("events.rsvp", { event_id: this.props.eventid }).then((json) => {
      console.log(json);
      if (json.success && json.data) {
        this.props.reduxAddRSVP(json.data);
      }
    });
  };

  changeRSVP = (status) => {
    const body = {
      status: status,
      event_id: this.props.eventid,
      rsvp_id: this.props.rsvp.id,
    };
    apiCall("events.rsvp.update", body).then((json) => {
      console.log(json);
      if (json.success && json.data) {
        this.props.reduxChangeRSVP(json.data);
      }
    });
  };

  removeRSVP = () => {
    apiCall("events.rsvp.remove", { rsvp_id: this.props.rsvp.id }).then(
      (json) => {
        if (json.success) {
          this.props.reduxRemoveRSVP(this.props.rsvp);
        }
      }
    );
  };

  onSubmit = (event) => {
    event.preventDefault();
    const body = {
      name: this.state.name,
      unit_type: this.state.unittype,
      location: this.state.location,
      household_id: this.props.householdID,
    };

    /** Collects the form data and sends it to the backend */
    apiCall("users.households.add", body)
      .then((json) => {
        if (json.success) {
          if (!this.props.householdID) {
            this.props.addHousehold(json.data);
            var householdIds = [];
            this.props.user.households.forEach((household) => {
              householdIds.push(household.id);
            });
          } else {
            this.props.editHousehold(json.data);
            this.props.closeForm();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

const mapDispatchToProps = { reduxAddRSVP, reduxRemoveRSVP, reduxChangeRSVP };
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(null, mapDispatchToProps)(RSVPForm);
