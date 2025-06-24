"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  FileText,
  Upload,
  MoreVertical,
  Download,
  Edit,
  Trash,
  User,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Role, UsersData } from "../../../../../lib/data";
import Link from "next/link";

// Tipos para el formulario
interface FormData {
  // Información básica
  tipoVacante: string;
  estado: string;
  puesto: string;
  cliente: string;
  fechaLimite: string;
  reclutador: {
    id: number | null;
    name: string;
  };
  // Información financiera
  salario: string;
  valorFactura: string;
  fee: string;
  // Archivos
  uploadedFiles: File[];
}

// Componente principal para crear una vacante
export const CreateVacanteForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          Crear Vacante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] z-[200]">
        <VacancyForm />
      </DialogContent>
    </Dialog>
  );
};

// Archivos de ejemplo (datos estáticos)

interface File {
  id: number;
  name: string;
  type: string;
  size: string;
  lastUpdated: string;
  icon: React.ReactNode;
}

const demoFiles: File[] = [
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

// Componente de archivo (para la visualización)
const FileCard = ({ file }: { file: File }) => (
  <Card className="group hover:shadow-md transition-all duration-200">
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
                <Download className="h-4 w-4 mr-2" />
                <span>Descargar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 cursor-pointer">
                <Trash className="h-4 w-4 mr-2" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-medium text-lg mb-1">{file.name}</div>
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
          <span className="text-xs text-muted-foreground">{file.size}</span>
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          <span>Descargar</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Componente principal del formulario de vacante
function VacancyForm() {
  // Estado global del formulario
  const [formData, setFormData] = useState<FormData>({
    tipoVacante: "",
    estado: "",
    puesto: "",
    cliente: "",
    fechaLimite: "",
    reclutador: {
      id: null,
      name: "Seleccionar",
    },
    salario: "",
    valorFactura: "",
    fee: "",
    uploadedFiles: [],
  });

  // Función para actualizar el estado del formulario
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para actualizar campos anidados
  const updateNestedFormData = (
    parentField: keyof FormData,
    childField: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [childField]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Datos del formulario:", formData);
    // Aquí puedes agregar la lógica para guardar los datos
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4 mt-4">
        <TabsTrigger value="basic">Información Básica</TabsTrigger>
        <TabsTrigger value="files">Archivos</TabsTrigger>
        <TabsTrigger value="financial">Información Fiscal</TabsTrigger>
      </TabsList>

      {/* Tab de Información Básica */}
      <TabsContent value="basic">
        <BasicInformationTab
          formData={formData}
          updateFormData={updateFormData}
          updateNestedFormData={updateNestedFormData}
        />
      </TabsContent>

      {/* Tab de Archivos */}
      <TabsContent value="files">
        <FilesTab
          files={demoFiles}
          formData={formData}
          updateFormData={updateFormData}
        />
      </TabsContent>

      {/* Tab de Información Fiscal */}
      <TabsContent value="financial">
        <FinancialInformationTab
          formData={formData}
          updateFormData={updateFormData}
        />
      </TabsContent>

      {/* Botón de Guardar */}
      <Button
        type="button"
        variant={"default"}
        className="w-full mt-4"
        onClick={handleSave}
      >
        Guardar Vacante
      </Button>
    </Tabs>
  );
}

// Componente para la pestaña de información básica
const BasicInformationTab = ({
  formData,
  updateFormData,
  updateNestedFormData,
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  updateNestedFormData: (
    parentField: keyof FormData,
    childField: string,
    value: any
  ) => void;
}) => {
  // Filter only recruiters from the UsersData array
  const recruiters = UsersData.filter((user) => user.rol === Role.reclutador);

  const handleReclutadorChange = (newReclutador: any) => {
    updateFormData("reclutador", newReclutador);
  };

  return (
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
            <Select
              value={formData.tipoVacante}
              onValueChange={(value) => updateFormData("tipoVacante", value)}
            >
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
            <Select
              value={formData.estado}
              onValueChange={(value) => updateFormData("estado", value)}
            >
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
            <Input
              placeholder="Ej. Desarrollador Senior"
              value={formData.puesto}
              onChange={(e) => updateFormData("puesto", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <Select
              value={formData.cliente}
              onValueChange={(value) => updateFormData("cliente", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar Cliente" />
              </SelectTrigger>
              <SelectContent className="z-[8888]">
                <SelectItem value="Zendesk" className="cursor-pointer">
                  Zendesk
                </SelectItem>
                <SelectItem value="CirculoCredito" className="cursor-pointer">
                  Circulo de Credito
                </SelectItem>
                <SelectItem value="CiberPower" className="cursor-pointer">
                  CiberPower
                </SelectItem>
                <SelectItem value="Takeda" className="cursor-pointer">
                  Takeda
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Fecha Límite</Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.fechaLimite}
                onChange={(e) => updateFormData("fechaLimite", e.target.value)}
              />
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-full">
            <Button variant="outline" size="sm" className="flex ">
              <User />
              <span className="truncate">{formData.reclutador.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-h-[250px] overflow-y-auto z-[999]">
            {recruiters.map((recruiter) => (
              <DropdownMenuItem
                key={recruiter.id}
                className="flex items-center gap-3 p-2 cursor-pointer"
                onClick={() => {
                  handleReclutadorChange({
                    id: recruiter.id,
                    name: recruiter.name,
                  });
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage
                      src={recruiter.photo}
                      alt={recruiter.name}
                      className="object-cover"
                    />
                    <AvatarFallback>{recruiter.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {recruiter.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {recruiter.email}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="link"
                  className="ml-auto h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  asChild
                >
                  <Link href={`/profile/${recruiter.id}`}>Ver</Link>
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reclutador */}
      </CardContent>
    </Card>
  );
};

// Componente para la pestaña de archivos
const FilesTab = ({
  files,
  formData,
  updateFormData,
}: {
  files: File[];
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles);
      updateFormData("uploadedFiles", [...formData.uploadedFiles, ...newFiles]);
    }
  };

  return (
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
              accept=".pdf,.docx,.doc"
              multiple
              onChange={handleFileUpload}
            />
          </label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>

        {/* Mostrar archivos subidos por el usuario */}
        {formData.uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Archivos subidos:</h4>
            <div className="space-y-2">
              {formData.uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newFiles = formData.uploadedFiles.filter(
                        (_, i) => i !== index
                      );
                      updateFormData("uploadedFiles", newFiles);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && formData.uploadedFiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p>No hay documentos subidos</p>
            <p className="text-sm">
              Sube tus archivos usando el botón Subir Archivo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para la pestaña de información fiscal (mejorado visualmente)
const FinancialInformationTab = ({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">Detalles Financieros</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Salario</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.salario}
              onChange={(e) => updateFormData("salario", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Valor Factura</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              className="custom-number-input"
              value={formData.valorFactura}
              onChange={(e) => updateFormData("valorFactura", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Fee</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.fee}
              onChange={(e) => updateFormData("fee", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        * Todos los montos son en la moneda local
      </div>
    </CardContent>
  </Card>
);

export default CreateVacanteForm;
