"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2 } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useActionState, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadStatus, Person, User } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { editLeadById } from "@/actions/leads/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { editLeadZodSchema } from "@/zod/editLeadSchema";

interface EditLeadFormProps {
  leadData: Lead & { generadorLeads: User; contactos: Person[] };
}

export const EditLeadForm = ({ leadData }: EditLeadFormProps) => {
  const wrapEditLead = (leadId: string) => {
    return async (_prevState: any, formData: FormData) => {
      return await editLeadById(leadId, formData);
    };
  };

  const [lastResult, formAction, isPending] = useActionState(
    wrapEditLead(String(leadData.id)),
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editLeadZodSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [fechaConectar, setFechaConectar] = useState<Date | undefined>(
    leadData.fechaAConectar ? new Date(leadData.fechaAConectar) : undefined,
  );

  const [fechaProspectar, setFechaProspectar] = useState<Date | undefined>(
    leadData.fechaProspeccion ? new Date(leadData.fechaProspeccion) : undefined,
  );

  const [status, setStatus] = useState<LeadStatus>(leadData.status);

  return (
    <>
      <div className="overflow-y-auto">
        <div className="px-6 pb-6 pt-4">
          <form
            className="space-y-4"
            onSubmit={form.onSubmit}
            action={formAction}
            id={form.id}
            noValidate
          >
            {fechaProspectar && (
              <input
                type="hidden"
                name={fields.fechaProspeccion.name}
                key={fields.fechaProspeccion.key}
                value={fechaProspectar?.toISOString()}
              />
            )}

            {fechaConectar && (
              <input
                type="hidden"
                name={fields.fechaAConectar.name}
                key={fields.fechaAConectar.key}
                value={fechaConectar?.toISOString()}
              />
            )}
            {status && (
              <input
                type="hidden"
                name={fields.status.name}
                key={fields.status.key}
                value={status}
              />
            )}

            <div className="">
              <div className="flex-1 space-y-2">
                <Label className="flex gap-2 items-center">
                  <span>Empresa</span>
                </Label>
                <Input
                  id={fields.empresa.id}
                  name={fields.empresa.name}
                  key={fields.empresa.key}
                  placeholder="Empresa"
                  type="text"
                  defaultValue={leadData.empresa || undefined}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row pt-3">
              <div className="flex-1 space-y-2">
                <Label className="flex gap-2 items-center">
                  <span>Pagina Web</span>
                </Label>
                <Input
                  id={fields.link.id}
                  name={fields.link.name}
                  key={fields.link.key}
                  placeholder="https://"
                  type="text"
                  defaultValue={leadData.link || undefined}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="flex gap-2 items-center">
                  <span>Fecha De Prospección</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaProspectar ? (
                        format(fechaProspectar, "EEE dd/MM/yy", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto z-[9999] p-0">
                    <Calendar
                      mode="single"
                      selected={fechaProspectar}
                      onSelect={setFechaProspectar}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="sector" className="flex gap-2 items-center">
                <span>Sector</span>
              </Label>
              <Input
                id={fields.sector.id}
                key={fields.sector.key}
                name={fields.sector.name}
                placeholder="Sector"
                type="text"
                defaultValue={leadData.sector || undefined}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row pt-3">
              <div className="flex-1 space-y-2">
                <Label className="flex gap-2 items-center">
                  <span>Fecha De Conexión</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fecha-coneccion"
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaConectar ? (
                        format(fechaConectar, "EEE dd/MM/yy", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto z-[9999] p-0">
                    <Calendar
                      mode="single"
                      selected={fechaConectar}
                      onSelect={setFechaConectar}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 space-y-2">
                <Label className="flex gap-1 items-center">
                  <span>Status</span>
                </Label>
                <div>
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
            </div>

            <div className="border-t border-border mt-6 pt-4 flex justify-end space-x-2">
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
