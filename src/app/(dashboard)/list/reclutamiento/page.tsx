import { DataTable } from "@/components/Table";
import { type ReactElement } from "react";
import { vacantesColumns } from "./columns";
import { vacantes } from "@/lib/data";

export interface pageProps {}

export default function Reclutamiento({}: pageProps): ReactElement {
  return (
    <>
      <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md flex-1 m-4 mt-0 ">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={vacantesColumns} data={vacantes} />
        </div>
      </div>
    </>
  );
}
