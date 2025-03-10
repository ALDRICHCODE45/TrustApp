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
import { Role, UsersData } from "@/lib/data";
import { User } from "lucide-react";

export const RecruiterDropDown = ({ row }: { row: any }) => {
  const router = useRouter();
  const [reclutador, setNewReclutador] = useState(
    row.original.reclutador || {
      name: "Seleccionar",
      id: null,
    }
  );

  // Filter only recruiters from the UsersData array
  const recruiters = UsersData.filter((user) => user.rol === Role.reclutador);

  const handleReclutadorChange = (newReclutador: any) => {
    setNewReclutador(newReclutador);
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
          <span className="truncate">{reclutador.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-[250px] overflow-y-auto">
        {recruiters.map((recruiter) => (
          <DropdownMenuItem
            key={recruiter.id}
            className="flex items-center gap-3 p-2 cursor-pointer"
            onClick={() => {
              handleReclutadorChange({
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
