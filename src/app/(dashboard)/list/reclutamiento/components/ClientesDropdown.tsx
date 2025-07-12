import { VacancyWithRelations } from "@/app/(dashboard)/reclutador/components/ReclutadorColumns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { Hotel } from "lucide-react";
import { useState } from "react";

export const ClientesDropDown = ({
  row,
}: {
  row: Row<VacancyWithRelations>;
}) => {
  const [cliente, setCliente] = useState(
    row.original.cliente?.cuenta ? row.original.cliente.cuenta : "Cliente"
  );
  const handleClienteChange = (newCliente: string) => {
    setCliente(newCliente);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          {cliente}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="cursor-pointer">
        <DropdownMenuItem onClick={() => handleClienteChange("Zendesk")}>
          <Hotel />
          Zendesk
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleClienteChange("Global Hits")}
        >
          <Hotel />
          Global Hits
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleClienteChange("CiberPower")}
        >
          <Hotel />
          CiberPower
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleClienteChange("Takeda")}
        >
          <Hotel />
          Takeda
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
