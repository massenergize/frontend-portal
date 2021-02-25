import React from "react";
import { connect } from "react-redux";
import { apiCall } from "../../../api/functions";
import { withFirebase } from "react-redux-firebase";
import METextView from "../Widgets/METextView";
import METextField from "../Widgets/METextField";
import MEButton from "../Widgets/MEButton";
import { ME_STATES } from "./States";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MEDropdown from "../Widgets/MEDropdown";

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
  name: "",
  unittype: "RESIDENTIAL",
  location: "",
};

class AddingHouseholdForm extends React.Component {
  constructor(props) {
    super(props);
    var address = "";
    var city = "";
    var state = "MA";
    var zip = "";

    if (props.location) {
      // passing location as JSON address
      address = props.location.street;
      city = props.location.city;
      state = props.location.state;
      zip = props.location.zipcode;
    }

    this.state = {
      name: props.name ? props.name : INITIAL_STATE.name,
      unittype: props.unittype ? props.unittype : INITIAL_STATE.unittype,
      address: address,
      city: city,
      state: state,
      zip: zip,
      error: null,
    };

    this.onChange = this.onChange.bind(this);
  }

  render() {
    const meStatesData = getPropsArrayFromJsonArray(ME_STATES, "name");
    const meStatesDataValues = getPropsArrayFromJsonArray(ME_STATES, "value");
    return (
      <form onSubmit={this.onSubmit} className="householdForm">
        <div className="col">
          {/* <p>Name <span className="text-danger">*</span></p> */}
          <METextView type="small">
            <b>Name *</b>
          </METextView>
          {/* <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.onChange} required /> */}
          <METextField
            type="text"
            name="name"
            placeholder="Name..."
            defaultValue={this.state.name}
            onChange={this.onChange}
            required={true}
          />
        </div>
        <div className="col">
          <METextView type="small">
            <b>Type</b>
          </METextView>
          <div
            className="put-me-inline i-need-my-space"
            style={{ width: "24%", marginLeft: 10 }}
          >
            <input
              className="put-me-inline"
              type="radio"
              name="unittype"
              id="unit_residential"
              value="RESIDENTIAL"
              checked={this.state.unittype === "RESIDENTIAL"}
              onChange={this.onChange}
            />
            <label
              htmlFor="unit_residential"
              className="ml-2"
              value="unit_residential"
            >
              Residential
            </label>
          </div>
          <div
            className=" put-me-inline i-need-my-space"
            style={{ width: "20%", marginLeft: 5 }}
          >
            <input
              className="put-me-inline"
              type="radio"
              name="unittype"
              id="unit_commercial"
              value="COMMERCIAL"
              checked={this.state.unittype === "COMMERCIAL"}
              onChange={this.onChange}
            />
            <label
              htmlFor="unit_commercial"
              className="ml-2"
              value="unit_commercial"
            >
              Commercial
            </label>
          </div>
        </div>
        <div className="col">
          <METextView type="small">
            <b>City / Town</b>
          </METextView>
          <METextField
            type="text"
            placeholder="Name Of City..."
            name="city"
            defaultValue={this.state.city ? this.state.city : ""}
            onChange={this.onChange}
          />
        </div>
        <div className="" style={{ marginLeft: 10, marginBottom: 10 }}>
          <METextView type="small">
            <b>State</b>
          </METextView>
          <MEDropdown
            placeholder="Select State"
            data={meStatesData}
            dataValues={meStatesDataValues}
            value={meStatesData[meStatesDataValues.indexOf(this.state.state)]}
            onItemSelected={(item) => this.setState({ state: item })}
          ></MEDropdown>
        </div>
        <div className="col">
          <METextView type="small">
            <b>Zip Code</b>
          </METextView>
          <METextField
            type="text"
            name="zip"
            required={true}
            placeholder="Zip Code..."
            defaultValue={this.state.zip ? this.state.zip : ""}
            onChange={this.onChange}
          />
        </div>
        <p className="text-danger" style={{ fontSize: 16 }}>
              {this.state.error}
        </p>
        <br />
        <div className="col p-0">
          <MEButton
            type="submit"
            style={{ marginTop: 10, marginRight: 6, padding: 8, width: "99%" }}
          >
            {!this.props.householdID ? "Add household" : "Submit Changes"}
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
    const { user, community, householdID } = this.props;

    const zipCodePattern = /^\d{5}$|^\d{5}$/;    
    if (!this.state.zip || this.state.zip.length < 5 || !zipCodePattern.test(this.state.zip)) {
      this.setState({
        error: "Please enter a valid US zip code"
      })
      return;
    }
    
    const address = {
      street: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zip,
    }

    const body = { 
      name: this.state.name,
      unit_type: this.state.unittype,
      address: JSON.stringify(address),
      user_id: user && user.id,
      email: user && user.email,
      community: community && community.id,
    };

    if (householdID) {
      body["household_id"] = householdID;
      apiCall("users.households.edit", body)
        .then((json) => {
          if (json.success) {
            this.props.editHousehold(json.data);
            this.props.closeForm();
          } else {
            this.props.editHousehold(json.data);
            this.props.closeForm();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      apiCall("users.households.add", body)
        .then((json) => {
          if (json.success) {
            this.props.addHousehold(json.data);
            this.props.closeForm();
          } else {
            this.props.editHousehold(json.data);
            this.props.closeForm();
          }
        })
        .catch((error) => {
          console.log(error);
          this.props.closeForm();
        });
    }
  };
}

const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    user: store.user.info,
    community: store.page.community,
  };
};

export default connect(mapStoreToProps, {})(withFirebase(AddingHouseholdForm));
