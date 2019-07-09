import React from 'react'
import { withFirebase } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { sendSignInSignal } from '../../../redux/actions/authActions'
import { sendToBackEnd } from '../../../api'
import CONST from '../../Constants'
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';

const INITIAL_STATE = {
    email: '',
    passwordOne: '',
    passwordTwo: '',

    firstName: '',
    lastName: '',
    preferredName: '',
    serviceProvider: false,

    form: 1,
    error: null,
};
class RegisterFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFinalSubmit = this.onFinalSubmit.bind(this);
    }

    render() {
        const {
            email,
            passwordOne,
            passwordTwo,
            firstName,
            lastName,
            preferredName,
            serviceProvider,
            form,
            error,
        } = this.state;

        const { auth } = this.props;
        if (auth.uid && form == 1) return <Redirect to='/profile' />;
        return (
            < div class="styled-form register-form" >
                <div class="section-title style-2">
                    <h3>Register with Google or Facebook</h3>
                </div>
                <div class="form-group social-links-three padd-top-5">
                    <button onClick={this.signInWithFacebook} id="facebook" class="img-circle facebook"><span class="fa fa-facebook-f"> Register with Facebook</span></button>
                    <button onClick={this.signInWithGoogle} id="google" class="img-circle google"><span class="fa fa-google"> Register with Google</span></button>
                </div>
                <div style = {{ width: '100%', height: '0px', borderBottom:'solid 1px black', marginBottom:'15px'}}> 

                </div>
                <div class="section-title style-2">
                    <h3>Register With Email and Password</h3>
                </div>
                {form === 1 ?
                    <form onSubmit={this.onSubmit}>
                        <div class="form-group">
                            <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                            <input type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter your email" required />
                        </div>
                        <div class="form-group">
                            <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                            <input type="password" name="passwordOne" value={passwordOne} onChange={this.onChange} placeholder="Enter your password" required />
                        </div>
                        <div class="form-group">
                            <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                            <input type="password" name="passwordTwo" value={passwordTwo} onChange={this.onChange} placeholder="Re-enter your password" required />
                        </div>
                        {error && <p style={{ color: "red" }}> {error} </p>}
                        <div class="clearfix">
                            <div class="form-group pull-left">
                                <button type="submit" disabled={this.isInvalid()} class="thm-btn">Register</button>
                            </div>
                        </div>
                    </form>
                    :
                    <form onSubmit={this.onFinalSubmit}>
                        <div class="form-group">
                            <span class="adon-icon"><span class="fa fa-user"></span></span>
                            <input type="text" name="firstName" value={firstName} onChange={this.onChange} placeholder="First Name" required />
                        </div>
                        <div class="form-group">
                            <span class="adon-icon"><span class="fa fa-user"></span></span>
                            <input type="text" name="lastName" value={lastName} onChange={this.onChange} placeholder="Last Name" required />
                        </div>
                        <div class="form-group">
                            <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                            <input type="text" name="preferredName" value={preferredName} onChange={this.onChange} placeholder="Enter a Preferred Name or Nickname" />
                        </div>
                        <label className="checkbox-container">
                            <p style={{ marginLeft: "25px" }}>Are you a Service Provider?</p>
                            <input className="checkbox" type="checkbox" name="serviceProvider" onClick={() => { this.setState({ serviceProvider: !serviceProvider }) }} checked={serviceProvider} />
                            <span className="checkmark"></span>
                        </label>
                        <div class="clearfix">
                            <div class="form-group pull-left">
                                <button type="submit" class="thm-btn">Register</button>
                            </div>
                        </div>
                    </form>
                }
            </div >
        );
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };

    isInvalid() {
        const { passwordOne, email, name, passwordTwo } = this.state;
        return (passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            name === '');
    }

    onSubmit(event) {
        event.preventDefault();
        const { email, passwordOne } = this.state;
        this.props.firebase.auth()
            .createUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.props.sendSignInSignal(authUser); //send Sign in signal from the connect to redux
                this.setState({ ...INITIAL_STATE, form: 2 });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    };
    onFinalSubmit(event) {
        event.preventDefault();
        const { auth } = this.props;
        const { firstName, lastName, preferredName, serviceProvider } = this.state;
        const fullName = firstName + " " + lastName;
        console.log(fullName);
        const user = {
            'full_name': fullName,
            'email': auth.email,
            'firebase_user_info': auth,
            'preferred_name': (preferredName !== "") ? preferredName : firstName,
            'is_service_provider': serviceProvider,
            'communities': [],
            'households': 1,
        }
        console.log("doing this now");
        // sendToBackEnd(user, CONST.URL.USER + 'create/account');
        this.setState({ ...INITIAL_STATE });
    }

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

//makes the register form have firebase and router so it can route the user if the login is successful
const RegisterForm = compose(
    withFirebase,
)(RegisterFormBase);

const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, { sendSignInSignal })(RegisterForm);
