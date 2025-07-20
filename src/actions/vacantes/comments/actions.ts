"use server";

import prisma from "@/lib/db";
import { CreateCommentData, CreateTaskData } from "@/types/comment";

export async function CreateTask(args: CreateTaskData) {
  try {
    const {
      title,
      description,
      dueDate,
      assignedToId,
      notifyOnComplete = false,
      notificationRecipients = [],
    } = args;

    // Verificar que el usuario asignado existe
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!assignedUser) {
      return {
        ok: false,
        message: "Usuario asignado no encontrado",
      };
    }

    // Verificar que los usuarios de notificación existen
    if (notificationRecipients.length > 0) {
      const notificationUsers = await prisma.user.findMany({
        where: { id: { in: notificationRecipients } },
      });

      if (notificationUsers.length !== notificationRecipients.length) {
        return {
          ok: false,
          message: "Algunos usuarios de notificación no fueron encontrados",
        };
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        assignedToId,
        notifyOnComplete,
        notificationRecipients: {
          connect: notificationRecipients.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
        assignedTo: true,
      },
    });

    for (const recipientId of notificationRecipients) {
      await prisma.notification.create({
        data: {
          type: "TASK_INITIALIZED",
          message: `El usuario ${task.assignedTo.name} ha iniciado una tarea compartida`,
          taskId: task.id,
          recipientId: recipientId,
        },
      });
    }

    return {
      ok: true,
      message: "Tarea creada exitosamente",
      taskId: task.id,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      ok: false,
      message: "Error al crear la tarea",
    };
  }
}

export async function CreateComment(args: CreateCommentData) {
  try {
    const {
      content,
      authorId,
      vacancyId,
      isTask = false,
      title,
      description,
      assignedToId,
      dueDate,
      notifyOnComplete = false,
      notificationRecipients = [],
    } = args;

    // Verificar que el autor existe
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return {
        ok: false,
        message: "Autor no encontrado",
      };
    }

    // Verificar que la vacante existe si se proporciona
    if (vacancyId) {
      const vacancy = await prisma.vacancy.findUnique({
        where: { id: vacancyId },
      });

      if (!vacancy) {
        return {
          ok: false,
          message: "Vacante no encontrada",
        };
      }
    }

    let taskId: string | null = null;

    // Si es una tarea, crear la tarea primero
    if (isTask && title && description && assignedToId && dueDate) {
      const taskResult = await CreateTask({
        title,
        description,
        dueDate,
        assignedToId,
        notifyOnComplete,
        notificationRecipients,
      });

      if (!taskResult.ok) {
        return taskResult;
      }

      taskId = taskResult.taskId!;
    }

    // Crear el comentario
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        vacancyId,
        taskId,
      },
      include: {
        author: true,
        task: {
          include: {
            assignedTo: true,
            notificationRecipients: true,
          },
        },
        vacancy: true,
      },
    });

    return {
      ok: true,
      message: "Comentario creado exitosamente",
      comment,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      ok: false,
      message: "Error al crear el comentario",
    };
  }
}

export async function GetComments(vacancyId?: string) {
  try {
    const whereClause = vacancyId ? { vacancyId } : {};

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        author: true,
        task: {
          include: {
            assignedTo: true,
            notificationRecipients: true,
          },
        },
        vacancy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      ok: true,
      comments,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      ok: false,
      message: "Error al obtener comentarios",
    };
  }
}

export async function DeleteComment(commentId: string) {
  try {
    // Verificar que el comentario existe
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true },
    });

    if (!comment) {
      return {
        ok: false,
        message: "Comentario no encontrado",
      };
    }

    // Si el comentario tiene una tarea asociada, eliminar la tarea primero
    if (comment.taskId) {
      await prisma.task.delete({
        where: { id: comment.taskId },
      });
    }

    // Eliminar el comentario
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      ok: true,
      message: "Comentario eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      ok: false,
      message: "Error al eliminar el comentario",
    };
  }
}
