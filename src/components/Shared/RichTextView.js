import { useEffect, useRef, useState } from "react";

export const RichTextView = (props) => {
  const iframeRef = useRef();
  const { children, html, style } = props || {};

  useEffect(() => {
    const adjustHeight = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeDocument =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow.document;
        const val = iframeDocument.body.scrollHeight;
        iframeRef.current.style.height = val ? `${val}px` : "auto";
      }
    };

    // Adjust height initially and when content changes
    iframeRef.current.onload = adjustHeight;

    return () => {
      if (iframeRef.current) {
        iframeRef.current.onload = null;
      }
    };
  }, []);
  useEffect(() => {
    if (iframeRef?.current) {
      const doc =
        iframeRef.current?.contentDocument ||
        iframeRef.current?.contentWindow?.document;
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
            <body>${html || "<p>Add your rich text here...</p>"}</body>
          </html>
        `);
      doc.close();
    }
  }, [html]);

  return (
    <div style={{ position: "relative" }}>
      <iframe
        ref={iframeRef}
        title="Rich Text Display"
        style={{
          width: "100%",
          border: "none",
          height: "auto",
          ...(style || {}),
        }}
      />
    </div>
  );
};

export default RichTextView;
