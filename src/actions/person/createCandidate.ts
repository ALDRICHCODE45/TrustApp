"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { CreateCandidateFormData } from "@/zod/createCandidateSchema";
import { uploadFile } from "../files/actions";
import { FileMetadata } from "@/hooks/use-file-upload";

export async function createCandidate(
  data: CreateCandidateFormData & { cvFile?: File | FileMetadata | undefined },
  vacancyId: string
) {
  console.log("createCandidate", data, vacancyId);
  try {
    const user = await auth();
    if (!user?.user) {
      return {
        ok: false,
        message: "Usuario no autenticado",
      };
    }
    const currentUserId = user.user.id;
    // TODO: Implementar lógica para crear candidato
    // Esta función debe:
    // 1. Validar los datos (name es requerido, email/phone/cvFile opcionales)
    // 2. Si hay cvFile, subir el archivo y crear VacancyFile
    // 3. Crear el Person con el cvFileId si existe
    // 4. Retornar resultado con ok: boolean y message?: string

    console.log("Datos recibidos:", data);

    // Ejemplo de lógica a implementar:
    if (data.cvFile) {
      // 1. Subir archivo a storage (S3, Cloudinary, etc.)
      const formData = new FormData();
      formData.append("file", data.cvFile);
      const uploadedUrl = await uploadFile(formData);
      console.log("uploadedUrl", uploadedUrl);

      if (!uploadedUrl.ok || !uploadedUrl.url) {
        return {
          ok: false,
          message: "Error al subir el archivo",
        };
      }
      // 2. Crear VacancyFile con los datos del archivo
      const vacancyFile = await prisma.vacancyFile.create({
        data: {
          url: uploadedUrl.url!,
          name: data.cvFile.name,
          mimeType: data.cvFile.type,
          size: data.cvFile.size,
          authorId: currentUserId, // obtener del contexto
          vacancyId: vacancyId,
        },
      });
      // 3. Crear Person con cvFileId
      await prisma.person.create({
        data: {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          cvFileId: vacancyFile.id,
          vacanciesTernaFinal: {
            connect: {
              id: vacancyId,
            },
          },
        },
      });
    } else {
      // Crear Person sin CV
      await prisma.person.create({
        data: {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          vacanciesTernaFinal: {
            connect: {
              id: vacancyId,
            },
          },
        },
      });
    }

    return {
      ok: true,
      message: "Candidato creado exitosamente (función vacía)",
    };
  } catch (error) {
    console.error("Error al crear candidato:", error);
    throw new Error("Error al crear candidato para la vacante");
  }
}
