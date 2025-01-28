import Image from "next/image";
import { type ReactElement } from "react";

export interface UserCardProps {
  type: string;
}

export function UserCard({ type }: UserCardProps): ReactElement {
  return (
    <>
      <div className="rounded-2xl odd:bg-alPurple even:bg-alYellow p-4 flex-1 min-w-[130px]">
        <div className="flex justify-between items-center">
          <span className="text-[10px] bg-white px-2 py-2 rounded-full text-green-600">
            2024/25
          </span>
          <Image src="/more.png" alt="" width={20} height={20} />
        </div>
        <h1 className="text-2xl font-semibold my-4">1,234</h1>
        <h1 className="capitalize text-sm font-medium text-gray-500">{type}</h1>
      </div>
    </>
  );
}
