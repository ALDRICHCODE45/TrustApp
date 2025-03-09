import { DataTable } from "@/components/Table";
import { type ReactElement } from "react";
import { leadsData, usuario_logeado } from "@/lib/data";
import { vistaLeadsColumns } from "./vistaLeadsColumns";

export interface pageProps {}

export default function page({}: pageProps): ReactElement {
  const leadsFiltradas = leadsData.filter(
    (lead) => lead.generadorLeads.id === usuario_logeado.id
  );

  return (
    <>
      {/* LIST */}
      <div className="mt-4">
        <DataTable columns={vistaLeadsColumns} data={leadsFiltradas} />
      </div>
    </>
  );
}
