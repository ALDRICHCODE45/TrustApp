import { DataTable } from "@/components/Table";
import { logs } from "@/lib/data";
import { type ReactElement } from "react";
import { logsColumns } from "./components/logsColumns";

export interface pageProps {}

export default function Logspage({}: pageProps): ReactElement {
  return (
    <>
      {/* LIST */}
      <DataTable columns={logsColumns} data={logs} />
    </>
  );
}
