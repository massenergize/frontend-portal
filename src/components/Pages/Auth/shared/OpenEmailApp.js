import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signMeOut } from "../../../../redux/actions/authActions";

function OpenEmailApp({ signMeOut, showCancel }) {
  return (
    <div className="email-helpers-div">
      {/* <a target="_blank" href="mailto:" rel="noopener noreferrer">
        Open Your Email App
      </a>
      <a
        style={{
          marginLeft: 20,
        }}
        target="_blank"
        href="https://www.gmail.com"
        rel="noopener noreferrer"
      >
        Open Gmail Online{" "}
      </a> */}

      {showCancel && (
        <a
          href="#void"
          className="cancel-process"
          onClick={(e) => {
            e.preventDefault();
            signMeOut();
          }}
        >
          Cancel this process
        </a>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      signMeOut: signMeOut,
    },
    dispatch
  );
};
export default connect(null, mapDispatchToProps)(OpenEmailApp);
