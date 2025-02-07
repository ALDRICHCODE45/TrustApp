import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { parentsColumns } from "./columns";
import { parentsData } from "@/lib/data";

interface pageProps {}

export default async function ParentsPage({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={parentsColumns} data={parentsData} />
        </div>
      </div>
    </>
  );
}
