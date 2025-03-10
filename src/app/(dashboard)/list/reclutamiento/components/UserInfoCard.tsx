import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserIcon } from "lucide-react";

export const UserInfoCard = ({
  value,
  title,
}: {
  value: string | number;
  title: string;
}) => {
  return (
    <Card className="border-l-4 border-l-[#3b82f6] ">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start md:items-center  space-x-3">
          <div className="p-2 rounded-full bg-primary/10 hidden md:block">
            <UserIcon className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase font-medium">
            {title}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
};
