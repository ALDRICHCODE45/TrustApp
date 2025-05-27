"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Loader2 } from "lucide-react";
import { es } from "date-fns/locale";
import { getTaskByDate, getTasksByMonth } from "@/actions/tasks/actions";
import { Task } from "@prisma/client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface Props {
  userId: string;
}

export const EventCalendar = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [events, setEvents] = useState<Task[]>([]);
  const [monthEvents, setMonthEvents] = useState<Task[]>([]); // Eventos del mes completo
  const [loading, setLoading] = useState<boolean>(false);
  const [monthLoading, setMonthLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Cargar eventos del mes cuando cambia el mes visible
  const loadMonthEvents = async (date: Date) => {
    setMonthLoading(true);
    try {
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      // Necesitarás crear esta función en tu archivo de actions
      const result = await getTasksByMonth(
        userId,
        startDate.toISOString(),
        endDate.toISOString(),
      );

      if (result.ok) {
        setMonthEvents(result.tasks || []);
      } else {
        toast.error("Error al cargar eventos del mes");
      }
    } catch (error) {
      toast.error("Error al cargar eventos del mes");
    } finally {
      setMonthLoading(false);
    }
  };

  // Cargar eventos del mes inicial
  useEffect(() => {
    loadMonthEvents(currentMonth);
  }, [userId]);

  // Manejar cambio de mes en el calendario
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    loadMonthEvents(date);
  };

  const handleDateSelect = async (date: Date | undefined) => {
    console.log({ date });
    if (!date) return;

    setSelectedDate(date);
    setLoading(true);

    const result = await getTaskByDate(userId, date.toISOString());
    if (!result.ok) {
      toast.error("Error al traer las tareas");
      setLoading(false);
      return;
    }

    setEvents(result.tasks || []);
    setLoading(false);
  };

  const eventDates = monthEvents.map((event) => new Date(event.dueDate));

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-center">Calendario</CardTitle>
        <CardDescription className="text-center">
          Eventos y reuniones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center relative">
            {monthLoading && (
              <div className="absolute top-2 right-2 z-10">
                <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
              </div>
            )}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              className="rounded-md border-0"
              locale={es}
              modifiers={{
                hasEvents: eventDates,
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  fontWeight: "bold",
                  borderRadius: "50%",
                },
              }}
              modifiersClassNames={{
                hasEvents: "has-events-day",
              }}
            />
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
              </div>
            ) : events?.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-white border-2 border-l-blue-500 rounded-lg shadow-sm p-3 mb-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-gray-800">
                          {event.title}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {format(event.dueDate, "EEE dd/MM/yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </Card>
                ))}
              </div>
            ) : selectedDate ? (
              <p className="text-center text-sm text-slate-500 py-4">
                No hay eventos para el{" "}
                {format(selectedDate, "dd/MM/yyyy", { locale: es })}.
              </p>
            ) : (
              <p className="text-center text-sm text-slate-500 py-4">
                Selecciona una fecha para ver los eventos.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
