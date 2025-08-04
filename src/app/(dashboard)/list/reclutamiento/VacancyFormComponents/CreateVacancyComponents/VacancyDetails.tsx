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
              <Label htmlFor="req-experiencia">Salario</Label>
              <Input id="req-experiencia" placeholder="Ej: $15,000 - $20,000" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-educacion">Prestaciones</Label>
              <Input
                id="req-educacion"
                placeholder="Ej: 10 dias de vacaciones"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-habilidades">Herramientas de trabajo</Label>
              <Input id="req-habilidades" placeholder="Ej: Excel , CRM, etc" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-idiomas">Comisiones/Bonos</Label>
              <Input id="req-idiomas" placeholder="Ej: 10% de comisiones" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-ubicacion">
                Modalidad (Híbrido, Remoto, Presencial)
              </Label>
              <Input id="req-ubicacion" placeholder="Ej: Híbrido" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-disponibilidad">Psicometría (Sí / No)</Label>
              <Input id="req-disponibilidad" placeholder="Ej: Sí" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-salario">
                Ubicación de la posición (CDMX, Monterrey, etc.)
              </Label>
              <Input id="req-salario" placeholder="Ej: CDMX" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-otros">Comentarios generales</Label>
              <Textarea
                id="req-otros"
                placeholder="Ej: El cliente indicó que sus horarios para entrevistas son determinados"
              />
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
