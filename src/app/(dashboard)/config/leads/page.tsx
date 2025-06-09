import prisma from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrigenesSections } from "./components/OrigenesSection";
import { SectoresSection } from "./components/SectoresSection";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const getAllOrigenes = async () => {
  try {
    const origenes = await prisma.leadOrigen.findMany();
    return origenes;
  } catch (err) {
    throw new Error("Error al cargar origenes");
  }
};

const getAllSectores = async () => {
  try {
    const sectores = await prisma.sector.findMany();
    return sectores;
  } catch (err) {
    throw new Error("Error al cargar sectores");
  }
};
const LeadsPage = async () => {
  const origenes = await getAllOrigenes();
  const sectores = await getAllSectores();

  return (
    <div className="flex flex-col h-screen ">
      {/* Header fijo */}
      <div className="flex-shrink-0 px-6 py-4">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">Configuración de Leads</h1>
          <p className="mt-1">
            Configure sus ajustes y preferencias de gestión de leads.
          </p>
        </div>
      </div>

      {/* Tabs con scroll */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="origenes" className="flex flex-col h-full">
          {/* TabsList fijo */}
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="origenes">Orígenes</TabsTrigger>
            <TabsTrigger value="sectores">Sectores</TabsTrigger>
          </TabsList>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="origenes"
              className="h-full overflow-y-auto px-6 py-6 space-y-6 data-[state=inactive]:hidden"
            >
              <OrigenesSections origenes={origenes} />
            </TabsContent>

            <TabsContent
              value="sectores"
              className="h-full overflow-y-auto px-6 py-6 space-y-6 data-[state=inactive]:hidden"
            >
              {/* <SectoresSection sectores={sectores} /> */}
              <Card>
                <CardHeader>En Construccion</CardHeader>
                <CardContent>Seccion en Construccion.</CardContent>
                <CardFooter>Pronta liberacion</CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LeadsPage;
