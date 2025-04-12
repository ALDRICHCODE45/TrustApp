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
  // Use the generadorLeads from row.original as the source of truth
  const [recruiters, setRecruiters] = useState<User[] | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the current generator ID directly from row.original each time
  // This ensures we always show the latest data
  const currentGeneratorId = row.original.generadorId;
  const currentGenerator = row.original.generadorLeads;

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
    if (newUser.id === currentGeneratorId) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("generadorId", newUser.id);
      await editLeadById(row.original.id, formData);
      toast.success("Lead reasignado con éxito");
      router.refresh(); // Refresh to update all components with new data
    } catch (error) {
      toast.error("Error al reasignar lead");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateToProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full"
          disabled={isUpdating}
        >
          {isUpdating ? (
            "Actualizando..."
          ) : loading ? (
            "Cargando..."
          ) : (
            <>
              <span className="truncate max-w-[120px]">
                {currentGenerator?.name}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-[300px] overflow-y-auto">
        {recruiters?.map((recruiter) => (
          <DropdownMenuItem
            key={recruiter.id}
            className={`flex items-center gap-3 p-2 cursor-pointer ${
              recruiter.id === currentGeneratorId ? "bg-muted" : ""
            }`}
            onClick={() => handleUserChange(recruiter)}
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
