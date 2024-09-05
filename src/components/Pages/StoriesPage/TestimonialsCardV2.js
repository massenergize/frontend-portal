import React from "react";

function TestimonialsCardV2() {
  return <div>TestimonialsCardV2</div>;
}

export default TestimonialsCardV2;

export const TestimonialsCardLite = () => {
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
          Had all my complicated lights switched to LED!{" "}
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
          22-03-2024
        </span>
      </div>
    </div>
  );
};
