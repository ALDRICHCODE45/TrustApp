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

export const GeneratorDropDown = ({ row }: { row: any }) => {
  const [generador, setNewGenerador] = useState(
    row.original.generadorLeads.name
  );

  const handleGeneratorChange = (newGenerador: string) => {
    setNewGenerador(newGenerador);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User />
          {generador}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleGeneratorChange("Cesar Romero")}>
          <User />
          Cesar Romero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleGeneratorChange("Aylin Perez")}>
          <User />
          Aylin Perez
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleGeneratorChange("Rodrigo Herrera")}
        >
          <User />
          Rodrigo Herrera
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleGeneratorChange("Manuel Morales")}
        >
          <User />
          Manuel Morales
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleGeneratorChange("Melissa Flores")}
        >
          <User />
          Melissa Flores
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
