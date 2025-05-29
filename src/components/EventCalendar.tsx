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
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";

interface Props {
  userId: string;
}

export const EventCalendar = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [events, setEvents] = useState<Task[]>([]);
  const [monthEvents, setMonthEvents] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [monthLoading, setMonthLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Función helper para convertir fecha a formato YYYY-MM-DD sin problemas de zona horaria
  const formatDateForServer = (date: Date): string => {
    // Usar la fecha local sin conversión de zona horaria
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cargar eventos del mes
  const loadMonthEvents = async (date: Date) => {
    setMonthLoading(true);
    try {
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      // Usar formato ISO para el rango de fechas del mes
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
      console.error("Error loading month events:", error);
      toast.error("Error al cargar eventos del mes");
    } finally {
      setMonthLoading(false);
    }
  };

  // Cargar eventos para una fecha específica
  const loadEventsForDate = async (date: Date) => {
    setLoading(true);
    try {
      // Usar formato YYYY-MM-DD para la fecha específica
      const dateString = formatDateForServer(date);
      console.log("Loading events for date:", dateString); // Debug

      const result = await getTaskByDate(userId, dateString);

      if (result.ok) {
        console.log("Tasks found:", result.tasks); // Debug
        setEvents(result.tasks || []);
      } else {
        console.log("No tasks found or error:", result.message); // Debug
        toast.error("Error al traer las tareas");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error loading events for date:", error);
      toast.error("Error al traer las tareas");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto inicial: cargar mes actual y eventos del día actual
  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);

    // Cargar tanto el mes como los eventos del día actual
    loadMonthEvents(today);
    loadEventsForDate(today);
  }, [userId]);

  // Manejar cambio de mes en el calendario
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    loadMonthEvents(date);
  };

  // Manejar selección de fecha
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;

    console.log("Date selected:", date); // Debug
    setSelectedDate(date);
    await loadEventsForDate(date);
  };

  // Crear array de fechas que tienen eventos
  // Normalizando las fechas para evitar problemas de zona horaria
  const eventDates = monthEvents.map((event) => {
    const eventDate = new Date(event.dueDate);
    // Normalizar la fecha para evitar problemas de zona horaria
    return new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
    );
  });

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
                    className="border-2 border-l-blue-500 rounded-lg shadow-sm p-3 mb-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm ">
                          {event.title}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {format(new Date(event.dueDate), "EEE dd/MM/yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2">{event.description}</p>
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
