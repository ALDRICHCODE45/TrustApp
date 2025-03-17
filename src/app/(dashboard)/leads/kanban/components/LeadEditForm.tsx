import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lead } from "@/lib/data";

type LeadEditFormProps = {
  task: Lead;
};

export const LeadEditForm: React.FC<LeadEditFormProps> = ({ task }) => {
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
          defaultValue={task.fechaAConectar}
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
