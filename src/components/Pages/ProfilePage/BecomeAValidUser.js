import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../api/functions";
import {
  sendVerificationEmail,
  setFirebaseUser,
  setMassEnergizeUser,
} from "../../../redux/actions/authActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import FormCompletion from "../Auth/Registration/FormCompletion";
import { getRandomColor } from "../Auth/shared/utils";
import Notification from "../Widgets/Notification/Notification";
import AddGuestToFirebase from "./AddGuestToFirebase";
import AddPassword from "./AddPassword";
import Stepper from "./MEStepper";

function BecomeAValidUser({
  community,
  policies,
  user,
  setMassEnergizeUser,
  setFirebaseUser,
  fireAuth,
  sendVerificationEmail,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const history = useHistory();
  const [checked, setChecked] = useState([]);
  const [active, setActive] = useState("provide-pass");
  const [error, setError] = useState(null);

  const finaliseFormAndRegister = () => {
    const location = " , " + form.city + ", " + form.state + ", " + form.zip;
    const body = {
      id: user && user.id,
      full_name: form.firstName + " " + form.lastName,
      preferred_name: form.preferred_name || form.firstName,
      email: user && user.email,
      location: location,
      is_vendor: false,
      accepts_terms_and_conditions: true,
      subdomain: community && community.subdomain,
      color: getRandomColor(),
    };

    setLoading(true);
    apiCall("/users.make.guest.permanent", body)
      .then((response) => {
        setLoading(false);
        console.log("I think I am the response bro", response);
        if (!response.success) setError(response && response.error);
      })
      .catch((e) => {
        console.log("ERROR_UPDATING_GUEST_USER_", e.toString());
      });
  };
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cancel = () => {
    history.goBack();
  };

  useEffect(() => {
    // In the where a guest adds a password but leaves the page,
    // This step will help them start from the next form when they come back
    if (fireAuth) setChecked("form-completion");
  }, []);

  const steps = {
    "provide-pass": {
      name: "Add Password",
      key: "provide-pass",
      component: (
        <AddGuestToFirebase
          setError={setError}
          email={user.email}
          loading={loading}
          setLoading={setLoading}
          nextStep={() => {
            setActive("form-completion");
            setChecked([...checked, "provide-pass"]);
          }}
          setFirebaseUser={setFirebaseUser}
          sendVerificationEmail={sendVerificationEmail}
        />
      ),
    },
    "form-completion": {
      name: "About You",
      key: "form-completion",
      component: (
        <FormCompletion
          getValue={(name) => form[name] || ""}
          onChange={onChange}
          createMyAccountNow={finaliseFormAndRegister}
          policies={policies}
          customCancel={cancel}
          disableDeleteNotification={true}
          loading={loading}
        />
      ),
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

          {error && <Notification good={false}>{error}</Notification>}

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
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setFirebaseUser,
      setMassEnergizeUser,
      sendVerificationEmail: sendVerificationEmail,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BecomeAValidUser));
