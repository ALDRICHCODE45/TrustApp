import { UserCard } from "@/components/UserCard";
import { type ReactElement } from "react";

export interface pageProps {}

export default function page({}: pageProps): ReactElement {
  return (
    <>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3">
          {/* USER CARDS */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="student" />
            <UserCard type="parent" />
            <UserCard type="teacher" />
            <UserCard type="staff" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/3">R</div>
      </div>
    </>
  );
}
