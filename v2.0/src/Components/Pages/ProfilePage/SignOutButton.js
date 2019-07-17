import React from 'react';
import {connect} from 'react-redux';
import {sendSignOutSignal} from '../../../redux/actions/authActions'
import { withFirebase } from 'react-redux-firebase';

class SignOutButton extends React.Component{
    render(){
        return(
            //firebase prop from withFirebase higher component
            <button className="thm-btn" type="button" onClick={this.onClick}>
                Sign Out
            </button>
        );
    }
    onClick = () => {
        this.props.firebase.auth().signOut();
        this.props.sendSignOutSignal();
    }
}

export default connect(null, {sendSignOutSignal})(withFirebase(SignOutButton));