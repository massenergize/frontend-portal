import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
// Big Calendar Documentation : https://jquense.github.io/react-big-calendar/examples/index.html
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function EventCalendarView({ events, openModal }) {
  return (
    <Calendar
      localizer={localizer}
      events={events || []}
      startAccessor="start_date_and_time"
      titleAccessor="name"
      endAccessor="end_date_and_time"
      style={{ height: 500 }}
      views={["month"]}
      onSelectEvent={(obj) => openModal(obj)}
      popup={true}
      showMultiDayTimes={true}
      eventPropGetter={() => ({
        className: "c-event-mark z-depth-float",
      })}
    />
  );
}
