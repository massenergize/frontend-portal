import React from 'react';
import URLS from '../../../api/urls'
import { postJson } from '../../../api/functions'

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
		if (props.location && props.location != '') {
			var locationparts = props.location.split(', ')
			address = locationparts[0];
			city = locationparts[1];
			state = locationparts[2];
		}
		this.state = {
			name: props.name ? props.name : INITIAL_STATE.name,
			unittype: props.unittype ? props.unittype : INITIAL_STATE.unittype,

			address: address,
			city: city,
			state: state,
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
					<p>Street Address</p>
					<input type="text" className="form-control" name="address" value={this.state.address ? this.state.address : ""} onChange={this.onChange} />
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
		console.log(this.state.unittype)
	};

	onSubmit = (event) => {
		event.preventDefault();
		const location = this.state.address + ', ' + this.state.city + ', ' + this.state.state;
		const body = {
			"name": this.state.name,
			"unit_type": this.state.unittype,
			"location": location
		}
		var postURL = URLS.USER + "/" + this.props.user.id + "/households";
		if (this.props.householdID) {
			postURL = URLS.HOUSEHOLD + "/" + this.props.householdID;
		}
		/** Collects the form data and sends it to the backend */
		postJson(postURL, body).then(json => {
			console.log(json);
			if (json.success) {
				if (!this.props.householdID) {
					this.props.addHousehold(json.data);
					postJson(URLS.USER + "/" + this.props.user.id, { "real_estate_units": json.data.id }).then(json => {
						if (json.success) this.props.closeForm();
					});
				} else {
					this.props.editHousehold(json.data);
					this.props.closeForm();
				}
			}
		}).catch(error => {
			console.log(error);
		})
	}
}


//composes the login form by using higher order components to make it have routing and firebase capabilities
export default AddingHouseholdForm;


