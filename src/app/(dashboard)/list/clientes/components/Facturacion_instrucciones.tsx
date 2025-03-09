import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Banknote,
  Download,
  FileText,
  Clock,
  User,
  Plus,
  MoreHorizontal,
  SquarePen,
  Trash2,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Tipo para la información del archivo
interface FileInfo {
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  uploadTime: string;
  fileSize: string;
  fileType: string;
}

// Ejemplo de datos de archivo
const facturacionFileInfo: FileInfo = {
  fileName: "Instrucciones_Facturacion_2025.pdf",
  uploadedBy: "Ana Martinez",
  uploadDate: "01/03/2025",
  uploadTime: "14:30",
  fileSize: "1.2 MB",
  fileType: "PDF",
};

// Componente de Sheet para mostrar información del archivo de facturación
export function FacturacionSheet() {
  const handleDownload = () => {
    // Lógica para descargar el archivo
    console.log("Descargando archivo:", facturacionFileInfo.fileName);
    // Aquí iría el código para iniciar la descarga del archivo
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Banknote className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="py-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <PlusIcon size={16} />
                <span>Agregar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
              <DialogHeader className="contents space-y-0 text-left">
                <DialogTitle className="border-b px-6 py-4 text-base">
                  Agregar Documento
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="sr-only">
                Sube el nuevo documento.
              </DialogDescription>
              <div className="overflow-y-auto">
                <div className="px-6 pt-4 pb-6">
                  <form className="space-y-4">
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={`kk-cv`}>
                        Instrucciones Para Facturar
                      </Label>
                      <div className="mt-2">
                        <div className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors">
                          <UploadIcon className="text-muted-foreground mb-2 h-6 w-6" />
                          <div className="text-muted-foreground text-sm">
                            Arrastra y suelta o haz clic para subir
                          </div>
                          <div className="text-muted-foreground/80 text-xs mt-1">
                            PDF (máx. 5MB)
                          </div>
                          <input
                            id={`kk-cv`}
                            type="file"
                            className="sr-only"
                            accept=".pdf,.docx,.doc,.txt"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <DialogFooter className="border-t px-6 py-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button">Guardar Documento</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetHeader>

        <Card className="w-full shadow-sm">
          {/* Header */}
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Icono y Título */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg font-medium">
                    Archivo de Instrucciones
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-gray-500">
                    {facturacionFileInfo.fileType} •{" "}
                    {facturacionFileInfo.fileSize}
                  </CardDescription>
                </div>
              </div>

              {/* Menú Desplegable */}
              <div className="self-end md:self-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1.5">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[99999]">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      <SquarePen className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Contenido */}
          <CardContent className="pt-0">
            <div className="flex flex-col gap-3 py-2">
              {/* Nombre del Archivo */}
              <div className="flex items-center text-xs md:text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium w-20 md:w-24 flex-shrink-0">
                  Nombre:
                </span>
                <span className="ml-2 truncate">
                  {facturacionFileInfo.fileName}
                </span>
              </div>

              {/* Subido por */}
              <div className="flex items-center text-xs md:text-sm text-gray-500">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium w-20 md:w-24 flex-shrink-0">
                  Subido por:
                </span>
                <span className="ml-2">{facturacionFileInfo.uploadedBy}</span>
              </div>

              {/* Fecha y Hora */}
              <div className="flex items-center text-xs md:text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium w-20 md:w-24 flex-shrink-0">
                  Fecha y hora:
                </span>
                <span className="ml-2">
                  {facturacionFileInfo.uploadDate} a las{" "}
                  {facturacionFileInfo.uploadTime}
                </span>
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="border-t pt-4">
            <Button className="w-full" onClick={handleDownload}>
              <Download />
              <span className="hidden md:block">Descargar Instrucciones</span>
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Este archivo contiene todas las instrucciones necesarias para
            realizar el proceso de facturación correctamente.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
