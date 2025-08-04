import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";

export const DrawerVacancyDetails = ({ vacancyId }: { vacancyId: string }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Ver más detalles
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="z-[9998]" />
        <DrawerContent className="z-[9999] max-h-[80vh]">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Detalles de la Vacante</DrawerTitle>
              <DrawerDescription>
                Información financiera y detalles adicionales de la vacante.
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Aquí irá el contenido específico de la vacante */}
              <div className="grid gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Información Financiera</h4>
                  <p className="text-sm text-muted-foreground">
                    Detalles específicos de la vacante con ID: {vacancyId}
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Métricas de Rendimiento</h4>
                  <p className="text-sm text-muted-foreground">
                    Estadísticas y análisis de la vacante.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Historial de Cambios</h4>
                  <p className="text-sm text-muted-foreground">
                    Registro de modificaciones y actualizaciones.
                  </p>
                </div>
              </div>
            </div>

            <DrawerFooter>
              <Button>Guardar Cambios</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
