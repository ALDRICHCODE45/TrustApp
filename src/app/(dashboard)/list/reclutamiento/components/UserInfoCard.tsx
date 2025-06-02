import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const UserInfoCard = ({
  value,
  title,
  truncate = false,
  maxLength = 50,
}: {
  value: string | number;
  title: string;
  truncate?: boolean;
  maxLength?: number;
}) => {
  const stringValue = String(value);
  const isLongContent = truncate && stringValue.length > maxLength;
  const displayValue = isLongContent
    ? `${stringValue.substring(0, maxLength)}...`
    : stringValue;

  return (
    <Card className="border-l-4 border-l-[#3b82f6]">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start md:items-center md:space-x-3">
          <div className="p-2 rounded-full bg-primary/10 hidden md:block">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase font-medium">
            {title}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLongContent ? (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <p className="text-sm font-semibold">{displayValue}</p>
                <span className="ml-1 text-xs text-primary">[Ver]</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="max-w-sm p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{title}</h4>
                <p className="text-sm break-words">{stringValue}</p>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <p className="text-sm font-semibold">{displayValue}</p>
        )}
      </CardContent>
    </Card>
  );
};
