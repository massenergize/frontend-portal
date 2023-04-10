
import React, { useEffect } from "react";
import "./METoast.css";


const METoast = ({ message, type, open, onClose, duration }) => {
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        onClose && onClose();
      },duration|| 3000);
    }
    // eslint-disable-next-line
  }, [message]);

  return open ? (
    <div className={`me-toast ${type}`}>
      <small style={{ color: "white", fontSize: "0.9rem" }}>{message}</small>
    </div>
  ) : (
    <></>
  );
};

export default METoast;
