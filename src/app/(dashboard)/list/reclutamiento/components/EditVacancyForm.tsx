"use client";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VacancyWithRelations } from "@/app/(dashboard)/reclutador/components/ReclutadorColumns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VacancyEstado, VacancyPrioridad, VacancyTipo } from "@prisma/client";
import { useState } from "react";
import { updateVacancy } from "@/actions/vacantes/actions";
import { toast } from "sonner";
import { CircleCheckIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  vacancy: VacancyWithRelations;
}

// Esquema de validación (igual que en CreateVacanteForm)
const vacancySchema = z.object({
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
    ])
    .optional(),
  posicion: z.string().optional(),
  prioridad: z.enum(["Alta", "Media", "Baja"]).optional(),
  fechaAsignacion: z.date().optional(),
  fechaEntrega: z.date().optional(),
  salario: z.number().optional(),
  valorFactura: z.number().optional(),
  fee: z.number().optional(),
  monto: z.number().optional(),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

export const EditVacancyForm = ({ open, setOpen, vacancy }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      tipo: vacancy.tipo,
      estado: vacancy.estado,
      posicion: vacancy.posicion || "",
      prioridad: vacancy.prioridad,
      fechaAsignacion: vacancy.fechaAsignacion
        ? new Date(vacancy.fechaAsignacion)
        : undefined,
      fechaEntrega: vacancy.fechaEntrega
        ? new Date(vacancy.fechaEntrega)
        : undefined,
      salario: vacancy.salario || undefined,
      valorFactura: vacancy.valorFactura || undefined,
      fee: vacancy.fee || undefined,
      monto: vacancy.monto || undefined,
    },
  });

  // Resetear el formulario cuando cambie la vacante
  useEffect(() => {
    if (open && vacancy) {
      form.reset({
        tipo: vacancy.tipo,
        estado: vacancy.estado,
        posicion: vacancy.posicion || "",
        prioridad: vacancy.prioridad,
        fechaAsignacion: vacancy.fechaAsignacion
          ? new Date(vacancy.fechaAsignacion)
          : undefined,
        fechaEntrega: vacancy.fechaEntrega
          ? new Date(vacancy.fechaEntrega)
          : undefined,
        salario: vacancy.salario || undefined,
        valorFactura: vacancy.valorFactura || undefined,
        fee: vacancy.fee || undefined,
        monto: vacancy.monto || undefined,
      });
    }
  }, [vacancy, open, form]);

  const onSubmit = async (data: VacancyFormData) => {
    setLoading(true);
    try {
      // Preparar los datos para la actualización
      const updateData = {
        id: vacancy.id,
        ...data,
      };

      const result = await updateVacancy(updateData);

      if (!result.ok) {
        toast.error(result.message || "Error al actualizar la vacante");
        return;
      }

      toast.custom((t) => (
        <div className="bg-background z-50 max-w-[400px] rounded-md border p-4 shadow-lg">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <CircleCheckIcon
                className="mt-0.5 shrink-0 text-emerald-500"
                size={16}
                aria-hidden="true"
              />
              <div className="flex grow flex-col gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Vacante actualizada correctamente
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Los datos de la vacante han sido actualizados correctamente
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                aria-label="Cerrar notificación"
                onClick={() => toast.dismiss(t)}
              >
                <XIcon
                  size={16}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </div>
      ));
      setOpen(false);
    } catch (error) {
      console.error("Error al actualizar la vacante:", error);
      toast.error("Error al actualizar la vacante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] z-[200]">
          <DialogHeader>
            <DialogTitle>Editar vacante: {vacancy.posicion}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4 mt-4">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="files">Archivos</TabsTrigger>
                  <TabsTrigger value="financial">
                    Información Fiscal
                  </TabsTrigger>
                  <TabsTrigger value="terna">Terna</TabsTrigger>
                </TabsList>
                {/* Información Básica */}
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalles de la Vacante</CardTitle>
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
                                  <SelectItem value={VacancyTipo.Nueva}>
                                    Nueva
                                  </SelectItem>
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
                                  <SelectItem
                                    value={VacancyEstado.QuickMeeting}
                                  >
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
                                <Input
                                  placeholder="Ej. Desarrollador Senior"
                                  {...field}
                                />
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
                                  <SelectItem value={VacancyPrioridad.Alta}>
                                    Alta
                                  </SelectItem>
                                  <SelectItem value={VacancyPrioridad.Media}>
                                    Media
                                  </SelectItem>
                                  <SelectItem value={VacancyPrioridad.Baja}>
                                    Baja
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
                          name="fechaAsignacion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Asignación</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
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
                                <PopoverContent
                                  side="top"
                                  className="z-[999999] w-full"
                                >
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
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
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
                                <PopoverContent
                                  side="top"
                                  className="z-[999999] w-full"
                                >
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
                      {/* Campos solo lectura para reclutador y cliente */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Reclutador</FormLabel>
                          <Input
                            value={vacancy.reclutador?.name || "Sin asignar"}
                            disabled
                          />
                          {/* Función vacía para editar reclutador */}
                        </div>
                        <div>
                          <FormLabel>Cliente</FormLabel>
                          <Input
                            value={vacancy.cliente?.cuenta || "Sin asignar"}
                            disabled
                          />
                          {/* Función vacía para editar cliente */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Archivos (solo visualización, función vacía para editar) */}
                <TabsContent value="files">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Documentos de la Vacante</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <p>
                          Edición de archivos no disponible en este formulario.
                        </p>
                        {/* Función vacía para editar archivos */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Información Fiscal */}
                <TabsContent value="financial">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalles Financieros</CardTitle>
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
                                    field.onChange(
                                      Number(e.target.value) || undefined
                                    )
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
                                    field.onChange(
                                      Number(e.target.value) || undefined
                                    )
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
                                    field.onChange(
                                      Number(e.target.value) || undefined
                                    )
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
                </TabsContent>
                {/* Terna */}
                <TabsContent value="terna">
                  <Card>
                    <CardHeader>
                      <CardTitle>Terna</CardTitle>
                    </CardHeader>
                  </Card>
                </TabsContent>
                {/* Botón de guardar */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Tabs>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
