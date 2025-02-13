import { DataTable } from "@/components/Table";
import { logs } from "@/lib/data";
import { type ReactElement } from "react";
import { logsColumns } from "./logsColumns";

export interface pageProps {}

export default function Logspage({}: pageProps): ReactElement {
  return (
    <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* LIST */}
      <div className="mt-4">
        <DataTable columns={logsColumns} data={logs} />
      </div>
    </div>
  );
}
