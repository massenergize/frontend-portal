import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function RenderCustomPage() {
  const { pageId } = useParams();
  console.log("THE PAGE ID", pageId);
  return <div style={{ height: "100vh" }}>RenderCustomPage</div>;
}

export default RenderCustomPage;
