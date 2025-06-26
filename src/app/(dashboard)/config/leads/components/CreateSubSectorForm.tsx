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
import { createSubSector } from "@/actions/subsectores/actions";
import { toast } from "sonner";

export const CreateSubSectorForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const subsector = formData.get("subsector") as string;

    try {
      const response = await createSubSector(subsector);
      if (response.ok) {
        toast.success(response.message);
        // Limpiar el formulario después del éxito
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error al crear el subsector");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crea un nuevo subsector</CardTitle>
        <CardDescription>
          Ingresa el nombre del subsector que deseas crear.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="subsector-form">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="subsector">Nombre del subsector</Label>
              <Input
                id="subsector"
                name="subsector"
                type="text"
                placeholder="Ej: Tecnologia"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="subsector-form" className="w-full">
          Crear subsector
        </Button>
      </CardFooter>
    </Card>
  );
};
