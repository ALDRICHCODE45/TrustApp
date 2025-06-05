import prisma from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrigenesSections } from "./components/OrigenesSection";

const getAllOrigenes = async () => {
  try {
    const origenes = await prisma.leadOrigen.findMany();
    return origenes;
  } catch (err) {
    throw new Error("Error al cargar origenes");
  }
};

const LeadsPage = async () => {
  const origenes = await getAllOrigenes();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="flex-shrink-0 bg-white px-6 py-4">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración de Leads
          </h1>
          <p className="text-gray-600 mt-1">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sectores de Negocio
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configura los sectores de negocio para categorizar tus leads
                  </p>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-center py-12">
                    Contenido de sectores será implementado aquí...
                  </p>
                </div>
              </div>

              {/* Contenido adicional para demostrar scroll en sectores */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Sector {i + 1}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Información detallada sobre el sector {i + 1} y sus
                    configuraciones específicas.
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                      Editar
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LeadsPage;
