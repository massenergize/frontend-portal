import React, {  useEffect, useState } from "react";
import MERadio from "./MERadio";
import METextField from "./METextField";

function UploadQuestionaire({ onStateChange }) {
  const [hasCopyright, setHasCopyright] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [guardianInfo, setGuardianInfo] = useState("");
  const [copyrightAtt, setCopyrightAtt] = useState("");

  useEffect(() => {
    if (!onStateChange) return;
    const callback = () => {
      onStateChange({
        underAge: hasChildren,
        copyright_att: copyrightAtt,
        has_copyright_permission: hasCopyright,
        guardian_info: guardianInfo,
      });
    };

    callback();
  }, [hasCopyright, hasChildren, guardianInfo, copyrightAtt]);

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
          value={boolValue(hasCopyright)}
          onItemSelected={(item) =>
            setHasCopyright(item === "Yes" ? true : false)
          }
          data={["Yes", "No"]}
        />
        {hasCopyright && (
          <>
            <p style={{ fontSize: 17, margin: "6px 0px" }}>
              If this item needs to be attributed to someone, please type in the
              name of the owner of the copyright
            </p>
            <METextField
              value={copyrightAtt}
              onChange={(e) => setCopyrightAtt(e.target.value)}
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
          Does the image contain any visible depictions of children
          <b>under the age of 13</b>? If yes, please provide consent information
          in the box shown below{" "}
          <span style={{ fontWeight: "bold", color: "red" }}>*</span>
        </p>
        <MERadio
          value={boolValue(hasChildren)}
          onItemSelected={(item) =>
            setHasChildren(item === "Yes" ? true : false)
          }
          data={["Yes", "No"]}
        />
        {hasChildren && (
          <>
            <p style={{ fontSize: 17, margin: "6px 0px" }}>
              Add information of guardians
              <span style={{ fontWeight: "bold", color: "red" }}>*</span>
            </p>
            <METextField
              value={guardianInfo}
              onChange={(e) => setGuardianInfo(e.target.value)}
              placeholder="Guardian information (name, phone, email etc)..."
            />{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default UploadQuestionaire;
