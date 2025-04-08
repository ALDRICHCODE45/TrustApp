import { type ReactElement } from "react";
import { leadsColumns } from "../list/leads/leadsColumns";
import { CreateLeadForm } from "../list/leads/components/CreateLeadForm";
import { CommercialTable } from "./table/CommercialTable";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { checkRoleRedirect } from "../../helpers/checkRoleRedirect";
import { ToastAlerts } from "@/components/ToastAlerts";
import prisma from "@/lib/db";

export interface pageProps {}

const fetchData = async () => {
  const leads = await prisma.lead.findMany({
    include: {
      generadorLeads: true,
      contactos: true,
    },
  });
  return {
    columns: leadsColumns,
    data: leads,
  };
};

const fetchGeneradores = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["GL", "Admin", "MK"],
      },
    },
  });

  return users;
};

export default async function page({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchData();
  const session = await auth();
  const generadores = await fetchGeneradores();

  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.GL, Role.MK]);

  return (
    <>
      {/* LIST */}
      <ToastAlerts />
      <CreateLeadForm generadores={generadores} />
      <CommercialTable
        columns={columns}
        data={data}
        generadores={generadores}
      />
    </>
  );
}
