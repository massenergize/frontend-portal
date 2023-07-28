import React from "react";
import { GoogleCalendar } from "datebook";
import { stateAbbreviation } from "../../Utils";
import MEButton from "../Widgets/MEButton";

const AddToGoogleCalendar = ({ data }) => {
  const locationFormat = (location) => {
    if (!location) return "";
    let firstLine =
      location.unit && location.unit !== ""
        ? `${location.address || ""}, ${location.unit}`
        : `${location.address || ""}`;
    const state = location.state ? stateAbbreviation(location.state) : "";

    return `${firstLine}${location.city ? `, ${location.city}` : ""}${
      state ? `, ${state}` : ""
    }`;
  };

  const handleAddEventToGoogleCalendar = () => {
    const googleCalendar = new GoogleCalendar({
      title: data?.name,
      location: locationFormat(data?.location),
      description: data?.description.replace(/<[^>]+>/g, ""),
      start: new Date(data?.start_date_and_time),
      end: new Date(data?.end_date_and_time),
      url: data?.external_link,
    });
    const link = googleCalendar.render();
    window.open(link, "_blank");
  };

  return (
    <MEButton
      onClick={handleAddEventToGoogleCalendar}
      flat
      style={{
        padding: "12px 30px",
        marginTop: 10,
        width: "100%",
        backgroundColor: "grey",
        marginLeft:10
      }}
      wrapperStyle={{ width: "100%" }}
      containerStyle={{
        fontSize: "0.7rem",
      }}
      className="cal-btn google-calendar-btn"
    >
      <i className="fa fa-plus" style={{ marginRight: 6 }} /> Google Calendar
    </MEButton>
  );
};

export default AddToGoogleCalendar;
