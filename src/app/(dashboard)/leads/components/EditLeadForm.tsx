"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { ToastCustomMessage } from "@/components/ToastCustomMessage";

interface EditLeadFormProps {
  leadData: LeadWithRelations;
  closeDialog: (close: boolean) => void;
}

export const EditLeadForm = ({ leadData, closeDialog }: EditLeadFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sectores, setSectores] = useState<Sector[] | null>(null);
  const [origenes, setOrigenes] = useState<LeadOrigen[] | null>(null);
  const [link, setLink] = useState(leadData.link);
  const [empresa, setEmpresa] = useState(leadData.empresa);

  const [selectedSector, setSelectedSector] = useState<Sector | null>(
    leadData.sector
  );
  const [selectedOrigen, setSelectedOrigen] = useState<LeadOrigen | null>(
    leadData.origen
  );
  const [status, setStatus] = useState<LeadStatus>(leadData.status);

  useEffect(() => {
    const getSectores = async () => {
      try {
        const sectores = await getAllSectores();
        setSectores(sectores);
      } catch (err) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error"
            message="No se pueden obtener los sectores"
            type="error"
            onClick={() => {
              toast.dismiss(t);
            }}
          />
        ));
      }
    };

    const getOrigenes = async () => {
      try {
        const origenes = await getAllOrigenes();
        setOrigenes(origenes);
      } catch (err) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error"
            message="No se pueden obtener los origenes"
            type="error"
            onClick={() => {
              toast.dismiss(t);
            }}
          />
        ));
      }
    };
    getSectores();
    getOrigenes();
  }, []);

  const handleSelectSector = (sector: Sector) => {
    setSelectedSector(sector);
  };

  const handleSelecteOrigen = (origen: LeadOrigen) => {
    setSelectedOrigen(origen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);

      formData.set("status", status);
      if (selectedSector) formData.set("sector", selectedSector.id);
      if (selectedOrigen) formData.set("origen", selectedOrigen.id);

      await editLeadById(String(leadData.id), formData);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Lead actualizado correctamente"
          message="El lead se ha actualizado correctamente"
          type="success"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al editar el lead";
      setError(errorMessage);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error"
          message={errorMessage}
          type="error"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    } finally {
      setIsPending(false);
      closeDialog(false);
    }
  };

  return (
    <>
      <div className="overflow-y-auto">
        <div className="px-6 pb-6 pt-4">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Empresa y Página Web */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  name="empresa"
                  placeholder="Empresa"
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <Label htmlFor="link">Página Web</Label>
                <Input
                  id="link"
                  name="link"
                  placeholder="https://"
                  type="text"
                  value={link}
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
              </div>

              {/* Status */}
              <div className="w-full sm:w-1/2">
                <Label htmlFor="status" className="mb-2 block">
                  Status
                </Label>
                <Select
                  value={status}
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
