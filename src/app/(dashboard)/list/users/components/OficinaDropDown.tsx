"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Oficina, User } from "@/lib/data";
import { Row } from "@tanstack/react-table";
import { House } from "lucide-react";
import { useState } from "react";

interface Props {
  row: Row<User>;
}

export const OficinaDropDown = ({ row }: Props) => {
  const actualOficina = row.original.oficina;
  const [oficina, setOficina] = useState(actualOficina);

  const handleChangeOficina = (newOficina: Oficina) => {
    setOficina(newOficina);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {oficina}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleChangeOficina(Oficina.dos)}
        >
          <House />
          Oficina 2
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChangeOficina(Oficina.uno)}
          className="cursor-pointer"
        >
          <House />
          Oficina 1
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
