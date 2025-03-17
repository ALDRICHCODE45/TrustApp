import { type ReactElement } from "react";
import { Lead, leadsData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { leadsColumns } from "../list/leads/leadsColumns";
import { CreateLeadForm } from "../list/leads/components/CreateLeadForm";
import { CommercialTable } from "./table/CommercialTable";

export interface pageProps {}

const fetchLeads = async () => {
  return new Promise<{ columns: ColumnDef<Lead>[]; data: Lead[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: leadsColumns,
          data: leadsData,
        });
      }, 2000); // Retraso de 2 segundos
    },
  );
};

export default async function page({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchLeads();

  return (
    <>
      {/* LIST */}
      <CreateLeadForm />
      <CommercialTable columns={columns} data={data} />
    </>
  );
}
