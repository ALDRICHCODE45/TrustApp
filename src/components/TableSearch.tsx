import Image from "next/image";
import { type ReactElement } from "react";

export interface TableSearchProps {}

export default function TableSearch({}: TableSearchProps): ReactElement {
  return (
    <>
      <div className=" w-full md:w-auto flex  items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="search logo" width={14} height={14} />
        <input
          type="text"
          placeholder="Search.."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
    </>
  );
}
