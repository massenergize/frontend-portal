import React from "react";

function HouseholdDeleteConfirmation({ household, todos, cancel, onConfirm }) {
  const todosForThisHouse = (todos || []).filter(
    (todo) => todo?.real_estate_unit?.id === household?.id
  );
  return (
    <div className="household-confirmation">
      <center style={{ padding: 15 }}>
        <span>
          Are you sure you want to delete this household (
          <b>{household?.name || "..."}</b>)?
          <br />
          {todosForThisHouse.length ? (
            <span>
              {" "}
              You will not be able to keep the{" "}
              <b>({todosForThisHouse.length})</b> item(s) you have added to your
              todo list, in this household.
            </span>
          ) : (
            <></>
          )}
        </span>
      </center>
      <div
        className="house-footer"
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          width: "100%",
          background: "#fafafa",
          bottom: 0,
          borderBottomRightRadius: 6,
          borderBottomLeftRadius: 6,
        }}
      >
        <div
          style={{
            marginLeft: "auto",
          }}
        >
          <button
            className="flat-btn  flat-btn_submit btn-success"
            onClick={() => {
              onConfirm && onConfirm();
              cancel();
            }}
          >
            YES
          </button>
          <button
            className="flat-btn close-flat"
            onClick={() => cancel && cancel()}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}

export default HouseholdDeleteConfirmation;
