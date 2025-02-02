"use client";
import "react-calendar/dist/Calendar.css";
import { useState, type ReactElement } from "react";
import Calendar from "react-calendar";
import Image from "next/image";

export interface EventCalendarProps {}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: number;
  title: string;
  time: string;
  description: string;
}

//Temporary Data
const events: Event[] = [
  {
    id: 1,
    title: "Cambiar esquema",
    time: "12:00 PM - 2:00 PM",
    description: "cambiar el esquema del modelo",
  },
  {
    id: 2,
    title: "Renovar licencia",
    time: "2:00 PM - 4:00 PM",
    description: "renovar la licencia de adobe",
  },
  {
    id: 3,
    title: "Back up DB",
    time: "6:00 PM - 8:00 PM",
    description: "Hacer back up de base de datos PostGresQL",
  },
];

export function EventCalendar({}: EventCalendarProps): ReactElement {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <>
      <div className="bg-white p-4 rounded-md">
        <Calendar onChange={onChange} value={value} />
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold my-4">Events</h1>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sky even:border-t-alPurple"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs ">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
