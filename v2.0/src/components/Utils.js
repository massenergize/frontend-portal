import * as moment from "moment";
import React from "react";

export const getFilterVersionFromURL = (location, paramName) => {
  if (!location || !location.search) return "";
  const search = location.search;
  var broken = search.slice(1, search.length);
  broken = broken.split("=");
  var found = broken.filter((item) => item.toLowerCase() === "filter")[0];
  if (!found) return "";
  return broken[broken.indexOf(found) + 1];
};

export const searchIsActiveFindContent = (data, activeFilters, word, func) => {
  if (!word) return null;
  word = word.toLowerCase();
  const content = applyTagsAndGetContent(data, activeFilters) || data;
  if (!func) return null;
  return content.filter((action) => func(action, word));
};

export const changeToProperURL = (url) => {
  if (!url) return "#";
  if (isAProperURL(url)) return url;
  return "https://" + url;
};
export const isAProperURL = (url) => {
  if (!url) return false;
  return url.split("http").length > 1;
};

export const applyTagsAndGetContent = (content, checkedValues) => {
  if (!checkedValues || checkedValues.length === 0) return content;
  //apply AND filter
  const filters = getPropsArrayFromJsonArray(checkedValues, "value");
  const rem = (content || []).filter((item) => {
    const contentTags = getPropsArrayFromJsonArray(item.tags, "name");
    const combined = new Set([...filters, ...contentTags]);
    // if the set of unique values of filters and action tags have the same number of elements
    // as the array of tag names of an action, it means an action qualifies for all the selected filters
    return combined.size === contentTags.length && item;
  });

  return rem.sort((a, b) => {
    return a.rank - b.rank;
  });
};

/**
 * This function takes actions and records only tags and tag categories that are
 * active
 * @param {*} actions just normal arr of actions
 * @param {*} cols original tag collection arr set that is returned by the api
 * @returns
 */

//TODO: This whole mech should probably be done in the backend
export const filterTagCollections = (actions, cols) => {
  if (!actions) return [];
  const collections = {};
  actions.forEach((action) => {
    action.tags &&
      action.tags.forEach((tag) => {
        const name = tag.tag_collection_name;
        // Collect the rank value from the original tag collection array to be used for sorting later (TODO:backend needs to add this)
        const original = (cols || []).filter((set) => set.name === name)[0];
        const rank = original && original.rank;
        const found = collections[name];
        if (found) {
          if (!found.alreadyIn.includes(tag.id)) {
            collections[name].tags.push(tag);
            collections[name].alreadyIn.push(tag.id);
          }
        } else {
          collections[name] = {
            name: name,
            tags: [tag],
            alreadyIn: [tag.id],
            rank,
          };
        }
      });
  });
  var arr = [];
  Object.keys(collections).forEach((key) => {
    arr.push(collections[key]);
  });
  // Now sort array of tag collections based on ranks from lowest -> highest
  arr = arr.sort((a, b) => a.rank - b.rank);
  return arr;
};

export const sumOfCarbonScores = (data) => {
  if (!data) return 0;
  return data
    .map((t) =>
      t.action && t.action.calculator_action
        ? t.action.calculator_action.average_points
        : 0
    )
    .reduce((partial_sum, a) => partial_sum + a, 0);
};
export const getHumanFriendlyDate = (dateString) => {
  if (!dateString) return null;
  return moment(dateString).format("MMMM Do YYYY ");
};
export const getTextArrayAsString = (array, separationKey) => {
  if (!array || !separationKey) return "";
  let text = "";
  array.forEach((item) => {
    if (text === "") {
      text = item;
    } else {
      text = text + separationKey + item;
    }
  });

  return text;
};

/**
 *
 * @param {*} data
 * @param {*} pageNumber
 * @param {*} perPage
 */
const getPageCount = (dataLength, perPage) => {
  // when the page number is determined by just rounding of a the division of datalength and perpage
  // it does not take into account a page that only has a number of items less than half of the "perpage" number
  // hence this "ROBUST" algorithm.. LMAAAAAOOOOOOOOOOO!!!
  const div = dataLength / perPage;
  if (dataLength % perPage > 0) return (div + 1).toFixed();
  return div.toFixed();
};
export const moveToPage = (data, pageNumber, perPage) => {
  data = data ? data : [];
  perPage = Number(perPage);
  // the current page x by perpage number will give how items have been taken away any time
  const whereIAmAt = (pageNumber - 1) * perPage;
  const endpoint = whereIAmAt + perPage;
  // use the number of items taken away to determine the point in the data list to start from
  // and add the perPage number to determine the end index of the point we want to slice to in the data list
  const dataToSend = data.slice(whereIAmAt, endpoint);
  // now to find how much data has been retrieved in total including the curernt data tha tis about to be shipped
  // add the "whereIAmAt"  to the number of items that were obtained from the slice
  const taken = whereIAmAt + dataToSend.length;
  //now just update state values
  return {
    data: dataToSend,
    currentPage: pageNumber,
    itemsLeft: data.length - taken,
    pageCount: getPageCount(data.length, perPage),
  };
};

export const getRandomIntegerInRange = (range) => {
  return Math.floor(Math.random() * Math.floor(range));
};
export function getPropsArrayFromJsonArray(array, property) {
  if (!array || !property) return [];
  const toGo = [];
  array.forEach((item) => toGo.push(item[property]));
  return toGo;
}
export function getPropsArrayFromJsonArrayAdv(array, modifier) {
  if (!array || !modifier) return [];
  const toGo = [];
  array.forEach((item) => toGo.push(modifier(item)));
  return toGo;
}

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

export function createCircleGraphData(goalObj, which) {
  if (goalObj === null) return {};
  switch (which) {
    case "households": {
      let value =
        goalObj.attained_number_of_households +
        goalObj.organic_attained_number_of_households;
      let rest;
      if (
        goalObj.attained_number_of_households +
          goalObj.organic_attained_number_of_households ===
        0
      ) {
        rest = 100; // if everything is zero, we dont want the graph to not show, we want a big ball of greyish NOTHING... loool
      } else {
        rest = goalObj.target_number_of_households - value;
      }
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
      let rest;
      if (
        goalObj.attained_number_of_actions +
          goalObj.organic_attained_number_of_actions ===
        0
      ) {
        rest = 100; // if everything is zero, we dont want the graph to not show, we want a big ball of greyish NOTHING... loool
      } else {
        rest = goalObj.target_number_of_actions - value;
      }
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
      let rest;
      if (
        goalObj.attained_carbon_footprint_reduction +
          goalObj.organic_attained_carbon_footprint_reduction ===
        0
      ) {
        rest = 100; // if everything is zero, we dont want the graph to not show, we want a big ball of greyish NOTHING... loool
      } else {
        rest = goalObj.target_carbon_footprint_reduction - value;
      }
      return {
        labels: ["Carbon Reduction", ""],
        datasets: [
          {
            data: [value, rest],
            backgroundColor: ["#000", "#f2f2f2"],
            hoverBackgroundColor: ["#000", "#f2f2f2"],
          },
        ],
      };
    }
    default:
      return {
        labels: [],
        datasets: [],
      };
  }
}
