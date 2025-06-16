"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteNotification = async (notificationId: string) => {
  try {
    const existNotification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
    if (!existNotification) {
      return {
        ok: false,
        message: "Error al eliminar la notificacion",
      };
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    revalidatePath("/");
    return {
      ok: true,
      message: "Notificacion Eliminada",
    };
  } catch (err) {
    throw new Error("Error al eliminar la notificacion");
  }
};
