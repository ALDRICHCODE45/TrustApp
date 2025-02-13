import { ReactElement } from "react";
import { DataTable } from "@/components/Table";
import { dataFactura } from "@/lib/data";
import { facturasColumns } from "./facturasColumns";

interface pageProps {}

export default async function FacturasPage({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="mt-4">
          <DataTable columns={facturasColumns} data={dataFactura} />
        </div>
      </div>
    </>
  );
}
