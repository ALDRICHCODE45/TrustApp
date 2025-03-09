"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useState } from "react";

export const RecruiterDropDown = ({ row }: { row: any }) => {
  const [reclutador, setNewReclutador] = useState(row.original.reclutador.name);
  const handleReclutadorChange = (newReclutador: string) => {
    setNewReclutador(newReclutador);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User />
          {reclutador}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleReclutadorChange("Cesar Romero")}
        >
          <User />
          Cesar Romero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleReclutadorChange("Aylin Perez")}>
          <User />
          Aylin Perez
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleReclutadorChange("Rodrigo Herrera")}
        >
          <User />
          Rodrigo Herrera
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleReclutadorChange("Manuel Morales")}
        >
          <User />
          Manuel Morales
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleReclutadorChange("Melissa Flores")}
        >
          <User />
          Melissa Flores
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
