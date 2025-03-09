import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Encabezado y resumen general */}
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda y central (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjetas de KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pestañas principales */}
          <Tabs defaultValue="details" className="w-full">
            <Card>
              <CardHeader className="px-6 pb-2 pt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details" className="text-xs md:text-base">
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="text-xs md:text-base"
                  >
                    Comentarios
                  </TabsTrigger>
                  <TabsTrigger
                    value="statistics"
                    className="text-xs md:text-base"
                  >
                    Estadísticas
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-6">
                {/* Pestaña de detalles */}
                <div className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Información comercial */}
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-36" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[...Array(4)].map((_, index) => (
                          <Skeleton key={index} className="h-4 w-full" />
                        ))}
                      </CardContent>
                    </Card>

                    {/* Información fiscal */}
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-36" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[...Array(4)].map((_, index) => (
                          <Skeleton key={index} className="h-4 w-full" />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Pestaña de comentarios */}
                <div className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pr-4">
                      <Skeleton className="h-6 w-48" />
                      <Button size="sm" variant="outline" disabled>
                        <PlusCircle size={16} className="mr-2" />
                        <span className="hidden md:block">
                          Nuevo comentario
                        </span>
                      </Button>
                    </div>

                    {/* Comentarios simulados */}
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <Card key={index}>
                          <CardContent className="p-4 space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pestaña de estadísticas */}
                <div className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <Skeleton className="h-6 w-48 mb-4" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                    <Separator />
                    <div>
                      <Skeleton className="h-6 w-48 mb-4" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        {/* Columna derecha (1/3) */}
        <div className="space-y-6">
          {/* Resumen financiero */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>

          {/* Contactos */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
