import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { dataFactura, Factura } from "@/lib/data";
import { facturasColumns } from "./facturasColumns";
import { ColumnDef } from "@tanstack/react-table";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { checkRoleRedirect } from "../../../helpers/checkRoleRedirect";

interface pageProps {}

const fetchFacturas = async () => {
  return new Promise<{ columns: ColumnDef<Factura>[]; data: Factura[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: facturasColumns,
          data: dataFactura,
        });
      });
    },
  );
};

export default async function FacturasPage({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchFacturas();

  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
