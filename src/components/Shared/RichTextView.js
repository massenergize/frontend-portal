// import React, { useEffect, useRef } from "react";

import { useEffect, useRef } from "react";

// function RichTextView(props) {
//   const iframeRef = useRef();

//   const { key, html, style } = props || {};

//   useEffect(() => {
//     if (iframeRef?.current) {
//       const doc =
//         iframeRef.current?.contentDocument ||
//         iframeRef.current?.contentWindow?.document;
//       doc.open();
//       doc.write(`
//           <html>
//             <head>
//               <style>
//                 @import url("https://fonts.googleapis.com/css?family=Google+Sans:400,400i,500,500i,600,600i,700,700i,900,900i");
//                 @import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i");
//                 @import url("https://fonts.googleapis.com/css?family=Nunito:400,500,700");
//                 body {
//                   font-family: "Google Sans", "Roboto", sans-serif;
//                 }
//               </style>
//             </head>
//             <body>${html}</body>
//           </html>
//         `);
//       doc.close();
//       console.log("BODY HEIGHT", doc.body.scrollHeight);
//     }
//   }, [html]);

//   const makeHeight = (ref) => {
//     const iframe = ref.current;
//     const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
//     return doc?.body?.scrollHeight;
//   };

//   const frameHeight = makeHeight(iframeRef);

// //   console.log("Key, Height", key, makeHeight(iframeRef));

//   return (
//     <div style={{ position: "relative" }}>
//       <iframe
//         ref={iframeRef}
//         title="Rich Text Display"
//         style={{
//           width: "100%",
//           border: "none",
//           height: frameHeight ? `${frameHeight}px` : "auto",

//           ...(style || {}),
//         }}
//       ></iframe>
//     </div>
//   );
// }

// export default RichTextView;

export const RichTextView = (props) => {
  const iframeRef = useRef();
  const { children, html, style, ...rest } = props || {};
  // return <div className="rogue-div" {...rest} dangerouslySetInnerHTML={{ html }} />;

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
