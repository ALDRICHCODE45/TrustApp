"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lead, Person, User } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { editLeadById, getRecruiters } from "@/actions/leads/actions";
import { toast } from "sonner";

export const GeneradorDropdownSelect = ({
  row,
}: {
  row: Row<Lead & { generadorLeads: User; contactos: Person[] }>;
}) => {
  const [generador, setNewGenerador] = useState(row.original.generadorLeads);
  const [recruiters, setRecruiters] = useState<User[] | null>(null);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecruiters = async () => {
      try {
        const recruiters = await getRecruiters();
        setRecruiters(recruiters);
      } catch (error) {
        console.error("Error loading recruiters:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRecruiters();
  }, []);

  const handleUserChange = async (newUser: User) => {
    try {
      setNewGenerador(newUser);
      const formData = new FormData();
      formData.append("generadorId", newUser.id);

      await editLeadById(row.original.id, formData);
      toast.success("Lead reasignado con éxito");
    } catch (error) {
      toast.error("Error al reasignar lead");
      setNewGenerador(row.original.generadorLeads);
      router.refresh();
      console.log(error);
    }
  };

  const navigateToProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex ">
          <span className="truncate">
            {loading ? "Cargando..." : generador?.name || "Seleccionar"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-[300px] overflow-y-auto">
        {recruiters?.map((recruiter) => (
          <DropdownMenuItem
            key={recruiter.id}
            className="flex items-center gap-3 p-2 cursor-pointer"
            onClick={() => {
              handleUserChange(recruiter);
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage
                  src={recruiter.image ?? undefined}
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
