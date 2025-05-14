"use server";

import prisma from "@/lib/db";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION!, // "nyc3"
  endpoint: process.env.DO_SPACES_ENDPOINT!, // "https://nyc3.digitaloceanspaces.com"
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SECRET_KEY!,
  },
});

export interface propsReplaceFile {
  interactionId: string; // para poner el remplazo en la interaccion correcta
  file: File;
}

export const replaceFile = async (fileKey: string, props: propsReplaceFile) => {
  try {
    //eliminar el archivo a remplazar
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
    });
    await s3.send(command);

    //crear otro file en digital ocean
    const formData = new FormData();
    formData.append("file", props.file);
    const response = await uploadFile(formData);

    if (!response.success) {
      throw new Error("Erorr al subir el archivo para remplazarlo");
    }

    await prisma.contactInteraction.update({
      where: {
        id: props.interactionId,
      },
      data: {
        attachmentName: response.fileName,
        attachmentType: response.fileType,
        attachmentUrl: response.url,
      },
    });

    return {
      success: true,
      url: response.url,
      fileName: response.fileName,
      fileType: response.fileType,
    };
  } catch (err) {
    throw new Error("Error al remplazar el archivo");
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

  const fileUrl = `https://${process.env.DO_SPACES_BUCKET!}.nyc3.digitaloceanspaces.com/${key}`;

  return {
    success: true,
    url: fileUrl,
    fileName: file.name,
    fileType: file.type,
  };
}
