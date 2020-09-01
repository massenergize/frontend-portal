import React from 'react';
import { connect } from 'react-redux'
import { reduxLogin } from '../../../redux/actions/userActions'
import { compose } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import Tooltip from '../../Shared/Tooltip';


class ChangePasswordFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            old_password: null,
            password1: null,
            password2: null
        };
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.error ?
                    <p className='text-danger'>{this.state.error}</p> : null
                }
                <input type="password" name="old_password" value={this.state.old_password} onChange={this.onChange} required />
                <p>Old Password <span className="text-danger" >*</span></p>

                <input type="password" name="password1" value={this.state.password1} onChange={this.onChange} required />
                <Tooltip text='Re-type your new password to confirm it. Passwords must match' >
                    <input type="password" name="password2" value={this.state.password2} onChange={this.onChange} required />
                </Tooltip>

                <p>New Password <span className="text-danger">*</span></p>
                <button className="thm-btn bg-cl-1" type="submit">{"Submit"}</button>
                <button className="thm-btn red" type='button' onClick={() => this.props.closeForm()}> Cancel </button>
            </form>
        );
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        
        if(this.state.password1 !== this.state.password2) {
            this.setState({error: 'New Passwords Must Match'});
        }else{
            var cred = this.props.firebase.auth.EmailAuthProvider.credential(
                this.props.user.email, this.state.old_password
            );
            this.props.firebase.auth().currentUser.reauthenticateWithCredential(cred).then(() => {
                this.props.firebase.auth().currentUser.updatePassword(this.state.password1).then(() => {
                    this.props.closeForm('Thank you, your password has been changed')
                }).catch(err => {
                    this.setState({ error: err.message? err.message : err });
                })
            }).catch(err => {
                this.setState({ error: err.message? err.message : err });
            })
        }
    }
}

const ChangePasswordForm = compose(
    withFirebase,
)(ChangePasswordFormBase);

const mapStoreToProps = store => {
    return {
        user: store.user.info,
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, { reduxLogin })(ChangePasswordForm);


