import { vacantes } from "@/lib/data";
import { type ReactElement } from "react";
import { RecruiterTable } from "../list/reclutamiento/table/RecruiterTable";
import { reclutadorColumns } from "./components/ReclutadorColumns";

export interface PageProps {}

export default function VacantesPage({}: PageProps): ReactElement {
  return (
    <>
      {/* LIST */}
      <RecruiterTable columns={reclutadorColumns} data={vacantes} />
    </>
  );
}
