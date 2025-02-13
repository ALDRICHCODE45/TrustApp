import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type ReactElement } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

export interface UserCardProps {
  type: string;
}

export function UserCard({ type }: UserCardProps): ReactElement {
  return (
    <Card className="rounded-2xl odd:bg-[#c3ebfa]  even:bg-[#60a8fb] p-4 flex-1 min-w-[130px]">
      <CardHeader className="flex flex-row justify-between items-center p-0">
        {/* Badge for Year */}
        <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">
          2024/25
        </Badge>
        {/* Avatar for Icon */}
        <Button size="sm" variant="ghost">
          <Image src="/more.png" alt="More options" width={20} height={20} />
        </Button>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        {/* Main Number */}
        <CardTitle className="text-2xl font-semibold ">1,234</CardTitle>
        {/* Type Label */}
        <p className="capitalize text-sm font-medium text-gray-600 mt-2">
          {type}
        </p>
      </CardContent>
    </Card>
  );
}
