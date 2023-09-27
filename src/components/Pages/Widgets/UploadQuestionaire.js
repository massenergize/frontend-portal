import React from "react";
import MERadio from "./MERadio";
import METextField from "./METextField";

function UploadQuestionaire({ onChange, data }) {
  const { underAge, copyright, copyright_att, guardian_info } = data || {};
  const handleChange = (name, value) => {
    if (!onChange) return;
    onChange(name, value);
  };

  const boolValue = (bool) => (bool ? "Yes" : "No");

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
        <h5 style={{ fontWeight: "bold", marginBottom: 10 }}>
          Copyright Information
        </h5>
        <p style={{ fontSize: 17 }}>
          Do you have permission to use the selected item(s)?{" "}
          <span style={{ fontWeight: "bold", color: "red" }}>*</span>
        </p>

        <MERadio
          value={boolValue(copyright)}
          onItemSelected={(item) =>
            // setHasCopyright(item === "Yes" ? true : false)
            handleChange("copyright", item === "Yes" ? true : false)
          }
          data={["Yes", "No"]}
        />
        {copyright && (
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
