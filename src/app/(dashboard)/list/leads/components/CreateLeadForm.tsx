"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Loader2,
  PlusCircle,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createLead } from "@/actions/leads/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createLeadSchema } from "@/zod/createLeadSchema";
import { User } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateLeadForm = ({ generadores }: { generadores: User[] }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle />
            Crear Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] z-[200]">
          <DialogHeader>
            <DialogTitle>Nuevo Lead</DialogTitle>
            <Separator />
          </DialogHeader>
          {/* Envolver el formulario con FormProvider */}
          <NuevoLeadForm generadores={generadores} />
        </DialogContent>
      </Dialog>
    </>
  );
};

function NuevoLeadForm({ generadores }: { generadores: User[] }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [fechaConectar, setFechaConectar] = useState<Date>();
  const [fechaProspectar, setFechaProspectar] = useState<Date>();

  const [lastResult, formAction, isPending] = useActionState(
    createLead,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createLeadSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (lastResult?.status === "error") {
      toast.error("Error al crear el Lead");
      return;
    }

    if (lastResult?.status === "success") {
      toast.success("Lead creado exitosamente");
      // Reset form (optional)
      setSelectedUser(undefined);
      setFechaConectar(undefined);
      setFechaProspectar(undefined);
    }
  }, [lastResult, router]);

  // Seleccionar un usuario
  const handleSelectGl = (user: User) => {
    setSelectedUser(user);
  };

  // Obtener iniciales para Avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <form
        className="space-y-4"
        id={form.id}
        action={formAction}
        onSubmit={form.onSubmit}
        noValidate
      >
        {fechaConectar && (
          <input
            type="hidden"
            name={fields.fechaAConectar.name}
            key={fields.fechaAConectar.key}
            value={fechaConectar.toISOString()}
          />
        )}

        {fechaProspectar && (
          <input
            type="hidden"
            name={fields.fechaProspeccion.name}
            key={fields.fechaProspeccion.key}
            value={fechaProspectar.toISOString()}
          />
        )}

        <input
          type="hidden"
          name={fields.generadorId.name}
          key={fields.generadorId.key}
          value={selectedUser?.id || ""}
        />

        {/* Grupo 1: Empresa y Sector */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="">Empresa</Label>
            <div className="">
              <Input
                id={fields.empresa.id}
                name={fields.empresa.name}
                key={fields.empresa.key}
                defaultValue={fields.empresa.initialValue}
                placeholder="Zendesk"
              />
            </div>
            <p className="text-sm text-red-500">{fields.empresa.errors}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Sector</Label>
            <div className="">
              <Input
                id={fields.sector.id}
                name={fields.sector.name}
                key={fields.sector.key}
                placeholder="Tecnología"
              />
            </div>
            <p className="text-sm text-red-500">{fields.sector.errors}</p>
          </div>
        </div>
        {/* Generador de Leads */}

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label>Generador de Leads</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="flex items-center justify-center gap-2"
                >
                  <UserIcon />
                  <span className="truncate">
                    {selectedUser
                      ? selectedUser.name
                      : "Selecciona un Generador"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 max-h-[250px] overflow-y-auto z-[9999]">
                {generadores.map((generador) => (
                  <DropdownMenuItem
                    key={generador.id}
                    className="flex items-center gap-3 p-2 cursor-pointer"
                    onClick={() => {
                      handleSelectGl(generador);
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage
                          src={generador.image ? generador.image : undefined}
                          alt={generador.name}
                          className="object-cover rounded-full h-full w-full"
                        />
                        <AvatarFallback className="rounded-full">
                          {getInitials(generador.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {generador.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {generador.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="link"
                      className="ml-auto h-8 w-8 p-0"
                      type="button"
                      asChild
                    >
                      <Link href={`/profile/${generador.id}`}>Ver</Link>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-sm text-red-500">{fields.generadorId.errors}</p>
          </div>
          <div className="w-1/2">
            <Label className="mb-2">Fecha para Conectar</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {fechaConectar ? (
                    format(fechaConectar, "EEE dd/MM/yy", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto z-[9999]">
                <Calendar
                  onSelect={(date) => {
                    if (date instanceof Date) {
                      setFechaConectar(date);
                    }
                  }}
                  mode="single"
                  selected={fechaConectar}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-red-500">
              {fields.fechaAConectar.errors}
            </p>
          </div>
        </div>
        {/* Grupo 2: Fecha de Prospección y Enlace */}
        <div className="flex  gap-4 ">
          <div className="w-1/2 space-y-2">
            <Label>Fecha de Prospección</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {fechaProspectar ? (
                    format(fechaProspectar, "EEE dd/MM/yy", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto z-[9999]">
                <Calendar
                  onSelect={(date) => {
                    if (date instanceof Date) {
                      setFechaProspectar(date);
                    }
                  }}
                  mode="single"
                  selected={fechaProspectar}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-red-500">
              {fields.fechaProspeccion.errors}
            </p>
          </div>
          <div className="w-1/2 space-y-2">
            <Label>Enlace</Label>
            <div className="">
              <Input
                id={fields.link.id}
                name={fields.link.name}
                key={fields.link.key}
                placeholder="https:"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2 space-y-2">
            <Label>Origen</Label>
            <Input
              id={fields.origen.id}
              name={fields.origen.name}
              key={fields.origen.key}
              placeholder="Likedin"
              defaultValue={fields.origen.initialValue}
            />
          </div>
        </div>

        {/* Botón */}
        <Button
          className="w-full"
          type="submit"
          variant={"default"}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Cargando...
            </>
          ) : (
            <span>Crear lead</span>
          )}
        </Button>
      </form>
    </>
  );
}
