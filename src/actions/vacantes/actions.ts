"use server";
import prisma from "@/lib/db";
import { VacancyTipo, VacancyEstado, VacancyPrioridad } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface VacancyFormData {
  tipo?: VacancyTipo;
  estado?: VacancyEstado;
  posicion?: string;
  prioridad?: VacancyPrioridad;
  fechaAsignacion?: Date;
  fechaEntrega?: Date;
  reclutadorId?: string;
  clienteId: string; // Hacer requerido según el esquema
  salario?: number;
  valorFactura?: number;
  fee?: number;
  monto?: number;
}

export const createVacancy = async (vacancy: VacancyFormData) => {
  try {
    if (!vacancy.reclutadorId) {
      return {
        ok: false,
        message: "El reclutador es requerido",
      };
    }

    if (!vacancy.clienteId) {
      return {
        ok: false,
        message: "El cliente es requerido",
      };
    }

    if (!vacancy.fechaAsignacion) {
      return {
        ok: false,
        message: "La fecha de asignación es requerida",
      };
    }

    if (!vacancy.posicion) {
      return {
        ok: false,
        message: "La posición es requerida",
      };
    }

    const newVacancy = await prisma.vacancy.create({
      data: {
        fechaAsignacion: vacancy.fechaAsignacion,
        posicion: vacancy.posicion,
        tipo: vacancy.tipo || "Nueva",
        estado: vacancy.estado || "Hunting",
        prioridad: vacancy.prioridad || "Alta",
        fechaEntrega: vacancy.fechaEntrega,
        salario: vacancy.salario,
        valorFactura: vacancy.valorFactura,
        fee: vacancy.fee,
        monto: vacancy.monto,
        reclutador: {
          connect: {
            id: vacancy.reclutadorId,
          },
        },
        cliente: {
          connect: {
            id: vacancy.clienteId,
          },
        },
      },
    });

    revalidatePath("/list/reclutamiento");
    revalidatePath("/reclutador");
    revalidatePath("/");
    return {
      ok: true,
      message: "Vacante creada correctamente",
      vacancy: newVacancy,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Error al crear la vacante");
  }
};
