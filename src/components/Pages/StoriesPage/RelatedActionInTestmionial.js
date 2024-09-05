import React from "react";

function RelatedActionInTestmionial() {
  return (
    <div
      className="touchable-opacity rel-action"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "solid 1px #ededed",
        borderRadius: 5,
        padding: "10px 15px",
        width: "100%",
      }}
    >
      <img
        src="https://via.placeholder.com/150"
        alt="related action"
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 5 }}
      />
      <div style={{ margin: "15px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <h5
            style={{
              marginRight: 10,
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Heat Pump Hot Water Works Great!
          </h5>
          {/* <i className=" fa fa-long-arrow-right" /> */}
        </div>
        <div style={{ fontSize: 14, marginTop: 5, color: "grey" }}>
          <b>Wayland</b>{" "}
          <span style={{ margin: "0px 8px", fontWeight: "normal" }}>
            22-03-1998
          </span>
        </div>
      </div>

      <i
        className=" fa fa-angle-right"
        style={{
          fontSize: 40,
          color: "grey",
          marginLeft: "auto",
          fontWeight: "bold",
          marginRight: 15,
        }}
      />
    </div>
  );
}

export default RelatedActionInTestmionial;
