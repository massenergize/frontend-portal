import React from "react";
import { Link } from "react-router-dom";

export default function TourContent({ links, handleCloseTourWithBtn }) {
  return (
    <>
      Be part of this amazing community. Enter your email and a password. Use
      Google or Facebook for faster sign up. Together we make a difference!
      <div
        style={{
          position: "absolute",
          top: 185,
          left: 25,
        }}
      >
        <Link
          onClick={handleCloseTourWithBtn}
          style={{ color: "black", cursor: "pointer", fontSize: 14 }}
          to={links.home}
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}

export function TourTitle({ community_name }) {
  return (
    <strong style={{ fontSize: 16 }}>
      Join the {community_name} community
    </strong>
  );
}
