"use client";
import React, { useState } from "react";
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

// Tipos para el formulario
interface ClientFormData {
  usuarioId: string;
  etiqueta: "PreCliente" | "Cliente" | "Inactivo";
  cuenta: string;
  asignadas: number;
  perdidas: number;
  canceladas: number;
  placements: number;
  tp_placement: number;
  modalidad: string;
  fee: number;
  dias_credito: number;
  tipo_factura: string;
  razon_social: string;
  regimen: string;
  rfc: string;
  codigo_postal: string;
  como_factura: string;
  portal_site: string;
  origenId: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

export const CreateClientModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ClientFormData>({
    usuarioId: "",
    etiqueta: "PreCliente",
    cuenta: "",
    asignadas: 0,
    perdidas: 0,
    canceladas: 0,
    placements: 0,
    tp_placement: 0,
    modalidad: "",
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
  });

  const handleInputChange = (
    field: keyof ClientFormData,
    value: string | number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.usuarioId) {
      newErrors.usuarioId = "Debe seleccionar un usuario";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      console.log("Datos del formulario:", formData);
      // Aquí iría la lógica para crear el cliente
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = (): void => {
    setFormData({
      usuarioId: "",
      etiqueta: "PreCliente",
      cuenta: "",
      asignadas: 0,
      perdidas: 0,
      canceladas: 0,
      placements: 0,
      tp_placement: 0,
      modalidad: "",
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
    });
    setErrors({});
    setActiveTab("general");
  };

  const getUsers = async (): Promise<any[]> => {
    // Función vacía para implementar la petición de usuarios
    return [];
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

        <div className="space-y-6">
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
                    error={errors.usuarioId}
                  >
                    <Select
                      value={formData.usuarioId}
                      onValueChange={(value: string) =>
                        handleInputChange("usuarioId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="user1">Usuario 1</SelectItem>
                        <SelectItem value="user2">Usuario 2</SelectItem>
                        <SelectItem value="user3">Usuario 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Etiqueta">
                    <Select
                      value={formData.etiqueta}
                      onValueChange={(value: ClientFormData["etiqueta"]) =>
                        handleInputChange("etiqueta", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="PreCliente">Pre-Cliente</SelectItem>
                        <SelectItem value="Cliente">Cliente</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Cuenta">
                    <Input
                      placeholder="Nombre de la cuenta"
                      value={formData.cuenta}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("cuenta", e.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="Origen">
                    <Select
                      value={formData.origenId}
                      onValueChange={(value: string) =>
                        handleInputChange("origenId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar origen" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="web">Sitio Web</SelectItem>
                        <SelectItem value="referido">Referido</SelectItem>
                        <SelectItem value="social">Redes Sociales</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormField label="Asignadas">
                    <Input
                      type="number"
                      min="0"
                      value={formData.asignadas}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "asignadas",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </FormField>

                  <FormField label="Perdidas">
                    <Input
                      type="number"
                      min="0"
                      value={formData.perdidas}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "perdidas",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </FormField>

                  <FormField label="Canceladas">
                    <Input
                      type="number"
                      min="0"
                      value={formData.canceladas}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "canceladas",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </FormField>

                  <FormField label="Placements">
                    <Input
                      type="number"
                      min="0"
                      value={formData.placements}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "placements",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </FormField>

                  <FormField label="TP Placement">
                    <Input
                      type="number"
                      min="0"
                      value={formData.tp_placement}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "tp_placement",
                          parseInt(e.target.value) || 0
                        )
                      }
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
                  <FormField label="Razón Social">
                    <Input
                      placeholder="Razón social de la empresa"
                      value={formData.razon_social}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("razon_social", e.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="RFC">
                    <Input
                      placeholder="RFC de la empresa"
                      value={formData.rfc}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("rfc", e.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="Régimen Fiscal">
                    <Input
                      placeholder="Régimen fiscal"
                      value={formData.regimen}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("regimen", e.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="Código Postal">
                    <Input
                      placeholder="Código postal"
                      value={formData.codigo_postal}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("codigo_postal", e.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="Tipo de Factura">
                    <Select
                      value={formData.tipo_factura}
                      onValueChange={(value: string) =>
                        handleInputChange("tipo_factura", value)
                      }
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
                  </FormField>

                  <FormField label="Cómo Factura">
                    <Input
                      placeholder="Método de facturación"
                      value={formData.como_factura}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("como_factura", e.target.value)
                      }
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
                  <FormField label="Modalidad">
                    <Select
                      value={formData.modalidad}
                      onValueChange={(value: string) =>
                        handleInputChange("modalidad", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modalidad" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="contado">Contado</SelectItem>
                        <SelectItem value="credito">Crédito</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Fee (%)">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Porcentaje de comisión"
                      value={formData.fee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("fee", parseInt(e.target.value) || 0)
                      }
                    />
                  </FormField>

                  <FormField label="Días de Crédito">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Días de crédito"
                      value={formData.dias_credito}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "dias_credito",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </FormField>

                  <FormField label="Portal/Sitio Web">
                    <Input
                      placeholder="URL del portal o sitio web"
                      value={formData.portal_site}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("portal_site", e.target.value)
                      }
                    />
                  </FormField>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Crear Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
