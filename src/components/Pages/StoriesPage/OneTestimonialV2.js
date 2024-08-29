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

      <ShareButtons
        label="Share this testimonial!"
        pageTitle={story?.name}
        pageDescription={story?.featured_summary}
        url={`${URLS.SHARE}/${subdomain}/testimonial/${story.id}`}
      />
    </div>
  );
}

export default OneTestimonialV2;
