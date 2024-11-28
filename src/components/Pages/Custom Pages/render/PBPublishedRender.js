import React, { useEffect, useMemo, useRef } from "react";
import { renderSection, serializeBlock } from "./engine/engine";

function PBPublishedRender({ sections }) {
  const iframeRef = useRef();
  const contRef = useRef();

  const html = useMemo(
    () =>
      sections
        .map(({ block }) => {
          return serializeBlock(block?.template);
        })
        ?.join(""),
    [sections]
  );

  useEffect(() => {
    if (iframeRef?.current) {
      const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      doc.open();
      doc.write(`
        <html>
          <head>
          <style>
            @import url("https://fonts.googleapis.com/css?family=Google+Sans:400,400i,500,500i,600,600i,700,700i,900,900i");
            @import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i");
            @import url("https://fonts.googleapis.com/css?family=Nunito:400,500,700");
            body {
              font-family: "Google Sans", "Roboto", sans-serif;
            }
          </style>  
          </head>
          <body>${html}</body>
        </html>
      `);
      doc.close();
    }
  }, [html]);

  return (
    <div ref={contRef} style={{ width: "100%", overflowY: "scroll", overflowX: "hidden", height: "100vh" }}>
      <iframe
        ref={iframeRef}
        style={{ width: "100%", borderWidth: 0, overflowY: "scroll", overflowX: "hidden", height: "100vh" }}
      />
    </div>
  );
}

export default PBPublishedRender;
