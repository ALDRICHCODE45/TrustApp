"use server";
import { checkSession } from "@/hooks/auth/checkSession";
import { parseWithZod } from "@conform-to/zod";
import { createUserSchema } from "@/zod/createUserSchema";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { editUserSchema } from "@/zod/editUserSchema";
import { Role } from "@prisma/client";

export const editUser = async (userId: string, formData: FormData) => {
  const session = await checkSession("/sing-in");

  if (session.user?.role !== Role.Admin) {
    throw Error("Unauthorize");
  }

  const submission = parseWithZod(formData, {
    schema: editUserSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw Error("User does not exists");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      age: submission.value.age || existingUser.age,
      celular: submission.value.celular || existingUser.celular,
      direccion: submission.value.direccion || existingUser.direccion,
      email: submission.value.email || existingUser.email,
      name: submission.value.name || existingUser.name,
      password: submission.value.password
        ? bcrypt.hashSync(submission.value.password, 10) // Si se pasa una nueva contraseña, la actualizamos
        : existingUser.password,
      Oficina: submission.value.oficina || existingUser.Oficina,
      State: submission.value.status || existingUser.State,
      role: submission.value.role || existingUser.role,
      image: submission.value.image || existingUser.image,
    },
  });

  revalidatePath("/list/users");
  revalidatePath(`/profile/${userId}`);
};

export const createUser = async (prevState: any, formData: FormData) => {
  await checkSession("/sign-in");

  const submission = parseWithZod(formData, {
    schema: createUserSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.create({
    data: {
      age: submission.value.age,
      celular: submission.value.celular,
      direccion: submission.value.direccion,
      email: submission.value.email,
      name: submission.value.name,
      password: bcrypt.hashSync(submission.value.password, 10),
      Oficina: submission.value.oficina,
      State: submission.value.status,
      role: submission.value.role,
      image: submission.value.image,
    },
  });

  revalidatePath("/list/users");
};
