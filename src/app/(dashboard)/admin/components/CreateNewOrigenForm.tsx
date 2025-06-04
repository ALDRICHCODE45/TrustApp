"use client";

import { createNewOrigen } from "@/actions/leads/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ban, Loader2, Plus, SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  nombre: string;
};

export const CreateNewOrigenForm = () => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsloading(true);
    const formData = new FormData();
    formData.append("nombre", data.nombre);

    const { ok, message } = await createNewOrigen(formData);
    if (!ok) {
      toast.error("Error", {
        description: "Ha ocurrido un error al crear el origen",
        duration: 5000,
        icon: <Ban />,
      });
      return;
    }

    try {
      toast.success("Origen creado", {
        description: "El origen ha sido creado exitosamente",
        duration: 5000,
        icon: <SquareCheckBig />,
      });
    } catch (err) {
      toast.error("Error", {
        description: "Ha ocurrido un error al crear el origen",
        duration: 5000,
        icon: <Ban />,
      });
    } finally {
      setIsloading(false);
    }
  };
  return (
    <>
      <Dialog>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus />
              Agregar origen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Origen</DialogTitle>
              <DialogDescription>
                Agrega el nuevo origen a continuacion:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  {...register("nombre", {
                    required: true,
                    minLength: {
                      value: 3,
                      message: "Ingrese minimo 3 caracteres",
                    },
                  })}
                  id="nombre"
                  name="nombre"
                  placeholder="eje: linkedin"
                />
              </div>
              {errors.nombre?.message ? (
                <span className="text-red-500">{errors.nombre.message}</span>
              ) : null}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" size="sm">
                {isLoading ? (
                  <>
                    <Loader2 /> Cargando..
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};
