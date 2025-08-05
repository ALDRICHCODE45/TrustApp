import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "lucide-react";

//Todo: implementar props para recivirla en el componente, recivir el candidateId

export const VacancyDetails = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="mt-4 w-full">
        <Button variant="outline" size="sm">
          <Contact />
          <span>Detalles de la vacante</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[30vw] z-[9999] min-h-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalles de la vacante</SheetTitle>
          <SheetDescription>
            Informacion Detallada de la vacante
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-1 gap-8 py-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              Informacion de la vacante
            </h3>

            <div className="grid gap-3">
              <Label>Prestaciones</Label>
              <Input placeholder="Ej: 10 dias de vacaciones" />
            </div>

            <div className="grid gap-3">
              <Label>Herramientas de trabajo</Label>
              <Input placeholder="Ej: Excel , CRM, etc" />
            </div>

            <div className="grid gap-3">
              <Label>Comisiones/Bonos</Label>
              <Input placeholder="Ej: 10% de comisiones" />
            </div>

            <div className="grid gap-3">
              <Label>Modalidad (Híbrido, Remoto, Presencial)</Label>
              <Input placeholder="Ej: Híbrido" />
            </div>

            <div className="grid gap-3">
              <Label>Psicometría (Sí / No)</Label>
              <Input placeholder="Ej: Sí" />
            </div>

            <div className="grid gap-3">
              <Label>Ubicación de la posición (CDMX, Monterrey, etc.)</Label>
              <Input placeholder="Ej: CDMX" />
            </div>

            <div className="grid gap-3">
              <Label>Comentarios generales</Label>
              <Textarea placeholder="Ej: El cliente indicó que sus horarios para entrevistas son determinados" />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="submit">Guardar</Button>
          <SheetClose asChild>
            <Button variant="outline">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
