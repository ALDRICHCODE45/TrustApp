import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeadWithRelations } from "../page";

type LeadEditFormProps = {
  task: LeadWithRelations;
};

export const LeadEditForm = ({ task }: LeadEditFormProps) => {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="empresa">Empresa</Label>
        <Input id="empresa" defaultValue={task.empresa} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sector">Sector</Label>
        <Input id="sector" defaultValue={task.sector} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fechaAConectar">Fecha a Conectar</Label>
        <Input
          id="fechaAConectar"
          type="date"
          defaultValue={
            task.fechaAConectar
              ? new Date(task.fechaAConectar).toISOString().split("T").at(0)
              : undefined
          }
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};
