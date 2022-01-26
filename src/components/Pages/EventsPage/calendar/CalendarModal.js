import React from "react";
import {
  getHumanFriendlyDate,
  locationFormatJSX,
  recurringDetails,
} from "../../../Utils";
import MEModal from "../../Widgets/MEModal";
import notFound from "./../not-found.jpg";
export default function CalendarModal({ event, close, toFullView }) {
  if (!event) return <></>;
  const { name, start_date_and_time, end_date_and_time, location } = event;
  const recurringString = recurringDetails(event);
  return (
    <MEModal
      showCloseBtn={false}
      size="sm"
      contentStyle={{ minWidth: "100%" }}
      style={{ padding: 0 }}
      closeModal={close}
    >
      <div className="calendar-modal">
        <img src={event?.image?.url || notFound} alt="Event media" />
        <div style={{ position: "relative" }}>
          <div style={{ height: "100%", padding: 15 }}>
            <h5>{name || "..."}</h5>
            <p style={{ color: "black", fontSize: 15 }}>
              {recurringString || ""}
            </p>
            <h6>
              <span style={{ marginBottom: 6 }}>
                <i
                  className="fa fa-clock-o"
                  style={{
                    marginRight: 6,
                  }}
                ></i>
                Start Date{" "}
              </span>{" "}
              <br />
              <b style={{ color: "var(--app-theme-orange)" }}>
                {getHumanFriendlyDate(start_date_and_time) || "...."}
              </b>
            </h6>
            <h6>
              <span style={{ marginBottom: 6 }}>
                <i
                  className="fa fa-clock-o"
                  style={{
                    marginRight: 4,
                  }}
                ></i>{" "}
                End Date
              </span>{" "}
              <br />
              <b style={{ color: "var(--app-theme-orange)" }}>
                {getHumanFriendlyDate(end_date_and_time) || "...."}
              </b>
            </h6>
            <h6>
              <span style={{ marginBottom: 4 }}>
                <i
                  className="fa fa-map-marker"
                  style={{
                    marginRight: 4,
                  }}
                ></i>{" "}
                Location
              </span>
              <br />
              <b style={{ color: "var(--app-theme-green)" }}>
                {locationFormatJSX(location) || "No location specified..."}
              </b>
            </h6>
          </div>
          <div
            onClick={() => toFullView(event)}
            className="calendar-modal-btn touchable-opacity"
          >
            See More About Event
          </div>
        </div>
      </div>
    </MEModal>
  );
}
