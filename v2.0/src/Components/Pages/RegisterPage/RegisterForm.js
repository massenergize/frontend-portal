import React from 'react'
import { withFirebase } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { sendSignInSignal } from '../../../redux/actions/authActions'
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';
//import { sendToBackEnd } from '../../../api'
import URLS from '../../api_v2'

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
        this.state = { ...INITIAL_STATE, form: props.form ? props.form : 1 };

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
        console.log("AUTUTUTHTH: " + JSON.stringify(auth));
        if (auth.uid && form === 1) return <Redirect to='/profile' />;
        return (
            <div>
                {form === 1 ?
                    < div className="styled-form register-form" >
                        <div className="section-title style-2">
                            <h3>Register with Google or Facebook</h3>
                        </div>
                        <div className="form-group social-links-three padd-top-5">
                            <button onClick={this.signInWithFacebook} id="facebook" className="img-circle facebook"><span className="fa fa-facebook-f"> Register with Facebook</span></button>
                            <button onClick={this.signInWithGoogle} id="google" className="img-circle google"><span className="fa fa-google"> Register with Google</span></button>
                        </div>
                        <div style={{ width: '100%', height: '0px', borderBottom: 'solid 1px black', marginBottom: '15px' }}>

                        </div>
                        <div className="section-title style-2">
                            <h3>Register With Email and Password</h3>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <span className="adon-icon"><span className="fa fa-envelope-o"></span></span>
                                <input type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter your email" required />
                            </div>
                            <div className="form-group">
                                <span className="adon-icon"><span className="fa fa-unlock-alt"></span></span>
                                <input type="password" name="passwordOne" value={passwordOne} onChange={this.onChange} placeholder="Enter your password" required />
                            </div>
                            <div className="form-group">
                                <span className="adon-icon"><span className="fa fa-unlock-alt"></span></span>
                                <input type="password" name="passwordTwo" value={passwordTwo} onChange={this.onChange} placeholder="Re-enter your password" required />
                            </div>
                            {error && <p style={{ color: "red" }}> {error} </p>}
                            <div className="clearfix">
                                <div className="form-group pull-left">
                                    <button type="submit" disabled={this.isInvalid()} className="thm-btn">Register</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    :
                    < div className="styled-form register-form" >
                        <form onSubmit={this.onFinalSubmit}>
                            <div className="form-group">
                                <span className="adon-icon"><span className="fa fa-user"></span></span>
                                <input type="text" name="firstName" value={firstName} onChange={this.onChange} placeholder="First Name" required />
                            </div>
                            <div className="form-group">
                                <span className="adon-icon"><span className="fa fa-user"></span></span>
                                <input type="text" name="lastName" value={lastName} onChange={this.onChange} placeholder="Last Name" required />
                            </div>
                            <div className="form-group">
                                <span className="adon-icon"><span className="fa fa-envelope-o"></span></span>
                                <input type="text" name="preferredName" value={preferredName} onChange={this.onChange} placeholder="Enter a Preferred Name or Nickname" />
                            </div>
                            <label className="checkbox-container">
                                <p style={{ marginLeft: "25px" }}>Are you a Service Provider?</p>
                                <input className="checkbox" type="checkbox" name="serviceProvider" onClick={() => { this.setState({ serviceProvider: !serviceProvider }) }} checked={serviceProvider} />
                                <span className="checkmark"></span>
                            </label>
                            <div className="clearfix">
                                <div className="form-group pull-left">
                                    <button type="submit" className="thm-btn">Register</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
            </div>
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
                //this.props.sendSignInSignal(authUser); //send Sign in signal from the connect to redux
                this.setState({ ...INITIAL_STATE, form: 2 });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    };
    onFinalSubmit(event) {
        event.preventDefault();
        /** Collects the form data and sends it to the backend */
        const { firstName, lastName, preferredName, serviceProvider } = this.state;
        const { auth } = this.props;
        const body = {
            "full_name": firstName + ' ' +  lastName,
            "preferred_name": preferredName === ""? firstName : preferredName,
            "email": auth.email,
            // "id": auth.uid,
            "is_vendor": serviceProvider,
        }
        fetch(URLS.USERS, {
            method: 'post',
            body: JSON.stringify(body),
            //headers: put the csrf token here I guess
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
        })
        this.setState({ ...INITIAL_STATE });
    }

    //KNOWN BUG : LOGGING IN WITH GOOGLE WILL DELETE ANY ACCOUNT WITH THE SAME PASSWORD: 
    //WOULD NOT DELETE DATA I THINK?
    signInWithGoogle = () => {
        this.props.firebase.auth()
            .signInWithPopup(googleProvider)
            .then(authUser => {
                console.log(authUser);
                //this.props.sendSignInSignal(authUser);
                this.setState({ ...INITIAL_STATE, form: 2 });
            })
            .catch(err => {
                console.log(err);
                this.setState({ ...INITIAL_STATE, form: 2 });
            });
    }
    signInWithFacebook = () => {
        this.props.firebase.auth()
            .signInWithPopup(facebookProvider)
            .then(authUser => {
                console.log(authUser);
                //this.props.sendSignInSignal(authUser);
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
