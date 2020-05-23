import * as moment from 'moment'
import React from 'react'

function sameYear(date1, date2) {
    return date1.getFullYear() === date2.getFullYear();
}
function sameMonth(date1, date2) {
    return date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}
function sameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
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
    if (sameDay(startDate, endDate)) {              // April 20, 2020
        dateString = startDateMoment.format("MMMM Do YYYY");
        if (hasTimeInterval(startDate, endDate)) {  // append 9:30am-3:00pm
            const startTime = startDateMoment.format("h:mm a");
            const endTime = endDateMoment.format("h:mm a");
            dateString += `, ${startTime}-${endTime}`;
        }
    } else {
        const startDay = startDateMoment.format("Do");
        const endDay = endDateMoment.format("Do");
        const startMonth = startDateMoment.format("MMMM");
        const startYear = startDateMoment.format("YYYY");

        if (sameMonth(startDate, endDate)) {        // April 15-20, 2020
            dateString = `${startMonth} ${startDay}-${endDay}, ${startYear}`;
        } else {
            const endMonth = endDateMoment.format("MMMM");
            if (sameYear(startDate, endDate)) {     // March 31 - April 15, 2020
                dateString = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
            }
            else {                                  // March 31 2019 - April 15 2020
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

    let firstLine = location.unit ? `${location.unit}, ${location.address}`
        : `${location.address}`;

    return (
        <span>
            <b>{firstLine}</b>
            {location.city ? `, ${location.city}` : ''}
            {location.state ? `, ${location.state}` : ''}
        </span>
    );
}