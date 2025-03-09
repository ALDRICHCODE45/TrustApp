import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@/lib/data";
import { Row } from "@tanstack/react-table";
import { Info, MapPin } from "lucide-react";

export function AddressPopover({ row }: { row: Row<User> }) {
  const address = row.original.address;

  return (
    <div className="flex items-center gap-2">
      <MapPin size={15} className="hidden md:block" />
      <div className="max-w-[100px] truncate">{address}</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-6 w-6 p-0">
            <Info size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52">
          <div className="grid gap-1">
            <h4 className="font-medium">Dirección</h4>
            <p className="text-sm">{address}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
