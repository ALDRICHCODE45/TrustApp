"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { editLeadById, getRecruiters } from "@/actions/leads/actions";
import { toast } from "sonner";
import { Loader2, RotateCw } from "lucide-react";
import { LeadWithRelations } from "@/app/(dashboard)/leads/kanban/page";

export const GeneradorDropdownSelect = ({
  row,
}: {
  row: Row<LeadWithRelations>;
}) => {
  const [recruiters, setRecruiters] = useState<User[] | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const currentGeneratorId = row.original.generadorId;
  const currentGenerator = row.original.generadorLeads;

  const loadRecruiters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const recruitersData = await getRecruiters();

      if (Array.isArray(recruitersData) && recruitersData.length > 0) {
        setRecruiters(recruitersData);
      } else {
        setError("No se pudieron cargar los reclutadores");
        console.warn("Recruiters data is empty or invalid:", recruitersData);
      }
    } catch (error) {
      setError("Error al cargar reclutadores");
      console.error("Error loading recruiters:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar reclutadores al montar el componente con un sistema de reintentos limitados
  useEffect(() => {
    loadRecruiters();

    // Sistema de reintentos automáticos (máximo 3)
    if (retryCount < 3) {
      const retryTimer = setTimeout(() => {
        if (loading && !recruiters) {
          console.log(`Retry attempt ${retryCount + 1} loading recruiters`);
          loadRecruiters();
          setRetryCount((prev) => prev + 1);
        }
      }, 2000); // Esperar 2 segundos antes de reintentar

      return () => clearTimeout(retryTimer);
    }
  }, [loadRecruiters, retryCount]);

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

  const retryLoading = () => {
    setRetryCount(0); // Resetear contador de reintentos
    loadRecruiters();
  };

  // Renderizar nombre del generador actual
  const renderCurrentGeneratorName = () => {
    if (currentGenerator?.name) {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarImage
              src={currentGenerator.image ?? undefined}
              alt={currentGenerator.name}
              className="object-cover"
            />
            <AvatarFallback>{currentGenerator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[90px]">{currentGenerator.name}</span>
        </div>
      );
    }
    return "Sin asignar";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full justify-between"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <span>Actualizando...</span>
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2">
              <span>Cargando...</span>
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          ) : error ? (
            <div
              className="flex items-center gap-2 text-red-500 w-full justify-between"
              onClick={(e) => {
                e.stopPropagation();
                retryLoading();
              }}
            >
              <span className="truncate max-w-[100px]">Error</span>
              <RotateCw className="h-3 w-3" />
            </div>
          ) : (
            renderCurrentGeneratorName()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 max-h-[300px] overflow-y-auto">
        {error ? (
          <div className="p-3 text-center">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button size="sm" onClick={retryLoading}>
              Reintentar
            </Button>
          </div>
        ) : loading ? (
          <div className="p-3 text-center">
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">
              Cargando reclutadores...
            </p>
          </div>
        ) : recruiters && recruiters.length > 0 ? (
          recruiters.map((recruiter) => (
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
          ))
        ) : (
          <div className="p-3 text-center">
            <p className="text-sm text-muted-foreground">
              No hay reclutadores disponibles
            </p>
            <Button size="sm" onClick={retryLoading} className="mt-2">
              Reintentar
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
