"use client";

import "react-calendar/dist/Calendar.css";
import { useState, type ReactElement } from "react";
import Calendar from "react-calendar";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface EventCalendarProps {}
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: number;
  title: string;
  time: string;
  description: string;
}

// Temporary Data
const events: Event[] = [
  {
    id: 1,
    title: "Cambiar esquema",
    time: "12:00 PM - 2:00 PM",
    description: "Cambiar el esquema del modelo",
  },
];
export function EventCalendar({}: EventCalendarProps): ReactElement {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <Card className="p-4 bg-background text-foreground">
      <CardContent>
        <Calendar
          onChange={onChange}
          value={value}
          className="mx-auto bg-white dark:bg-gray-800 p-2 rounded-md"
        />
        <div className="flex justify-end items-center mt-4">
          <Button variant="ghost" size="icon">
            <Image src="/moreDark.png" alt="Agregar" width={20} height={20} />
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <Card className="animate-pulse border border-red-500 dark:border-red-700 bg-red-100 dark:bg-red-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Titulo
                </h3>
                <span className="text-red-500 dark:text-red-400 text-xs">
                  12:00 PM - 2:00 PM
                </span>
              </div>
              <p className="mt-2 text-red-600 dark:text-red-300 text-sm">
                Revisar estados de cuenta.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-blue-500 dark:border-blue-700 bg-blue-100 dark:bg-blue-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Titulo
                </h3>
                <span className="text-blue-500 dark:text-blue-400 text-xs">
                  12:00 PM - 2:00 PM
                </span>
              </div>
              <p className="mt-2 text-blue-600 dark:text-blue-300 text-sm">
                Realizar Pagos de Nomina
              </p>
            </CardContent>
          </Card>
          {events.map((event) => (
            <Card
              key={event.id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {event.title}
                  </h3>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {event.time}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
