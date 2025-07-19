"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CircleUser,
  File,
} from "lucide-react";
import { Person, Prisma } from "@prisma/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  createCandidateSchema,
  CreateCandidateFormData,
} from "@/zod/createCandidateSchema";
import { createCandidate } from "@/actions/person/createCandidate";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export type PersonWithRelations = Prisma.PersonGetPayload<{
  include: {
    cv: true;
  };
}>;

export const FinalTernaSheet = ({
  ternaFinal,
  vacancyId,
}: {
  ternaFinal: PersonWithRelations[];
  vacancyId: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                      {candidato.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {candidato.position}
                    </CardDescription>
                  </div>
                </CardHeader>

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
