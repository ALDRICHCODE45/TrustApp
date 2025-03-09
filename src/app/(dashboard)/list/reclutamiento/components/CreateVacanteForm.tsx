"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  UsersIcon,
  DollarSignIcon,
  FileText,
  Upload,
  MoreVertical,
  Download,
  Edit,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const initialFiles = [
  {
    id: 1,
    name: "Checklist",
    type: "PDF",
    size: "2.4 MB",
    lastUpdated: "26 Feb, 2025",
    icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    id: 2,
    name: "Muestra Perfil",
    type: "DOCX",
    size: "1.2 MB",
    lastUpdated: "20 Feb, 2025",
    icon: <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />,
  },
];

export const CreateVacanteForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2" />
          Crear Vacante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] z-[200]">
        <VacancyForm />
      </DialogContent>
    </Dialog>
  );
};

function VacancyForm() {
  const [files, setFiles] = useState(initialFiles);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name.split(".")[0],
        type: file.name.split(".").pop().toUpperCase(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        lastUpdated: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        icon: (
          <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        ),
      };
      setFiles([...files, newFile]);
    }
  };

  const handleFileDelete = (id: any) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4 mt-4">
        <TabsTrigger value="basic">Información Básica</TabsTrigger>
        <TabsTrigger value="files">Archivos</TabsTrigger>
        <TabsTrigger value="financial">Información Fiscal</TabsTrigger>
      </TabsList>

      {/* Información Básica Tab */}
      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Detalles de la Vacante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Tipo de Vacante</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Tipo" />
                  </SelectTrigger>
                  <SelectContent className="z-[888]">
                    <SelectItem value="Nueva">Nueva</SelectItem>
                    <SelectItem value="Garantia">Garantía</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Estado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent className="z-[8888]">
                    <SelectItem value="Hunting">Hunting</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                    <SelectItem value="Entrevistas">Entrevistas</SelectItem>
                    <SelectItem value="Perdida">Perdida</SelectItem>
                    <SelectItem value="Placement">Placement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Puesto</Label>
                <Input placeholder="Ej. Desarrollador Senior" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Cliente" />
                  </SelectTrigger>
                  <SelectContent className="z-[8888]">
                    <SelectItem value="Hunting" className="cursor-pointer">
                      Zendesk
                    </SelectItem>
                    <SelectItem value="Cancelada" className="cursor-pointer">
                      Circulo de Credito
                    </SelectItem>
                    <SelectItem value="Entrevistas" className="cursor-pointer">
                      CiberPower
                    </SelectItem>
                    <SelectItem value="Perdida" className="cursor-pointer">
                      Takeda
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4"></div>

            {/* Reclutador */}
            <Card className="p-4 space-y-3 bg-muted/50">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5" />
                <h3 className="text-sm font-medium">Reclutador</h3>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Juan Pérez</p>
                  <p className="text-xs text-muted-foreground">
                    Reclutador Senior
                  </p>
                </div>
              </div>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Archivos Tab */}
      <TabsContent value="files">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">Documentos de la Vacante</div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Archivo
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc"
                />
              </label>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className="group hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          {file.icon}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[9999]">
                            <DropdownMenuItem className="cursor-pointer">
                              <Download />
                              <span>Descargar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleFileDelete(file.id)}
                            >
                              <Trash />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <div className="font-medium text-lg mb-1">
                          {file.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Actualizado el {file.lastUpdated}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                        >
                          {file.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {file.size}
                        </span>
                      </div>

                      <Button variant="outline" size="sm">
                        <Download />
                        <span>Descargar</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {files.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p>No hay documentos subidos</p>
                <p className="text-sm">
                  Sube tus archivos usando el botón "Subir Archivo"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Información Fiscal Tab */}
      <TabsContent value="financial">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSignIcon className="mr-2" />
              Detalles Financieros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Salario</Label>
                <div className="relative">
                  <Input type="number" placeholder="0" />
                  <DollarSignIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Valor Factura</Label>
                <div className="relative">
                  <Input type="number" placeholder="0" />
                  <DollarSignIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fee</Label>
                <div className="relative">
                  <Input type="number" placeholder="0" />
                  <DollarSignIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              * Todos los montos son en la moneda local
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Botón de Guardar */}
      <Button type="button" variant={"default"} className="w-full mt-4">
        Guardar Vacante
      </Button>
    </Tabs>
  );
}
