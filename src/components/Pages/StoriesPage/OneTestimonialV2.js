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

function OneTestimonialV2() {
  const params = useParams();
  const links = useSelector((state) => state.links);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [story, setStory] = useState("");

  const { community } = story || {};
  const { subdomain } = community || {};

  const fetchTestimonial = (id) => {
    // Make it fetch from redux after the first time
    setLoading(true);
    apiCall("testimonials.info", { testimonial_id: id }).then((response) => {
      console.log("This is the response", response);
      setLoading(false);
      if (!response.success) {
        setError(response.error);
        return;
      }
      setStory(response.data);
    });
  };

  useEffect(() => {
    window.gtag("set", "user_properties", { page_title: "OneTestimonialPage" });
    const { id } = params;
    fetchTestimonial(id);
  }, []);
  if (!story || error) {
    return (
      <ErrorPage
        errorMessage="Unable to load this Testimonial"
        errorDescription={error ? error : "Unknown cause"}
      />
    );
  }
  if (loading) return <LoadingCircle />;

  return (
    <div
      className="boxed_wrapper"
      style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
    >
      <BreadCrumbBar
        links={[
          { link: links.testimonials, name: "Testimonials" },
          { name: story ? story.title : "..." },
        ]}
      />

      <div className="container">
        <h2 style={{ display: "block", margin: "20px 0px" }}>{story?.title}</h2>
        <InteractionPanel />
        <img
          style={{
            background: "#fbfbfb",
            objectFit: "contain",
            borderRadius: 10,
            width: "100%",
            height: 400,
          }}
          src={
            "https://massenergize-prod-files.s3.amazonaws.com/media/tempImagenlb0uh-231116-044959.jpg"
          }
          alt="Testimonial Media"
        />
        <div
          style={{ margin: "20px 0px" }}
          className="one-story-html-view test-story-body rich-text-container"
          dangerouslySetInnerHTML={{ __html: story?.body || <></> }}
        />
        <ShareButtons
          label="Share this testimonial!"
          pageTitle={story?.name}
          pageDescription={story?.featured_summary}
          url={`${URLS.SHARE}/${subdomain}/testimonial/${story.id}`}
        />
      </div>
    </div>
  );
}

const InteractionPanel = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",

        border: "solid 1px #E8E8E8",
        borderRadius: 5,
        margin: "10px 0px",
      }}
    >
      <div
        style={{ padding: "10px 30px", display: "flex", alignItems: "center" }}
      >
        <small>
          Posted By <b>Frimpong Opoku Agyemang</b>
        </small>

        <small style={{ margin: "0px 10px", color: "#E8E8E8" }}>
          22nd March 2024
        </small>
        <small
          style={{ margin: "0px 10px", fontWeight: "bold", color: "#EB5D0B" }}
        >
          <i
            className="fa fa-share"
            style={{ color: "#EB5D0B", marginRight: 5 }}
          />{" "}
          Shared from Wayland
        </small>
      </div>

      <div
        className="touchable-opacity"
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#EB5D0B",
          padding: "10px 20px",
          height: 40,
          fontSize: 16,
          color: "white",
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
        }}
      >
        <i className="fa fa-plus" style={{ marginRight: 5 }} />{" "}
        <p style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          New Testimonial
        </p>
      </div>
    </div>
  );
};

export default OneTestimonialV2;
