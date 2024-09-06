import React, { useEffect, useState } from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "../Errors/ErrorPage";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import { apiCall } from "../../../api/functions";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import ShareButton from "react-share/lib/ShareButton";
import ShareButtons from "../../Shared/ShareButtons";
import URLS from "../../../api/urls";
import PageTitle from "../../Shared/PageTitle";
import RelatedActionInTestmionial from "./RelatedActionInTestmionial";
import { TestimonialsCardLite } from "./TestimonialsCardV2";
import { isMobile } from "react-device-detect";
import { getHumanFriendlyDate } from "../../Utils";
import SmartImage from "../../Shared/SmartImage";

function OneTestimonialV2({
  story,
  stories,
  otherStories,
  community,
  creatorName,
  newTestimonial,
  edit,
  user,
}) {
  let isShared = community?.id !== story?.community?.id;
  const inEditMode = !story?.is_published && user;
  return (
    <div>
      <div className="container">
        <h2 style={{ display: "block", margin: "20px 0px" }}>{story?.title}</h2>
        <InteractionPanel
          story={story}
          creatorName={creatorName}
          inEditMode={inEditMode}
          isShared={isShared}
          edit={edit}
          newTestimonial={newTestimonial}
        />
        {story?.file && (
          <SmartImage
            disableIfError
            className="me-standard-img"
            src={story?.file?.url}
            alt="Testimonial Media"
          />
        )}
        <div
          style={{ margin: "20px 0px" }}
          className="one-story-html-view test-story-body rich-text-container"
          dangerouslySetInnerHTML={{ __html: story?.body || <></> }}
        />

        <div className="related-area">
          <div style={{ marginTop: 10, width: "100%" }}>
            <h5 className="t-area-title flex-row">
              {/* <span style={{ marginRight: 50 }}>Vendor</span> */}
              <span>Related Action</span>
            </h5>
            <br />
            <div className="related-area">
              <RelatedActionInTestmionial action={story?.action} />
            </div>
          </div>
        </div>
        <br />
        <div style={{ marginTop: 10 }}>
          <h5 style={{ color: "rgb(167 167 167)" }}>Read other testimonials</h5>
          <br />
          <div
            className={"other-t-area"}
            // style={{ flex: "wrap" }}
            // style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {otherStories?.map((story) => {
              return <TestimonialsCardLite story={story} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const InteractionPanel = ({
  story,
  isShared,
  creatorName,
  inEditMode,
  edit,
  newTestimonial,
}) => {
  const { user } = story || {};
  const date = getHumanFriendlyDate(story?.created_at);

  return (
    <>
      <div className="pc-vanish" style={{ marginBottom: 15 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <small>
            Posted By <b>{creatorName} </b>
          </small>
        </div>
        <small style={{ color: "grey" }}>{date}</small>
        {isShared && (
          <small
            style={{ margin: "0px 10px", fontWeight: "bold", color: "#EB5D0B" }}
          >
            <i
              className="fa fa-share"
              style={{ color: "#EB5D0B", marginRight: 5 }}
            />{" "}
            Shared from {story?.community?.name}
          </small>
        )}
      </div>
      <div
        className="phone-vanish"
        style={{
          display: "flex",
          alignItems: "center",
          border: "solid 1px #E8E8E8",
          borderRadius: 5,
          margin: "10px 0px",
          fontSize: 18,
        }}
      >
        <div
          style={{
            padding: "10px 25px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <small>
            Posted By <b>{creatorName}</b>
          </small>

          <small style={{ margin: "0px 10px", color: "grey" }}>{date}</small>
          {isShared && (
            <small
              style={{
                margin: "0px 10px",
                fontWeight: "bold",
                color: "#EB5D0B",
              }}
            >
              <i
                className="fa fa-share"
                style={{ color: "#EB5D0B", marginRight: 5 }}
              />{" "}
              Shared from {story?.community?.name}
            </small>
          )}
        </div>

        <div
          className="touchable-opacity phone-vanish"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#EB5D0B",
            padding: "10px 20px",
            height: 42,
            fontSize: 16,
            color: "white",
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}
          onClick={() => (inEditMode ? edit(story) : newTestimonial())}
        >
          <i className="fa fa-plus" style={{ marginRight: 5 }} />{" "}
          <p style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {inEditMode ? "Edit" : "New Testimonial"}
          </p>
        </div>
      </div>
    </>
  );
};

export default OneTestimonialV2;
