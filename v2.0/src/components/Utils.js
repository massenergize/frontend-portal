import * as moment from "moment";
import React from "react";

function sameYear(date1, date2) {
  return date1.getFullYear() === date2.getFullYear();
}
function sameMonth(date1, date2) {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
function sameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
function hasTimeInterval(date1, date2) {
  return date1.getHours() !== 0 && date2.getHours() !== 0;
}

/**
 * returns a formatted date string which varies depending on the relationship between provided dates
 * @param startDate
 * @param endDate
 */
export function dateFormatString(startDate, endDate) {
  const startDateMoment = moment(startDate);
  const endDateMoment = moment(endDate);

  let dateString;
  if (sameDay(startDate, endDate)) {
    // April 20, 2020
    dateString = startDateMoment.format("MMMM Do YYYY");
    if (hasTimeInterval(startDate, endDate)) {
      // append 9:30am-3:00pm
      const startTime = startDateMoment.format("h:mm a");
      const endTime = endDateMoment.format("h:mm a");
      dateString += `, ${startTime}-${endTime}`;
    }
  } else {
    const startDay = startDateMoment.format("Do");
    const endDay = endDateMoment.format("Do");
    const startMonth = startDateMoment.format("MMMM");
    const startYear = startDateMoment.format("YYYY");

    if (sameMonth(startDate, endDate)) {
      // April 15-20, 2020
      dateString = `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    } else {
      const endMonth = endDateMoment.format("MMMM");
      if (sameYear(startDate, endDate)) {
        // March 31 - April 15, 2020
        dateString = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
      } else {
        // March 31 2019 - April 15 2020
        const endYear = endDateMoment.format("YYYY");
        dateString = `${startMonth} ${startDay} ${startYear} - ${endMonth} ${endDay} ${endYear}`;
      }
    }
  }

  return dateString;
}

/**
 * returns JSX-formatted version of the provided date
 * @param location
 */
export function locationFormatJSX(location) {
  let firstLine = location.unit
    ? `${location.unit}, ${location.address}`
    : `${location.address}`;

  return (
    <span>
      <b>{firstLine}</b>
      {location.city ? `, ${location.city}` : ""}
      {location.state ? `, ${location.state}` : ""}
    </span>
  );
}

export function addCommasToNumber(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function createCircleGraphData(goalObj, which) {
  if (goalObj === null) return {};
  switch (which) {
    case "households": {
      let value =
        goalObj.attained_number_of_households +
        goalObj.organic_attained_number_of_households;
      let rest = goalObj.target_number_of_households - value;
      return {
        labels: ["Households Engaged", ""],
        datasets: [
          {
            data: [value, rest],
            backgroundColor: ["#8dc63f", "#f2f2f2"],
            hoverBackgroundColor: ["#000", "#f2f2f2"],
          },
        ],
      };
    }
    case "actions-completed": {
      let value =
        goalObj.attained_number_of_actions +
        goalObj.organic_attained_number_of_actions;
      let rest = goalObj.target_number_of_actions - value;
      return {
        labels: ["Actions Completed", ""],
        datasets: [
          {
            data: [value, rest],
            backgroundColor: ["#f67b61", "#f2f2f2"],
            hoverBackgroundColor: ["#000", "#f2f2f2"],
          },
        ],
      };
    }
    case "carbon-reduction": {
      let value =
        goalObj.attained_carbon_footprint_reduction +
        goalObj.organic_attained_carbon_footprint_reduction;
      let rest = goalObj.target_carbon_footprint_reduction - value;
      return {
        labels: ["Carbon Reducation", ""],
        datasets: [
          {
            data: [value, rest],
            backgroundColor: ["#000", "#f2f2f2"],
            hoverBackgroundColor: ["#000", "#f2f2f2"],
          },
        ],
      };
    }
  }
}
