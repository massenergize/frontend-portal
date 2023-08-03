import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  sendVerificationEmail,
  setFirebaseUser,
} from "../../../redux/actions/authActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Notification from "../Widgets/Notification/Notification";
import AddGuestToFirebase from "./AddGuestToFirebase";
import Stepper from "./MEStepper";

function BecomeAValidUser({
  user,
  setFirebaseUser,
  sendVerificationEmail,
  links,
  community
}) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [active, setActive] = useState("provide-pass");
  const [notification, setNotification] = useState(null);

  const steps = {
    "provide-pass": {
      name: "Add Password",
      key: "provide-pass",
      component: (
        <AddGuestToFirebase
          links={links}
          // setError={(err, state) => setNotification({ good: false, mesage: err })}
          setNotification={setNotification}
          email={user.email}
          loading={loading}
          setLoading={setLoading}
          nextStep={() => {
            setActive("form-completion");
            setChecked([...checked, "provide-pass"]);
          }}
          setFirebaseUser={setFirebaseUser}
          sendVerificationEmail={sendVerificationEmail}
          community={community}
        />
      ),
    },
    // Just to give the user an idea of the steps to take in general, but its never used
    "form-completion": {
      name: "About You",
      key: "form-completion",
      component: <></>,
    },
  };

  return (
    <div
      className="boxed_wrapper"
      style={{
        minHeight: window.screen.height,
        overflowY: "scroll",
        marginBottom: 50,
      }}
    >
      <BreadCrumbBar links={[{ name: "Become A User" }]} />
      <div className="container">
        <div className="col-lg-19 col-md-10  col-12 offset-md-1">
          <Stepper steps={steps} active={active} checked={checked} />

          {notification && (
            <div style={{ marginBottom: 14 }}>
              <Notification good={notification.good}>
                {notification.message}
              </Notification>
            </div>
          )}

          {steps[active]?.component}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    fireAuth: store.fireAuth,
    community: store.page.community,
    communityData: store.page.communityData,
    policies: store.page.policies,
    user: store.user.info,
    links: store.links,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setFirebaseUser,
      sendVerificationEmail: sendVerificationEmail,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BecomeAValidUser));
