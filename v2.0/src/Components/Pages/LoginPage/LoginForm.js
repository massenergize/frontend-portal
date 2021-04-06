import React from "react";
import { withFirebase } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MEButton from "./../Widgets/MEButton";
import {
  facebookProvider,
  googleProvider,
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
      persistence: props.firebase.auth.Auth.Persistence.SESSION,
    };

    this.onChange = this.onChange.bind(this);
    this.isInvalid = this.isInvalid.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const { email, password, error } = this.state;
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
            <h3 className="mog-title-fix">Sign in</h3>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group mob-sweet-b-10">
              <span className="adon-icon">
                <span className="fa fa-envelope-o"></span>
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.onChange}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mob-sweet-b-10">
              <span className="adon-icon">
                <span className="fa fa-unlock-alt"></span>
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.onChange}
                placeholder="Enter Password"
              />
            </div>
            {error && <p style={{ color: "red" }}> {error} </p>}
            <div className="clearfix">
              <div className="form-group pull-left">
                <MEButton type="submit" disabled={this.isInvalid()}>
                  Sign In
                </MEButton>
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
                  onClick={this.signInWithFacebook}
                  id="facebook"
                  type="button"
                  className="img-circle  round-me raise me-facebook-btn"
                >
                  <span className="fa fa-facebook"></span>
                </button>
              </div>
            </div>
          </form>
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
      </div>
    );
  }

  forgotPassword = () => {
    if (this.state.email !== "") {
      var actionCodeSettings = {
        url: window.location.href,
      };
      this.props.firebase
        .auth()
        .sendPasswordResetEmail(this.state.email, actionCodeSettings)
        .then(function (user) {
          alert("Please check your email...");
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
    return password === "" || email === "";
  }
  //updates the state when form elements are changed
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    //firebase prop comes from the withFirebase higher component
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
    window.location.reload()
    return false;
  };
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
const LoginForm = compose(withFirebase)(LoginFormBase);

const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    links: store.links,
  };
};

export default connect(mapStoreToProps, {
  reduxLogin,
  reduxLoadDone,
  reduxLoadTodo,
})(LoginForm);
