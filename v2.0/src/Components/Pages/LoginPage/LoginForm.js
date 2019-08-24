import React from 'react';
import { withFirebase } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';
import { getJson } from '../../../api/functions';
import URLS from '../../../api/urls'
import { reduxLogin, reduxLoadDone, reduxLoadTodo } from '../../../redux/actions/userActions';



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
        this.state = {
            ...INITIAL_STATE, persistence: props.firebase.auth.Auth.Persistence.SESSION
        };

        this.onChange = this.onChange.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        const { email, password, error } = this.state;
        return (
            < div className="styled-form login-form" >
                <div className="section-title style-2">
                    <h3>Login</h3>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <span className="adon-icon"><span className="fa fa-envelope-o"></span></span>
                        <input type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <span className="adon-icon"><span className="fa fa-unlock-alt"></span></span>
                        <input type="password" name="password" value={password} onChange={this.onChange} placeholder="Enter Password" />
                    </div>
                    {error && <p style={{ color: "red" }}> {error} </p>}
                    <div className="clearfix">
                        <div className="form-group pull-left">
                            <button type="submit" disabled={this.isInvalid()} className="thm-btn">Login</button>
                        </div>
                        <div className="form-group social-links-two padd-top-5 pull-right">
                            Or login with
                            <button onClick={this.signInWithFacebook} id="facebook" type="button" className="img-circle facebook"><span className="fa fa-facebook-f"></span></button>
                            <button onClick={this.signInWithGoogle} id="google" type="button" className="img-circle google"><span className="fa fa-google"></span></button>
                        </div>
                    </div>
                </form>
                <p><button className="as-link" onClick={this.forgotPassword}> Forgot Password </button></p>
                <p> Don't have an account? <Link to="/register">Register Here</Link> </p>
            </div >
        );
    }

    forgotPassword = () => {
        if(this.state.email !== ''){
        this.props.firebase.auth().sendPasswordResetEmail(this.state.email)
          .then(function (user) {
            alert('Please check your email...')
          }).catch(function (e) {
            console.log(e)
          })
        }else{
            this.setState({
                error: 'Enter your email to reset your password'
            })
        }
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
        this.props.firebase.auth().setPersistence(this.state.persistence).then(() => {
            this.props.firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(auth => {
                    console.log(auth.user);
                    this.fetchAndLogin(auth.user.email).then(success => {
                        if (success)
                            console.log('yay');
                    });
                    this.setState({ ...INITIAL_STATE }); //reset the login boxes
                })
                .catch(err => {
                    this.setState({ error: err.message });
                });
        });
        event.preventDefault();
    };

    //KNOWN BUG : LOGGING IN WITH GOOGLE WILL DELETE ANY ACCOUNT WITH THE SAME PASSWORD: 
    //WOULD NOT DELETE DATA I THINK?
    signInWithGoogle = () => {
        this.props.firebase.auth().setPersistence(this.state.persistence).then(() => {
            this.props.firebase.auth()
                .signInWithPopup(googleProvider)
                .then(auth => {
                    console.log(auth);
                    this.fetchAndLogin(auth.user.email).then(success => {
                        if (success)
                            console.log('yay');
                    });
                    this.setState({ ...INITIAL_STATE });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: err.message });
                });
        });
    }
    signInWithFacebook = () => {
        this.props.firebase.auth().setPersistence(this.state.persistence).then(() => {
            this.props.firebase.auth()
                .signInWithPopup(facebookProvider)
                .then(auth => {
                    this.fetchAndLogin(auth.user.email).then(success => {
                        if (success) {
                            console.log('yay')
                        }
                    });
                    this.setState({ ...INITIAL_STATE });
                })
                .catch(err => {
                    this.setState({ error: err.message });
                });
        });
    }

    fetchAndLogin = async (email) => {
        try {
            this.props.tryingToLogin(true);
            const json = await getJson(`${URLS.USER}/e/${email}`);
            if (json.success && json.data) {
                this.props.reduxLogin(json.data);

                const todo = await getJson(`${URLS.USER}/e/${email}/actions?status=TODO`)
                this.props.reduxLoadTodo(todo.data);
                const done = await getJson(`${URLS.USER}/e/${email}/actions?status=DONE`)
                this.props.reduxLoadDone(done.data);
                this.props.tryingToLogin(false);
                return true;
            }
            console.log('fetch and login failed');
            this.props.tryingToLogin(false);
            return false;
        }
        catch (err) {
            console.log(err);
            this.props.tryingToLogin(false);
            return false;
        }
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

export default connect(mapStoreToProps, { reduxLogin, reduxLoadDone, reduxLoadTodo })(LoginForm);


