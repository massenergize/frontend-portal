import React from "react";
import { getHumanFriendlyDate } from "../../Utils";
import { useSelector } from "react-redux";
import SmartImage from "../../Shared/SmartImage";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function TestimonialsCardV2({ story }) {
  const history = useHistory();
  const community = useSelector((state) => state.page.community);
  const links = useSelector((state) => state.links);
  const isShared = community?.id !== story?.community?.id;
  const { user, action, vendor, id } = story || {};
  const creatorName =
    story?.preferred_name || user?.preferred_name || user?.full_name || "...";

  return (
    <div
      // className="touchable-opacity"
      style={{
        flexBasis: "30%",
        border: "solid 1px #f9f9f9",
        background: "rgb(252 252 252)",
        borderRadius: 10,
        margin: 5,
        padding: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <SmartImage
        disableIfError
        src={story?.file?.url || "/backup"}
        style={{ width: 80, height: 80, marginRight: 30, objectFit: "contain" }}
      />
      <div style={{ width: "100%" }}>
        <h3
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            width: "95%",
          }}
        >
          <span
            className="touchable-opacity"
            onClick={() => history.push(`${links?.testimonials}/${id}`)}
            style={{ textDecoration: "underline", fontWeight: "bold" }}
          >
            {story?.title}
            <i className="fa fa-long-arrow-right" style={{ marginLeft: 10 }} />
          </span>

          <span
            style={{
              fontSize: 35,
              position: "absolute",
              right: -17,
              top: -5,
              transform: "rotate(10deg)",
              color: "grey",
              opacity: 0.1,
            }}
          >
            <i className="fa fa-quote-right" />
          </span>
        </h3>

        <div
          style={{
            fontSize: 13,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            color: "grey",
            marginTop: 10,
          }}
        >
          <b style={{ color: "black" }}>By {creatorName}</b>
          <span style={{ fontWeight: "normal", margin: "0px 10px" }}>
            {getHumanFriendlyDate(story?.created_at)}
          </span>

          {action?.title && (
            <span>
              Action:
              <Link
                to={`${links?.actions}/${action?.id}`}
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  color: "grey",
                  margin: "0px 5px",
                }}
              >
                {action?.title}
              </Link>
            </span>
          )}
          {vendor?.name && (
            <span>
              Service Provider:
              <Link
                to={`${links?.services}/${vendor?.id}`}
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  color: "grey",
                  margin: "0px 5px",
                }}
              >
                {vendor?.name}
              </Link>
            </span>
          )}

          <span
            style={{
              margin: "0px 10px",
              fontWeight: "bold",
              color: "#EB5D0B",
              marginLeft: "auto",
            }}
          >
            {isShared && (
              <i
                className="fa fa-share"
                style={{ color: "#EB5D0B", marginRight: 5 }}
              />
            )}
            {isShared ? "Shared from" : ""} {story?.community?.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsCardV2;

export const TestimonialsCardLite = ({ story }) => {
  return (
    <div
      className="touchable-opacity"
      style={{
        flexBasis: "30%",
        border: "solid 1px #f9f9f9",
        background: "rgb(252 252 252)",
        borderRadius: 5,
        margin: 5,
        padding: 20,
      }}
    >
      <h6
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          width: "95%",
        }}
      >
        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
          {story?.title}
          <i className="fa fa-long-arrow-right" style={{ marginLeft: 5 }} />
        </span>

        <span
          style={{
            marginLeft: "auto",
            fontSize: 25,
            position: "absolute",
            right: -17,
            top: -5,
            transform: "rotate(10deg)",
            color: "grey",
            opacity: 0.1,
          }}
        >
          <i className="fa fa-quote-right" />
        </span>
      </h6>

      <div
        style={{
          fontSize: 13,
          display: "flex",
          flexDirection: "row",
          color: "grey",
          marginTop: 8,
        }}
      >
        <b>Brad Hubbard-Nelson</b>
        <span style={{ marginLeft: "auto", fontWeight: "normal" }}>
          {getHumanFriendlyDate(story?.created_at)}
        </span>
      </div>
    </div>
  );
};
