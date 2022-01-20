import React from "react";
import { connect } from "react-redux";
import { withFirebase } from "react-redux-firebase";
import { Link, Redirect } from "react-router-dom";
import { compose } from "recompose";
import ReCAPTCHA from "react-google-recaptcha";
import { apiCall } from "../../../api/functions";
import {
  facebookProvider,
  googleProvider,
} from "../../../config/firebaseConfig";
import {
  reduxLogin,
  reduxLoadDone,
  reduxLoadTodo,
} from "../../../redux/actions/userActions";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import LoadingCircle from "../../Shared/LoadingCircle";
import MEButton from "../Widgets/MEButton";
import METextView from "../Widgets/METextView";
import ProductTour from "react-joyride";
import { handleTourCallback, handleCloseTourWithBtn } from "../../Utils";
//import { helpers } from "chart.js";
/* Modal config */
const INITIAL_STATE = {
  email: "",
  passwordOne: "",
  passwordTwo: "",

  firstName: "",
  lastName: "",
  preferredName: "",
  city: "",
  state: "",
  zip: "",
  serviceProvider: false,
  termsAndServices: false,
  showTOSError: false,
  showTOS: false,
  form: 1,
  error: null,
  color: "#00000000",
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class RegisterFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_using_facebook: false,
      ...INITIAL_STATE,
      persistence: this.props.firebase.auth.Auth.Persistence.SESSION,
      form: props.form ? props.form : 1,
      email: null,
      selectedSignInOption: "passwordless",
    };

    this.onChange = this.onChange.bind(this);
    this.isInvalid = this.isInvalid.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmit = this.onFinalSubmit.bind(this);
    this.setRegProtocol = this.setRegProtocol.bind(this);
    //const { id } = this.props.match.params;
    //console.log(id);
  }

  componentDidMount() {
    if (this.props.auth.email) {
      const body = { email: this.props.auth.email };
      apiCall("users.checkImported", body)
        .then((json) => {
          if (json.success && json.data.imported) {
            this.setState({
              firstName: json.data.firstName,
              lastName: json.data.lastName,
              preferredName: json.data.preferredName,
              specialUser: true,
            });
          } else {
            console.log(json.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  getRegProtocol() {
    return localStorage.getItem("reg_protocol");
  }
  setRegProtocol() {
    window.localStorage.setItem("reg_protocol", "show");
  }

  render() {
    if (!this.props.auth || !this.props.user) {
      return <LoadingCircle />;
    }
    const policies = this.props.policies || [];

    this.completeSignInWithEmail();

    var page;
    if (this.props.auth.isEmpty) {
      page = 1;
    } else {
      page = 2;
    }
    const [TOS] = policies.filter((x) => x.name === "Terms of Service") || "";

    const [PP] = policies.filter((x) => x.name === "Privacy Policy") || "";

    if (
      this.props.user.info &&
      this.props.user.todo &&
      this.props.user.done &&
      this.props.auth.emailVerified &&
      this.props.user.accepts_terms_and_conditions
    ) {
      return <Redirect to={this.props.links.profile} />;
    }

    return (
      <>
        <div>{this.renderPage(page)}</div>
        <Modal
          show={this.state.showTOS}
          onHide={() => this.setState({ showTOS: false })}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Terms of Service</Modal.Title>
          </Modal.Header>
          <Modal.Body
            dangerouslySetInnerHTML={{
              __html: TOS
                ? TOS.description
                : "The Terms of Service failed to load or does not exist",
            }}
            style={{ maxHeight: "50vh", overflowY: "scroll" }}
          ></Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showTOS: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showPP}
          onHide={() => this.setState({ showPP: false })}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Privacy Policy</Modal.Title>
          </Modal.Header>
          <Modal.Body
            dangerouslySetInnerHTML={{
              __html: PP
                ? PP.description
                : "The privacy policy failed to load or does not exist",
            }}
            style={{ maxHeight: "50vh", overflowY: "scroll" }}
          ></Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showPP: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  renderPage = (page) => {
    if (page === 1) {
      return this.renderPage1();
    } else if (page === 2) {
      return this.renderPage2();
    }
    /*else if (page === 3) {
			return this.renderPage3() 
		}*/
  };

  renderPage1 = () => {
    const { email, passwordOne, passwordTwo, error } = this.state;

    const pageData = this.props.registerPage;
    //if (pageData == null) return <LoadingCircle />;

    const title = pageData?.title
      ? pageData.title
      : (this.state.selectedSignInOption === "password" ? "Enter your Email and a Password" : "Enter your Email");
    const description = pageData?.description
      ? pageData.description
      : "This helps us count your impact correctly, and avoid double counting. We collect no sensitive personal data, and do not share data.";

    const seen_tour = window.localStorage.getItem("seen_community_portal_tour");
    const community_name = `${this.props.community.name}`;

    const steps = [
      {
        target: "body",
        title: (
          <strong style={{ fontSize: 16 }}>
            Join the {community_name} community
          </strong>
        ),
        content: (
          <>
            Be part of this amazing community. Enter your email and a password.
            Use Google or Facebook for faster sign up. Together we make a
            difference!
            <div
              style={{
                position: "absolute",
                top: 185,
                left: 25,
              }}
            >
              <Link
                onClick={handleCloseTourWithBtn}
                style={{ color: "black", cursor: "pointer", fontSize: 14 }}
                to={this.props.links.home}
              >
                Back to Home
              </Link>
            </div>
          </>
        ),
        locale: {
          last: "End Tour & Sign Up",
        },
        placement: "center",
        spotlightClicks: true,
        disableBeacon: true,
        hideFooter: false,
      },
    ];

    return (
      <div
        className="styled-form register-form"
        style={{ height: window.screen.height - 60, marginTop: 15 }}
      >
        {seen_tour === "true" ? null : (
          <ProductTour
            steps={steps}
            continuous
            showSkipButton
            disableScrolling={true}
            callback={handleTourCallback}
            getHelpers={this.getHelpers}
            debug
            styles={{
              options: {
                arrowColor: "#eee",
                backgroundColor: "#eee",
                primaryColor: "#8CC43C",
                textColor: "black",
                width: 400,
                zIndex: 1000,
              },
            }}
          />
        )}

        <div
          className="z-depth-float me-anime-fade-in-up"
          style={{ padding: 46, borderRadius: 12 }}
        >
          <div className="section-title style-2">
            <h3>{title}</h3>
            <p> {description}</p>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <span className="adon-icon">
                <span className="fa fa-envelope-o"></span>
              </span>
              <input
                id="email"
                type="email"
                name="email"
                value={email || ""}
                onChange={this.onChange}
                placeholder="Enter your email"
                required
              />
            </div>
            {this.state.selectedSignInOption === "password" ? <div>
              <div className="form-group">
                <span className="adon-icon">
                  <span className="fa fa-unlock-alt"></span>
                </span>
                <input
                  id="password"
                  type="password"
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="form-group">
                <span className="adon-icon">
                  <span className="fa fa-unlock-alt"></span>
                </span>
                <input
                  id="confirm-password"
                  type="password"
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                  placeholder="Re-enter your password"
                  required
                />
              </div>
            </div> : <div/>}
            <br />
            {error && <p style={{ color: "red" }}> {error} </p>}
            <div className="radio">
              <label>
                <input type="radio" value="passwordless" 
                              checked={this.state.selectedSignInOption === "passwordless"} 
                              onChange={this.handleSignInOptionChange} />
                <p>Passwordless</p>
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="password" 
                              checked={this.state.selectedSignInOption === "password"} 
                              onChange={this.handleSignInOptionChange} />
                <p>With Password</p>
              </label>
            </div>
            <div className="clearfix">
              <div className="form-group pull-left">
                <MEButton
                  type="submit"
                  disabled={this.isInvalid()}
                  id="create-profile-btn"
                >
                  Create Profile
                </MEButton>
                <small style={{ margin: "0px 15px" }}>
                  <b>OR USE</b>
                </small>
                <MEButton
                  onClick={this.signInWithGoogle}
                  className="me-google-btn"
                >
                  Google
                </MEButton>
                {/* ---------------- fACEBOOK WILL BE RE-ENABLED LATER -------------- */}
                {/* ---------------- BHN testing new facebook project login -------------- */}
                <MEButton
                  onClick={this.signInWithFacebook}
                  className="me-facebook-btn"
                >
                  Facebook
                </MEButton>
              </div>
            </div>
          </form>
          {/* <div
            style={{
              width: "100%",
              height: "0px",
              borderBottom: "solid 1px black",
              marginBottom: "15px",
            }}
          ></div> */}
          {/* <div className="section-title style-2" style={{ marginBottom: 9 }}>
            <h3>Register with</h3>
          </div>
          <div className="form-group social-links-three padd-top-5">
            <button onClick={this.signInWithFacebook} id="facebook" className="img-circle facebook"><span className="fa fa-facebook-f"> Register with Facebook</span></button>
            <button
              style={{
                borderRadius: 5,
                padding: "0px 30px",
                background: "#398add",
              }}
              onClick={this.signInWithFacebook}
              id="google"
              className="img-circle google cool-font round-me raise"
            >
              <span className="fa fa-facebook"></span>acebook
            </button>
            <button
              style={{ float: "left", borderRadius: 5, padding: "0px 30px" }}
              onClick={this.signInWithGoogle}
              id="google"
              className="img-circle google cool-font round-me raise"
            >
              <span className="fa fa-google"></span>oogle
            </button>
          </div> */}
          {this.state.is_using_facebook && (
            <METextView style={{ color: "darkorange", fontSize: 16 }}>
              <strong>Note</strong>: If you are using facebook, please make sure
              the facebook account you intend to register with has a dedicated
              primary email.
            </METextView>
          )}
          <p>
            <Link
              className="energize-link"
              style={{ textDecoration: "underline" }}
              to={this.props.links.signin}
            >
              I have a profile already
            </Link>
          </p>{" "}
        </div>
      </div>
    );
  };
  renderPage2 = () => {
    const {
      firstName,
      lastName,
      preferredName,
      city,
      state,
      zip,
      //serviceProvider,
      //termsAndServices,
    } = this.state;

    //before the app gets here, the reg protocol would have been set to indicate whether or not the user is registering or just logging in
    //if they are login in, the loading circle will show, otherwise, the appropriate value will be set to allow the
    //loading circle to be skipped and to show the form
    if (!this.getRegProtocol()) {
      return <LoadingCircle />;
    }
    return (
      <div
        className="styled-form register-form"
        style={{ height: window.screen.height, marginTop: 100 }}
      >
        <div className="z-depth-1" style={{ padding: 40, borderRadius: 12 }}>
          <form onSubmit={this.onFinalSubmit}>
            {this.props.firebase.auth().currentUser &&
            !this.props.firebase.auth().currentUser.emailVerified ? (
              <>
                <p id="verify-email-area">
                  {" "}
                  We sent a link to your email address. Please check your email
                  and follow the link to continue. If you don't see a message,
                  be sure to{" "}
                  <strong style={{ color: "maroon" }}>
                    <em>check your spam folder.</em>
                  </strong>
                  <button
                    type="button"
                    className="as-link"
                    onClick={this.sendVerificationEmail}
                  >
                    {" "}
                    Didnt receive any verification email? Resend Verification
                    Email{" "}
                  </button>
                  <br />
                  <Link
                    id="sign-in-anchor"
                    to={this.props.links.signin}
                    onClick={() => this.props.firebase.auth().signOut()}
                  >
                    {" "}
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <>
                <center>
                  <p style={{ color: "red" }}>
                    {" "}
                    Please finish creating your profile before you continue
                    {this.state.specialUser ? (
                      <p>
                        Welcome! You have been invited by a community admin to
                        this MassEnergize Community.
                      </p>
                    ) : (
                      <></>
                    )}
                  </p>
                </center>
                <div className="form-group">
                  <span className="adon-icon">
                    <span className="fa fa-user"></span>
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={this.onChange}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <span className="adon-icon">
                    <span className="fa fa-user"></span>
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={this.onChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <span className="adon-icon">
                    <span className="fa fa-user"></span>
                  </span>
                  <input
                    type="text"
                    name="preferredName"
                    value={preferredName}
                    onChange={this.onChange}
                    placeholder="Preferred Name (visible to others)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={this.onChange}
                    placeholder="City / Town"
                  />
                </div>
                <div className="form-group">
                  <select
                    value={state}
                    className="form-control"
                    onChange={(event) =>
                      this.setState({ state: event.target.value })
                    }
                    placeholder="State"
                  >
                    <option value="">State</option>
                    <option value="">--</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">Washington, D.C.</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="zip"
                    value={zip}
                    onChange={this.onChange}
                    placeholder="Home ZIP Code"
                    required
                  />
                </div>
                <ReCAPTCHA
                  sitekey="6LcLsLUUAAAAAL1MkpKSBX57JoCnPD389C-c-O6F"
                  onChange={this.onReCaptchaChange}
                />
                <br />
                <p style={{ marginLeft: "25px" }}>
                  By continuing, I accept the{" "}
                  <button
                    type="button"
                    onClick={() => this.setState({ showPP: true })}
                    className="as-link"
                    style={{ display: "inline-block" }}
                  >
                    Privacy Policy
                  </button>{" "}
                  (in short, MassEnergize or host organization won't share my
                  data) and agree to comply with the{" "}
                  <button
                    type="button"
                    onClick={() => this.setState({ showTOS: true })}
                    className="as-link"
                    style={{ display: "inline-block" }}
                  >
                    Terms of Service
                  </button>
                </p>
              </>
            )}
            {this.state.error && (
              <p style={{ color: "red" }}> {this.state.error} </p>
            )}
            <br />
            <div className="clearfix">
              <div className="form-group pull-left">
                {this.props.auth.emailVerified ? (
                  <MEButton
                    style={{ marginRight: 8, padding: "11px 40px" }}
                    type="submit"
                  >
                    Finish Creating Profile
                  </MEButton>
                ) : null}
                {/* <Tooltip text="Cancelling in the middle of registration will delete your profile"> */}
                <MEButton
                  variation="accent"
                  onClick={this.deleteFirebaseAccount}
                  style={{ marginLeft: 10 }}
                >
                  {" "}
                  Cancel{" "}
                </MEButton>
                {this.renderCreationStatus()}
                {/* </Tooltip> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  renderCreationStatus() {
    const { creating } = this.state;
    if (creating)
      return (
        <p style={{ color: "#8dc343" }}>
          <span className="fa fa-spinner fa-spin"></span> Creating, please
          wait...
        </p>
      );
  }
  sendVerificationEmail = () => {
    var str = window.location.href;
    var n = str.lastIndexOf("/");
    const suffix = this.props.is_sandbox ? "?sandbox=true" : "";
    var redirect = str.substring(0, n) + "/signin" + suffix;
    var actionCodeSettings = {
      url: redirect,
    };
    this.props.firebase
      .auth()
      .currentUser.sendEmailVerification(actionCodeSettings);
  };
  onReCaptchaChange = (value) => {
    if (!value) {
      this.setState({ captchaConfirmed: false });
    }
    apiCall("auth.verifyCaptcha", { captchaString: value }).then((response) => {
      if (response && response.data && response.data.success)
        this.setState({ captchaConfirmed: true });
    });
  };
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  isInvalid() {
    const { passwordOne, email, name, passwordTwo } = this.state;
    if (this.state.selectedSignInOption === "password") {
      return passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      name === "";
    } else if (this.state.selectedSignInOption === "passwordless") {
      return email === "" || email === null;
    };
  }

  onSubmit(event) {
    this.setRegProtocol();
    event.preventDefault();
    const { email, passwordOne } = this.state;
    if (this.state.selectedSignInOption === "password") {
      this.props.firebase
      .auth()
      .setPersistence(this.state.persistence)
      .then(() => {
        this.props.firebase
          .auth()
          .createUserWithEmailAndPassword(email, passwordOne)
          .then((authUser) => {
            this.setState({ ...INITIAL_STATE, form: 2 });
            this.sendVerificationEmail();
          })
          .catch((err) => {
            this.setState({ error: err.message });
          });
      });
    } else if (this.state.selectedSignInOption === "passwordless") {
      this.signInWithEmail();
    };
    
  }

  signInWithEmail = () => {
    // console.log(window.location.href)
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.massenergize.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: window.location.href,
      // This must be true.
      handleCodeInApp: true,
    };
    this.props.firebase
      .auth()
      .sendSignInLinkToEmail(this.state.email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. 
        // TODO: Inform the user.
        alert("Please check your email for a new sign in link.");
        console.log("Email sent!")
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', this.state.email);
        // ...
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: err.message });
      });
  };
  completeSignInWithEmail = () => {
    // Confirm the link is a sign-in with email link.
    if (this.props.firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email again for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      this.props.firebase.auth().signInWithEmailLink(email, window.location.href)
        .then((auth) => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          // TODO: Redirect to home
          this.fetchMassToken(auth.user._lat, auth.user.email);
          this.setState({ ...INITIAL_STATE });
          window.location.href = window.location.origin + this.props.links.home;
        })
        .catch((err) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.log(err);
        });
    }
  };
  //for generating the profile picture before the user can upload one when they go back to edit their profile

  onFinalSubmit(event) {
    event.preventDefault();
    //if (!this.state.termsAndServices) {
    //  this.setState({ error: "You need to agree to the terms and services" });
    //} else
    if (!this.state.captchaConfirmed) {
      this.setState({ error: "Invalid reCAPTCHA, please try again" });
    } else {
      /** Collects the form data and sends it to the backend */
      const {
        firstName,
        lastName,
        preferredName,
        city,
        state,
        zip,
        //serviceProvider,
        //termsAndServices,
      } = this.state;
      //if (!termsAndServices) {
      //  this.setState({ showTOSError: true });
      //  return;
      //}
      const { auth, community } = this.props;
      const location = " , " + city + ", " + state + ", " + zip;
      const body = {
        full_name: firstName + " " + lastName,
        preferred_name: preferredName === "" ? firstName : preferredName,
        email: auth.email,
        location: location,
        //is_vendor: serviceProvider,
        is_vendor: false,
        accepts_terms_and_conditions: true,
        //accepts_terms_and_conditions: termsAndServices,
        subdomain: community && community.subdomain,
        color: getRandomColor(),
      };
      this.setState({ creating: true });
      apiCall("users.create", body)
        .then((json) => {
          var token = this.props.auth
            ? this.props.auth.stsTokenManager.accessToken
            : null;
          var email = this.props.auth ? this.props.auth.email : null;
          if (json && json.success && json.data) {
            this.fetchMassToken(token, email);
            window.location = this.props.links.profile;
          } else {
            this.setState({ creating: false });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ ...INITIAL_STATE, creating: false });
        });
      //this.setState({ ...INITIAL_STATE });
    }
  }

  deleteFirebaseAccount = () => {
    window.localStorage.removeItem("reg_protocol");
    this.props.firebase.auth().currentUser.delete();
    this.props.firebase.auth().signOut();
  };

  //KNOWN BUG : LOGGING IN WITH GOOGLE WILL DELETE ANY ACCOUNT WITH THE SAME PASSWORD:
  //WOULD NOT DELETE DATA I THINK?
  signInWithGoogle = () => {
    this.props.firebase
      .auth()
      .setPersistence(this.state.persistence)
      .then(() => {
        this.props.firebase
          .auth()
          .signInWithPopup(googleProvider)
          .then((auth) => {
            this.fetchMassToken(auth.user._lat, auth.user.email);
          })
          .catch((err) => {
            console.log(err);
            this.setState({ ...INITIAL_STATE, form: 2 });
          });
      });
  };
  handleSignInOptionChange = (changeEvent) => {
    this.setState({
      selectedSignInOption: changeEvent.target.value
    });
  };
  signInWithFacebook = (e) => {
    this.setState({ is_using_facebook: true });
    this.props.firebase
      .auth()
      .setPersistence(this.state.persistence)
      .then(() => {
        this.props.firebase
          .auth()
          .signInWithPopup(facebookProvider)
          .then((auth) => {
            this.fetchMassToken(auth.user._lat, auth.user.email);
            // this.fetchAndLogin(auth.user.email);
            //if (!auth.emailVerified) this.sendVerificationEmail();
            this.setState({ ...INITIAL_STATE });
          })
          .catch((err) => {
            this.setState({ error: err.message });
          });
      });
  };

  fetchMassToken = async (fireToken, email) => {
    this.setRegProtocol(); // dont delete, see below for explanation
    const body = { idToken: fireToken };
    apiCall("auth.login", body)
      .then((userData) => {
        this.inflatePageWithUserData(userData, email);
        // this.fetchAndLogin(email).then((success) => {
        //   if (success) console.log("login successful");
        // });
      })
      .catch((err) => {
        console.log("login error: ", err);
      });
  };

  inflatePageWithUserData = async (json, email) => {
    if (json.success && json.data) {
      this.props.reduxLogin(json.data);
      const todo = await apiCall("users.actions.todo.list", { email });
      this.props.reduxLoadTodo(todo.data);
      const done = await apiCall("users.actions.completed.list", { email });
      this.props.reduxLoadDone(done.data);
      return true;
    }
    return false;
  };

  /**
   * WHY LOGIN RENDER PAGE 2 DOES NOT SHOW ANYMORE & "REG_PROTOCOL" should NEVER be removed
   * ------------------------------------------------
   * The authentication flow on ME is programmed to first check if a user exists in our firebase service,
   * then go ahead to retrieve information about a user, based on the token that firebase will
   * return if a user exists
   * With this design, there are a few flaws that come up,
   * ..............
   * Firebase will always return a token ID, whether the user exists in our firebase service
   * or not.
   * In other words, if the user is not in our firebase service, google creates an account for them
   * THERE AND THEN!
   * With this, we are only able to deteremine that a user really does not exist in our system only
   * when we hit the ME backend with the firebase-generated token for more information and our system returns or
   * does not return anything
   *
   * While this process is happening from the back, on the client side,
   * the component logic is to quickly show a "complete profile form" if a user's information
   * is not quickly passed into the redux store....( at the point of click , user information is aways null|undefined)
   *
   * Because of these two things, is why a user is always taken to the "complete profile page"
   * for a brief moment before they are taken to the profile page.
   * When they are taken to the profile page, it just means user information from the ME backend
   * has just been returned and saved in the redux store.
   *
   * And if nothing is returned from the ME backend, then it actually means they dont exist in our DB
   * and really have to complete the form, so they stay on the page.
   *
   * To avoid this temporary blink and to give users the idea that authentication is in sync
   * and all in one place -- the reg_protocol value in the local storage was introduced
   *
   * Now, the "complete profile page" form ONLY shows if "reg_protocol" value exists in the
   * user's local storage.
   * If the reg_protocol value isnt set, a loading spinner will always show instead
   *
   * Now with this reg_protocol implementation, when a user tries to sign in and firebase returns its token
   * and we are trying to fetch user info from the ME backend, they will see a loading
   * spinner instead, becase "reg_protocol" would not be available in the local storage(ie. js just obeying rules.. LOL!)
   *
   * Now, all that needs to be done to get the "complete profile page" to actually show during registration
   * is to set the reg_protocol value in localStorage from the registration....
   *
   * This should be enough to deter anyone from deleting or commenting out reg protocol stuff anymore
   * LOOOOOOL!!!!
   *
   *
   *
   *
   */
}

//makes the register form have firebase and router so it can route the user if the login is successful
const RegisterForm = compose(withFirebase)(RegisterFormBase);

const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    user: store.user,
    policies: store.page.policies,
    links: store.links,
    registerPage: store.page.registerPage,
    community: store.page.community,
    is_sandbox: store.page.__is_sandbox,
  };
};

export default connect(mapStoreToProps, {
  reduxLogin,
  reduxLoadDone,
  reduxLoadTodo,
})(RegisterForm);
