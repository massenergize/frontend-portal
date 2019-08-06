import React from 'react';
import URLS from '../../../api/urls'
import {postJson} from '../../../api/functions'

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
    name: '',
    unittype: 'RESIDENTIAL',
    location: null
};

class AddingHouseholdForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="col">
                    <p>Unit Name <span className="text-danger">*</span></p>
                    <input type="text" name="name" value={this.state.name} onChange={this.onChange} />
                </div>
                <div className="col">
                    <p>Unit Type</p>
                    <div className="col-6 d-flex">
                        <input type='radio' name="unittype" id="unit_residential" value="RESIDENTIAL" defaultChecked onClick={this.onChange} />
                        <label className="ml-2" for="unit_residential">Residential</label>
                    </div>
                    <div className="col-6 d-flex">
                        <input type='radio' name="unittype" id="unit_commercial" value="COMMERCIAL" onClick={this.onChange} />
                        <label className="ml-2" for="unit_commercial">Commercial</label>
                    </div>
                </div>
                <div className="col">
                    <p>Location</p>
                    <input type="text" name="location" value={this.state.location} onChange={this.onChange} />
                </div>
                <div className="col p-0">
                    <button className="thm-btn bg-cl-1" type="submit" style={{ width: '99%' }}>Add household</button>
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
        const body = {
            "name": this.state.name,
            "unit_type": this.state.unittype,
            "location": this.state.location
        }
        /** Collects the form data and sends it to the backend */
        postJson(URLS.USER + "/" + this.props.user.id + "/households", body).then(json => {
            console.log(json);
            if (json.success) {
                this.props.addHousehold(json.data);
                var householdIds = [];
                this.props.user.households.forEach(household => {
                    householdIds.push(household.id);
                })
                fetch(URLS.USER + "/" + this.props.user.id, {
                    method: 'post',
                    body: JSON.stringify({
                        "preferred_name": this.props.user.preferred_name,
                        "email": this.props.user.email,
                        "full_name": this.props.user.full_name,
                        "real_estate_units": [
                            ...householdIds
                        ]
                    })
                }).then(response => {
                    return response.json()
                }).then(json => {
                    console.log(json);
                    if(json.success) this.props.closeForm();
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
export default AddingHouseholdForm;


