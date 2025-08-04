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
import { NotepadText } from "lucide-react";

export const CompareChecklistForm = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="mt-4">
        <Button variant="outline" size="sm">
          <NotepadText />
          <span>Checklist</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[40vw] z-[9999] min-h-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Comparación Requisitos vs Candidato</SheetTitle>
          <SheetDescription>
            Compara los requisitos de la vacante con los datos del candidato.
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-8 py-6">
          {/* Columna 1: Requisitos de la Vacante */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              Requisitos de la Vacante
            </h3>

            <div className="grid gap-3">
              <Label htmlFor="req-experiencia">Requisito 1</Label>
              <Input id="req-experiencia" placeholder="Ej: 3 años en ventas" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-educacion">Requisito 2</Label>
              <Input id="req-educacion" placeholder="Ej: Licenciatura en..." />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-habilidades">Requisito 3</Label>
              <Input
                id="req-habilidades"
                placeholder="Ej: Excel avanzado, CRM"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-idiomas">Requisito 4</Label>
              <Input id="req-idiomas" placeholder="Ej: Inglés intermedio" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-ubicacion">Requisito 5</Label>
              <Input id="req-ubicacion" placeholder="Ej: Ciudad de México" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-disponibilidad">Requisito 6</Label>
              <Input
                id="req-disponibilidad"
                placeholder="Ej: Tiempo completo"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-salario">Requisito 7</Label>
              <Input id="req-salario" placeholder="Ej: $15,000 - $20,000" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="req-otros">Requisito 8</Label>
              <Input id="req-otros" placeholder="Requisitos adicionales" />
            </div>
          </div>

          {/* Columna 2: Datos del Candidato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Comentarios</h3>

            <div className="grid gap-3">
              <Label htmlFor="cand-nombre" className="text-red-500">
                *
              </Label>
              <Input id="cand-nombre" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cand-experiencia" className="text-red-500">
                *
              </Label>
              <Input id="cand-experiencia" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cand-educacion" className="text-red-500">
                *
              </Label>
              <Input id="cand-educacion" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cand-habilidades" className="text-red-500">
                *
              </Label>
              <Input id="cand-habilidades" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cand-idiomas" className="text-red-500">
                *
              </Label>
              <Input id="cand-idiomas" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cand-ubicacion" className="text-red-500">
                *
              </Label>
              <Input id="cand-ubicacion" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cand-disponibilidad" className="text-red-500">
                *
              </Label>
              <Input id="cand-disponibilidad" />
            </div>

            <div className="grid gap-3">
              <Label
                htmlFor="cand-expectativa justify-end"
                className="text-red-500"
              >
                *
              </Label>
              <Input id="cand-expectativa" />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="submit">Guardar Comparación</Button>
          <SheetClose asChild>
            <Button variant="outline">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
