"use server";
import prisma from "@/lib/db";
import { LogAction } from "@prisma/client";

export const createLog = async (formData: FormData, action: LogAction) => {
  try {
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as string;
    const modulo = formData.get("file") as string;

    console.log("CreateLog action parameters:", { userId, file });

    const userExist = prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId) {
      return {
        ok: false,
        message: "User does not exists",
      };
    }

    await prisma.log.create({
      data: {
        autorId: userId,
        action,
        file,

        //TODO:Implementar logs module
      },
    });

    return {
      ok: true,
      message: "User exists",
    };
  } catch (error) {
    throw new Error("Server Error: Error al crear el log");
  }
};
