import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { apiCall } from "../../api/functions";
import { reduxToggleGuestAuthDialog } from "../../redux/actions/pageActions";
import { reduxLogin } from "../../redux/actions/userActions";
import {
  emailIsInvalid,
  GUEST_USER_KEY,
  ifEnterKeyIsPressed,
} from "../Pages/Auth/shared/utils";
import MEButton from "../Pages/Widgets/MEButton";
import METextField from "../Pages/Widgets/METextField";

function GuestAuthenticationDialog(props) {
  const { community, putUserInRedux, user, links, close, history } = props;
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [proceedAsGuest, setProceedAsGuest] = useState(false);
  const [guestAuthIsDone, setGuestAuthIsDone] = useState(false);
  const authenticateGuest = () => {
    setError("");
    if (emailIsInvalid(email))
      return setError("Please provide a valid email to proceed as guest");
    const name = email.split("@")[0];
    const data = {
      full_name: name,
      preferred_name: name,
      email,
      community_id: community?.id,
      accepts_terms_and_conditions: false,
      is_vendor: false,
      is_guest: true,
    };
    setLoading(true);
    apiCall("/users.create", data)
      .then((response) => {
        setLoading(false);
        if (!response.success) return setError(response?.error?.message);
        putUserInRedux(response.data);
        localStorage.setItem(GUEST_USER_KEY, email);
        setGuestAuthIsDone(true);
        setTimeout(() => {
          close && close();
          window.location.reload();
        }, 2000); // close modal after 2 seconds
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

  const createProfileNow = () => {
    close && close();
    history.push(links?.signin);
  };

  if (guestAuthIsDone) return <CongratulatoryMessage />;
  return (
    <>
      <div className="guest-dialog-container">
        <div>
          <p className="responsive-p">
            {!proceedAsGuest ? (
              <span>
                Hi there, please choose one of the options below to continue
              </span>
            ) : (
              <span>
                Please provide an
                <span
                  style={{ color: "var(--app-theme-orange)", marginLeft: 5 }}
                >
                  email
                </span>{" "}
                below. That's all you would have to do for now.
              </span>
            )}
          </p>

          {proceedAsGuest && (
            <METextField
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              genericProps={{ onKeyUp: whenUserTypes }}
            />
          )}

          {error && (
            <small style={{ color: "maroon", marginTop: 5 }}>{error}</small>
          )}
        </div>

        {!proceedAsGuest ? (
          <div className="guest-dialog-footer">
            <div style={{ marginLeft: "auto" }}>
              <Cancel close={close} />
              <MEButton
                loading={loading}
                onClick={() => setProceedAsGuest(true)}
              >
                {!isMobile ? "Proceed As Guest" : "As Guest"}
              </MEButton>
              <MEButton
                loading={loading}
                onClick={createProfileNow}
                variation="union"
              >
                {!isMobile ? "Create a Profile Now" : "With Profile"}
              </MEButton>
            </div>
          </div>
        ) : (
          <div className="guest-dialog-footer">
            <Cancel close={close} />
            <MEButton
              loading={loading}
              onClick={() => setProceedAsGuest(true)}
              containerStyle={{ marginLeft: "auto" }}
            >
              Continue
            </MEButton>
          </div>
        )}
      </div>
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

const Cancel = ({ close }) => {
  return (
    <Link
      to="#"
      onClick={(e) => {
        e.preventDefault();
        close && close();
      }}
      style={{ marginRight: 20 }}
    >
      Cancel
    </Link>
  );
};

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
