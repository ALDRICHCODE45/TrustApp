import { ReactElement } from "react";
import Image from "next/image";
import { DataTable } from "@/components/Table";
import { StudentsColumns } from "./columns";
import { studentsData } from "@/lib/data";

interface pageProps {}

export default async function TeachersList({}: pageProps): Promise<ReactElement> {
  return (
    <>
      <div className="bg-white dark:bg-[#0e0e0e] p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="mt-4">
          <DataTable columns={StudentsColumns} data={studentsData} />
        </div>
      </div>
    </>
  );
}
