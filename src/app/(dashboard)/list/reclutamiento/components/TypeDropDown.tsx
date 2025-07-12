"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCcw, SquarePlus } from "lucide-react";
import { useState } from "react";

export const TypeDropdown = ({ row }: { row: any }) => {
  const [tipo, setTipo] = useState(row.original.tipo);
  const handleTipoChange = (newTipo: string) => {
    setTipo(newTipo as "Garantia");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          {tipo}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleTipoChange("Nueva")}>
          <SquarePlus />
          Nueva
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTipoChange("Garantia")}>
          <RefreshCcw />
          Garantía
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
