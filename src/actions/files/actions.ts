"use server";

import prisma from "@/lib/db";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION!,
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SECRET_KEY!,
  },
});

export const deleteAnyFile = async (fileName: string) => {
  try {
    const fileKey = fileName.split("/").pop();

    if (!fileKey) {
      console.log({ fileKey });
      throw new Error("File key error");
    }
    //eliminar el archivo
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
    });

    await s3.send(command);
  } catch (err) {
    throw new Error("Error al eliminar el archivo");
  }
};

export const deleteFile = async (fileKey: string, interactionId: string) => {
  try {
    //eliminar el archivo
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
    });
    await s3.send(command);

    //eliminar el file de la base de datos (filename, fileurl, fileType)
    const interactionExists = await prisma.contactInteraction.findUnique({
      where: {
        id: interactionId,
      },
    });

    if (!interactionExists) {
      return {
        ok: false,
        message: "interaction not found",
      };
    }

    await prisma.contactInteraction.update({
      where: {
        id: interactionId,
      },
      data: {
        attachmentName: null,
        attachmentType: null,
        attachmentUrl: null,
      },
    });

    return {
      ok: true,
      message: "Archivo eliminado correctamente",
    };
  } catch (err) {
    return {
      ok: false,
      message: "No se puede eliminar el archivo",
    };
  }
};

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `${randomUUID()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET!, // "propleflow"
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  });

  await s3.send(command);

  const fileUrl = `https://${process.env
    .DO_SPACES_BUCKET!}.nyc3.digitaloceanspaces.com/${key}`;

  return {
    success: true,
    url: fileUrl,
    fileName: file.name,
    fileType: file.type,
  };
}
