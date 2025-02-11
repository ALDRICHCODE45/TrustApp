import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { leadsData } from "@/lib/data";
import { leadsColumns } from "./leadsColumns";

interface pageProps {}

export default async function LeadsPage({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={leadsColumns} data={leadsData} />
        </div>
      </div>
    </>
  );
}
