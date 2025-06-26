"use client";
import { useState, useEffect, useCallback } from "react";
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
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

interface Props {
  userId: string;
}

export const EventCalendar = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [events, setEvents] = useState<Task[]>([]);
  const [monthEvents, setMonthEvents] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [monthLoading, setMonthLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Función helper para convertir fecha a formato YYYY-MM-DD sin problemas de zona horaria
  const formatDateForServer = (date: Date): string => {
    // Usar la fecha local sin conversión UTC para evitar desfase
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cargar eventos del mes
  const loadMonthEvents = useCallback(
    async (date: Date) => {
      setMonthLoading(true);
      try {
        const startDate = startOfMonth(date);
        const endDate = endOfMonth(date);

        // Usar startOfDay y endOfDay para obtener el rango completo
        const startDateTime = startOfDay(startDate);
        const endDateTime = endOfDay(endDate);

        const result = await getTasksByMonth(
          userId,
          startDateTime.toISOString(),
          endDateTime.toISOString()
        );

        if (result.ok) {
          setMonthEvents(result.tasks || []);
        } else {
          toast.error(result.error || "Error al cargar eventos del mes");
        }
      } catch (error) {
        toast.error("Error al cargar eventos del mes");
      } finally {
        setMonthLoading(false);
      }
    },
    [userId]
  );

  // Cargar eventos para una fecha específica
  const loadEventsForDate = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        // Usar formato YYYY-MM-DD para la fecha específica
        const dateString = formatDateForServer(date);

        const result = await getTaskByDate(userId, dateString);

        if (result.ok) {
          setEvents(result.tasks || []);
        } else {
          toast.error(result.message || "Error al traer las tareas");
          setEvents([]);
        }
      } catch (error) {
        toast.error("Error al traer las tareas");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Efecto inicial: cargar mes actual y eventos del día actual
  useEffect(() => {
    const initializeCalendar = async () => {
      if (!userId) return; // Validar que userId existe

      const today = new Date();
      setCurrentMonth(today);
      setSelectedDate(today);

      // Cargar el mes primero, luego los eventos del día
      await loadMonthEvents(today);
      await loadEventsForDate(today);
    };

    initializeCalendar();
  }, [userId, loadEventsForDate, loadMonthEvents]);

  // Efecto para cargar eventos cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate && userId) {
      loadEventsForDate(selectedDate);
    }
  }, [selectedDate, userId, loadEventsForDate]);

  // Manejar cambio de mes en el calendario
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    loadMonthEvents(date);
  };

  // Manejar selección de fecha
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    // El useEffect se encargará de cargar los eventos
  };

  // Crear array de fechas que tienen eventos
  // Usando la misma lógica de formateo que usamos para buscar
  const eventDates = monthEvents.map((event) => {
    const eventDate = new Date(event.dueDate);
    // Usar la misma lógica que formatDateForServer para consistencia
    return new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
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
              className="rounded-md border-0 "
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

          <div className="space-y-2 min-h-[145px]">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
              </div>
            ) : events?.length > 0 ? (
              <div className="space-y-2 h-[145px] overflow-y-auto">
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
