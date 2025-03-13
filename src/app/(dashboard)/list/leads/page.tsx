import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { Lead, leadsData } from "@/lib/data";
import { leadsColumns } from "./leadsColumns";
import { CreateLeadForm } from "./components/CreateLeadForm";
import { ColumnDef } from "@tanstack/react-table";

interface pageProps {}
const fetchLeads = async () => {
  return new Promise<{ columns: ColumnDef<Lead>[]; data: Lead[] }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          columns: leadsColumns,
          data: leadsData,
        });
      }, 2000);
    },
  );
};

export default async function LeadsPage({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchLeads();

  return (
    <>
      {/* LIST */}
      <CreateLeadForm />
      <DataTable columns={columns} data={data} />
    </>
  );
}
