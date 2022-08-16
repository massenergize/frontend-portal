import React, { useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { fetchParamsFromURL } from "../../Utils";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";
import EditingProfileForm from "./EditingProfileForm";
import ProfileOptions from "./ProfileOptions";

function ProfileSettings(props) {
  const { mode } = fetchParamsFromURL(props.location, "mode");
  const pathname = props.location?.pathname || "#";
  const { user } = props;
  const history = useHistory();
  // ----------------------------------------------------------
  useEffect(() => {}, [mode]);
  // ----------------------------------------------------------
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
        closeForm={() => history.push(pathname)}
        email={props.user?.email}
      />
    ),
    "change-password": (
      <ChangePasswordForm closeForm={() => history.push(pathname)} />
    ),
    "delete-account": (
      <DeleteAccountForm closeForm={() => history.push(pathname)} />
    ),
  };
  // -------------------------------------------------------------
  const renderThisPage = (page) => <>{page}</>;
  const page = modes[mode || ""];
  if (page) return renderThisPage(page);
  //   -----------------------------ELSE--------------------------------
  return (
    <div style={{ marginBottom: 50 }}>
      <ProfileOptions {...props} pathname={pathname} history={history} />
    </div>
  );
}

export default withRouter(ProfileSettings);
