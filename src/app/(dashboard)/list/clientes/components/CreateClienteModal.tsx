"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, FileText, Settings, UserPlus } from "lucide-react";
import { createClientFromClientForm } from "@/actions/clientes/actions";
import { toast } from "sonner";
import { ClienteEtiqueta, ClienteModalidad, LeadOrigen } from "@prisma/client";
import {
  createClientSchema,
  CreateClientFormData,
} from "@/zod/createClientSchema";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

interface Props {
  users: { id: string; name: string }[];
  origenes: LeadOrigen[];
}

export const CreateClientModal = ({ users, origenes }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      usuarioId: "",
      etiqueta: "PreCliente",
      cuenta: "",
      asignadas: 0,
      perdidas: 0,
      canceladas: 0,
      placements: 0,
      tp_placement: 0,
      modalidad: "Exito",
      fee: 0,
      dias_credito: 0,
      tipo_factura: "",
      razon_social: "",
      regimen: "",
      rfc: "",
      codigo_postal: "",
      como_factura: "",
      portal_site: "",
      origenId: "",
    },
  });

  const onSubmit = async (data: CreateClientFormData): Promise<void> => {
    const promise = createClientFromClientForm(data);
    toast.promise(promise, {
      loading: "Cargando...",
      success: () => {
        return `Cliente creado correctamente`;
      },
      error: "Error al crear el cliente",
    });

    setOpen(false);
    reset();
    setActiveTab("general");
  };

  const handleCancel = (): void => {
    setOpen(false);
    reset();
    setActiveTab("general");
  };

  const FormField: React.FC<FormFieldProps> = ({
    label,
    children,
    error,
    required = false,
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-w-4xl [&>button:last-child]:top-3.5 max-h-[min(700px,85vh)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Crear Nuevo Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="estadisticas"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Estadísticas
              </TabsTrigger>
              <TabsTrigger
                value="facturacion"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Facturación
              </TabsTrigger>
              <TabsTrigger
                value="configuracion"
                className="flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Usuario Asignado"
                    required
                    error={errors.usuarioId?.message}
                  >
                    <Controller
                      name="usuarioId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar usuario" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>

                  <FormField label="Etiqueta" error={errors.etiqueta?.message}>
                    <Controller
                      name="etiqueta"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            <SelectItem value="PreCliente">
                              Pre-Cliente
                            </SelectItem>
                            <SelectItem value="Cliente">Cliente</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Cuenta"
                    required
                    error={errors.cuenta?.message}
                  >
                    <Input
                      placeholder="Nombre de la cuenta"
                      {...register("cuenta")}
                    />
                  </FormField>

                  <FormField
                    label="Origen"
                    required
                    error={errors.origenId?.message}
                  >
                    <Controller
                      name="origenId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar origen" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            {origenes.map((origen) => (
                              <SelectItem key={origen.id} value={origen.id}>
                                {origen.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estadisticas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Estadísticas del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    label="Asignadas"
                    error={errors.asignadas?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      {...register("asignadas", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField label="Perdidas" error={errors.perdidas?.message}>
                    <Input
                      type="number"
                      min="0"
                      {...register("perdidas", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Canceladas"
                    error={errors.canceladas?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      {...register("canceladas", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Placements"
                    error={errors.placements?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      {...register("placements", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="TP Placement"
                    error={errors.tp_placement?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      {...register("tp_placement", { valueAsNumber: true })}
                    />
                  </FormField>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facturacion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información de Facturación
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Razón Social"
                    error={errors.razon_social?.message}
                  >
                    <Input
                      placeholder="Razón social de la empresa"
                      {...register("razon_social")}
                    />
                  </FormField>

                  <FormField label="RFC" error={errors.rfc?.message}>
                    <Input
                      placeholder="RFC de la empresa"
                      {...register("rfc")}
                    />
                  </FormField>

                  <FormField
                    label="Régimen Fiscal"
                    error={errors.regimen?.message}
                  >
                    <Input
                      placeholder="Régimen fiscal"
                      {...register("regimen")}
                    />
                  </FormField>

                  <FormField
                    label="Código Postal"
                    error={errors.codigo_postal?.message}
                  >
                    <Input
                      placeholder="Código postal"
                      {...register("codigo_postal")}
                    />
                  </FormField>

                  <FormField
                    label="Tipo de Factura"
                    error={errors.tipo_factura?.message}
                  >
                    <Controller
                      name="tipo_factura"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            <SelectItem value="factura">Factura</SelectItem>
                            <SelectItem value="recibo">Recibo</SelectItem>
                            <SelectItem value="nota">Nota</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Cómo Factura"
                    error={errors.como_factura?.message}
                  >
                    <Input
                      placeholder="Método de facturación"
                      {...register("como_factura")}
                    />
                  </FormField>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Configuración Comercial
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Modalidad"
                    error={errors.modalidad?.message}
                  >
                    <Controller
                      name="modalidad"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar modalidad" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            <SelectItem value="Exito">Éxito</SelectItem>
                            <SelectItem value="Anticipo">Anticipo</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>

                  <FormField label="Fee (%)" error={errors.fee?.message}>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Porcentaje de comisión"
                      {...register("fee", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Días de Crédito"
                    error={errors.dias_credito?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      placeholder="Días de crédito"
                      {...register("dias_credito", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Portal/Sitio Web"
                    error={errors.portal_site?.message}
                  >
                    <Input
                      placeholder="URL del portal o sitio web"
                      {...register("portal_site")}
                    />
                  </FormField>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Creando..." : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
