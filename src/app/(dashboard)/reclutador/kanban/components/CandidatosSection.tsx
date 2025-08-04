"use client";
import { VacancyWithRelations } from "../../components/ReclutadorColumns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonWithRelations } from "@/app/(dashboard)/list/reclutamiento/components/FinalTernaSheet";
import {
  createCandidateSchema,
  CreateCandidateFormData,
} from "@/zod/createCandidateSchema";
import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
} from "@/actions/person/createCandidate";
import {
  uploadNewCvToCandidate,
  updateNewCvToCandidate,
  deleteCvFromCandidate,
} from "@/actions/person/actions";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";
import {
  Plus,
  UserPlus,
  AlertCircle,
  FileText,
  X,
  UploadIcon,
  Mail,
  Phone,
  UserCheck,
  Waypoints,
  Pencil,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import { MoreVertical } from "lucide-react";
import { ToastCustomMessage } from "@/components/ToastCustomMessage";
import {
  deseleccionarCandidato,
  seleccionarCandidato,
} from "@/actions/vacantes/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRoundX, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CompareChecklistForm } from "@/app/(dashboard)/list/reclutamiento/VacancyFormComponents/CreateVacancyComponents/CompareChecklistForm";

interface CandidatesSectionProps {
  vacante: VacancyWithRelations;
}

export const CandidatesSectionReclutador = ({
  vacante,
}: CandidatesSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState<PersonWithRelations[]>(
    vacante.ternaFinal || []
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [alertDialogDelete, setAlertDialogDelete] = useState<boolean>(false);
  const [currentEditingCandidate, setCurrentEditingCandidate] =
    useState<PersonWithRelations | null>(null);

  const form = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cvFile: undefined,
    },
  });

  const formEdit = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidateSchema),
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

  // Funciones para manejo del CV
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
        return;
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

  // Función para manejar la edición de candidatos
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
    setDialogOpen(true);
  };

  const onSubmitEdit = async (data: CreateCandidateFormData) => {
    try {
      if (!currentEditingCandidate?.id) {
        return;
      }

      const result = await updateCandidate(currentEditingCandidate.id, data);

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

      // Actualizar la lista local de candidatos
      setCandidates(
        candidates.map((c) =>
          c.id === currentEditingCandidate.id
            ? {
                ...c,
                name: data.name,
                phone: data.phone || null,
                email: data.email || null,
              }
            : c
        )
      );

      formEdit.reset();
      setDialogOpen(false);
      setCurrentEditingCandidate(null);
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

  const onSubmitEditOld = (data: CreateCandidateFormData) => {
    console.log(data);
  };

  const formEditOld = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

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

      const result = await createCandidate(dataWithFile, vacante.id);

      if (!result.ok || !result.person) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al crear candidato"
            message="El candidato no pudo ser agregado a la vacante"
            type="error"
            onClick={() => {
              toast.dismiss(t);
            }}
          />
        ));
        return;
      }

      toast.custom((t) => (
        <ToastCustomMessage
          title="Candidato agregado exitosamente"
          message="El candidato ha sido agregado correctamente a la vacante"
          type="success"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
      console.log("candidates", { candidates });
      form.reset();
      fileUploadActions.clearFiles();
      setIsDialogOpen(false);
      setCandidates([...candidates, result.person]);
    } catch (error) {
      console.error("Error al crear candidato:", error);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al crear candidato"
          message="El candidato no pudo ser agregado a la vacante"
          type="error"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
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

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const result = await deleteCandidate(candidateId);
      if (!result.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al eliminar candidato"
            message="El candidato no pudo ser eliminado"
            type="error"
            onClick={() => {
              toast.dismiss(t);
            }}
          />
        ));
        return;
      }
      toast.custom((t) => (
        <ToastCustomMessage
          title="Candidato eliminado exitosamente"
          message="El candidato ha sido eliminado correctamente"
          type="success"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
      setCandidates(
        candidates.filter((candidato) => candidato.id !== candidateId)
      );
    } catch (error) {
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al eliminar candidato"
          message="El candidato no pudo ser eliminado"
          type="error"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    }
  };

  const handleMarkCandidateAsContratado = async (candidateId: string) => {
    try {
      setIsSelecting(true);
      const response = await seleccionarCandidato(candidateId, vacante.id);
      if (!response.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al seleccionar al candidato"
            message={
              response.message || "El candidato no pudo ser seleccionado"
            }
            type="error"
            onClick={() => {
              toast.dismiss(t);
            }}
          />
        ));
        return;
      }

      toast.custom((t) => (
        <ToastCustomMessage
          title="Candidato seleccionado correctamente"
          message="El candidato ha sido SELECCIONADO"
          type="success"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    } catch (err) {
      console.error(err);
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al seleccionar al candidato"
          message="El candidato no pudo ser seleccionado"
          type="error"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleDeseleccionarCandidato = async () => {
    try {
      setIsSelecting(true);
      const response = await deseleccionarCandidato(vacante.id);
      if (!response.ok) {
        toast.custom((t) => (
          <ToastCustomMessage
            title="Error al deseleccionar al candidato"
            message={
              response.message || "El candidato no pudo ser deseleccionado"
            }
            type="error"
            onClick={() => {
              toast.dismiss(t);
            }}
          />
        ));
        return;
      }
      toast.custom((t) => (
        <ToastCustomMessage
          title="Candidato deseleccionado correctamente"
          message="El candidato ha sido DESSELECCIONADO"
          type="success"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    } catch (err) {
      toast.custom((t) => (
        <ToastCustomMessage
          title="Error al deseleccionar al candidato"
          message="El candidato no pudo ser deseleccionado"
          type="error"
          onClick={() => {
            toast.dismiss(t);
          }}
        />
      ));
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Existing candidates section content */}
      {candidates && candidates.length > 0 ? (
        <div className="space-y-6 mt-4 w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-muted-foreground">
              Candidatos
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 bg-background">
                {candidates.length} candidato(s)
              </Badge>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus size={16} />
                    <span>Agregar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="z-[9999] flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
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
                      Complete la información del candidato. El nombre es
                      requerido.
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
                                      <Input
                                        placeholder="Juan Pérez"
                                        {...field}
                                      />
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
                            <Label htmlFor="cv-upload-kanban">
                              Curriculum Vitae (CV)
                            </Label>
                            {fileUploadState.files.length === 0 ? (
                              <div
                                className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors"
                                onClick={() =>
                                  document
                                    .getElementById("cv-upload-kanban")
                                    ?.click()
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
                                    document
                                      .getElementById("cv-upload-kanban")
                                      ?.click()
                                  }
                                  className="w-full"
                                >
                                  <UploadIcon className="h-4 w-4 mr-2" />
                                  Cambiar archivo
                                </Button>
                              </div>
                            )}
                            <input
                              id="cv-upload-kanban"
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
            </div>
          </div>
          {/* Lista de candidatos */}
          <div className="space-y-3">
            {candidates.map((candidato, index) => (
              <Card
                key={index}
                className="group hover:shadow-sm transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar compacto */}
                    <div className="relative">
                      <Avatar className="h-11 w-11">
                        <AvatarImage
                          src={
                            typeof candidato.cv === "string"
                              ? candidato.cv
                              : (candidato.cv as any)?.url || "" || ""
                          }
                          alt={candidato.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                          {candidato.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Indicador de estado minimalista */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Información del candidato */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground mb-1 truncate">
                            {candidato.name}
                          </h3>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">
                                {candidato.email || "Sin email"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{candidato.phone || "Sin teléfono"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown de acciones */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 z-[9999]"
                          >
                            {candidato.cv?.url && (
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <Link href={candidato.cv.url} target="_blank">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver CV
                                </Link>
                              </DropdownMenuItem>
                            )}

                            {vacante.candidatoContratadoId === candidato.id ? (
                              <DropdownMenuItem
                                onClick={() => handleDeseleccionarCandidato()}
                                className="cursor-pointer"
                              >
                                <UserRoundX className="h-4 w-4 mr-2" />
                                Deseleccionar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleMarkCandidateAsContratado(candidato.id);
                                }}
                                className="cursor-pointer"
                              >
                                {isSelecting ? (
                                  <LoaderCircleIcon
                                    className="-ms-1 animate-spin"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <UserCheck className="h-4 w-4 mr-2" />
                                )}
                                Seleccionar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleEditCandidate(candidato)}
                              className="cursor-pointer"
                            >
                              <Pencil />
                              Editar
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setAlertDialogDelete(true)}
                              className="cursor-pointer"
                              variant="destructive"
                            >
                              <Trash2 />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  {/* DIALOG PARA ELIMINAR EL CANDIDATO */}
                  <AlertDialog
                    open={alertDialogDelete}
                    onOpenChange={setAlertDialogDelete}
                  >
                    <AlertDialogContent className="z-[9999]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar candidato</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Este candidato será
                          eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
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
                  {/* DIALOG PARA EDITAR EL CANDIDATO */}
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] z-[9999]">
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
                            <Label htmlFor="cv-edit-upload-kanban">
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
                                    .getElementById("cv-edit-upload-kanban")
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
                                        .getElementById("cv-edit-upload-kanban")
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
                              id="cv-edit-upload-kanban"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.docx,.doc,.txt"
                              onChange={handleCvEditFileUpload}
                            />

                            {cvEditUploadState.errors.length > 0 && (
                              <div className="text-sm text-red-600">
                                {cvEditUploadState.errors.map(
                                  (error, index) => (
                                    <div key={index}>{error}</div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Información de estado */}
                  <div className="mt-3 pt-2 border-t">
                    <CompareChecklistForm />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/10 rounded-lg mt-4">
          <AlertCircle className="h-10 w-10 mb-4 text-muted-foreground/60" />
          <p className="text-base font-medium mb-2">
            No hay candidatos en la terna final
          </p>
          <p className="text-sm text-center max-w-sm mb-4">
            Cuando se agreguen candidatos a la terna final, aparecerán aquí para
            su revisión.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar candidatos
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5 z-[9999]">
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
                        <Label htmlFor="cv-upload-kanban-empty">
                          Curriculum Vitae (CV)
                        </Label>
                        {fileUploadState.files.length === 0 ? (
                          <div
                            className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors"
                            onClick={() =>
                              document
                                .getElementById("cv-upload-kanban-empty")
                                ?.click()
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
                                document
                                  .getElementById("cv-upload-kanban-empty")
                                  ?.click()
                              }
                              className="w-full"
                            >
                              <UploadIcon className="h-4 w-4 mr-2" />
                              Cambiar archivo
                            </Button>
                          </div>
                        )}
                        <input
                          id="cv-upload-kanban-empty"
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
        </div>
      )}
    </div>
  );
};
