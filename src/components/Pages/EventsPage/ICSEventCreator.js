import React from "react";
import { createEvent } from "ics";
import { stateAbbreviation } from "../../Utils";
import MEButton from "../Widgets/MEButton";

const ICSEventCreator = ({ data }) => {
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

  const getDateArr = (str) => {
    const dateObj = new Date(str);
    const [year, month, day, hour, minute, second, millisecond] = [
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      dateObj.getDate(),
      dateObj.getHours(),
      dateObj.getMinutes(),
      dateObj.getSeconds(),
      dateObj.getMilliseconds(),
    ];

    return [year, month, day, hour, minute, second, millisecond];
  };

  const handleDownloadICS = () => {
    const event = {
      title: data?.name,
      description: data?.featured_summary,
      location: locationFormat(data?.location),
      start: getDateArr(data?.start_date_and_time),
      end: getDateArr(data?.end_date_and_time),
      url:window.location.href
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.error("Error creating ICS file:", error);
        return;
      }
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data?.name}.ics`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <MEButton
      onClick={handleDownloadICS}
      flat
      style={{
        padding: "12px 30px",
        marginTop: 10,
        width: "100%",
        backgroundColor: "grey",
        borderRadius: 5,
      }}
      wrapperStyle={{ width: "100%" }}
      className="cal-btn"
      containerClassName="ical-btn"
    >
      <i className="fa fa-plus" style={{ marginRight: 6 }} /> ICAL
    </MEButton>
  );
};

export default ICSEventCreator;
