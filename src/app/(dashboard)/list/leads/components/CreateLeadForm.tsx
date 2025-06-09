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
import { Loader2, Plus, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createLead } from "@/actions/leads/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createLeadSchema } from "@/zod/createLeadSchema";
import { Role, User } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sector, LeadOrigen } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const CreateLeadForm = ({
  generadores,
  sectores,
  isAdmin,
  origenes,
  activeUser,
  onLeadCreated,
}: {
  generadores: User[];
  sectores: Sector[];
  origenes: LeadOrigen[];
  isAdmin: boolean;
  activeUser: { name: string; id: string; role: Role };
  onLeadCreated?: () => void;
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Crear Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] z-[400]">
          <DialogHeader>
            <DialogTitle>Nuevo Lead</DialogTitle>
            <Separator />
          </DialogHeader>
          <NuevoLeadForm
            setOpenDialog={setOpenDialog}
            activeUser={activeUser}
            isAdmin={isAdmin}
            generadores={generadores}
            sectores={sectores}
            origenes={origenes}
            onLeadCreated={onLeadCreated}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

function NuevoLeadForm({
  generadores,
  sectores,
  origenes,
  isAdmin,
  activeUser,
  setOpenDialog,
  onLeadCreated,
}: {
  generadores: User[];
  sectores: Sector[];
  origenes: LeadOrigen[];
  isAdmin: boolean;
  activeUser: { name: string; id: string; role: Role };
  setOpenDialog: (newState: boolean) => void;
  onLeadCreated?: () => void;
}) {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedOrigen, setSelectedOrigen] = useState<LeadOrigen | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User>();

  const handleSelectSector = (sector: Sector) => {
    setSelectedSector(sector);
  };

  const handleSelecteOrigen = (origen: LeadOrigen) => {
    setSelectedOrigen(origen);
  };

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
    onSubmit() {
      if (lastResult?.status === "success") {
        setOpenDialog(false);
        router.refresh();
      }
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (!lastResult) return;

    if (lastResult.status === "error") {
      const errorMessage = "Error al Crear el Lead";
      toast.error(errorMessage, {
        description: "Por favor, verifica los datos e intenta nuevamente",
        duration: 5000,
      });
      return;
    }

    if (lastResult.status === "success") {
      toast.success("Lead creado exitosamente", {
        description: "El lead ha sido creado y agregado a la lista",
        duration: 3000,
      });

      // Reset form
      setSelectedUser(undefined);
      setSelectedSector(null);
      setSelectedOrigen(null);
      setSelectedDate(undefined);

      // Notificar que se creó un lead
      onLeadCreated?.();
    }
  }, [lastResult, onLeadCreated]);

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
        {(isAdmin || activeUser.role === Role.MK) && selectedUser && (
          <input
            type="hidden"
            name={fields.generadorId.name}
            key={fields.generadorId.key}
            value={selectedUser.id}
          />
        )}

        {selectedDate && (
          <input
            type="hidden"
            name={fields.createdAt.name}
            key={fields.createdAt.key}
            value={selectedDate.toISOString()}
          />
        )}

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedSector?.nombre || "Selecciona sector"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[9999] w-full max-h-[300px] overflow-y-scroll">
                <DropdownMenuLabel>Sectores</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sectores.map((sector) => (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    key={sector.nombre}
                    onSelect={() => handleSelectSector(sector)}
                  >
                    {sector.nombre}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedSector && (
              <Input
                name={fields.sector.name}
                key={fields.sector.key}
                value={selectedSector.id}
                type="hidden"
              />
            )}
            <p className="text-sm text-red-500">{fields.sector.errors}</p>
          </div>
        </div>
        {/* Generador de Leads */}

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label>Generador de Leads</Label>
            {(isAdmin || activeUser.role === Role.MK) && (
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
                              src={
                                generador.image ? generador.image : undefined
                              }
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
              )}

            {(!isAdmin && activeUser.role !== Role.MK) && (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" disabled>
                    {activeUser.name}
                  </Button>
                  <input
                    type="hidden"
                    name={fields.generadorId.name}
                    key={fields.generadorId.key}
                    value={activeUser.id}
                  />
                </div>
              )}
            <p className="text-sm text-red-500">{fields.generadorId.errors}</p>
          </div>
          <div className="w-1/2">
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

        {/* Grupo 2: Fecha de Prospección y Origen */}
        <div className="flex gap-4">
          <div className="w-1/2 space-y-1 ">
            <div className="flex flex-col gap-2 ">
              <Label>Fecha de creacion - Opcional</Label>

              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline">
                    {selectedDate ? (
                      format(selectedDate, "eee dd/MM/yyyy", {
                        locale: es,
                      })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="z-[999999]">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="w-1/2 space-y-1">
            <div className="flex flex-col gap-2">
              <Label>Origen</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {selectedOrigen?.nombre || "Selecciona un origen"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-[9999] w-full max-h-[300px] overflow-y-scroll">
                  <DropdownMenuLabel>Origenes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {origenes.map((origen) => (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      key={origen.nombre}
                      onSelect={() => handleSelecteOrigen(origen)}
                    >
                      {origen.nombre}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedOrigen && (
                <Input
                  name={fields.origen.name}
                  key={fields.origen.key}
                  value={selectedOrigen.id}
                  type="hidden"
                />
              )}
              <p className="text-sm text-red-500">{fields.origen.errors}</p>
            </div>
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
