"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { Loader2 } from "lucide-react";
import { es } from "date-fns/locale";
import { getTaskByDate } from "@/actions/tasks/actions";
import { Task } from "@prisma/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  userId: string;
}

export const EventCalendar = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [events, setEvents] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDateSelect = async (date: Date | undefined) => {
    console.log({date});
    
    if (!date) return;
    setSelectedDate(date);
    setLoading(true);

    const result = await getTaskByDate(userId, date.toISOString());
    if (!result.ok) {
      toast.error("Error al traer las tareas");
      return;
    }

    // Simulate loading
    setEvents(result.tasks || []);
    setLoading(false);
  };

  return (
    <Card className=" shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Calendario</CardTitle>
        <CardDescription>Eventos y reuniones</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-center mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border-0 max-w-[280px]"
            locale={es}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
            </div>
          ) : events?.length > 0 ? (
            events.map((event) => (
              <Card
                key={event.id}
                className="border shadow-none border-l-blue-500 "
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <span className="text-xs text-slate-500">
                      {format(event.dueDate, "d 'de' MMMM, yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500 py-4">
              No hay eventos para este día.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
