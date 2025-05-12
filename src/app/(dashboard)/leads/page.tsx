import { type ReactElement } from "react";
import { leadsColumns } from "../list/leads/leadsColumns";
import { CommercialTable } from "./table/CommercialTable";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { checkRoleRedirect } from "@/app/helpers/checkRoleRedirect";
import { ToastAlerts } from "@/components/ToastAlerts";
import prisma from "@/lib/db";
import { CreateLeadForm } from "../list/leads/components/CreateLeadForm";
import { LeadWithRelations } from "./kanban/page";

export interface pageProps {}

const fetchData = async (): Promise<{
  data: LeadWithRelations[];
  columns: typeof leadsColumns;
}> => {
  const leads = await prisma.lead.findMany({
    include: {
      generadorLeads: true,
      origen: true,
      sector: true,
      contactos: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return {
    columns: leadsColumns,
    data: leads,
  };
};

const fetchGeneradores = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["GL", "Admin", "MK"],
        },
      },
    });

    return users;
  } catch (err) {
    throw new Error("no se pueden fetchear los generadores");
  }
};
const fetchSectores = async () => {
  try {
    const sectores = await prisma.sector.findMany({
      select: { id: true, nombre: true },
    });
    return sectores;
  } catch (err) {
    throw new Error("No se pueden fetchear los sectores");
  }
};

const fetchOrigenes = async () => {
  try {
    const origenes = await prisma.leadOrigen.findMany({
      select: { id: true, nombre: true },
    });
    return origenes;
  } catch (err) {
    throw new Error("No se pueden fetchear los origenes");
  }
};

export default async function page({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchData();

  const session = await auth();

  if (!session) {
    throw new Error("User does not exists");
  }
  const generadores = await fetchGeneradores();

  const sectores = await fetchSectores();
  const origenes = await fetchOrigenes();

  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.GL, Role.MK]);

  const isAdmin = session?.user.role === Role.Admin;
  const activeUser = {
    name: session.user.name,
    id: session.user.id,
  };

  return (
    <>
      {/* LIST */}
      <ToastAlerts />
      <CreateLeadForm
        isAdmin={isAdmin}
        activeUser={activeUser}
        sectores={sectores}
        generadores={generadores}
        origenes={origenes}
      />
      <CommercialTable
        columns={columns}
        data={data}
        generadores={generadores}
      />
    </>
  );
}
