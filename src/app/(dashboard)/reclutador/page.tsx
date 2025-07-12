import { type ReactElement } from "react";
import { RecruiterTable } from "../list/reclutamiento/table/RecruiterTableOptimized";
import {
  reclutadorColumns,
  VacancyWithRelations,
} from "./components/ReclutadorColumns";
import { ToastAlerts } from "@/components/ToastAlerts";
import { checkRoleRedirect } from "../../helpers/checkRoleRedirect";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import CreateVacanteForm from "../list/reclutamiento/components/CreateVacanteForm";
import prisma from "@/lib/db";

export interface PageProps {}
const fetchReclutadores = async () => {
  try {
    const reclutadores = await prisma.user.findMany({
      where: {
        role: Role.reclutador,
      },
    });
    return reclutadores;
  } catch (err) {
    console.log(err);
    throw new Error("Error al devolver los reclutadores");
  }
};

const fetchVacancies = async (): Promise<VacancyWithRelations[]> => {
  try {
    const vacantes = await prisma.vacancy.findMany({
      include: {
        reclutador: true,
        cliente: true,
        candidatoContratado: true,
        ternaFinal: true,
        Comments: {
          include: {
            author: true,
          },
        },
      },
    });
    return vacantes;
  } catch (err) {
    console.log(err);
    throw new Error("Error al devolver las vacantes");
  }
};

const fetchClientes = async () => {
  try {
    const clientes = await prisma.client.findMany();
    return clientes;
  } catch (err) {
    console.log(err);
    throw new Error("Error al devolver los clientes");
  }
};

export default async function VacantesPage({}: PageProps): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    redirect("sign/in");
  }
  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.reclutador]);

  const reclutadores = await fetchReclutadores();
  const vacantes = await fetchVacancies();
  const clientes = await fetchClientes();

  return (
    <>
      {/* LIST */}
      <ToastAlerts />
      <div className="flex justify-end mt-2 w-full">
        <CreateVacanteForm reclutadores={reclutadores} clientes={clientes} />
      </div>

      <RecruiterTable
        columns={reclutadorColumns}
        clientes={clientes}
        data={vacantes}
        reclutadores={reclutadores}
      />
    </>
  );
}
