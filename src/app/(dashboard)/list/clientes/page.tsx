import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { clientesColumns } from "./columns";
import { clientesData } from "@/lib/data";

interface pageProps {}

export default async function ClientesList({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="bg-white dark:bg-[#0e0e0e] p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={clientesColumns} data={clientesData} />
        </div>
      </div>
    </>
  );
}
