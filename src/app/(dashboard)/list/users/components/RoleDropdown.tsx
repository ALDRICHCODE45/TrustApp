"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role, User } from "@/lib/data";
import { Row } from "@tanstack/react-table";
import { BadgeCent, DollarSign, Shield, UserRoundSearch } from "lucide-react";
import { useState } from "react";

interface Props {
  row: Row<User>;
}

export const RoleDropDown = ({ row }: Props) => {
  const actualRole = row.original.rol;
  const [rol, setRole] = useState(actualRole);

  const handleChangeRole = (newRole: Role) => {
    setRole(newRole);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {rol}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleChangeRole(Role.reclutador)}>
          <UserRoundSearch />
          Reclutador
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeRole(Role.generadorLeads)}>
          <DollarSign />
          G.L
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeRole(Role.admin)}>
          <Shield />
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeRole(Role.marketing)}>
          <BadgeCent />
          Marketing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
