"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Lightbulb, MessageCircleOff, Search, Users } from "lucide-react";
import { useState } from "react";

export const StatusDropdown = ({ row }: { row: any }) => {
  const [status, setStatus] = useState(row.original.estado);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as "Hunting");
    // Aquí puedes agregar lógica para actualizar el estatus en tu backend o estado global
    console.log(`Estatus cambiado a: ${newStatus}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleStatusChange("Hunting")}>
          <Users />
          Hunting
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("Cancelada")}>
          <Ban />
          Cancelada
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("Entrevistas")}>
          <Search />
          Entrevistas
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("Perdida")}>
          <MessageCircleOff />
          Perdida
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("Placement")}>
          <Lightbulb />
          Placement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
