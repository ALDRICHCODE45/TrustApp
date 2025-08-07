"use client";

import { useState } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  UploadIcon,
  FileText,
  X,
  Download,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface CVUploadSectionProps {
  label?: string;
  inputId: string;
  currentCV?: {
    id: string;
    url: string;
  };
  onSaveCV?: (file: File) => Promise<void>;
  onDeleteCV?: () => Promise<void>;
  disabled?: boolean;
}

export const CVUploadSection = ({
  label = "Curriculum Vitae (CV)",
  inputId,
  currentCV,
  onSaveCV,
  onDeleteCV,
  disabled = false,
}: CVUploadSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [fileUploadState, fileUploadActions] = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: ".pdf,.docx,.doc,.txt",
    multiple: false,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      fileUploadActions.addFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    fileUploadActions.removeFile(fileId);
  };

  const handleSave = async () => {
    if (!onSaveCV || fileUploadState.files.length === 0) return;

    const cvFile = fileUploadState.files[0]?.file as File;
    if (!cvFile) return;

    try {
      setIsProcessing(true);
      await onSaveCV(cvFile);
      fileUploadActions.clearFiles();
    } catch (error) {
      console.error("Error al procesar CV:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteCV) return;

    try {
      setIsProcessing(true);
      await onDeleteCV();
    } catch (error) {
      console.error("Error al eliminar CV:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={inputId}>{label}</Label>

      {/* Mostrar CV actual si existe */}
      {currentCV && (
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
                    href={currentCV.url}
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
              onClick={handleDelete}
              disabled={disabled || isProcessing}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Área para subir nuevo CV o reemplazar actual */}
      {fileUploadState.files.length === 0 ? (
        <div
          className="border-input bg-background hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors"
          onClick={() => !disabled && document.getElementById(inputId)?.click()}
        >
          <UploadIcon className="text-muted-foreground mb-2 h-6 w-6" />
          <div className="text-muted-foreground text-sm">
            {currentCV
              ? "Arrastra y suelta o haz clic para reemplazar CV"
              : "Arrastra y suelta o haz clic para subir CV"}
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
                onClick={() => removeFile(file.id)}
                disabled={disabled}
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
              onClick={() => document.getElementById(inputId)?.click()}
              disabled={disabled}
              className="flex-1"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Cambiar archivo
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={disabled || isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Guardando..." : "Guardar CV"}
            </Button>
          </div>
        </div>
      )}

      <input
        id={inputId}
        type="file"
        className="sr-only"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileUpload}
        disabled={disabled}
      />

      {fileUploadState.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {fileUploadState.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};
