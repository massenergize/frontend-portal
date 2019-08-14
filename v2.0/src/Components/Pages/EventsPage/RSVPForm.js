import React from 'react';
import URLS from '../../../api/urls'
import { postJson, deleteJson } from '../../../api/functions'
import { connect } from 'react-redux'
import { reduxAddRSVP, reduxRemoveRSVP, reduxChangeRSVP } from '../../../redux/actions/pageActions'

/********************************************************************/
/**                        RSVP FORM                               **/
/********************************************************************/
const INITIAL_STATE = {
    value: '--',
};

class RSVPForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.rsvp ? props.rsvp.status : INITIAL_STATE.value,
        };

        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <>
                <h6 style={{ display: 'inline-block' }}> RSVP </h6>
                {'\u00A0'}
                <select value={this.state.value} onChange={this.onChange}>
                    <option value='--'>--</option>
                    <option value='INTERESTED'>Interested</option>
                    <option value='RSVP'>Going</option>
                    <option value='SAVE'>Save For Later</option>
                </select>
            </>
        );
    }

    //updates the state when form elements are changed
    onChange(event) {
        const oldvalue = this.state.value;
        this.setState({
            value: event.target.value,
        });
        if(oldvalue === '--'){
            this.addRSVP(event.target.value);
        }
        else if(event.target.value === '--'){
            this.removeRSVP(event.target.value);
        }
        else { 
            this.changeRSVP(event.target.value)
        }
    };

    addRSVP = (status) => {
        const body = {
            'status': status,
            'attendee': this.props.userid,
            'event': this.props.eventid
        }
        postJson(URLS.EVENT_ATTENDEES, body).then(json => {
            console.log(json)
            if(json.success && json.data){
                this.props.reduxAddRSVP(json.data);
            }
        })
    }

    changeRSVP = (status) => {
        const body = {
            'status': status,
            'attendee': this.props.userid,
            'event': this.props.eventid
        }
        postJson(`${URLS.EVENT_ATTENDEE}/${this.props.rsvp.id}`, body).then(json => {
            console.log(json)
            if(json.success && json.data){
                this.props.reduxChangeRSVP(json.data);
            }
        })
    }

    removeRSVP = () => {
        deleteJson(`${URLS.EVENT_ATTENDEE}/${this.props.rsvp.id}`).then(json => {
            console.log(json)
            if(json.success){
                this.props.reduxRemoveRSVP(this.props.rsvp);
            }
        })
    }


    onSubmit = (event) => {
        event.preventDefault();
        const body = {
            "name": this.state.name,
            "unit_type": this.state.unittype,
            "location": this.state.location
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


const mapDispatchToProps = { reduxAddRSVP, reduxRemoveRSVP, reduxChangeRSVP }
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(null, mapDispatchToProps)(RSVPForm);


