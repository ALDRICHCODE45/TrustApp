"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createSubSector } from "@/actions/subsectores/actions";
import { toast } from "sonner";
import { Building2, Plus, Loader2 } from "lucide-react";

export const CreateSubSectorForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const subsector = formData.get("subsector") as string;

    try {
      const response = await createSubSector(subsector);
      if (response.ok) {
        toast.success("¡Subsector creado exitosamente!");
        // Limpiar el formulario después del éxito
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Error al crear el subsector");
      }
    } catch (error) {
      toast.error("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="">
          <div>
            <CardTitle>Crear Subsector</CardTitle>
            <CardDescription>
              Define un nuevo subsector para categorizar mejor tus leads
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} id="subsector-form" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subsector">Nombre del subsector</Label>
            <Input
              id="subsector"
              name="subsector"
              type="text"
              placeholder="Ej: Tecnología, Marketing Digital, Consultoría..."
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Usa nombres descriptivos para una mejor organización
            </p>
          </div>
        </form>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button
          type="submit"
          form="subsector-form"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Crear Subsector
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
