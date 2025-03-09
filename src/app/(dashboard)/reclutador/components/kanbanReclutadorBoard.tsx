"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Building,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
  MessageSquareOff,
  MessageSquare,
  Download,
  MoreVertical,
  Edit,
  Trash,
  UserPlus,
  UserCheck,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { type Vacante, vacantes as mockVacantes } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function KanbanBoardPage() {
  const [vacantes] = useState<Vacante[]>(mockVacantes);
  const [selectedVacante, setSelectedVacante] = useState<Vacante | null>(null);
  const [mobileView, setMobileView] = useState<string | null>(null);

  const columns = [
    { id: "Hunting", title: "Hunting" },
    { id: "Entrevistas", title: "Entrevistas" },
    { id: "Placement", title: "Placement" },
    { id: "Perdida", title: "Perdida" },
    { id: "Cancelada", title: "Cancelada" },
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Nueva":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Garantia":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="p-4 md:p-10">
      {/* Mobile View Selector */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              Cambiar vista de columnas
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>Seleccionar columna</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4">
              {columns.map((column) => (
                <Button
                  key={column.id}
                  variant={mobileView === column.id ? "default" : "outline"}
                  onClick={() => setMobileView(column.id)}
                  className="w-full"
                >
                  {column.title}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setMobileView(null)}
                className="col-span-2"
              >
                Mostrar todas las columnas
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 w-full">
        {columns.map(
          (column) =>
            // Only show specific column in mobile view if selected
            (mobileView === null || mobileView === column.id) && (
              <div key={column.id} className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{column.title}</h2>
                  <Badge variant="outline">
                    {vacantes.filter((v) => v.estado === column.id).length}
                  </Badge>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 min-h-[500px] overflow-auto">
                  {vacantes
                    .filter((vacante) => vacante.estado === column.id)
                    .map((vacante) => (
                      <Dialog key={vacante.id}>
                        <DialogTrigger asChild>
                          <Card
                            className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedVacante(vacante)}
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-base">
                                  {vacante.puesto}
                                </h3>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Building className="h-3.5 w-3.5 mr-1" />
                                <span>{vacante.cliente}</span>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 pb-2">
                              <div className="flex items-center text-sm mt-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage
                                    src={vacante.reclutador.photo}
                                    alt={vacante.reclutador.name}
                                    className="h-full w-full object-cover"
                                  />
                                  <AvatarFallback>
                                    {vacante.reclutador.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {vacante.reclutador.name}
                                </span>
                              </div>
                              <div className="flex items-center text-sm mt-2">
                                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Entrega: {vacante.fechaEntrega}
                                </span>
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 flex justify-between">
                              <Badge
                                variant="outline"
                                className={getTipoColor(vacante.tipo)}
                              >
                                {vacante.tipo}
                              </Badge>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>{vacante.tiempoTranscurrido} días</span>
                              </div>
                            </CardFooter>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                          {selectedVacante && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="text-xl">
                                  {selectedVacante.puesto}
                                </DialogTitle>
                              </DialogHeader>
                              <Tabs defaultValue="detalles">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="detalles">
                                    Detalles
                                  </TabsTrigger>
                                  <TabsTrigger value="candidatos">
                                    Candidatos
                                  </TabsTrigger>
                                  <TabsTrigger value="comentarios">
                                    Comentarios
                                  </TabsTrigger>
                                  <TabsTrigger value="documentos">
                                    Documentos
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                  value="detalles"
                                  className="space-y-6 mt-4"
                                >
                                  {/* Información principal y estado */}
                                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage
                                            src={
                                              selectedVacante.reclutador.photo
                                            }
                                            alt={
                                              selectedVacante.reclutador.name
                                            }
                                            className="w-full h-full object-cover"
                                          />
                                          <AvatarFallback>
                                            {selectedVacante.reclutador.name.charAt(
                                              0
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="text-sm text-muted-foreground">
                                            Reclutador asignado
                                          </p>
                                          <p className="font-medium">
                                            {selectedVacante.reclutador.name}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Badge
                                          className={getTipoColor(
                                            selectedVacante.tipo
                                          )}
                                        >
                                          {selectedVacante.tipo}
                                        </Badge>
                                        <Badge variant="outline">
                                          {selectedVacante.año}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Información de cliente y tiempos */}
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-3">
                                        <div className="flex items-center">
                                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">
                                            Cliente:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {selectedVacante.cliente}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">
                                            Fecha entrega:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {selectedVacante.fechaEntrega}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">
                                            Mes asignado:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {selectedVacante.mesAsignado}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                              Tiempo transcurrido:
                                            </span>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2"
                                          >
                                            <span className="font-medium">
                                              {
                                                selectedVacante.tiempoTranscurrido
                                              }{" "}
                                              días
                                            </span>
                                          </Button>
                                        </div>
                                        <div className="pt-2">
                                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                            <div
                                              className={`h-full ${
                                                selectedVacante.tiempoTranscurrido >
                                                30
                                                  ? "bg-red-500"
                                                  : selectedVacante.tiempoTranscurrido >
                                                    15
                                                  ? "bg-amber-500"
                                                  : "bg-green-500"
                                              }`}
                                              style={{
                                                width: `${Math.min(
                                                  100,
                                                  (selectedVacante.tiempoTranscurrido /
                                                    45) *
                                                    100
                                                )}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>0d</span>
                                            <span>15d</span>
                                            <span>30d</span>
                                            <span>45d</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Información financiera */}
                                  <div>
                                    <h4 className="text-sm font-medium uppercase text-muted-foreground mb-3 flex items-center">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Información financiera
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                      <Card className="overflow-hidden">
                                        <div className="h-1 bg-blue-500"></div>
                                        <CardContent className="pt-4">
                                          <div className="text-sm text-muted-foreground">
                                            Salario
                                          </div>
                                          <div className="text-2xl font-semibold mt-1">
                                            $
                                            {selectedVacante.salario.toLocaleString()}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="overflow-hidden">
                                        <div className="h-1 bg-purple-500"></div>
                                        <CardContent className="pt-4">
                                          <div className="text-sm text-muted-foreground">
                                            Fee
                                          </div>
                                          <div className="text-2xl font-semibold mt-1">
                                            {selectedVacante.fee}%
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="overflow-hidden">
                                        <div className="h-1 bg-green-500"></div>
                                        <CardContent className="pt-4">
                                          <div className="text-sm text-muted-foreground">
                                            Valor factura
                                          </div>
                                          <div className="text-2xl font-semibold mt-1">
                                            $
                                            {selectedVacante.valorFactura.toLocaleString()}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>

                                  {/* Candidato contratado (condicional) */}
                                  {selectedVacante.candidatoContratado && (
                                    <Card className="overflow-hidden border-green-200 dark:border-green-800">
                                      <div className="h-1 bg-green-500"></div>
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                              <h4 className="font-medium">
                                                Candidato contratado
                                              </h4>
                                              <p className="text-muted-foreground text-sm">
                                                {
                                                  selectedVacante
                                                    .candidatoContratado.nombre
                                                }
                                              </p>
                                            </div>
                                          </div>
                                          <Button variant="outline" size="sm">
                                            <FileText className="h-4 w-4 mr-1" />
                                            Ver CV
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Acciones (botones) */}
                                  <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline">
                                      Historial de cambios
                                    </Button>
                                    <Button>Editar vacante</Button>
                                  </div>
                                </TabsContent>

                                <TabsContent value="candidatos">
                                  {selectedVacante.ternaFinal &&
                                  selectedVacante.ternaFinal.length > 0 ? (
                                    <div className="space-y-6 mt-4 w-full">
                                      {/* Header */}
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-muted-foreground">
                                          Terna final
                                        </h4>
                                        <Badge
                                          variant="outline"
                                          className="px-3 py-1 bg-background"
                                        >
                                          {selectedVacante.ternaFinal.length}{" "}
                                          candidato(s)
                                        </Badge>
                                      </div>

                                      {/* Lista de candidatos */}
                                      <div className="space-y-4">
                                        {selectedVacante.ternaFinal.map(
                                          (candidato, index) => (
                                            <Card
                                              key={index}
                                              className="hover:bg-accent hover:text-accent-foreground transition-colors p-4 rounded-lg"
                                            >
                                              <div className="flex items-center gap-4">
                                                {/* Avatar */}
                                                <Avatar className="h-14 w-14 border-2 border-primary/10">
                                                  <AvatarImage
                                                    src={candidato.foto}
                                                    alt={candidato.nombre}
                                                  />
                                                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                                                    {candidato.nombre
                                                      .split(" ")
                                                      .map((n) => n[0])
                                                      .join("")}
                                                  </AvatarFallback>
                                                </Avatar>

                                                {/* Detalles del candidato */}
                                                <div className="flex-1 space-y-1">
                                                  <p className="font-medium text-sm">
                                                    {candidato.nombre}
                                                  </p>
                                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center">
                                                      <Mail className="h-3 w-3 mr-1 opacity-70" />
                                                      <span>
                                                        {candidato.correo}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                      <Phone className="h-3 w-3 mr-1 opacity-70" />
                                                      <span>
                                                        {candidato.telefono}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Acciones */}
                                                <div className="flex gap-2">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-sm px-3 py-1.5 hover:bg-primary/10"
                                                  >
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Ver CV
                                                  </Button>
                                                  <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="text-sm px-3 py-1.5"
                                                  >
                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                    Seleccionar
                                                  </Button>
                                                </div>
                                              </div>
                                            </Card>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/10 rounded-lg mt-4">
                                      <AlertCircle className="h-10 w-10 mb-4 text-muted-foreground/60" />
                                      <p className="text-base font-medium mb-2">
                                        No hay candidatos en la terna final
                                      </p>
                                      <p className="text-sm text-center max-w-sm">
                                        Cuando se agreguen candidatos a la terna
                                        final, aparecerán aquí para su revisión.
                                      </p>
                                      <Button
                                        className="mt-4"
                                        variant="outline"
                                        size="sm"
                                      >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Agregar candidatos
                                      </Button>
                                    </div>
                                  )}
                                </TabsContent>

                                <TabsContent value="comentarios">
                                  <div className="space-y-6 mt-4 h-[300px] overflow-auto p-3">
                                    {/* Encabezado con título y botón de añadir */}
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium uppercase text-muted-foreground flex items-center">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Historial de comentarios
                                      </h4>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Añadir comentario
                                      </Button>
                                    </div>

                                    {/* Contenido de los comentarios */}
                                    {selectedVacante.comentarios &&
                                    selectedVacante.comentarios.length > 0 ? (
                                      <div className="space-y-4">
                                        {/* Barra de tiempo para comentarios */}
                                        <div className="relative pb-2">
                                          <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>

                                          {selectedVacante.comentarios.map(
                                            (comentario, index) => (
                                              <div
                                                key={comentario.id}
                                                className="relative mb-6 last:mb-0"
                                              >
                                                {/* Indicador de tiempo */}
                                                <div className="absolute left-4 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-primary z-10"></div>

                                                <Card
                                                  className={`ml-8 ${
                                                    index === 0
                                                      ? "border-primary"
                                                      : ""
                                                  }`}
                                                >
                                                  <CardHeader className="p-4 pb-2">
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                          <AvatarImage
                                                            src={
                                                              comentario.autor
                                                                .photo
                                                            }
                                                            alt={
                                                              comentario.autor
                                                                .name
                                                            }
                                                            className="w-full h-full object-cover"
                                                          />
                                                          <AvatarFallback>
                                                            {comentario.autor.name.charAt(
                                                              0
                                                            )}
                                                          </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                          <div className="font-medium leading-none">
                                                            {
                                                              comentario.autor
                                                                .name
                                                            }
                                                          </div>
                                                          <div className="text-xs text-muted-foreground mt-1">
                                                            {comentario.autor
                                                              .rol ||
                                                              "Reclutador"}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        <Badge
                                                          variant="outline"
                                                          className="text-xs"
                                                        >
                                                          {comentario.fecha}
                                                        </Badge>
                                                        {index === 0 && (
                                                          <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                          >
                                                            Más reciente
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </CardHeader>
                                                  <CardContent className="p-4 pt-2">
                                                    <p className="text-sm">
                                                      {comentario.texto}
                                                    </p>
                                                  </CardContent>
                                                </Card>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-48 bg-muted/30 rounded-lg border border-dashed">
                                        <MessageSquareOff className="h-10 w-10 mb-2 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                          No hay comentarios todavía
                                        </p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-4"
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Añadir el primer comentario
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>

                                <TabsContent value="documentos">
                                  <div className="space-y-6 mt-6">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-xl font-semibold">
                                        Documentos
                                      </h3>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                      >
                                        <Plus className="h-4 w-4" />
                                        <span>Añadir documento</span>
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {/* Documento 1 */}
                                      <Card className="group hover:shadow-md transition-all duration-200">
                                        <CardContent className="p-5">
                                          <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                              </div>
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                  >
                                                    <MoreVertical className="h-4 w-4" />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                  align="end"
                                                  className="z-[9999]"
                                                >
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <Download />
                                                    <span>Descargar</span>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <Edit />
                                                    <span>Editar</span>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem className="text-red-500 cursor-pointer ">
                                                    <Trash />
                                                    <span>Eliminar</span>
                                                  </DropdownMenuItem>
                                                </DropdownMenuContent>
                                              </DropdownMenu>
                                            </div>

                                            <div>
                                              <div className="font-medium text-lg mb-1">
                                                Checklist
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                Actualizado el 26 Feb, 2025
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-2">
                                              <Badge
                                                variant="outline"
                                                className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                              >
                                                PDF
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                2.4 MB
                                              </span>
                                            </div>

                                            <Button variant="outline" size="sm">
                                              <Download />
                                              <span>Descargar</span>
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Documento 2 */}
                                      <Card className="group hover:shadow-md transition-all duration-200">
                                        <CardContent className="p-5">
                                          <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                              </div>
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                  >
                                                    <MoreVertical />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                  align="end"
                                                  className="z-[9999]"
                                                >
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <Download />
                                                    <span>Descargar</span>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <Edit />
                                                    <span>Editar</span>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer">
                                                    <Trash />
                                                    <span>Eliminar</span>
                                                  </DropdownMenuItem>
                                                </DropdownMenuContent>
                                              </DropdownMenu>
                                            </div>

                                            <div>
                                              <div className="font-medium text-lg mb-1">
                                                Muestra de perfil
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                Actualizado el 1 Mar, 2025
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-2">
                                              <Badge
                                                variant="outline"
                                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                              >
                                                DOCX
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                1.8 MB
                                              </span>
                                            </div>

                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="w-full mt-2 flex items-center justify-center gap-2"
                                            >
                                              <Download className="h-4 w-4" />
                                              <span>Descargar</span>
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Añadir documento (card) */}
                                      <Card className="border-dashed hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer">
                                        <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center">
                                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                                            <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <h4 className="font-medium mb-2">
                                            Añadir nuevo documento
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            Sube archivos PDF, DOCX, XLSX o
                                            imágenes
                                          </p>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Documentos recientes (sección opcional) */}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
