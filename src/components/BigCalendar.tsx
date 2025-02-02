"use client";
import {
  Calendar,
  EventProps,
  momentLocalizer,
  View,
} from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const eventStyleGetter = (event: EventProps) => {
    const now = moment(); // Fecha actual
    const end = moment(event.end); // Fecha de finalización del evento
    const daysRemaining = end.diff(now, "days"); // Días restantes
    let className = "";

    let backgroundColor = "#A8E6CF"; // Verde por defecto
    if (daysRemaining <= 3) {
      backgroundColor = "#FF6B6B"; // Rojo
    } else if (daysRemaining === 4) {
      backgroundColor = "#FFD93D"; // Amarillo
    } else if (daysRemaining === 15) {
      backgroundColor = "#ff0033";
      className = "blink";
    }

    return {
      style: {
        backgroundColor,
      },
      className,
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["day", "week"]}
      view={view}
      min={new Date(2025, 1, 30, 8, 0, 0)}
      max={new Date(2025, 1, 30, 18, 0, 0)}
      date={date}
      onNavigate={handleNavigate}
      style={{ height: "98%" }}
      eventPropGetter={eventStyleGetter}
      onView={handleOnChangeView}
    />
  );
};

export default BigCalendar;
