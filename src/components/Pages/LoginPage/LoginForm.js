import React from "react";
import { withFirebase } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MEButton from "./../Widgets/MEButton";
import LoadingCircle from "../../Shared/LoadingCircle";
import {
  googleProvider,
  facebookProvider
} from "../../../config/firebaseConfig";
import { apiCall } from "../../../api/functions";
import {
  reduxLogin,
  reduxLoadDone,
  reduxLoadTodo,
} from "../../../redux/actions/userActions";

/********************************************************************/
/**                        LOGIN FORM                               */
/********************************************************************/
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class LoginFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      signInWithPassword: null,
      selectedSignInOption: "passwordless",
      persistence: props.firebase.auth.Auth.Persistence.SESSION,
    };

    this.onChange = this.onChange.bind(this);
    this.isInvalid = this.isInvalid.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const { email, password, error } = this.state;

    const pageData = this.props.signinPage;
    if (pageData == null) return <LoadingCircle />;
    const title = pageData.title ? pageData.title : "Sign in";
    const description = pageData.description ? pageData.description : "Sign in with your name and password if you have one.";

    return (
      <div
        className="styled-form login-form mob-login-white-cleaner me-anime-fade-in-up"
        style={{ height: window.screen.height, marginTop: 40 }}
      >
        <div
          className="z-depth-float mob-login-card-fix"
          style={{ padding: 55, borderRadius: 12 }}
        >
          <div className="section-title style-2 mob-sweet-b-10">
            <h3 className="mog-title-fix">{title}</h3>
            <h4>Welcome!</h4>
            <p> {description}</p>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group mob-sweet-b-10">
              <span className="adon-icon">
                <span className="fa fa-envelope-o"></span>
              </span>
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={this.onChange}
                placeholder="Enter email"
              />
            </div>
            {this.state.signInWithPassword ? <div className="form-group mob-sweet-b-10">
              <span className="adon-icon">
                <span className="fa fa-unlock-alt"></span>
              </span>
              <input
                id="login-password"
                type="password"
                name="password"
                value={password}
                onChange={this.onChange}
                placeholder="Enter Password"
              />
            </div> : <div/>}
            {error && <p style={{ color: "red" }}> {error} </p>}
            <div className="clearfix">
              <div className="form-group pull-left">
                { this.state.signInWithPassword===null ? <MEButton onClick={this.signInWithMethod} disabled={this.isInvalid()}>Continue</MEButton> : 
                this.state.signInWithPassword ? 
                <MEButton type="submit" disabled={this.isInvalid()} id="sign-in-btn">
                  Sign In
                </MEButton> : 
                <MEButton onClick={this.signInWithMethod} disabled={this.isInvalid()}>
                  Email Sent!
                </MEButton>}
              </div>
              <div className="form-group social-links-two padd-top-5 pull-right">
                Or sign in with
                <button
                  onClick={this.signInWithGoogle}
                  id="google"
                  type="button"
                  className="img-circle  round-me raise me-google-btn"
                >
                  <span className="fa fa-google"></span>
                </button>
                <button
                  onClick={this.signInWithEmail}
                  id="emai"
                  type="button"
                  className="img-circle  round-me raise me-email-btn"
                >
                  <span className="fa fa-envelope"></span>
                </button>
                <button
                  onClick={this.signInWithFacebook}
                  id="facebook"
                  type="button"
                  className="img-circle  round-me raise me-facebook-btn"
                >
                  <span className="fa fa-facebook"></span>
                </button>
              </div>
              
            </div>
            <div className="row">
              <div className="col">
                <p>
                  <button className=" energize-link" onClick={this.forgotPassword}>
                    {" "}
                    Forgot Password{" "}
                  </button>
                </p>
                <p>
                  {" "}
                  Don't have a profile?{" "}
                  <Link className="energize-link" to={this.props.links.signup}>
                    Create one
                  </Link>{" "}
                </p>{" "}
              </div>
              <div className="col">
                <div className="radio">
                  <div className="row">
                    <div className="col-3">
                      <input type="radio" value="passwordless" 
                          checked={this.state.selectedSignInOption === "passwordless"} 
                          onChange={this.handleSignInOptionChange} />
                    </div>
                    <div className="col-9">
                      <label>
                        <p>Passwordless</p>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <input type="radio" value="password" 
                            checked={this.state.selectedSignInOption === "password"} 
                            onChange={this.handleSignInOptionChange} />
                    </div>
                    <div className="col-9">
                      <label>
                        <p>With Password</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount = () => {
    this.completeSignInWithEmail();
  };

  forgotPassword = () => {
    if (this.state.email !== "") {
      var actionCodeSettings = {
        url: window.location.href,
      };
      this.props.firebase
        .auth()
        .sendPasswordResetEmail(this.state.email, actionCodeSettings)
        .then(function (user) {
          alert("Please check your email for a new message with a reset link");
        })
        .catch(function (e) {
          /* could check that e.code == "auth/user-not-found" */
          alert(e.message);
          console.log(e);
        });
    } else {
      this.setState({
        error: "Enter your email to reset your password",
      });
    }
  };
  //checks if the login info is invalid, if so, the submit button will be disabled
  isInvalid() {
    const { password, email } = this.state;
    return (this.state.signInWithPassword ? email === null || email === "" || password === "": email === "" || email === null);
  }
  //updates the state when form elements are changed
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  handleSignInOptionChange = (changeEvent) => {
    this.setState({
      selectedSignInOption: changeEvent.target.value
    }, this.setSignInWithPassword);
  };

  setSignInWithPassword = () => {
    const {selectedSignInOption, signInWithPassword} = this.state;
    if (selectedSignInOption === "passwordless") {
      this.setState({signInWithPassword: false});
    } else if (selectedSignInOption === "password") {
      this.setState({signInWithPassword: true});
    } else {
      this.setState({selectedSignInOption: "passwordless"});
    };
  };

  onSubmit(event) {
    event.preventDefault();
    //firebase prop comes from the withFirebase higher component
    if (this.state.signInWithPassword) {
      this.props.firebase
      .auth()
      .setPersistence(this.state.persistence)
      .then(() => {
        this.props.firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then((auth) => {
            this.fetchMassToken(auth.user._lat, auth.user.email);
            this.setState({ ...INITIAL_STATE }); //reset the login boxes
          })
          .catch((err) => {
            this.setState({ error: err.message });
          });
      });
    }
  }

  signInWithMethod = () => {
    if (this.state.email) {
      this.props.firebase.auth().fetchSignInMethodsForEmail(this.state.email)
        .then((signInMethods) => {
          // This returns the same array as fetchProvidersForEmail but for email
          // provider identified by 'password' string, signInMethods would contain 2
          // different strings:
          // 'emailLink' if the user previously signed in with an email/link
          // 'password' if the user has a password.
          // A user could have both.
          if (signInMethods.indexOf(
            this.props.firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) !== -1) {
            // User can sign in with email/link.
            this.setState({signInWithPassword: false}, this.signInWithEmail());
          } else if (signInMethods.indexOf(
            this.props.firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1) {
            // User can sign in with email/password.
            this.setState({signInWithPassword: true});
          } else {
            this.setState({signInWithPassword: null});
          };
        })
        .catch((err) => {
          console.log(err);
          // Some error occurred, you can inspect the code: error.code
        });
    };
  }

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
            this.setState({ ...INITIAL_STATE });
          })
          .catch((err) => {
            console.log(err);
            this.setState({ error: err.message });
          });
      });
  };
  signInWithEmail = () => {
    if (this.state.email === "") {
      this.setState({error: "Please enter your email to enable passwordles authentication"});
    } else {
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
        alert("Please check your email for a new sign in link.\n\nIf you don't see it right away it may have been put in your spam folder.");
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
  signInWithFacebook = () => {
    this.props.firebase
      .auth()
      .setPersistence(this.state.persistence)
      .then(() => {
        this.props.firebase
          .auth()
          .signInWithPopup(facebookProvider)
          .then((auth) => {
            this.fetchMassToken(auth.user._lat, auth.user.email);
            this.setState({ ...INITIAL_STATE });
          })
          .catch((err) => {
            this.setState({ error: err.message });
          });
      });
  };

  fetchMassToken = async (fireToken, email) => {
    const body = { idToken: fireToken };
    apiCall("auth.login", body)
      .then((userData) => {
        this.inflatePageWithUserData(userData, email);
      })
      .catch((err) => {
        window.localStorage.setItem("reg_protocol", "show");
        console.log("Error MASSTOKEN: ", err);
        window.location.reload();
      });
  };

  inflatePageWithUserData = async (json, email) => {
    if (json.success && json.data) {
      this.props.reduxLogin(json.data);
      const todo = await apiCall("users.actions.todo.list", { email });
      this.props.reduxLoadTodo(todo.data);
      const done = await apiCall("users.actions.completed.list", { email });
      this.props.reduxLoadDone(done.data);
      this.props.tryingToLogin(false);
      return true;
    }
    console.log(json.error);
    this.props.tryingToLogin(false);
    window.localStorage.setItem("reg_protocol", "show");
    window.location.reload();
    return false;
  };
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
const LoginForm = compose(withFirebase)(LoginFormBase);

const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    signinPage: store.page.signinPage,
    links: store.links,
  };
};

export default connect(mapStoreToProps, {
  reduxLogin,
  reduxLoadDone,
  reduxLoadTodo,
})(LoginForm);
