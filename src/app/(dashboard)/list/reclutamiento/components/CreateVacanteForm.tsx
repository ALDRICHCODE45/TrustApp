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
  tipo: z.enum(["Nueva", "Garantia"]).optional(),
  estado: z
    .enum(["Hunting", "Cancelada", "Entrevistas", "Perdida", "Placement"])
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

  // Archivos (por ahora vacío como solicitaste)
  files: z.array(z.any()).optional(),
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

// Componente de archivo (manteniendo el original)
const FileCard = ({ file }: { file: File }) => (
  <Card className="group hover:shadow-md transition-all duration-200">
    <CardContent className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {file.icon}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[9999]">
              <DropdownMenuItem className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                <span>Descargar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 cursor-pointer">
                <Trash className="h-4 w-4 mr-2" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-medium text-lg mb-1">{file.name}</div>
          <div className="text-sm text-muted-foreground">
            Actualizado el {file.lastUpdated}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            {file.type}
          </Badge>
          <span className="text-xs text-muted-foreground">{file.size}</span>
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          <span>Descargar</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const uploadFiles = async (files: File[]) => {
  // TODO: Implementar lógica de subida de archivos
  console.log("Subir archivos:", files);
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
      files: [],
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
          <TabsList className="grid w-full grid-cols-3 mb-4 mt-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="files">Archivos</TabsTrigger>
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

          {/* Tab de Archivos */}
          <TabsContent value="files">
            <FilesTab files={demoFiles} />
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
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Estado" />
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
                <FormLabel>Puesto</FormLabel>
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

// Componente para la pestaña de archivos (simplificado como solicitaste)
const FilesTab = ({ files }: { files: File[] }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Implementar lógica de subida de archivos
    console.log("Archivos seleccionados:", event.target.files);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">Documentos de la Vacante</div>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Subir Archivo
            </Button>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.docx,.doc"
              multiple
              onChange={handleFileUpload}
            />
          </label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>

        {files.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p>No hay documentos subidos</p>
            <p className="text-sm">
              Sube tus archivos usando el botón Subir Archivo
            </p>
          </div>
        )}
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
