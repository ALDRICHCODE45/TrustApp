import { vacantes } from "@/lib/data";
import { type ReactElement } from "react";
import { vacantesColumns } from "../list/reclutamiento/columns";
import { CreateVacanteForm } from "../list/reclutamiento/components/CreateVacanteForm";
import { RecruiterTable } from "../list/reclutamiento/table/RecruiterTable";

export interface PageProps {}

export default function VacantesPage({}: PageProps): ReactElement {
  return (
    <>
      {/* LIST */}
      <CreateVacanteForm />
      <RecruiterTable columns={vacantesColumns} data={vacantes} />
    </>
  );
}
