import React from 'react';
import URLS from '../../api_v2'

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
                <p>Unit name*</p>
                <input type="text" name="name" value={this.state.name} onChange={this.onChange} />
                <p> Unit Type </p>
                <div className="row">
                    <div className="col">
                        <input type='radio' name="unittype" value="RESIDENTIAL" defaultChecked onClick={this.onChange} />
                        <p>Residential</p>
                    </div>
                    <div className="col">
                        <input type='radio' name="unittype" value="COMMERCIAL" onClick={this.onChange} />
                        <p>Commercial</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button disabled className="thm-btn bg-cl-1" type="submit" style={{ width: '99%' }}>Add household</button>
                    </div>
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
        /** Collects the form data and sends it to the backend */
        fetch(URLS.USER + "/" + this.props.user.id + "/households", {
            method: 'post',
            body: JSON.stringify({
                "name": this.state.name,
                "unit_type": this.state.unittype,
                "location": this.state.location
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
            // this.props.addHousehold(json.data);
            // if (json.success) {
            //     var oldhouseholds = [];
            //     this.props.user.households.forEach(household => {
            //         oldhouseholds.push(household.id);
            //     })
            //     fetch(URLS.USER + "/" + this.props.user.id, {
            //         method: 'post',
            //         body: JSON.stringify({
            //             "preferred_name": this.props.user.preferred_name,
            //             "email": this.props.user.email,
            //             "full_name": this.props.user.full_name,
            //             "real_estate_units": [
            //                 ...oldhouseholds,
            //                 json.data.id
            //             ]
            //         })
            //     }).then(response => {
            //         return response.json()
            //     }).then(json => {
            //         console.log(json);
            //     });
            // }
        }).catch(error => {
            console.log(error);
        })
    }
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
export default AddingHouseholdForm;


