import { DataTable } from "@/components/Table";
import { vacantes } from "@/lib/data";
import { type ReactElement } from "react";
import { vacantesColumns } from "../list/reclutamiento/columns";
import { CreateVacanteForm } from "../list/reclutamiento/components/CreateVacanteForm";

export interface PageProps {}

export default function StudentPage({}: PageProps): ReactElement {
  return (
    <>
      {/* LIST */}
      <CreateVacanteForm />
      <DataTable columns={vacantesColumns} data={vacantes} />
    </>
  );
}
