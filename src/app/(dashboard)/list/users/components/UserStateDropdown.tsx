"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Status, User } from "@/lib/data";
import { Row } from "@tanstack/react-table";
import { Ban, CircleUser } from "lucide-react";
import { useState } from "react";

interface Props {
  row: Row<User>;
}

export const StateDropdown = ({ row }: Props) => {
  const actualState = row.original.status;
  const [status, setStatus] = useState(actualState);

  const handleChangeState = (newState: Status) => {
    setStatus(newState);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleChangeState(Status.active)}>
          <CircleUser />
          Activo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeState(Status.inactive)}>
          <Ban />
          Inactivo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
