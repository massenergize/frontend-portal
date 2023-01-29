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

export default function EventCalendarView({
  events,
  onEventClick,
  thisCommunity,
}) {
  return (
    <div className="event-calendar-container">
      <Calendar
        localizer={localizer}
        events={events || []}
        startAccessor="start_date_and_time"
        titleAccessor="name"
        endAccessor="start_date_and_time"
        messages={{ previous: "Previous" }}
        views={["month"]}
        onSelectEvent={(obj) => onEventClick && onEventClick(obj)}
        popup={true}
        showMultiDayTimes={true}
        eventPropGetter={({ community }) => {
          const isShared = community?.id !== thisCommunity?.id;
          return {
            className: ` c-event-mark ${
              isShared ? "c-event-shared" : "c-event-original"
            } z-depth-float`,
          };
        }}
      />
    </div>
  );
}
