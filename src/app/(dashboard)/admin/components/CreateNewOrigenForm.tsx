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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    console.log({ ok, message });
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
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus />
                Agregar nuevo origen
              </Button>
            </TooltipTrigger>
            <TooltipContent showArrow={true} className="dark px-2 py-1 text-xs">
              <p>Agregar nuevo origen</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Agregar Origen</DialogTitle>
              <DialogDescription>
                Agrega el nuevo origen a continuacion:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="nombre" className="mt-3">
                  Nombre
                </Label>
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

                {errors.nombre?.message ? (
                  <span className="text-red-500 text-sm">
                    {errors.nombre.message}
                  </span>
                ) : null}
              </div>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                {isLoading ? (
                  <>
                    <Loader2 /> Cargando..
                  </>
                ) : (
                  <p>Guardar Cambios</p>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
