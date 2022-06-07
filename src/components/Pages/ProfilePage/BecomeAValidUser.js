import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import FormCompletion from "../Auth/Registration/FormCompletion";
import { getRandomColor } from "../Auth/shared/utils";

function BecomeAValidUser({ fireAuth, community, policies }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const history = useHistory();

  const finaliseFormAndRegister = () => {
    const location = " , " + form.city + ", " + form.state + ", " + form.zip;
    const body = {
      full_name: form.firstName + " " + form.lastName,
      preferred_name: form.preferred_name || form.firstName,
      email: fireAuth.email,
      location: location,
      is_vendor: false,
      accepts_terms_and_conditions: true,
      subdomain: community && community.subdomain,
      color: getRandomColor(),
    };

    setLoading(true);
    // completeFormRegistrationInME(body, () => setLoading(false));
  };
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cancel = () => {
    history.goBack();
  };

  return (
    <div
      className="boxed_wrapper"
      style={{
        minHeight: window.screen.height - 100,
        overflowY: "scroll",
        marginBottom: 50,
      }}
    >
      <BreadCrumbBar links={[{ name: "Guest To User Transition" }]} />
      <div className="container">
        <div className="col-lg-19 col-md-10  col-12 offset-md-1">
          <center>
            <h3 styl={{ marginBottom: 20 }}>
              Complete this short form to become a{" "}
              <b style={{ color: "var(--app-theme-green)" }}>valid user</b>{" "}
            </h3>
          </center>

          <FormCompletion
            getValue={(name) => form[name] || ""}
            onChange={onChange}
            createMyAccountNow={finaliseFormAndRegister}
            policies={policies}
            customCancel={cancel}
            disableDeleteNotification={true}
          />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (store) => {
  return {
    fireAuth: store.fireAuth,
    community: store.page.community,
    communityData: store.page.communityData,
    policies: store.page.policies,
  };
};
export default connect(mapDispatchToProps)(withRouter(BecomeAValidUser));
