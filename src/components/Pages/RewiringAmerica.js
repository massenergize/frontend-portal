import React from "react";
import Seo from "../Shared/Seo";
import { useSelector } from "react-redux";
import URLS from "../../api/urls";
import {IS_LOCAL} from "../../config";

function RewiringAmerica() {
  const community = useSelector((state) => state?.page?.community);

  const baseEndpoint = IS_LOCAL ? `${URLS.ROOT }/api/`: `${URLS.ROOT}/`;
  return (
    <div style={{ paddingTop: 50 }}>
      {Seo({
        title: "Rewiring America",
        description: "",
        url: `${window?.location?.pathname}`,
        site_name: community?.name,
      })}
      <div style={{ width: "100%", height: "100vh", background: "white" }}>
        <iframe
          src={baseEndpoint + "rewiring_america"}
          title="Rewiring America"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            overflow: "hidden",
          }}
        ></iframe>
      </div>
    </div>
  );
}

export default RewiringAmerica;
