import React, { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useApiRequest } from "../../../hooks/useApiRequest";
import LoadingCircle from "../../Shared/LoadingCircle";
import PBPublishedRender from "./render/PBPublishedRender";

function RenderCustomPage() {
  const { pageId } = useParams();

  const [pageLoadHandler] = useApiRequest([
    {
      key: "pageLoad",
      url: "/custom.pages.getForUser",
    },
  ]);

  const [fetchPageInfo, data, error, loading] = pageLoadHandler || [];

  useEffect(() => {
    fetchPageInfo({ id: pageId });
  }, []);

  if (loading) return <LoadingCircle />;

  if (error)
    return (
      <div style={{ height: "100vh" }}>
        <p
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            color: "#d05c5c",
          }}
        >
          {error}
        </p>
      </div>
    );

  return (
    <div style={{ height: "100vh" }}>
      <PBPublishedRender sections={data?.content || []} />
    </div>
  );
}

export default RenderCustomPage;
