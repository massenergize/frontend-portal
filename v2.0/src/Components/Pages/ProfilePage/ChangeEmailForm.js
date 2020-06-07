import React from 'react';
import { connect } from 'react-redux'
import { reduxLogin } from '../../../redux/actions/userActions'
import { compose } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import URLS from '../../../api/urls'
import { postJson } from '../../../api/functions'


class ChangeEmailFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            are_you_sure: false,
        };
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.error ?
                    <p className='text-danger'>{this.state.error}</p> : null
                }
                <input type="email" name="email" value={this.state.email} onChange={this.onChange} required />
                <p>New Email <span className="text-danger" >*</span></p>

                <input type="password" name="password" value={this.state.password} onChange={this.onChange} required />
                <p>Password <span className="text-danger">*</span></p>
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
        console.log(this.state.unittype)
    };

    onSubmit = (event) => {
        event.preventDefault();

        var cred = this.props.firebase.auth.EmailAuthProvider.credential(
            this.props.user.email, this.state.password
        );
        this.props.firebase.auth().currentUser.reauthenticateWithCredential(cred).then(() => {
            this.props.firebase.auth().currentUser.updateEmail(this.state.email).then(() => {
                this.props.firebase.auth().currentUser.sendEmailVerification().then(() => console.log('email sent'));
                postJson(`${URLS.USER}/${this.props.user.id}`, {email: this.state.email}).then(response =>{
                    console.log(response);
                });
                this.props.closeForm('Thank you, your email has been changed. Please check your inbox to verify your new email');
            }).catch(err => {
                this.setState({ error: err.message? err.message : err });
            })
        }).catch(err => {
            this.setState({ error: err.message? err.message : err });
        })
    }
    deleteAccount() {
        this.setState({ error: "Sorry, we don't support deleting profiles yet" });
    }
}

const ChangeEmailForm = compose(
    withFirebase,
)(ChangeEmailFormBase);

const mapStoreToProps = store => {
    return {
        user: store.user.info,
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, { reduxLogin })(ChangeEmailForm);



