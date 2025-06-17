"use server";
import prisma from "@/lib/db";
import { NotificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const markAsReadNotification = async (notificationId: string) => {
  try {
    //Buscar la notificacion
    const existsNotification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
    if (!existsNotification) {
      return {
        ok: false,
        message: "Notification does not exists",
      };
    }

    //Actualizar notification
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        status: NotificationStatus.READ,
      },
    });
    return {
      ok: true,
      message: "Notificacion actualizada",
    };
  } catch (err) {
    throw new Error("Error al marcar la notificacion como leida");
  }
};

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
