import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import { fetchParamsFromURL } from "../../Utils";
import VerifyEmailBox from "../Auth/shared/components/VerifyEmailBox";
import { AUTH_STATES } from "../Auth/shared/utils";
import Notification from "../Widgets/Notification/Notification";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";
import EditingProfileForm from "./EditingProfileForm";
import ProfileOptions from "./ProfileOptions";
import Seo from "../../Shared/Seo";

function ProfileSettings(props) {
  const [notification, setNotification] = useState(null);
  const { links, user, authState, fireAuth } = props;
  const { mode } = fetchParamsFromURL(props.location, "mode");
  const pathname = props.location?.pathname || "#";
  const history = useHistory();
  // ----------------------------------------------------------
  useEffect(() => {}, [mode]);
  // ----------------------------------------------------------
  const userIsNotAuthenticated =
    authState === AUTH_STATES.USER_IS_NOT_AUTHENTICATED;
  const appIsCheckingFirebase = authState === AUTH_STATES.CHECKING_FIREBASE;
  const appIsCheckingMassEnergize =
    authState === AUTH_STATES.CHECK_MASS_ENERGIZE;

  // -------------------------------------------------------------------
  if (userIsNotAuthenticated) return <Redirect to={links.signin}> </Redirect>;

  if (appIsCheckingFirebase || appIsCheckingMassEnergize)
    return <LoadingCircle />;

  if (fireAuth && !fireAuth.emailVerified) return <VerifyEmailBox />;

  const modes = {
    "edit-profile": (
      <EditingProfileForm
        email={props.user?.email}
        full_name={user?.full_name}
        preferred_name={user?.preferred_name}
        image={user?.profile_picture}
        closeForm={() => history.push(pathname)}
      />
    ),
    "change-email": (
      <ChangeEmailForm
        closeForm={(inSubmit) =>
          history.push(inSubmit ? links?.profile : pathname)
        }
        email={props.user?.email}
      />
    ),
    "change-password": (
      <ChangePasswordForm
        closeForm={(message) => {
          history.push(pathname);
          if (message) setNotification({ good: true, message });
        }}
      />
    ),
    "delete-account": (
      <DeleteAccountForm closeForm={() => history.push(pathname)} />
    ),
  };
  // -------------------------------------------------------------
  const renderThisPage = (page) => <>{page}</>;
  const page = modes[mode || ""];
  if (page)
    return (
      <BoxWrapper>
        {Seo({
          title: "Profle Settings",
          description: "",
          url: `${window.location.pathname}`,
          subdomain: props.community?.subdomain,
        })}
        <div style={{ marginBottom: 70 }}>{renderThisPage(page)}</div>
      </BoxWrapper>
    );
  //   -----------------------------ELSE--------------------------------
  return (
    <BoxWrapper>
      <div style={{ marginBottom: 50 }}>
        {notification && (
          <div style={{ marginBottom: 15 }}>
            <Notification good={notification.good}>
              {notification.message}
            </Notification>
          </div>
        )}
        <br />
        <ProfileOptions {...props} pathname={pathname} history={history} />
      </div>
    </BoxWrapper>
  );
}

const mapStateToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    firebaseAuthSettings: store.firebaseAuthSettings,
    fireAuth: store.fireAuth,
    authState: store.authState,
    community: store.page.community,
  };
};

export default connect(mapStateToProps)(withRouter(ProfileSettings));

const BoxWrapper = ({ children }) => {
  return (
    <>
      <div
        className="boxed_wrapper"
        style={{ minHeight: window.screen.height - 100 }}
        id="profile-page-component"
      >
        <BreadCrumbBar links={[{ name: "Settings" }]} />
        <div className="container">
          <div
            className="row"
            style={{ paddingRight: "0px", marginRight: "0px" }}
          >
            <div className="col-lg-9 col-md-9 col-12 offset-md-1 settings-wrapper">
              <h1> Preferences</h1>
              <p style={{ color: "black" }}>Make changes to your profile</p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
