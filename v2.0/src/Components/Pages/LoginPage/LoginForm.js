import React from 'react';
import { withFirebase } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';
import { getJson, rawCall } from '../../../api/functions';
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
			< div className="styled-form login-form" style={{ height: window.screen.height, marginTop: 100 }}>
				<div className="z-depth-1" style={{padding:55, borderRadius:12}}>
					<div className="section-title style-2">
						<h3>Sign in</h3>
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
								<button type="submit" disabled={this.isInvalid()} className="thm-btn round-me raise">Sign in</button>
							</div>
							<div className="form-group social-links-two padd-top-5 pull-right">
								Or sign in with
                            {/* <button onClick={this.signInWithFacebook} id="facebook" type="button" className="img-circle facebook"><span className="fa fa-facebook-f"></span></button> */}
								<button onClick={this.signInWithGoogle} id="google" type="button" className="img-circle google round-me raise"><span className="fa fa-google"></span></button>
								<button onClick={this.signInWithFacebook} id="facebook" type="button" className="img-circle google round-me raise" style={{background:'#398add' }}><span className="fa fa-facebook"></span></button>
							</div>
						</div>
					</form>
					<p><button className=" energize-link" onClick={this.forgotPassword} > Forgot Password </button></p>
					<p> Don't have an account? <Link className="energize-link" to={this.props.links.signup}>Register Here</Link> </p>
				</div>
			</div >
		);
	}

	forgotPassword = () => {
		if (this.state.email !== '') {
			var actionCodeSettings = {
				url: window.location.href
			}
			this.props.firebase.auth().sendPasswordResetEmail(this.state.email, actionCodeSettings)
				.then(function (user) {
					alert('Please check your email...')
				}).catch(function (e) {
					/* could check that e.code == "auth/user-not-found" */
					alert(e.message)
					console.log(e)
				})
		} else {
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
					this.fetchMassToken(auth.user._lat, auth.user.email);
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
					this.fetchMassToken(auth.user._lat, auth.user.email);
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
					this.fetchMassToken(auth.user._lat, auth.user.email);
					// this.fetchAndLogin(auth.user.email).then(success => {
					// 	if (success) {
					// 		console.log('yay')
					// 	}
					// });
					this.setState({ ...INITIAL_STATE });
				})
				.catch(err => {
					this.setState({ error: err.message });
				});
		});
	}


	fetchMassToken = async (fireToken, email) => {
		const body = { idToken: fireToken };
		rawCall("auth/verify", body).then(massToken => {
			const idToken = massToken.data.idToken;
			localStorage.setItem("idToken", idToken.toString());
			this.fetchAndLogin(email).then(success => {
				if (success)
					console.log('yay');
			});

		}).catch(err => { 
			console.log("Error MASSTOKEN: ", err);
		});
	}
	fetchAndLogin = async (email) => {
		try {
			this.props.tryingToLogin(true);
			//const json2 = await getJson(`${URLS.USER}/e/${email}`);
			const json = await rawCall("auth/whoami");
			console.log("I am fetch", json);
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
		auth: store.firebase.auth,
		links: store.links,
	}
}

export default connect(mapStoreToProps, { reduxLogin, reduxLoadDone, reduxLoadTodo })(LoginForm);


