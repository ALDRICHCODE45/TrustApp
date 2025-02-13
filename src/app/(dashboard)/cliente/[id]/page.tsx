"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { clientesData } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { AttendanceChart } from "@/components/AttendanceChart";
import { CountCharts } from "@/components/CountCharts";

// Simulación de función para obtener datos del cliente
const fetchClient = (clientId: number) => {
  return clientesData.find((client) => client.id === clientId);
};

export default function ClientProfile() {
  const { id } = useParams();
  const client = fetchClient(Number(id));

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <div className="p-6 flex gap-6 flex-col xl:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3">
        <Card className="h-full">
          <CardHeader></CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full h-full">
              <TabsList className="flex w-full">
                <TabsTrigger className="w-full" value="details">
                  Detalles
                </TabsTrigger>
                <TabsTrigger className="w-full" value="comments">
                  Comentarios
                </TabsTrigger>
                <TabsTrigger className="w-full" value="empty">
                  Estadisticas
                </TabsTrigger>
              </TabsList>

              {/* DETALLES DEL CLIENTE */}
              <TabsContent value="details">
                <div className="p-6 flex flex-col gap-6">
                  {/* INFORMACIÓN GENERAL */}
                  <div className="flex flex-col items-center gap-4 justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>{client.nombre.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{client.nombre}</h2>
                      <p className="text-gray-500 text-center">
                        {client.cuenta}
                      </p>
                    </div>
                  </div>

                  {/* DATOS PRINCIPALES EN CARDS */}
                  {/* DATOS PRINCIPALES EN CARDS */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        ID del Cliente
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.clienteId}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Origen
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.origen}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Modalidad
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.modalidad}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">Fee</CardTitle>
                      <CardDescription className="text-center">
                        ${client.fee.toFixed(2)}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Días de Crédito
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.dias_credito} días
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Tipo de Factura
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.tipo_factura}
                      </CardDescription>
                    </Card>
                  </div>

                  {/* ESTADÍSTICAS */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Asignadas
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.asignadas}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Perdidas
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.perdidas}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Canceladas
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.canceladas}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Placements
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.placements}
                      </CardDescription>
                    </Card>
                  </div>

                  {/* INFORMACIÓN FISCAL */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Razón Social
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.razon_social}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Régimen
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.regimen}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">RFC</CardTitle>
                      <CardDescription className="text-center">
                        {client.rfc}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Código Postal
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.cp}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Cómo Factura
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.como_factura}
                      </CardDescription>
                    </Card>
                    <Card className="p-4">
                      <CardTitle className="text-center text-lg">
                        Portal
                      </CardTitle>
                      <CardDescription className="text-center">
                        {client.portal_site ? (
                          <a
                            href={client.portal_site}
                            target="_blank"
                            className="underline"
                          >
                            {client.portal_site}
                          </a>
                        ) : (
                          <p className="text-red-500">N.A</p>
                        )}
                      </CardDescription>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* COMENTARIOS */}
              <TabsContent value="comments">
                <div className="w-full  ">
                  <Card className="h-[800px]">
                    <CardContent className="p-4 flex flex-row justify-center gap-4">
                      {client.comentarios.map((comentario, index) => (
                        <Card key={index} className="w-[400px]">
                          <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Salvador Perea</CardTitle>
                            <CardDescription>23-1-2025</CardDescription>
                          </CardHeader>
                          <Separator />
                          <CardContent className="py-2">
                            <p>{comentario}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* TAB VACÍO */}
              <TabsContent value="empty">
                <div className="p-6 flex flex-col gap-5">
                  <AttendanceChart />
                  <CountCharts />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        {/* RESUMEN */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">
                  Ingresos
                </h3>
                <p className="text-lg font-bold">$10,000</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">
                  Placements
                </h3>
                <p className="text-lg font-bold">{client.placements}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">
                  Valor Promedio por Placement
                </h3>
                <p className="text-lg font-bold">
                  ${client.tp_placement.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CONTACTOS */}
        <Card>
          <CardHeader>
            <CardTitle>Contactos</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {client.contactos.map((contacto, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {contacto.nombre.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {contacto.nombre}
                        </h3>
                        <p className="text-gray-500">{contacto.correo}</p>
                        <p className="text-gray-500">{contacto.celular}</p>
                        <p className="text-gray-500">{contacto.puesto}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
