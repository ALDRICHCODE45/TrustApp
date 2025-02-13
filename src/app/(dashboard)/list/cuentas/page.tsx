import { ReactElement } from "react";
import { cuentaColumns } from "./cuentaColumns";
import { cuentaData } from "@/lib/data";
import { DataTable } from "@/components/Table";

interface pageProps {}

export default async function Cuentas({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={cuentaColumns} data={cuentaData} />
        </div>
      </div>
    </>
  );
}
