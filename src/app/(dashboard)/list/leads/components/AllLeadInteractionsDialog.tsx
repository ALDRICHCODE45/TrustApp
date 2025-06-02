"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Loader2,
  MessageSquare,
  Users,
  Calendar,
  User,
  FileText,
  Download,
  PaperclipIcon,
} from "lucide-react";
import { ContactInteractionWithRelations } from "@/actions/leadSeguimiento/ations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AllLeadInteractionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  empresaName: string;
}

export function AllLeadInteractionsDialog({
  open,
  onOpenChange,
  leadId,
  empresaName,
}: AllLeadInteractionsDialogProps) {
  const [interactions, setInteractions] = useState<
    ContactInteractionWithRelations[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInteractions = async () => {
    if (!leadId || !open) return;

    console.log("=== INICIO DEBUG FETCH INTERACCIONES ===");
    console.log("Lead ID:", leadId);
    console.log("Open:", open);

    setLoading(true);
    setError(null);

    try {
      const url = `/api/leads/${leadId}/interacciones`;
      console.log("URL de la petición:", url);

      const response = await fetch(url);
      console.log("Status de respuesta:", response.status);
      console.log("OK:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        throw new Error(errorData.error || "Error al cargar las interacciones");
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);
      console.log("Número de interacciones:", data.length);
      setInteractions(data);
    } catch (err) {
      console.error("Error en fetch:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
      console.log("=== FIN DEBUG FETCH INTERACCIONES ===");
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [leadId, open]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `hace ${diffInSeconds} segundos`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} horas`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `hace ${diffInDays} días`;

    // Si es más de una semana, mostrar la fecha formateada
    return format(date, "eee dd/MM/yyyy", { locale: es });
  };

  const groupedInteractions = interactions.reduce(
    (acc, interaction) => {
      const contactName = interaction.contacto.name;
      if (!acc[contactName]) {
        acc[contactName] = [];
      }
      acc[contactName].push(interaction);
      return acc;
    },
    {} as Record<string, ContactInteractionWithRelations[]>,
  );

  const totalInteractions = interactions.length;
  const totalContacts = Object.keys(groupedInteractions).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] w-full max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Todas las interacciones - {empresaName}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {totalContacts} contactos
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {totalInteractions} interacciones
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Cargando interacciones...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Error: {error}</p>
              <Button 
                variant="outline" 
                onClick={fetchInteractions}
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : totalInteractions === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                No hay interacciones registradas
              </p>
              <p className="text-sm">
                Esta empresa aún no tiene interacciones con ninguno de sus
                contactos.
              </p>
            </div>
          ) : (
            <div className="pt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4">
                  {Object.entries(groupedInteractions).map(
                    ([contactName, contactInteractions]) => (
                      <div key={contactName} className="space-y-3">
                        {/* Header del contacto */}
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-base">
                            {contactName}
                          </h3>
                          <Badge variant="secondary" className="ml-auto">
                            {contactInteractions.length} interacciones
                          </Badge>
                        </div>

                        {/* Interacciones del contacto */}
                        <div className="space-y-3 pl-4">
                          {contactInteractions.map((interaction) => (
                            <div
                              key={interaction.id}
                              className={cn(
                                "border-l-4 bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow",
                                interaction.attachmentUrl
                                  ? "border-l-blue-500"
                                  : "border-l-primary",
                              )}
                            >
                              {/* Header de la interacción */}
                              <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={interaction.autor.image || ""}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="text-xs bg-primary/10">
                                    {interaction.autor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">
                                    {interaction.autor.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {getTimeAgo(
                                        new Date(interaction.createdAt),
                                      )}
                                    </span>
                                    {interaction.updatedAt !==
                                      interaction.createdAt && (
                                      <span className="text-orange-500">
                                        (editado)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Contenido de la interacción */}
                              <div className="mb-3">
                                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                  {interaction.content}
                                </p>
                              </div>

                              {/* Archivo adjunto si existe */}
                              {interaction.attachmentUrl && (
                                <div className="bg-muted/50 rounded-md p-3 border border-muted">
                                  <div className="flex items-center gap-2">
                                    <PaperclipIcon className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm text-muted-foreground">
                                      Archivo adjunto:
                                    </span>
                                    <a
                                      href={interaction.attachmentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                                    >
                                      {interaction.attachmentName ||
                                        "Ver archivo"}
                                    </a>
                                    <a
                                      href={interaction.attachmentUrl}
                                      download={interaction.attachmentName}
                                      className="ml-auto p-1 hover:bg-muted rounded-md transition-colors"
                                    >
                                      <Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
