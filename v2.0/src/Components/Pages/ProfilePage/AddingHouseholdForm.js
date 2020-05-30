import React from 'react';
import { connect } from 'react-redux'
import { apiCall } from '../../../api/functions'
import { withFirebase } from 'react-redux-firebase';

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
	name: '',
	unittype: 'RESIDENTIAL',
	location: '',
};

class AddingHouseholdForm extends React.Component {
	constructor(props) {
		super(props);
		var address = '';
		var city = '';
		var state = 'MA';
		var zip = '';
		if (props.location && props.location !== '') {
			var locationparts = props.location.split(', ')
			address = locationparts[0];
			city = locationparts[1];
			state = locationparts[2];
			zip = locationparts[3];
		}
		this.state = {
			name: props.name ? props.name : INITIAL_STATE.name,
			unittype: props.unittype ? props.unittype : INITIAL_STATE.unittype,
			address: address,
			city: city,
			state: state,
			zip: zip,
		};

		this.onChange = this.onChange.bind(this);
	}

	render() {
		return (
			<form onSubmit={this.onSubmit} className='householdForm'>
				<div className="col">
					<p>Name <span className="text-danger">*</span></p>
					<input type="text" className="form-control" name="name" value={this.state.name} onChange={this.onChange} required />
				</div>
				<div className="col">
					<p>Type</p>
					<div className="col-6 d-flex">
						<input type='radio' name="unittype" id="unit_residential" value="RESIDENTIAL" checked={this.state.unittype === 'RESIDENTIAL'} onChange={this.onChange} />
						<label htmlFor='unit_residential' className="ml-2" value="unit_residential">Residential</label>
					</div>
					<div className="col-6 d-flex">
						<input type='radio' name="unittype" id="unit_commercial" value="COMMERCIAL" checked={this.state.unittype === 'COMMERCIAL'} onChange={this.onChange} />
						<label htmlFor='unit_commercial' className="ml-2" value="unit_commercial">Commercial</label>
					</div>
				</div>
				<div className="col">
					<p>City / Town</p>
					<input type="text" className="form-control" name="city" value={this.state.city ? this.state.city : ""} onChange={this.onChange} />
				</div>
				<div className="col">
					<p>State</p>
					<select value={this.state.state} className="form-control" onChange={event => this.setState({ state: event.target.value })}>
						<option value=""  >--</option>
						<option value="AL">Alabama</option>
						<option value="AK">Alaska</option>
						<option value="AZ">Arizona</option>
						<option value="AR">Arkansas</option>
						<option value="CA">California</option>
						<option value="CO">Colorado</option>
						<option value="CT">Connecticut</option>
						<option value="DE">Delaware</option>
						<option value="DC">Washington, D.C.</option>
						<option value="FL">Florida</option>
						<option value="GA">Georgia</option>
						<option value="HI">Hawaii</option>
						<option value="ID">Idaho</option>
						<option value="IL">Illinois</option>
						<option value="IN">Indiana</option>
						<option value="IA">Iowa</option>
						<option value="KS">Kansas</option>
						<option value="KY">Kentucky</option>
						<option value="LA">Louisiana</option>
						<option value="ME">Maine</option>
						<option value="MD">Maryland</option>
						<option value="MA">Massachusetts</option>
						<option value="MI">Michigan</option>
						<option value="MN">Minnesota</option>
						<option value="MS">Mississippi</option>
						<option value="MO">Missouri</option>
						<option value="MT">Montana</option>
						<option value="NE">Nebraska</option>
						<option value="NV">Nevada</option>
						<option value="NH">New Hampshire</option>
						<option value="NJ">New Jersey</option>
						<option value="NM">New Mexico</option>
						<option value="NY">New York</option>
						<option value="NC">North Carolina</option>
						<option value="ND">North Dakota</option>
						<option value="OH">Ohio</option>
						<option value="OK">Oklahoma</option>
						<option value="OR">Oregon</option>
						<option value="PA">Pennsylvania</option>
						<option value="RI">Rhode Island</option>
						<option value="SC">South Carolina</option>
						<option value="SD">South Dakota</option>
						<option value="TN">Tennessee</option>
						<option value="TX">Texas</option>
						<option value="UT">Utah</option>
						<option value="VT">Vermont</option>
						<option value="VA">Virginia</option>
						<option value="WA">Washington</option>
						<option value="WV">West Virginia</option>
						<option value="WI">Wisconsin</option>
						<option value="WY">Wyoming</option>
					</select>
				</div>
				<div className="col">
					<p>ZIP Code</p>
					<input type="text" className="form-control" name="zip" value={this.state.zip ? this.state.zip : ""} onChange={this.onChange} />
				</div>
				<div className="col p-0">
					<button className="thm-btn bg-cl-1" type="submit" style={{ marginTop:10,padding:8,width: '99%' }}>{!this.props.householdID ? "Add household" : "Submit Changes"}</button>
				</div>
			</form>
		);
	}

	//updates the state when form elements are changed
	onChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
			error: null
		});
	
	};

	onSubmit = (event) => {
		event.preventDefault();
		const { user, community, householdID } = this.props;
		const location = this.state.address + ', ' + this.state.city + ', ' + this.state.state + ', ' + this.state.zip;
		const body = {
			"name": this.state.name,
			"unit_type": this.state.unittype,
			"location": location,
			"user_id": user && user.id,
			"email": user && user.email,
			"community": community && community.id
		}

		if (householdID) {
			body["household_id"] = householdID;
			apiCall('users.households.edit', body).then(json => {
				if (json.success) {
					this.props.editHousehold(json.data);
					this.props.closeForm();
				}
				else {
					this.props.editHousehold(json.data);
					this.props.closeForm();
				}
			}
			).catch(error => {
				console.log(error);
			})
		} else {
			apiCall('users.households.add', body).then(json => {
				if (json.success) {
					this.props.addHousehold(json.data);
					this.props.closeForm();
				} else {
					this.props.editHousehold(json.data);
					this.props.closeForm();
				}
			}
			).catch(error => {
				console.log(error);
				this.props.closeForm();
			})
		}
	}
}


const mapStoreToProps = (store) => {
	return {
		auth: store.firebase.auth,
		user: store.user.info,
		community: store.page.community,
	}
}

export default connect(mapStoreToProps, {})(withFirebase(AddingHouseholdForm));


