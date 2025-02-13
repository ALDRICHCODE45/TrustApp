"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export const MesAsignadoCell = ({ row }: { row: any }) => {
  // Convertir el mes en formato texto (ej. "Enero") a un objeto Date
  const initialDate = row.original.mesAsignado
    ? parse(row.original.mesAsignado, "MMMM", new Date(), { locale: es })
    : undefined;

  // Estado local para el mes asignado
  const [mesAsignado, setMesAsignado] = useState<Date | undefined>(initialDate);

  // Manejador para cambiar el mes
  const handleMonthChange = (newDate: Date | undefined) => {
    if (newDate) {
      setMesAsignado(newDate);
      // Aquí puedes agregar lógica para actualizar el mes en tu backend o estado global
      console.log(
        `Mes cambiado a: ${format(newDate, "MMMM yyyy", { locale: es })}`
      );
    }
  };

  return (
    <Popover>
      {/* Botón que muestra el mes actual */}
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {mesAsignado ? (
            format(mesAsignado, "MMMM yyyy", { locale: es })
          ) : (
            <span>Seleccionar Mes</span>
          )}
        </Button>
      </PopoverTrigger>

      {/* Contenido del Popover: Calendario */}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={mesAsignado}
          onSelect={handleMonthChange}
          initialFocus
          fromDate={new Date(2020, 0, 1)} // Fecha mínima
          toDate={new Date(2030, 11, 31)} // Fecha máxima
          locale={es} // Localización en español
        />
      </PopoverContent>
    </Popover>
  );
};
