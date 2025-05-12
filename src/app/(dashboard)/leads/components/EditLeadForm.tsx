"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadOrigen, LeadStatus, Sector } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { editLeadById } from "@/actions/leads/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { editLeadZodSchema } from "@/zod/editLeadSchema";
import { LeadWithRelations } from "../kanban/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllOrigenes, getAllSectores } from "@/actions/sectores/actions";

interface EditLeadFormProps {
  leadData: LeadWithRelations;
}

export const EditLeadForm = ({ leadData }: EditLeadFormProps) => {
  console.log({ leadData });
  const wrapEditLead = (leadId: string) => {
    return async (_prevState: any, formData: FormData) => {
      return await editLeadById(leadId, formData);
    };
  };

  const [sectores, setSectores] = useState<Sector[] | null>(null);
  const [origenes, setOrigenes] = useState<LeadOrigen[] | null>(null);
  const [link, setLink] = useState(leadData.link);
  const [empresa, setEmpresa] = useState(leadData.empresa);

  const [selectedSector, setSelectedSector] = useState<Sector | null>(
    leadData.sector,
  );
  const [selectedOrigen, setSelectedOrigen] = useState<LeadOrigen | null>(
    leadData.origen,
  );

  useEffect(() => {
    const getSectores = async () => {
      try {
        const sectores = await getAllSectores();
        setSectores(sectores);
      } catch (err) {
        throw new Error("No se pueden obtener los sectores");
      }
    };

    const getOrigenes = async () => {
      try {
        const origenes = await getAllOrigenes();
        setOrigenes(origenes);
      } catch (err) {
        throw new Error("No se pueden obtener los origenes");
      }
    };
    getSectores();
    getOrigenes();
  }, []);

  const [lastResult, formAction, isPending] = useActionState(
    wrapEditLead(String(leadData.id)),
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editLeadZodSchema });
    },
    defaultValue: {
      empresa: empresa,
      link: link,
      status: leadData.status,
      sector: selectedSector?.id,
      origen: selectedOrigen?.id,
    },
    shouldValidate: "onBlur",
  });

  const handleSelectSector = (sector: Sector) => {
    setSelectedSector(sector);
  };

  const handleSelecteOrigen = (origen: LeadOrigen) => {
    setSelectedOrigen(origen);
  };

  const [status, setStatus] = useState<LeadStatus>(leadData.status);

  return (
    <>
      <div className="overflow-y-auto">
        <div className="px-6 pb-6 pt-4">
          <form
            className="space-y-6"
            onSubmit={form.onSubmit}
            action={formAction}
            id={form.id}
            noValidate
          >
            {status && (
              <input
                type="hidden"
                name={fields.status.name}
                key={fields.status.key}
                value={status}
              />
            )}

            {/* Empresa y Página Web */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Label>Empresa</Label>
                <Input
                  id={fields.empresa.id}
                  name={fields.empresa.name}
                  key={fields.empresa.key}
                  placeholder="Empresa"
                  type="text"
                  defaultValue={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <Label>Página Web</Label>
                <Input
                  id={fields.link.id}
                  name={fields.link.name}
                  key={fields.link.key}
                  placeholder="https://"
                  type="text"
                  defaultValue={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>

            {/* Sector y Status */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sector */}
              <div className="w-full sm:w-1/2">
                <Label className="mb-2 block">Sector</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {selectedSector?.nombre || "Selecciona sector"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[9999] w-full max-h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>Sectores</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sectores?.map((sector) => (
                      <DropdownMenuItem
                        key={sector.nombre}
                        onSelect={() => handleSelectSector(sector)}
                        className="cursor-pointer"
                      >
                        {sector.nombre}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {selectedSector && (
                  <input
                    type="hidden"
                    name={fields.sector.name}
                    key={fields.sector.key}
                    value={selectedSector.id}
                  />
                )}
              </div>

              {/* Status */}
              <div className="w-full sm:w-1/2">
                <Label htmlFor="status" className="mb-2 block">
                  Status
                </Label>
                <Select
                  defaultValue={leadData.status}
                  onValueChange={(val) => setStatus(val as LeadStatus)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Status..." />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <Separator />
                      <SelectItem value={LeadStatus.SocialSelling}>
                        S.S
                      </SelectItem>
                      <SelectItem value={LeadStatus.ContactoCalido}>
                        C.C
                      </SelectItem>
                      <SelectItem value={LeadStatus.Contacto}>
                        Contacto
                      </SelectItem>
                      <SelectItem value={LeadStatus.CitaAgendada}>
                        C.A
                      </SelectItem>
                      <SelectItem value={LeadStatus.CitaValidada}>
                        C.V
                      </SelectItem>
                      <SelectItem value={LeadStatus.Prospecto}>
                        Prospecto
                      </SelectItem>
                      <SelectItem value={LeadStatus.Asignadas}>
                        Asignadas
                      </SelectItem>
                      <SelectItem value={LeadStatus.StandBy}>
                        Stand By
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
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
                  {origenes?.map((origen) => (
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
                <input
                  type="hidden"
                  name={fields.origen.name}
                  key={fields.origen.key}
                  value={selectedOrigen.id}
                />
              )}
            </div>

            {/* Botones de acción */}
            <div className="border-t border-border pt-6 flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <span>Confirmar</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
