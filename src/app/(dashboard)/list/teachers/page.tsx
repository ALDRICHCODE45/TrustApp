import { teachersData } from "@/lib/data";
import { TeacherColumns } from "./columns";
import { DataTable } from "@/components/Table";

import { type ReactElement } from "react";

export interface pageProps {}

export const getTeacherData = async () => {
  return teachersData;
};

export default async function TeachersList({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={TeacherColumns} data={teachersData} />
        </div>
      </div>
    </>
  );
}
