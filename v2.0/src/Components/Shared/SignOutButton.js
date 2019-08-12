import React from 'react';
import {connect} from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { reduxLogout } from '../../redux/actions/userActions';


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
        this.props.reduxLogout();
    }
}

export default connect(null, {reduxLogout})(withFirebase(SignOutButton));