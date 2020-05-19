import * as moment from 'moment';

/**
 * checks if a two dates are on the same day ignoring time
 * @param  someDate
*/
function sameDay(someDate, someOtherDate) {
    return someDate.getDate() === someOtherDate.getDate() &&
        someDate.getMonth() === someOtherDate.getMonth() &&
        someDate.getFullYear() === someOtherDate.getFullYear()
}

/**
 * returns a formatted date string which varies depending on the relationship between provided dates
 * @param startDate 
 * @param endDate 
 */
export function dateFormat(startDate, endDate) {
    const format = "MMMM Do YYYY, h:mm a";
    const textyStart = moment(startDate).format(format);
    const textyEnd = moment(endDate).format(format);
    return `${textyStart} - ${textyEnd}`;
}

/**
 * returns a two-tuple (length-two array) containing formatted strings for the provided dates
 * for easy use in cases where the dates are used as seperate strings
 * @param startDate 
 * @param endDate 
 */
export function dateFormatTuple(startDate, endDate) {
    const format = "MMMM Do YYYY, h:mm a";
    return [moment(startDate).format(format), moment(endDate).format(format)];
}