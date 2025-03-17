import { ReactElement } from "react";
import { Lead, leadsData } from "@/lib/data";
import { leadsColumns } from "./leadsColumns";
import { CreateLeadForm } from "./components/CreateLeadForm";
import { ColumnDef } from "@tanstack/react-table";
import { CommercialTable } from "../../leads/table/CommercialTable";

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
      <CommercialTable columns={columns} data={data} />
    </>
  );
}
