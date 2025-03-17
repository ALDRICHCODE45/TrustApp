import React from "react";
import { useForm } from "react-hook-form";
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
import { Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function ClientEditForm() {
  // Sample client data from your provided object
  const initialData = {
    clienteId: "1234567890",
    origen: "Referido",
    cuenta: "Zendesk",
    asignadas: 30,
    perdidas: 9,
    canceladas: 14,
    placements: 7,
    tp_placement: 200000,
    modalidad: "Anticipo",
    fee: 17,
    dias_credito: 30,
    tipo_factura: "PPD",
    razon_social: "Zendesk",
    regimen: "S. DE R.L. DE C.V.",
    tipo: "Moral",
    rfc: "ZEN1704209I4",
    cp: "11560",
  };

  const form = useForm({
    defaultValues: initialData,
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-3xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Editar Cliente
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modifica la información del cliente
        </DialogDescription>

        <div className="overflow-y-auto max-h-[70vh]">
          <div className="px-6 py-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="performance">Rendimiento</TabsTrigger>
                  <TabsTrigger value="facturacion">Facturación</TabsTrigger>
                </TabsList>

                {/* General Information Tab */}
                <TabsContent value="general" className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="clienteId">ID Cliente</Label>
                      <Input
                        id="clienteId"
                        {...form.register("clienteId")}
                        disabled
                        className="bg-slate-50"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="origen">Origen</Label>
                      <Select defaultValue={initialData.origen}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar origen" />
                        </SelectTrigger>
                        <SelectContent className="z-[999]">
                          <SelectItem value="Referido">Referido</SelectItem>
                          <SelectItem value="Directo">Directo</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-2">
                    <Label htmlFor="cuenta">Nombre de Cuenta</Label>
                    <Input
                      id="cuenta"
                      {...form.register("cuenta")}
                      placeholder="Ingresa el nombre de la cuenta"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modalidad">Modalidad</Label>
                    <Select defaultValue={initialData.modalidad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modalidad" />
                      </SelectTrigger>
                      <SelectContent className="z-[999]">
                        <SelectItem value="Anticipo">Anticipo</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                        <SelectItem value="Contado">Contado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="fee">Fee (%)</Label>
                      <Input
                        id="fee"
                        type="number"
                        {...form.register("fee")}
                        placeholder="Ingresa el porcentaje"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="dias_credito">Días de Crédito</Label>
                      <Input
                        id="dias_credito"
                        type="number"
                        {...form.register("dias_credito")}
                        placeholder="Ingresa los días"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="asignadas">Posiciones Asignadas</Label>
                      <Input
                        id="asignadas"
                        type="number"
                        {...form.register("asignadas")}
                        placeholder="Ingresa cantidad"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="placements">Placements</Label>
                      <Input
                        id="placements"
                        type="number"
                        {...form.register("placements")}
                        placeholder="Ingresa cantidad"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="perdidas">Posiciones Perdidas</Label>
                      <Input
                        id="perdidas"
                        type="number"
                        {...form.register("perdidas")}
                        placeholder="Ingresa cantidad"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="canceladas">Posiciones Canceladas</Label>
                      <Input
                        id="canceladas"
                        type="number"
                        {...form.register("canceladas")}
                        placeholder="Ingresa cantidad"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tp_placement">
                      Ticket Promedio de Placement (pesos)
                    </Label>
                    <Input
                      id="tp_placement"
                      type="number"
                      {...form.register("tp_placement")}
                      placeholder="Ingresa tiempo promedio"
                    />
                  </div>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="facturacion" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="razon_social">Razón Social</Label>
                    <Input
                      id="razon_social"
                      {...form.register("razon_social")}
                      placeholder="Ingresa la razón social"
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select defaultValue={initialData.tipo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent className="z-[999]">
                          <SelectItem value="Moral">Moral</SelectItem>
                          <SelectItem value="Física">Física</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="regimen">Régimen</Label>
                      <Input
                        id="regimen"
                        {...form.register("regimen")}
                        placeholder="Ingresa el régimen"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="rfc">RFC</Label>
                      <Input
                        id="rfc"
                        {...form.register("rfc")}
                        placeholder="Ingresa el RFC"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="cp">Código Postal</Label>
                      <Input
                        id="cp"
                        {...form.register("cp")}
                        placeholder="Ingresa el código postal"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="tipo_factura">Tipo de Factura</Label>
                      <Select defaultValue={initialData.tipo_factura}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent className="z-[999]">
                          <SelectItem value="PPD">PPD</SelectItem>
                          <SelectItem value="PUE">PUE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={form.handleSubmit(onSubmit)}>
              Guardar Cambios
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
