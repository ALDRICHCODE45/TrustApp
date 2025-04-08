"use client";
import { Oficina, Role, UserState } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, Pencil } from "lucide-react";
import { User } from "@prisma/client";
import { editUser } from "@/actions/users/create-user";
import { useActionState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { editUserSchema } from "@/zod/editUserSchema";
import { toast } from "sonner";

export function EditUserProfile({ user }: { user: User }) {
  const { id } = useParams();

  const wrapEditUser = (userId: string) => {
    return async (_prevState: any, formData: FormData) => {
      return await editUser(userId, formData);
    };
  };

  const [lastResult, formAction, isPending] = useActionState(
    wrapEditUser(String(id)),
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onSubmit(event, context) {
      if (context.submission?.status === "success") {
        toast.success("Usuario editado correctamente");
      }
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editUserSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 overflow-y-scroll p-0 sm:max-w-lg [&>button:last-child]:top-3.5 max-h-[min(640px,80vh)]">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edita los datos de tu perfil.
        </DialogDescription>

        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form
              id={form.id}
              action={formAction}
              onSubmit={form.onSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Campo Nombre */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={fields.name.id}>Nombre</Label>
                  <Input
                    id={fields.name.id}
                    name={fields.name.name}
                    key={fields.name.key}
                    defaultValue={user.name}
                    placeholder="Nombre"
                    type="text"
                  />
                  <p className="text-sm text-red-500">{fields.name.errors}</p>
                </div>

                {/* Campo Email */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={fields.email.id}>Correo electrónico</Label>
                  <Input
                    id={fields.email.id}
                    name={fields.email.name}
                    key={fields.email.key}
                    defaultValue={user.email}
                    placeholder="correo@ejemplo.com"
                    type="email"
                  />
                  <p className="text-sm text-red-500">{fields.email.errors}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Campo Teléfono */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor={fields.celular?.id}>Teléfono</Label>
                  <Input
                    id={fields.celular?.id}
                    name={fields.celular?.name}
                    key={fields.celular?.key}
                    defaultValue={user.celular}
                    placeholder="+52 55..."
                    type="tel"
                  />
                  <p className="text-sm text-red-500">
                    {fields.celular?.errors}
                  </p>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor={fields.age?.id}>Edad</Label>
                  <Input
                    id={fields.age?.id}
                    name={fields.age?.name}
                    key={fields.age?.key}
                    defaultValue={user.age}
                    placeholder="23"
                    type="text"
                  />
                  <p className="text-sm text-red-500">{fields.age?.errors}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-1/2">
                  <Label>Role</Label>
                  <Select
                    name={fields.role.name}
                    key={fields.role.key}
                    defaultValue={user.role}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value={Role.Admin} className="cursor-pointer">
                        Admin
                      </SelectItem>
                      <SelectItem value={Role.GL} className="cursor-pointer">
                        GL
                      </SelectItem>
                      <SelectItem
                        value={Role.reclutador}
                        className="cursor-pointer"
                      >
                        Reclutador
                      </SelectItem>

                      <SelectItem value={Role.MK} className="cursor-pointer">
                        MK
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-red-500">{fields.role.errors}</p>
                </div>
                <div className="w-1/2">
                  <Label>Direccion</Label>
                  <Input
                    id={fields.direccion.id}
                    name={fields.direccion.name}
                    key={fields.direccion.key}
                    defaultValue={user.direccion}
                    placeholder="direccion"
                    type="text"
                  />
                  <p className="text-sm text-red-500">
                    {fields.direccion.errors}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-1/2">
                  <Label>Oficina</Label>
                  <Select
                    name={fields.oficina.name}
                    key={fields.oficina.key}
                    defaultValue={user.Oficina}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem
                        value={Oficina.Oficina1}
                        className="cursor-pointer"
                      >
                        1
                      </SelectItem>
                      <SelectItem
                        value={Oficina.Oficina2}
                        className="cursor-pointer"
                      >
                        2
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-red-500">
                    {fields.oficina.errors}
                  </p>
                </div>
                <div className="w-1/2">
                  <Label>Status</Label>
                  <Select
                    defaultValue={user.State}
                    name={fields.status.name}
                    key={fields.status.key}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem
                        value={UserState.ACTIVO}
                        className="cursor-pointer"
                      >
                        ACTIVO
                      </SelectItem>
                      <SelectItem
                        value={UserState.INACTIVO}
                        className="cursor-pointer"
                      >
                        INACTIVO
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-red-500">{fields.status.errors}</p>
                </div>
              </div>

              {/* Botones */}
              <DialogFooter className="border-t border-border pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <span>Guardar cambios</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
