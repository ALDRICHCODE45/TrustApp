"use server";
import prisma from "@/lib/db";
import { checkSession } from "@/hooks/auth/checkSession";
import { Role, TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// getTaskByDate - Para obtener tareas de una fecha específica
export const getTaskByDate = async (userId: string, date: string) => {
  try {
    console.log("getTaskByDate called with:", { userId, date });

    if (!userId || !date) {
      return {
        ok: false,
        message: "Parámetros faltantes",
        tasks: [],
      };
    }

    // Crear el inicio y fin del día para la fecha específica
    // Usar la fecha local para evitar problemas de zona horaria
    const [year, month, day] = date.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
        status: TaskStatus.Pending,
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return {
      ok: true,
      message: "Tareas obtenidas correctamente",
      tasks,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Error al obtener las tareas",
      tasks: [],
    };
  }
};

// getTasksByMonth - Para obtener tareas del mes completo
export async function getTasksByMonth(
  userId: string,
  startDate: string,
  endDate: string,
) {
  try {
    if (!userId || !startDate || !endDate) {
      return {
        ok: false,
        tasks: [],
        error: "Parámetros faltantes",
      };
    }

    const tasks = await prisma.task.findMany({
      where: {
        status: TaskStatus.Pending,
        assignedToId: userId,
        dueDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return {
      ok: true,
      tasks: tasks,
    };
  } catch (error) {
    return {
      ok: false,
      tasks: [],
      error: "Error al obtener las tareas del mes",
    };
  }
}

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

// Nueva función para crear tareas desde el seguimiento de contactos
export const createTaskFromContact = async (
  title: string,
  description: string,
  dueDate: string,
) => {
  const session = await checkSession();

  if (!title || !description || !dueDate) {
    return {
      ok: false,
      message: "Todos los campos son requeridos",
    };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        assignedToId: session.user.id,
      },
    });

    if (!task) {
      return {
        ok: false,
        message: "Error creando la tarea",
      };
    }

    revalidatePath(`/profile/${session.user.id}`);
    revalidatePath("/leads");
    revalidatePath("/list/leads");

    return {
      ok: true,
      message: "Tarea creada exitosamente",
      task,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error inesperado, revisa los logs",
    };
  }
};
