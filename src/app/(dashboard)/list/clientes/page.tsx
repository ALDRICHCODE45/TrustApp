import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { clientesColumns, ClientWithRelations } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { CreateClientModal } from "./components/CreateClienteModal";

interface pageProps {}

export const metadata: Metadata = {
  title: "Trust | Clientes",
};

const fetchUsers = async (): Promise<{
  columns: ColumnDef<ClientWithRelations>[];
  data: ClientWithRelations[];
}> => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        lead: {
          include: {
            origen: true,
          },
        },
        contactos: true,
        usuario: true,
        comentarios: true,
      },
    });

    return {
      columns: clientesColumns,
      data: clients,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los clientes");
  }
};

export default async function ClientesList({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchUsers();
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      {/* LIST */}
      <div className="flex justify-end mb-4">
        <CreateClientModal />
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}
