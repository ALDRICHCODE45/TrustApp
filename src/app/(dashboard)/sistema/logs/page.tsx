import { DataTable } from "@/components/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logs } from "@/lib/data";
import { Edit, Rss, Trash2, UploadCloud } from "lucide-react";
import { type ReactElement } from "react";
import { logsColumns } from "./logsColumns";

export interface pageProps {}

const getActionIcon = (action: string) => {
  switch (action) {
    case "Eliminar":
      return <Trash2 className="text-red-500" size={17} />;
    case "Actualizar":
      return <Edit className="text-blue-500" size={17} />;
    case "Publicar":
      return <UploadCloud className="text-green-500" size={17} />;
    default:
      return null;
  }
};
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
