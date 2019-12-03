import React from 'react';
import { connect } from 'react-redux'
import { reduxLogin, reduxLogout } from '../../../redux/actions/userActions'
import URLS from '../../../api/urls'
import { deleteJson } from '../../../api/functions'
import { compose } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';


class DeleteAccountFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            are_you_sure: false,
            password: '',
        };
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <p> Are you sure you want to delete your account? </p>
                {this.getProvider() === 'email_and_password' ?
                    <>
                        <input type="password" name="password" value={this.state.password} onChange={this.onChange} required />
                        <p>Password <span className="text-danger">*</span></p>
                    </>
                    : null
                }
                <input
                    type="radio"
                    id="yes_im_sure"
                    checked={this.state.are_you_sure}
                    onChange={() => this.setState({ are_you_sure: !this.state.are_you_sure })}
                    style={{ display: "inline-block" }}
                />
                <label htmlFor="yes_im_sure" style={{ display: "inline-block" }}> Yes </label>
                &nbsp;
                <input
                    type="radio"
                    id="nope_not_sure"
                    checked={!this.state.are_you_sure}
                    onChange={() => this.setState({ are_you_sure: !this.state.are_you_sure })}
                    style={{ display: "inline-block" }}
                />
                <label htmlFor="nope_not_sure" style={{ display: "inline-block" }}> No</label>
                <br />
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
        if (this.state.are_you_sure) {
            this.deleteAccount();
        } else {
            this.props.closeForm();
        }
    }
    deleteAccount() {
        const provider = this.getProvider();
        if (provider === 'email_and_password') {
            var cred = this.props.firebase.auth.EmailAuthProvider.credential(
                this.props.user.email, this.state.password
            );
            this.props.firebase.auth().currentUser.reauthenticateWithCredential(cred).then(() => {
                this.props.firebase.auth().currentUser.delete().then(() => {
                    deleteJson(`${URLS.USER}/${this.props.user.id}`).then(json => {
                        console.log(json)
                        this.props.firebase.auth().signOut();
                        this.props.reduxLogout();
                    })
                });
            })
        } else if (provider === 'google') {
            //this.setState({ error: 'Sorry, deleting accounts that use google sign in is not yet supported' });
            this.props.firebase.auth().signInWithPopup(googleProvider).then(() => {
                this.props.firebase.auth().currentUser.delete().then(() => {
                    deleteJson(`${URLS.USER}/${this.props.user.id}`).then(json => {
                        console.log(json)
                        this.props.firebase.auth().signOut();
                        this.props.reduxLogout();
                    })
                }).catch(err => {
                    this.setState({error: err.message});
                });
            })
            return;
        } else if (provider === 'facebook') {
            //this.setState({ error: 'Sorry, deleting accounts that use facebook sign in is not yet supported' });
            this.props.firebase.auth().signInWithPopup(facebookProvider).then(() => {
                this.props.firebase.auth().currentUser.delete().then(() => {
                    deleteJson(`${URLS.USER}/${this.props.user.id}`).then(json => {
                        console.log(json)
                        this.props.firebase.auth().signOut();
                        this.props.reduxLogout();
                    })
                }).catch(err => {
                    this.setState({error: err.message});
                });
            })
            return;
        } else {
            this.setState({ error: 'Unknown authorization provider. Unable to delete account' });
            return;
        }
    }

    getProvider() {
        if (this.props.auth && this.props.auth.providerData) {
            //if (this.props.auth.providerData.length === 1) {
                if (this.props.auth.providerData[0].providerId === 'password') {
                    return 'email_and_password';
                } else if (this.props.auth.providerData[0].providerId.toLowerCase().indexOf('google') > -1) {
                    return 'google';
                } else if (this.props.auth.providerData[0].providerId.toLowerCase().indexOf('facebook') > -1) {
                    return 'facebook';
                }
            //}
        }
        return null;
    }

}

const DeleteAccountForm = compose(
    withFirebase,
)(DeleteAccountFormBase);


const mapStoreToProps = store => {
    return {
        user: store.user.info,
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, { reduxLogin, reduxLogout })(DeleteAccountForm);


