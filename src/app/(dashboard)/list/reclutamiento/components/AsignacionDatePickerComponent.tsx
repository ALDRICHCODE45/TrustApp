"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { es } from "date-fns/locale";
import { format } from "date-fns";

interface DatePickerCellProps {
  fecha: Date;
  onFechaChange: (nuevaFecha: Date) => void;
}
export const ChangeDateComponent = ({
  fecha,
  onFechaChange,
}: DatePickerCellProps) => {
  const [date, setDate] = useState(
    fecha instanceof Date ? fecha : new Date(fecha),
  );
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpen(false);
      onFechaChange(selectedDate);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center w-full"
        >
          <span>{format(date, "EEE dd/MM/yy", { locale: es })}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={es}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
