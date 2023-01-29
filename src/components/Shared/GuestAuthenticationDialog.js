import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { apiCall } from "../../api/functions";
import { reduxToggleGuestAuthDialog } from "../../redux/actions/pageActions";
import { reduxLogin } from "../../redux/actions/userActions";
import AuthFooter from "../Pages/Auth/Components/auth footer/AuthFooter";
import TextBoxAndButtonCombo from "../Pages/Auth/Components/TextBoxAndButtonCombo";
import { PASSWORD_FREE_EMAIL } from "../Pages/Auth/shared/firebase-helpers";
import {
  emailIsInvalid,
  GUEST_USER_KEY,
  ifEnterKeyIsPressed,
  isInvalid,
} from "../Pages/Auth/shared/utils";
const GUEST_USER = "guest_user";
function GuestAuthenticationDialog(props) {
  const {
    community,
    putUserInRedux,
    user,
    links,
    close,
    history,
    callback,
    back,
  } = props;
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guestAuthIsDone, setGuestAuthIsDone] = useState(false);
  const [notGuest, setNotGuest] = useState(false);

  const authenticateGuest = () => {
    setError("");
    setNotGuest(false);
    if (emailIsInvalid(email.trim()))
      return setError("Please provide a valid email to proceed as guest");
    const data = {
      full_name: "Guest User",
      preferred_name: "Guest",
      email: email?.trim(),
      community_id: community?.id,
      accepts_terms_and_conditions: false,
      is_vendor: false,
      is_guest: true,
    };
    setLoading(true);

    apiCall("/users.create", data)
      .then((response) => {
        setLoading(false);
        if (!response.success) return setError(response?.error);
        const user = response.data;

        const userExistsAndIsNotAGuest =
          user?.user_info?.user_type !== GUEST_USER;
        if (userExistsAndIsNotAGuest) return setNotGuest(true);

        putUserInRedux(response.data);
        localStorage.setItem(GUEST_USER_KEY, email);
        localStorage.removeItem(PASSWORD_FREE_EMAIL);// If this value is somehow available in local storage at this time, remove it
        setGuestAuthIsDone(true);
        callback && callback(true);

        setTimeout(() => {
          close && close();
          window.location.reload();
        }, 1500); // close modal after 1.5 seconds
      })
      .catch((e) => {
        setLoading(false);
        console.log("GUEST_AUTHENTICATION_ERROR", e);
      });
  };

  useEffect(() => {}, [user]);

  const whenUserTypes = (e) => {
    if (ifEnterKeyIsPressed(e)) return authenticateGuest();
  };

  const goToMainAuthPage = () => {
    close && close();
    history.push(links?.signin);
  };

  if (guestAuthIsDone) return <CongratulatoryMessage />;
  window.scrollTo({ top: 0, behavior: "smooth" });

  const showWhenThereAreNoErrors = !error && !notGuest;
  return (
    <>
      <div className="guest-dialog-container">
        <div>
          <h1 className="auth-title">Sign in as a guest</h1>

          {/* {proceedAsGuest && ( */}
          <TextBoxAndButtonCombo
            id="test-guest-email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
            genericProps={{ onKeyUp: whenUserTypes }}
            btnText="Continue"
            onClick={() => authenticateGuest()}
            loading={loading}
            disabled={isInvalid(email) || loading}
          />
          {showWhenThereAreNoErrors && (
            <div style={{ margin: "7px 0px" }}>
              <small className="auth-info" style={{ marginBottom: 5 }}>
                This will let you use some of the functions on this site, but we
                wont be able to count your actions toward your community's
                goals.
                <span
                  onClick={() => {
                    close && close();
                    history.push(links?.signin);
                  }}
                  className="touchable-opacity"
                  style={{
                    color: "var(--app-theme-orange",
                    margin: "0px 2px",
                  }}
                >
                  <b>Join</b>
                </span>{" "}
                if you want to be counted.
              </small>
            </div>
          )}
          {/* // )} */}

          {error && (
            <small style={{ color: "maroon", marginTop: 5 }}>{error}</small>
          )}
          {notGuest && (
            <small
              style={{
                color: "maroon",
                marginTop: 5,
              }}
            >
              Hi there, it looks like you have an account with us already.
              <Link
                to={links?.signin}
                onClick={goToMainAuthPage}
                style={{ textDecoration: "underline", color: "maroon" }}
              >
                Try signing in with this email on our sign in page.
              </Link>{" "}
            </small>
          )}
        </div>

      </div>
      <AuthFooter back={back} />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    community: state.page.community,
    links: state.links,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putUserInRedux: reduxLogin,
      close: () => reduxToggleGuestAuthDialog(false),
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GuestAuthenticationDialog));

const CongratulatoryMessage = () => {
  return (
    <div className="guest-congrats me-anime-open-in">
      <i
        className="fa fa-check-circle"
        style={{
          fontSize: 30,
          color: "var(--app-theme-green)",
          marginRight: 6,
        }}
      ></i>{" "}
      <span>
        Congratulations! You can now proceed as a guest.{" "}
        <span role="img" aria-label="Congrats">
          🎊
        </span>
      </span>
    </div>
  );
};
