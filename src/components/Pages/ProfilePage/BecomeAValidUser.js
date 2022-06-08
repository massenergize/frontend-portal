import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../api/functions";
import { setMassEnergizeUser } from "../../../redux/actions/authActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import FormCompletion from "../Auth/Registration/FormCompletion";
import { getRandomColor } from "../Auth/shared/utils";
import Notification from "../Widgets/Notification/Notification";
import Stepper from "./MEStepper";

function BecomeAValidUser({ community, policies, user, setMassEnergizeUser }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const history = useHistory();
  const [checked, setChecked] = useState([]);
  const [active, setActive] = useState("form-completion");
  const [error, setError] = useState(null);

  const finaliseFormAndRegister = () => {
    const location = " , " + form.city + ", " + form.state + ", " + form.zip;
    const body = {
      id: user && user.id,
      full_name: form.firstName + " " + form.lastName,
      preferred_name: form.preferred_name || form.firstName,
      // email: user && user.email,
      location: location,
      is_vendor: false,
      accepts_terms_and_conditions: true,
      subdomain: community && community.subdomain,
      color: getRandomColor(),
    };

    setLoading(true);
    apiCall("/users.update", body)
      .then((response) => {
        setLoading(false);
        console.log("I think I am the response bro", response);
        if (!response.success) setError(response && response.error);
      })
      .catch((e) => {
        console.log("ERROR_UPDATING_GUEST_USER_", e.toString());
      });
    // console.log("I think I am the form, body", form, body);
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
          <Stepper
            steps={[
              { name: "Form Completion", key: "form-completion" },
              { name: "Provide Password", key: "provide-pass" },
            ]}
            active={active}
            checked={checked}
          />

          {error && <Notification good={false}>{error}</Notification>}

          <FormCompletion
            getValue={(name) => form[name] || ""}
            onChange={onChange}
            createMyAccountNow={finaliseFormAndRegister}
            policies={policies}
            customCancel={cancel}
            disableDeleteNotification={true}
            loading={loading}
          />
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
      setMassEnergizeUser: setMassEnergizeUser,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BecomeAValidUser));
