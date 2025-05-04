"use server";
import prisma from "@/lib/db";
import { checkSession } from "@/hooks/auth/checkSession";
import { Role, TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createTask = async (formData: FormData) => {
  await checkSession();

  //form Data
  const userId = formData.get("userId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!userId) {
    return {
      ok: false,
      message: "UserId is required",
    };
  }

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userToUpdate) {
      return {
        ok: false,
        message: "User not found",
      };
    }

    const task = await prisma.task.create({
      data: {
        description,
        dueDate,
        title,
        assignedToId: userId,
      },
    });

    if (!task) {
      return {
        ok: false,
        message: "Error creando la tarea",
      };
    }

    revalidatePath(`/profile/${userId}`);
    return {
      ok: true,
      message: "Tarea creada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado, Revisa los logs",
    };
  }
};

export const editTask = async (taskId: string, formData: FormData) => {
  await checkSession();

  try {
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const dueDate = formData.get("dueDate") as string | null;
    const status = formData.get("status") as TaskStatus | null;
    const userId = formData.get("userId") as string | null;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return {
        ok: false,
        message: "La tarea no existe",
      };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title ?? existingTask.title,
        description: description ?? existingTask.description,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
        status: status ?? existingTask.status,
      },
    });

    revalidatePath(`/profile/${userId}`);
  } catch (error) {
    console.log(error);
    throw new Error("Error Inesperado");
  }
};

export const deleteTask = async (userId: string, taskId: string) => {
  const session = await checkSession();

  if (session.user.role !== Role.Admin) {
    return {
      ok: false,
      message: "No puedes eliminar la tarea",
    };
  }

  try {
    const taskToDelete = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!taskToDelete) {
      return {
        ok: false,
        message: "La tarea no existe.",
      };
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    revalidatePath(`/profile/${userId}`);
    return {
      ok: true,
      message: "Tarea eliminada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al editar la tarea",
    };
  }
};

export const toggleTaskStatus = async (userId: string, taskId: string) => {
  await checkSession();
  let statusToUpdate: TaskStatus;

  try {
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return {
        ok: false,
        message: "No existe la tarea",
      };
    }

    if (existingTask.status == TaskStatus.Done) {
      statusToUpdate = TaskStatus.Pending;
    } else {
      statusToUpdate = TaskStatus.Done;
    }

    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: statusToUpdate,
      },
    });

    revalidatePath(`/profile/${userId}`);
    return {
      ok: true,
      message: "Tarea editada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error Editando la tarea",
    };
  }
};

export const getTaskByDate = async (userId: string, date: string) => {
  if (!userId || !date) {
    return {
      ok: false,
      message: "Parametros faltantes",
    };
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
        dueDate: date,
      },
    });
    return {
      ok: true,
      message: "Tareas",
      tasks,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Error desconocido",
    };
  }
};
