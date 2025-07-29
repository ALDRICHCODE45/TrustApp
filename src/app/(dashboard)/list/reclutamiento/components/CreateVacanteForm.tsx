"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  FileText,
  Upload,
  MoreVertical,
  Download,
  Edit,
  Trash,
  UserIcon,
  CircleOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Client,
  User,
  Vacancy,
  VacancyEstado,
  VacancyPrioridad,
  VacancyTipo,
} from "@prisma/client";
import { toast } from "sonner";
import { createVacancy } from "@/actions/vacantes/actions";

// Schema basado en el modelo Vacancy de Prisma
const vacancySchema = z.object({
  // Información básica
  tipo: z
    .enum([VacancyTipo.Nueva, VacancyTipo.Garantia, VacancyTipo.Recompra])
    .optional(),
  estado: z
    .enum([
      VacancyEstado.Hunting,
      VacancyEstado.Cancelada,
      VacancyEstado.Entrevistas,
      VacancyEstado.Perdida,
      VacancyEstado.Placement,
      VacancyEstado.QuickMeeting,
      VacancyEstado.PrePlacement,
    ])
    .optional(),
  posicion: z.string().optional(),
  prioridad: z.enum(["Alta", "Media", "Baja"]).optional(),
  fechaAsignacion: z.date().optional(),
  fechaEntrega: z.date().optional(),
  reclutadorId: z.string().optional(),

  // Información financiera
  salario: z.number().optional(),
  valorFactura: z.number().optional(),
  fee: z.number().optional(),
  monto: z.number().optional(),

  // Cliente (requerido según el esquema de Prisma)
  clienteId: z.string().min(1, "El cliente es requerido"),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

// Datos de ejemplo para archivos (manteniendo los originales)
interface File {
  id: number;
  name: string;
  type: string;
  size: string;
  lastUpdated: string;
  icon: React.ReactNode;
}

const demoFiles: File[] = [
  {
    id: 1,
    name: "Checklist",
    type: "PDF",
    size: "2.4 MB",
    lastUpdated: "26 Feb, 2025",
    icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    id: 2,
    name: "Muestra Perfil",
    type: "DOCX",
    size: "1.2 MB",
    lastUpdated: "20 Feb, 2025",
    icon: <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />,
  },
];

interface Props {
  reclutadores: User[];
  clientes: Client[];
}

// Componente principal para crear una vacante
export const CreateVacanteForm = ({ reclutadores, clientes }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          Crear Vacante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] z-[200]">
        <VacancyForm reclutadores={reclutadores} clientes={clientes} />
      </DialogContent>
    </Dialog>
  );
};

// Componente principal del formulario con react-hook-form
function VacancyForm({ reclutadores, clientes }: Props) {
  const form = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      tipo: undefined,
      estado: undefined,
      posicion: "",
      prioridad: undefined,
      reclutadorId: "",
      clienteId: "",
      salario: undefined,
      valorFactura: undefined,
      fee: undefined,
      monto: undefined,
    },
  });

  const onSubmit = async (data: VacancyFormData) => {
    try {
      const result = await createVacancy(data);

      if (!result.ok) {
        toast.error("Error al crear la vacante");
        return;
      }

      console.log("Vacante creada exitosamente:", data);
      toast.success("Vacante creada exitosamente");
      form.reset();
    } catch (error) {
      console.error("Error al crear vacante:", error);
      toast.error("Error al crear la vacante");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 mt-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="financial">Información Fiscal</TabsTrigger>
          </TabsList>

          {/* Tab de Información Básica */}
          <TabsContent value="basic">
            <BasicInformationTab
              form={form}
              reclutadores={reclutadores}
              clientes={clientes}
            />
          </TabsContent>

          {/* Tab de Información Fiscal */}
          <TabsContent value="financial">
            <FinancialInformationTab form={form} />
          </TabsContent>

          {/* Botón de Guardar */}
          <Button type="submit" variant="default" className="w-full mt-4">
            Guardar Vacante
          </Button>
        </Tabs>
      </form>
    </Form>
  );
}

// Componente para la pestaña de información básica
const BasicInformationTab = ({
  form,
  reclutadores,
  clientes,
}: {
  form: any; // FormReturn from react-hook-form
  reclutadores: User[];
  clientes: Client[];
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Detalles de la Vacante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Vacante</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[888]">
                    <SelectItem value={VacancyTipo.Nueva}>Nueva</SelectItem>
                    <SelectItem value={VacancyTipo.Garantia}>
                      Garantía
                    </SelectItem>
                    <SelectItem value={VacancyTipo.Recompra}>
                      Recompra
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[8888]">
                    <SelectItem value={VacancyEstado.QuickMeeting}>
                      Quick Meeting
                    </SelectItem>
                    <SelectItem value={VacancyEstado.Hunting}>
                      Hunting
                    </SelectItem>
                    <SelectItem value={VacancyEstado.Cancelada}>
                      Cancelada
                    </SelectItem>
                    <SelectItem value={VacancyEstado.Entrevistas}>
                      Entrevistas
                    </SelectItem>
                    <SelectItem value={VacancyEstado.Perdida}>
                      Perdida
                    </SelectItem>
                    <SelectItem value={VacancyEstado.PrePlacement}>
                      Pre Placement
                    </SelectItem>
                    <SelectItem value={VacancyEstado.Placement}>
                      Placement
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="posicion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posición</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Desarrollador Senior" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prioridad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Prioridad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[8888]">
                    <SelectItem value={VacancyPrioridad.Alta}>Alta</SelectItem>
                    <SelectItem value={VacancyPrioridad.Media}>
                      Media
                    </SelectItem>
                    <SelectItem value={VacancyPrioridad.Baja}>Baja</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fechaAsignacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Asignación</FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full">
                        {field.value ? (
                          format(field.value, "eee dd/MM/yyyy", {
                            locale: es,
                          })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="z-[999999] w-full">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={es}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaEntrega"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Entrega</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full">
                        {field.value ? (
                          format(field.value, "eee dd/MM/yyyy", {
                            locale: es,
                          })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="z-[999999] w-full">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={es}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reclutadorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reclutador</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-full">
                    <Button variant="outline" size="sm" className="flex">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        {field.value
                          ? reclutadores.find(
                              (r) => r.id.toString() === field.value
                            )?.name || "Seleccionar"
                          : "Seleccionar"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-[250px] overflow-y-auto z-[999]">
                    {reclutadores.length === 0 && (
                      <div className="w-full h-[200px] flex justify-center items-center gap-2">
                        <div className="flex flex-col items-center gap-2">
                          <CircleOff className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            No hay reclutadores disponibles
                          </span>
                        </div>
                      </div>
                    )}

                    {reclutadores.length > 0 &&
                      reclutadores.map((recruiter) => (
                        <DropdownMenuItem
                          key={recruiter.id}
                          className="flex items-center gap-3 p-2 cursor-pointer"
                          onClick={() =>
                            field.onChange(recruiter.id.toString())
                          }
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage
                                src={recruiter.image || ""}
                                alt={recruiter.name}
                                className="object-cover"
                              />
                              <AvatarFallback>
                                {recruiter.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {recruiter.name}
                              </span>
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
                              e.stopPropagation();
                            }}
                            asChild
                          >
                            <Link href={`/profile/${recruiter.id}`}>Ver</Link>
                          </Button>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-full">
                    <Button variant="outline" size="sm" className="flex">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        {field.value
                          ? clientes.find(
                              (c) => c.id.toString() === field.value
                            )?.cuenta || "Seleccionar"
                          : "Seleccionar"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-[250px] overflow-y-auto z-[999]">
                    {clientes.length === 0 && (
                      <div className="w-full h-[200px] flex justify-center items-center gap-2">
                        <div className="flex flex-col items-center gap-2">
                          <CircleOff className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            No hay clientes disponibles
                          </span>
                        </div>
                      </div>
                    )}

                    {clientes.length > 0 &&
                      clientes.map((cliente) => (
                        <DropdownMenuItem
                          key={cliente.id}
                          className="flex items-center gap-3 p-2 cursor-pointer"
                          onClick={() => field.onChange(cliente.id.toString())}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback>
                                {cliente.cuenta?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {cliente.cuenta}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="link"
                            className="ml-auto h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            asChild
                          >
                            <Link href={`/client/${cliente.id}`}>Ver</Link>
                          </Button>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para la pestaña de información fiscal
const FinancialInformationTab = ({
  form,
}: {
  form: any; // FormReturn from react-hook-form
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">Detalles Financieros</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="salario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salario</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value) || undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valorFactura"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Factura</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value) || undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value) || undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        * Todos los montos son en la moneda local
      </div>
    </CardContent>
  </Card>
);

export default CreateVacanteForm;
