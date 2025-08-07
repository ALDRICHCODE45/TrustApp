"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Ban,
  FileText,
  Mail,
  PlusIcon,
  UploadIcon,
  Users,
  X,
  Phone,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import {
  createCandidateSchema,
  CreateCandidateFormData,
} from "@/zod/createCandidateSchema";
import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
} from "@/actions/person/createCandidate";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ToastCustomMessage } from "@/components/ToastCustomMessage";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  uploadNewCvToCandidate,
  updateNewCvToCandidate,
  deleteCvFromCandidate,
} from "@/actions/person/actions";

export type PersonWithRelations = Prisma.PersonGetPayload<{
  include: {
    cv: true;
    vacanciesContratado: true;
  };
}>;

export const FinalTernaSheet = ({
  ternaFinal,
  vacancyId,
}: {
  ternaFinal: PersonWithRelations[];
  vacancyId: string;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditingCandidate, setCurrentEditingCandidate] =
    useState<PersonWithRelations | null>(null);

  const formEdit = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidateSchema),
  });

  const form = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cvFile: undefined,
    },
  });

  const [fileUploadState, fileUploadActions] = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: ".pdf,.docx,.doc,.txt",
    multiple: false,
  });

  // Hook separado para manejo de CV en edición
  const [cvEditUploadState, cvEditUploadActions] = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: ".pdf,.docx,.doc,.txt",
    multiple: false,
  });

  // Funciones para manejo del CV (vacías para que las implemente el usuario)
  const handleUploadNewCV = async (file: File, candidateId: string) => {
    try {
      const result = await uploadNewCvToCandidate(candidateId, file);
      if (!result.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al subir el CV"
            message="El CV no pudo ser subido"
            type="error"
            onClick={() => toast.dismiss(t)}
          />
        ));
      }
      toast.custom((t) => (
        <ToastCustomMessage
          title="CV subido exitosamente"
          message="El CV ha sido subido exitosamente"
          type="success"
          onClick={() => toast.dismiss(t)}
        />
      ));
    } catch (err) {
      console.error("Error al subir el CV:", err);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al subir el CV"
          message="El CV no pudo ser subido"
          type="error"
          onClick={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const handleUpdateCV = async (file: File, candidateId: string) => {
    try {
      const result = await updateNewCvToCandidate(candidateId, file);
      if (!result.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al actualizar el CV"
            message="El CV no pudo ser actualizado"
            type="error"
            onClick={() => toast.dismiss(t)}
          />
        ));
        return;
      }
      toast.custom((t) => (
        <ToastCustomMessage
          title="CV actualizado exitosamente"
          message="El CV ha sido actualizado exitosamente"
          type="success"
          onClick={() => toast.dismiss(t)}
        />
      ));
    } catch (err) {
      console.error("Error al actualizar el CV:", err);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al actualizar el CV"
          message="El CV no pudo ser actualizado"
          type="error"
          onClick={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const handleDeleteCV = async (candidateId: string) => {
    try {
      const result = await deleteCvFromCandidate(candidateId);
      if (!result?.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al eliminar el CV"
            message="El CV no pudo ser eliminado"
            type="error"
            onClick={() => toast.dismiss(t)}
          />
        ));
        return;
      }
      toast.custom((t) => (
        <ToastCustomMessage
          title="CV eliminado exitosamente"
          message="El CV ha sido eliminado exitosamente"
          type="success"
          onClick={() => toast.dismiss(t)}
        />
      ));
    } catch (err) {
      console.error("Error al eliminar el CV:", err);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al eliminar el CV"
          message="El CV no pudo ser eliminado"
          type="error"
          onClick={() => toast.dismiss(t)}
        />
      ));
    }
  };

  // Funciones para manejo de archivos CV en edición
  const handleCvEditFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      cvEditUploadActions.addFiles(files);
    }
  };

  const removeCvEditFile = (fileId: string) => {
    cvEditUploadActions.removeFile(fileId);
  };

  const handleSaveCV = async () => {
    if (!currentEditingCandidate?.id) return;

    const cvFile = cvEditUploadState.files[0]?.file as File;
    if (!cvFile) return;

    try {
      if (currentEditingCandidate.cvFileId) {
        // Ya tiene CV, actualizar
        await handleUpdateCV(cvFile, currentEditingCandidate.id);
      } else {
        // No tiene CV, subir nuevo
        await handleUploadNewCV(cvFile, currentEditingCandidate.id);
      }

      // Limpiar estado después de guardar
      cvEditUploadActions.clearFiles();
    } catch (error) {
      console.error("Error al procesar CV:", error);
    }
  };

  const handleRemoveCurrentCV = async () => {
    if (!currentEditingCandidate?.id || !currentEditingCandidate.cvFileId)
      return;

    try {
      await handleDeleteCV(currentEditingCandidate.id);
    } catch (error) {
      console.error("Error al eliminar CV:", error);
    }
  };

  const onSubmitEdit = async (data: CreateCandidateFormData) => {
    try {
      if (!currentEditingCandidate?.id) {
        return;
      }
      console.log("Editando candidato:", {
        candidatoId: currentEditingCandidate?.id,
        datosOriginales: currentEditingCandidate,
        datosNuevos: data,
      });

      const result = await updateCandidate(currentEditingCandidate.id, data);
      console.log("Resultado de la actualización:", result);

      if (!result.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al actualizar candidato"
            message="El candidato no pudo ser actualizado"
            type="error"
            onClick={() => toast.dismiss(t)}
          />
        ));
        return;
      }

      toast.custom((t) => (
        <ToastCustomMessage
          title="Candidato actualizado exitosamente"
          message="El candidato ha sido actualizado exitosamente"
          type="success"
          onClick={() => toast.dismiss(t)}
        />
      ));
      formEdit.reset();
      setIsEditDialogOpen(false);
      setCurrentEditingCandidate(null);
      formEdit.reset();
    } catch (err) {
      console.error("Error al actualizar candidato:", err);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al actualizar candidato"
          message="El candidato no pudo ser actualizado"
          type="error"
          onClick={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const onSubmit = async (data: CreateCandidateFormData) => {
    setIsSubmitting(true);
    try {
      // Limpiar campos vacíos antes de enviar
      const cleanData = {
        name: data.name,
        phone: data.phone?.trim() || undefined,
        email: data.email?.trim() || undefined,
      };

      // Agregar archivo CV si existe (solo si es un File, no FileMetadata)
      const cvFile = fileUploadState.files[0]?.file
        ? fileUploadState.files[0]?.file
        : undefined;

      const dataWithFile = {
        ...cleanData,
        cvFile,
      };

      const result = await createCandidate(dataWithFile, vacancyId);

      if (!result.ok) {
        toast.error(result.message || "Error al crear candidato");
        return;
      }

      toast.success("Candidato agregado exitosamente");
      form.reset();
      fileUploadActions.clearFiles();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al crear candidato:", error);
      toast.error("Error al crear candidato");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      fileUploadActions.addFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    fileUploadActions.removeFile(fileId);
  };

  const handleEditCandidate = (candidato: PersonWithRelations) => {
    setCurrentEditingCandidate(candidato);
    // Limpiar estado del CV al abrir el dialog
    cvEditUploadActions.clearFiles();
    // Configurar los valores del formulario con los datos del candidato
    formEdit.reset({
      name: candidato.name,
      phone: candidato.phone || "",
      email: candidato.email || "",
      cvFile: undefined,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      console.log("Eliminando candidato:", candidateId);

      const result = await deleteCandidate(candidateId);
      if (!result.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al eliminar candidato"
            message="El candidato no pudo ser eliminado"
            type="error"
            onClick={() => toast.dismiss(t)}
          />
        ));
        return;
      }

      toast.custom((t) => (
        <ToastCustomMessage
          title="Candidato eliminado exitosamente"
          message="El candidato ha sido eliminado exitosamente"
          type="success"
          onClick={() => toast.dismiss(t)}
        />
      ));
    } catch (err) {
      console.error("Error al eliminar candidato:", err);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al eliminar candidato"
          message="El candidato no pudo ser eliminado (Error desconocido)"
          type="error"
          onClick={() => toast.dismiss(t)}
        />
      ));
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="flex justify-center items-center w-full">
        <Button variant="outline" size="sm">
          <Users />
        </Button>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader className="mt-5 ">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" variant="outline">
                <PlusIcon size={16} />
                <span>Agregar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
              <DialogHeader className="contents space-y-0 text-left">
                <DialogTitle className="border-b px-6 py-4 text-base">
                  Agregar candidato
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="sr-only">
                Completar la información del nuevo candidato.
              </DialogDescription>
              <div className="px-6 pt-4 pb-2">
                <p className="text-sm text-muted-foreground">
                  Complete la información del candidato. El nombre es requerido.
                </p>
              </div>
              <div className="overflow-y-auto">
                <div className="px-6 pt-4 pb-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre completo *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Juan Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="555-123-4567"
                                    type="tel"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="candidato@ejemplo.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="cv-upload">Curriculum Vitae (CV)</Label>
                        {fileUploadState.files.length === 0 ? (
                          <div
                            className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors"
                            onClick={() =>
                              document.getElementById("cv-upload")?.click()
                            }
                          >
                            <UploadIcon className="text-muted-foreground mb-2 h-6 w-6" />
                            <div className="text-muted-foreground text-sm">
                              Arrastra y suelta o haz clic para subir
                            </div>
                            <div className="text-muted-foreground/80 text-xs mt-1">
                              PDF, DOCX o TXT (máx. 5MB)
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {fileUploadState.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium truncate">
                                    {file.file.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(file.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document.getElementById("cv-upload")?.click()
                              }
                              className="w-full"
                            >
                              <UploadIcon className="h-4 w-4 mr-2" />
                              Cambiar archivo
                            </Button>
                          </div>
                        )}
                        <input
                          id="cv-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={handleFileUpload}
                        />
                        {fileUploadState.errors.length > 0 && (
                          <div className="text-sm text-red-600">
                            {fileUploadState.errors.map((error, index) => (
                              <div key={index}>{error}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
              <DialogFooter className="border-t px-6 py-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar candidato"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {ternaFinal.length > 0 ? (
            ternaFinal.map((candidato, index) => (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow border-l-2 border-l-primary"
              >
                <CardHeader className="p-3 pb-1 flex flex-row justify-between items-start">
                  <div className="flex  justify-between items-center w-full">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-medium">
                        {candidato.name}
                      </CardTitle>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={() => handleEditCandidate(candidato)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                {/* DIALOG PARA EDITAR CANDIDATO */}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar candidato</DialogTitle>
                      <DialogDescription>
                        Modifica la información del candidato y guarda los
                        cambios.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...formEdit}>
                      <form
                        onSubmit={formEdit.handleSubmit(onSubmitEdit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={formEdit.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre completo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Juan Pérez" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEdit.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="555-123-4567"
                                  type="tel"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEdit.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Correo electrónico</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="candidato@ejemplo.com"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button type="submit">Guardar cambios</Button>
                        </DialogFooter>
                      </form>
                    </Form>

                    {/* Sección separada para manejo del CV */}
                    <div className="border-t pt-4 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cv-edit-upload">
                            Curriculum Vitae (CV)
                          </Label>

                          {/* Mostrar CV actual si existe */}
                          {currentEditingCandidate?.cvFileId && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                      CV Actual
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <a
                                        href={
                                          typeof currentEditingCandidate.cv ===
                                          "string"
                                            ? currentEditingCandidate.cv
                                            : (
                                                currentEditingCandidate.cv as any
                                              )?.url || ""
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                      >
                                        <Download className="h-3 w-3" />
                                        Ver/Descargar
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRemoveCurrentCV}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Área para subir nuevo CV o reemplazar actual */}
                          {cvEditUploadState.files.length === 0 ? (
                            <div
                              className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors"
                              onClick={() =>
                                document
                                  .getElementById("cv-edit-upload")
                                  ?.click()
                              }
                            >
                              <UploadIcon className="text-muted-foreground mb-2 h-6 w-6" />
                              <div className="text-muted-foreground text-sm">
                                {currentEditingCandidate?.cvFileId
                                  ? "Arrastra y suelta o haz clic para reemplazar CV"
                                  : "Arrastra y suelta o haz clic para subir CV"}
                              </div>
                              <div className="text-muted-foreground/80 text-xs mt-1">
                                PDF, DOCX o TXT (máx. 5MB)
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {cvEditUploadState.files.map((file) => (
                                <div
                                  key={file.id}
                                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-600" />
                                    <div>
                                      <span className="text-sm font-medium text-green-900 dark:text-green-100 truncate">
                                        {file.file.name}
                                      </span>
                                      <div className="text-xs text-green-600 dark:text-green-400">
                                        Nuevo CV - No guardado
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCvEditFile(file.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    document
                                      .getElementById("cv-edit-upload")
                                      ?.click()
                                  }
                                  className="flex-1"
                                >
                                  <UploadIcon className="h-4 w-4 mr-2" />
                                  Cambiar archivo
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleSaveCV}
                                  className="flex-1"
                                >
                                  Guardar CV
                                </Button>
                              </div>
                            </div>
                          )}

                          <input
                            id="cv-edit-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.docx,.doc,.txt"
                            onChange={handleCvEditFileUpload}
                          />

                          {cvEditUploadState.errors.length > 0 && (
                            <div className="text-sm text-red-600">
                              {cvEditUploadState.errors.map((error, index) => (
                                <div key={index}>{error}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* Alert DIALOG PARA ELIMINAR CANDIDATO */}
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminar candidato</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no puede ser deshecha. Esto eliminará el
                        candidato permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteCandidate(candidato.id)}
                        >
                          Eliminar
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <CardContent className="p-3 pt-1 space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex gap-1 items-center">
                        <Mail size={14} className="text-gray-400 mr-1" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidato.email ? candidato.email : "Sin email"}
                        </p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Phone size={14} className="text-gray-400 mr-1" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidato.phone ? candidato.phone : "Sin celular"}
                        </p>
                      </div>

                      <div className="flex gap-1 items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidato.cvFileId && (
                            <a
                              href={
                                typeof candidato.cv === "string"
                                  ? candidato.cv
                                  : (candidato.cv as any)?.url || ""
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              <span>Ver CV</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="">
              <CardHeader className="flex items-center justify-center">
                <Ban size={40} className="text-gray-500" />
                <CardTitle className="text-sm text-gray-400 text-center">
                  No hay terna disponible.
                </CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
