import React from "react";
import { getHumanFriendlyDate } from "../../Utils";
import SmartImage from "../../Shared/SmartImage";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

function RelatedActionInTestmionial({ action }) {
  const history = useHistory();
  const links = useSelector((state) => state.links);

  return (
    <div
      onClick={() => history.push(`${links?.actions}/${action?.id}`)}
      className="touchable-opacity rel-action"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "solid 1px #ededed",
        borderRadius: 5,
        padding: "10px 15px",
        width: "100%",
      }}
    >
      <SmartImage
        disableIfError
        src={action?.image?.url || "/backup"}
        alt="related action"
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 5 }}
      />
      <div style={{ margin: "15px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <h5
            style={{
              marginRight: 10,
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            {action?.title || "..."}
          </h5>
          {/* <i className=" fa fa-long-arrow-right" /> */}
        </div>
        <div style={{ fontSize: 14, marginTop: 5, color: "grey" }}>
          <b>{action?.community?.name || "..."}</b>{" "}
          <span style={{ margin: "0px 8px", fontWeight: "normal" }}>
            {getHumanFriendlyDate(action?.created_at)}
          </span>
        </div>
      </div>

      <i
        className=" fa fa-angle-right"
        style={{
          fontSize: 40,
          color: "grey",
          marginLeft: "auto",
          fontWeight: "bold",
          marginRight: 15,
        }}
      />
    </div>
  );
}

export default RelatedActionInTestmionial;
