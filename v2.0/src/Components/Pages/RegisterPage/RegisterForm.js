import React from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import ReCAPTCHA from 'react-google-recaptcha'

import { postJson, getJson } from '../../../api/functions';
import URLS from '../../../api/urls';
import { facebookProvider, googleProvider } from '../../../config/firebaseConfig';
import { reduxLogin, reduxLoadDone, reduxLoadTodo } from '../../../redux/actions/userActions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LoadingCircle from '../../Shared/LoadingCircle';
import Tooltip from '../../Shared/Tooltip';

/* Modal config */
const INITIAL_STATE = {
	email: '',
	passwordOne: '',
	passwordTwo: '',

	firstName: '',
	lastName: '',
	preferredName: '',
	serviceProvider: false,
	termsAndServices: false,
	showTOSError: false,
	showTOS: false,

	form: 1,
	error: null,
};

class RegisterFormBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			persistence: this.props.firebase.auth.Auth.Persistence.SESSION,
			form: props.form ? props.form : 1
		}

		this.onChange = this.onChange.bind(this);
		this.isInvalid = this.isInvalid.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onFinalSubmit = this.onFinalSubmit.bind(this);
	}

	render() {
		if (!this.props.auth || !this.props.user || !this.props.policies) return <LoadingCircle />

		var page;
		if (this.props.auth.isEmpty) {
			page = 1;
		} else {
			page = 2;
		}
		const TOS = this.props.policies.filter(x => x.name === "Terms of Service")[0];
		const PP = this.props.policies.filter(x => x.name === "Privacy Policy")[0];

		if (this.props.user.info && this.props.user.todo && this.props.user.done && this.props.auth.emailVerified) {
			return <Redirect to={this.props.links.profile} />;
		}
		return (
			<>
				<div>
					{this.renderPage(page)}
				</div>
				<Modal show={this.state.showTOS} onHide={() => this.setState({ showTOS: false })} centered>
					<Modal.Header closeButton>
						<Modal.Title>Terms of Service</Modal.Title>
					</Modal.Header>
					<Modal.Body dangerouslySetInnerHTML={{ __html: TOS ? TOS.description : 'The Terms of Service failed to load or does not exist' }} style={{ maxHeight: "50vh", overflowY: "scroll" }}></Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => this.setState({ showTOS: false })}>
							Close
                        </Button>
					</Modal.Footer>
				</Modal>
				<Modal show={this.state.showPP} onHide={() => this.setState({ showPP: false })} centered>
					<Modal.Header closeButton>
						<Modal.Title>Privacy Policy</Modal.Title>
					</Modal.Header>
					<Modal.Body dangerouslySetInnerHTML={{ __html: PP ? PP.description : 'The privacy policy failed to load or does not exist' }} style={{ maxHeight: "50vh", overflowY: "scroll" }}></Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => this.setState({ showPP: false })}>
							Close
                        </Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}

	renderPage = (page) => {
		console.log(page)
		if (page === 1) {
			return this.renderPage1()
		} else if (page === 2) {
			return this.renderPage2()
		} else if (page === 3) {
			return this.renderPage3()
		}
	}
	renderPage1 = () => {
		const {
			email,
			passwordOne,
			passwordTwo,
			error,
		} = this.state;
		return (
			< div className="styled-form register-form" >
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
					<br />
					{error && <p style={{ color: "red" }}> {error} </p>}
					<div className="clearfix">
						<div className="form-group pull-left">
							<button type="submit" disabled={this.isInvalid()} className="thm-btn">Create Account</button>
						</div>
					</div>
				</form>
				<div style={{ width: '100%', height: '0px', borderBottom: 'solid 1px black', marginBottom: '15px' }}>
				</div>
				<div className="section-title style-2">
					<h3>Register with Google or Facebook</h3>
				</div>
				<div className="form-group social-links-three padd-top-5">
					<button onClick={this.signInWithFacebook} id="facebook" className="img-circle facebook"><span className="fa fa-facebook-f"> Register with Facebook</span></button>
					<button onClick={this.signInWithGoogle} id="google" className="img-circle google"><span className="fa fa-google"> Register with Google</span></button>
				</div>
				Already have an account? <Link to={this.props.links.signin}>Sign In</Link>
			</div>
		);
	}
	renderPage2 = () => {
		const {
			firstName,
			lastName,
			preferredName,
			serviceProvider,
			termsAndServices,
		} = this.state;
		return (
			< div className="styled-form register-form" >
				<form onSubmit={this.onFinalSubmit}>
					{!this.props.firebase.auth().currentUser.emailVerified ?
						<>
							<p> We sent a link to your email address. Please verify your email and sign in to continue.
                                    <button type='button' className="as-link" onClick={this.sendVerificationEmail}> Resend Verification Email </button>
								<br />
								<Link to={this.props.links.signin} onClick={() => this.props.firebase.auth().signOut()}> Sign in</Link>
							</p>
						</>
						:
						<>
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
								<input className="checkbox" type="checkbox" name="serviceProvider" onChange={() => { this.setState({ serviceProvider: !serviceProvider }) }} checked={serviceProvider} />
								<span className="checkmark"></span>
								<p style={{ marginLeft: "25px" }}>Are you a Service Provider?</p>
							</label>
							<label className="checkbox-container">
								<input className="checkbox" type="checkbox" name="termsAndServices" onChange={() => { this.setState({ termsAndServices: !termsAndServices }) }} checked={termsAndServices} />
								<span className="checkmark"></span>
								<p style={{ marginLeft: "25px" }}>I agree to MassEnergize’s <button type='button' onClick={() => this.setState({ showTOS: true })} className='as-link' style={{ display: 'inline-block' }}>Terms of Service</button> and <button type='button' onClick={() => this.setState({ showPP: true })} className='as-link' style={{ display: 'inline-block' }}>Privacy Policy</button></p>
								{/* <span className="text-danger mb-3 small" style={{ display: (this.state.showTOSError) ? "block" : "none" }}>You need to agree to the terms of service!</span> */}
							</label>
							<ReCAPTCHA
								sitekey="6LcLsLUUAAAAAL1MkpKSBX57JoCnPD389C-c-O6F"
								onChange={this.onReCaptchaChange}
							/>
						</>
					}
					{this.state.error && <p style={{ color: "red" }}> {this.state.error} </p>}
					<div className="clearfix">
						<div className="form-group pull-left">
							{this.props.auth.emailVerified ?
								<button type="submit" className="thm-btn" >
									Finish Creating Account
                                </button> : null
							}
							<Tooltip text='Cancling in the middle of registration will delete your account'>
								<button onClick={this.deleteFirebaseAccount} className="thm-btn red"> Cancel </button>
							</Tooltip>
						</div>
					</div>
				</form>
			</div>
		)
	}

	sendVerificationEmail = () => {
		console.log(process.env.EMAIL_REDIRECT_URL)
		this.props.firebase.auth().currentUser.sendEmailVerification().then(() => console.log('email sent'));
	}
	onReCaptchaChange = (value) => {
		if (!value) {
			this.setState({ captchaConfirmed: false });
		}
		postJson(URLS.VERIFY, { 'captchaString': value }).then(response => {
			console.log(response)
			if (response.success && response.data.success) this.setState({ 'captchaConfirmed': true });
		})
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

		this.props.firebase.auth().setPersistence(this.state.persistence).then(() => {
			this.props.firebase.auth()
				.createUserWithEmailAndPassword(email, passwordOne)
				.then(authUser => {
					this.setState({ ...INITIAL_STATE, form: 2 });
					this.sendVerificationEmail();
				})
				.catch(err => {
					this.setState({ error: err.message });
				});
		});
	};
	onFinalSubmit(event) {
		event.preventDefault();
		if (!this.state.termsAndServices) {
			this.setState({ error: 'You need to agree to the terms and services' });
		} else if (!this.state.captchaConfirmed) {
			this.setState({ error: 'Invalid reCAPTCHA, please try again' });
		} else {
			/** Collects the form data and sends it to the backend */
			const { firstName, lastName, preferredName, serviceProvider, termsAndServices } = this.state;
			if (!termsAndServices) {
				this.setState({ showTOSError: true });
				return;
			}
			const { auth } = this.props;
			const body = {
				"full_name": firstName + ' ' + lastName,
				"preferred_name": preferredName === "" ? firstName : preferredName,
				"email": auth.email,
				// "id": auth.uid,
				"is_vendor": serviceProvider,
				"accepts_terms_and_conditions": termsAndServices
			}
			postJson(URLS.USERS, body).then(json => {
				console.log(json);
				if (json && json.success && json.data) {
					this.fetchAndLogin(json.data.email).then(success => {
						if (!success) {
							this.setState({ error: 'Failed to Register' })
						}
					});
				}
			})
			this.setState({ ...INITIAL_STATE });
		}
	}

	deleteFirebaseAccount = () => {
		this.props.firebase.auth().currentUser.delete();
		this.props.firebase.auth().signOut();
	}

	//KNOWN BUG : LOGGING IN WITH GOOGLE WILL DELETE ANY ACCOUNT WITH THE SAME PASSWORD: 
	//WOULD NOT DELETE DATA I THINK?
	signInWithGoogle = () => {

		this.props.firebase.auth().setPersistence(this.state.persistence).then(() => {
			this.props.firebase.auth()
				.signInWithPopup(googleProvider)
				.then(auth => {
					console.log(auth);
					this.fetchAndLogin(auth.user.email).then(success => {
					});
					this.setState({ ...INITIAL_STATE, form: 2 });
				})
				.catch(err => {
					console.log(err);
					this.setState({ ...INITIAL_STATE, form: 2 });
				});
		});

	}
	signInWithFacebook = () => {
		this.props.firebase.auth().setPersistence(this.state.persistence).then(() => {
			this.props.firebase.auth()
				.signInWithPopup(facebookProvider)
				.then(auth => {
					this.fetchAndLogin(auth.user.email);
					if (!auth.emailVerified) this.sendVerificationEmail();
					this.setState({ ...INITIAL_STATE });
				})
				.catch(err => {
					this.setState({ error: err.message });
				});
		});
	}

	fetchAndLogin = async (email) => {
		try {
			const json = await getJson(`${URLS.USER}/e/${email}`);
			if (json.success && json.data) {
				this.props.reduxLogin(json.data);

				const todo = await getJson(`${URLS.USER}/e/${email}/actions?status=TODO`)
				this.props.reduxLoadTodo(todo.data);
				const done = await getJson(`${URLS.USER}/e/${email}/actions?status=DONE`)
				this.props.reduxLoadDone(done.data);
				return true;
			}
			console.log('fetch and login failed');
			return false;
		}
		catch (err) {
			console.log(err);
			return false;
		}
	}
}

//makes the register form have firebase and router so it can route the user if the login is successful
const RegisterForm = compose(
	withFirebase,
)(RegisterFormBase);

const mapStoreToProps = (store) => {
	return {
		auth: store.firebase.auth,
		user: store.user,
		policies: store.page.policies,
		links: store.links
	}
}
export default connect(mapStoreToProps, { reduxLogin, reduxLoadDone, reduxLoadTodo })(RegisterForm);
