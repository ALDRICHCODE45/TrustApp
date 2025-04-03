"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { UserState, User } from "@prisma/client";
import { Ban, CircleUser } from "lucide-react";
import { useState } from "react";

interface Props {
  row: Row<User>;
}

export const StateDropdown = ({ row }: Props) => {
  const actualState = row.original.State;
  const [status, setStatus] = useState(actualState);

  const handleChangeState = (newState: UserState) => {
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
        <DropdownMenuItem onClick={() => handleChangeState(UserState.ACTIVO)}>
          <CircleUser />
          Activo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeState(UserState.INACTIVO)}>
          <Ban />
          Inactivo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
