import React from 'react';
import { withFirebase } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { sendSignInSignal } from '../../../redux/actions/authActions'
import { Redirect, Link } from 'react-router-dom'
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';

/********************************************************************/
/**                        LOGIN FORM                               */
/********************************************************************/
const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
};

class LoginFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        const { email, password, error } = this.state;
        const { auth } = this.props;
        if (auth.uid) return <Redirect to='/profile' />;
        return (
            < div class="styled-form login-form" >
                <div class="section-title style-2">
                    <h3>Login Now</h3>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                        <input type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter email" />
                    </div>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                        <input type="password" name="password" value={password} onChange={this.onChange} placeholder="Enter Password" />
                    </div>
                    {error && <p style={{ color: "red" }}> {error} </p>}
                    <div class="clearfix">
                        <div class="form-group pull-left">
                            <button type="submit" disabled={this.isInvalid()} class="thm-btn thm-tran-bg">Login</button>
                        </div>
                        <div class="form-group social-links-two padd-top-5 pull-right">
                            Or login with
                            <button onClick={this.signInWithFacebook} id="facebook" class="img-circle facebook"><span class="fa fa-facebook-f"></span></button>
                            <button onClick={this.signInWithGoogle} id="google" class="img-circle google"><span class="fa fa-google"></span></button>
                        </div>
                    </div>
                </form>
            </div >
        );
    }

    //checks if the login info is invalid, if so, the submit button will be disabled
    isInvalid() {
        const { password, email } = this.state;
        return (password === '' || email === '');
    }
    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };

    onSubmit(event) {
        //firebase prop comes from the withFirebase higher component
        this.props.firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(authUser => {
                console.log(authUser);
                this.props.sendSignInSignal(authUser); //send Sign in signal from the connect to redux
                this.setState({ ...INITIAL_STATE }); //reset the login boxes
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
        event.preventDefault();
    };

    //KNOWN BUG : LOGGING IN WITH GOOGLE WILL DELETE ANY ACCOUNT WITH THE SAME PASSWORD: 
    //WOULD NOT DELETE DATA I THINK?
    signInWithGoogle = () => {
        this.props.firebase.auth()
            .signInWithPopup(googleProvider)
            .then(authUser => {
                console.log(authUser);
                this.props.sendSignInSignal(authUser);
                this.setState({ ...INITIAL_STATE });
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: err.message });
            });
    }
    signInWithFacebook = () => {
        this.props.firebase.auth()
            .signInWithPopup(facebookProvider)
            .then(authUser => {
                console.log(authUser);
                this.props.sendSignInSignal(authUser);
                this.setState({ ...INITIAL_STATE });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
const LoginForm = compose(
    withFirebase
)(LoginFormBase);

const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, { sendSignInSignal })(LoginForm);


