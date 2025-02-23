import { UsersData } from "@/lib/data";
import { UserColumns } from "./columns";
import { DataTable } from "@/components/Table";

import { type ReactElement } from "react";

export interface pageProps {}

const getTeacherData = async () => {
  return UsersData;
};

export default function TeachersList({}: pageProps): ReactElement {
  return (
    <>
      <div className="dark:bg-[#0e0e0e] bg-white p-4 rounded-md  m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={UserColumns} data={UsersData} />
        </div>
      </div>
    </>
  );
}
