import React from "react";

function ProfileOptions({ pathname, history }) {
  return (
    <div >
      {/* <div
        className="link-to touchable-opacity"
        onClick={() => history.push(`${links.profile}?mode=become-valid`)}
      >
        <span className="fas fa-stamp" />
        <p>
          Become a registered member
          <span role="img" aria-label="image">
            🎊
          </span>
        </p>
        <i className=" fa fa-long-arrow-right" />
      </div> */}
      <div
        className="link-to touchable-opacity"
        onClick={() => history.push(`${pathname}?mode=edit-profile`)}
      >
        <span className=" fa fa-user" />
        <p>Edit my profile</p>
        <i className=" fa fa-long-arrow-right" />
      </div>
      <div
        className="link-to touchable-opacity"
        onClick={() => history.push(`${pathname}?mode=change-email`)}
      >
        <span className=" fa fa-envelope" />
        <p>Change my email</p>
        <i className=" fa fa-long-arrow-right" />
      </div>
      <div
        className="link-to touchable-opacity"
        onClick={() => history.push(`${pathname}?mode=change-password`)}
      >
        <span className=" fa fa-key" />
        <p>Change my password</p>
        <i className=" fa fa-long-arrow-right" />
      </div>
      {/* <div
        className="link-to touchable-opacity"
        onClick={() => history.push(`${links.profile}/password-less/manage`)}
      >
        <span className=" fa fa-lock" />
        <p>Add a password </p>
        <i className=" fa fa-long-arrow-right" />
      </div> */}
      <div
        className="link-to touchable-opacity"
        onClick={() => history.push(`${pathname}?mode=delete-account`)}
      >
        <span className=" fa fa-trash" />
        <p>
          Delete my account <span style={{ color: "red" }}> (Danger Zone)</span>{" "}
        </p>
        <i className=" fa fa-long-arrow-right" />
      </div>
    </div>
  );
}

export default ProfileOptions;
