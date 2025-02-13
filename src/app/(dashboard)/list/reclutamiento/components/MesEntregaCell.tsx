"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export const MesEntregaCell = ({ row }: { row: any }) => {
  // Convertir la fecha inicial (string YYYY-MM-DD) a un objeto Date
  const initialDate = row.original.fechaEntrega
    ? new Date(row.original.fechaEntrega)
    : undefined;

  // Estado local para la fecha
  const [fecha, setFecha] = useState<Date | undefined>(initialDate);

  // Manejador para cambiar la fecha
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setFecha(newDate);
      // Aquí puedes agregar lógica para actualizar la fecha en tu backend o estado global
      console.log(`Fecha cambiada a: ${format(newDate, "yyyy-MM-dd")}`);
    }
  };

  return (
    <Popover>
      {/* Botón que muestra la fecha actual */}
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {fecha ? format(fecha, "yyyy-MM-dd") : <span>Seleccionar Fecha</span>}
        </Button>
      </PopoverTrigger>

      {/* Contenido del Popover: Calendario */}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={fecha}
          onSelect={handleDateChange}
          initialFocus
          fromDate={new Date(2020, 0, 1)} // Fecha mínima
          toDate={new Date(2030, 11, 31)} // Fecha máxima
        />
      </PopoverContent>
    </Popover>
  );
};
