import React from "react";
import MERadio from "./MERadio";
import METextField from "./METextField";
import { COPYRIGHT_OPTIONS } from "../../Constants";

function UploadQuestionaire({ onChange, data }) {
  const { underAge, copyright_att, guardian_info, permission_key } =
    data || {};

  const organiseCopyrightInfo = (key) => {
    const opt = COPYRIGHT_OPTIONS[key];
    return {
      permission_key: key,
      permission_notes: opt?.notes,
      copyright: opt?.value,
    };
  };
  const handleChange = (name, value) => {
    if (!onChange) return;
    let extras = {};
    if (name === "copyright") extras = organiseCopyrightInfo(value);

    onChange(name, value, extras);
  };

  const boolValue = (bool) => (bool ? "Yes" : "No");

  const copyrightOptions = Object.values(COPYRIGHT_OPTIONS);

  const hasPermission = (key) => {
    const opt = COPYRIGHT_OPTIONS[key];
    return opt?.value;
  };

  const renderLabel = (child) => {
    if (COPYRIGHT_OPTIONS.YES_CHECKED.key === child?.key)
      return (
        <span>
          {child?.text}{" "}
          <a
            href="https://www.pixsy.com/academy/image-user/verify-image-source-copyright-owner/"
            target="_blank"
            rel="noreferrer"
          >
            How do I check?
          </a>
        </span>
      );

    return <span>{child?.text}</span>;
  };
  return (
    <div
      style={{
        padding: 40,
        background: "rgba(250, 235, 215, 0.3)",
        border: "solid 2px antiquewhite",
        borderRadius: 5,
        margin: "10px 0px",
      }}
    >
      <div>
        <h5 style={{ fontWeight: "bold", marginBottom: 10 }}>Permissions</h5>
        <p style={{ fontSize: 17 }}>
          Do you have permission to upload this image?
          <span style={{ fontWeight: "bold", color: "red" }}>*</span>
        </p>

        <MERadio
          value={permission_key}
          onItemSelected={(key) => {
            handleChange("copyright", key);
          }}
          valueExtractor={(opt) => opt?.key}
          labelExtractor={(opt) => opt.text}
          // renderLabel={(child) => <span>{child?.text} gbemi</span>}
          renderLabel={renderLabel}
          data={copyrightOptions}
        />
        {hasPermission(permission_key) && (
          <>
            <p style={{ fontSize: 17, margin: "6px 0px" }}>
              If this item needs to be attributed to someone, please type in the
              name of the owner of the copyright
            </p>
            <METextField
              value={copyright_att || ""}
              // onChange={(e) => setCopyrightAtt(e.target.value)}
              onChange={(e) => handleChange("copyright_att", e.target.value)}
              placeholder="Owner's name (optional)"
            />{" "}
          </>
        )}
      </div>
      <div>
        <h5 style={{ fontWeight: "bold", margin: "10px 0px", marginTop: 20 }}>
          Underage Consent
        </h5>
        <p style={{ fontSize: 17 }}>
          Does the image contain any visible depictions of children{" "}
          <b> under the age of 13</b>? If yes, please provide consent
          information in the box shown below{" "}
          <span style={{ fontWeight: "bold", color: "red" }}>*</span>
        </p>
        <MERadio
          value={boolValue(underAge)}
          onItemSelected={(item) =>
            // setHasChildren(item === "Yes" ? true : false)
            handleChange("underAge", item === "Yes" ? true : false)
          }
          data={["Yes", "No"]}
        />
        {underAge && (
          <>
            <p style={{ fontSize: 17, margin: "6px 0px" }}>
              Add information of guardians
              <span style={{ fontWeight: "bold", color: "red" }}>*</span>
            </p>
            <METextField
              value={guardian_info || ""}
              // onChange={(e) => setGuardianInfo(e.target.value)}
              onChange={(e) => handleChange("guardian_info", e.target.value)}
              placeholder="Guardian information (name, phone, email etc)..."
            />{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default UploadQuestionaire;
