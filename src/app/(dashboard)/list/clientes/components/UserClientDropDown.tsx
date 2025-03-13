"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cliente, Role, UsersData } from "@/lib/data";
import { User } from "lucide-react";
import { Row } from "@tanstack/react-table";

export const UserClientDropDown = ({ row }: { row: Row<Cliente> }) => {
  const router = useRouter();
  const [usuario, setNewUsuario] = useState(
    row.original.usuario || {
      name: "Seleccionar",
      id: null,
    },
  );

  // Filter only recruiters from the UsersData array
  const newUsuarios = UsersData.filter(
    (user) => user.rol === Role.generadorLeads,
  );

  const handleUserChange = (newUser: any) => {
    setNewUsuario(newUser);
    // Here you could also update your data source or call an API
  };

  const navigateToProfile = (id: number) => {
    router.push(`/profile/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex ">
          <User />
          <span className="truncate">{usuario.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-[250px] overflow-y-auto">
        {newUsuarios.map((recruiter) => (
          <DropdownMenuItem
            key={recruiter.id}
            className="flex items-center gap-3 p-2 cursor-pointer"
            onClick={() => {
              handleUserChange({
                id: recruiter.id,
                name: recruiter.name,
              });
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage
                  src={recruiter.photo}
                  alt={recruiter.name}
                  className="object-cover"
                />
                <AvatarFallback>{recruiter.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{recruiter.name}</span>
                <span className="text-xs text-muted-foreground">
                  {recruiter.email}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="link"
              className="ml-auto h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation(); // Prevent dropdown from closing
                navigateToProfile(recruiter.id);
              }}
            >
              Ver
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
