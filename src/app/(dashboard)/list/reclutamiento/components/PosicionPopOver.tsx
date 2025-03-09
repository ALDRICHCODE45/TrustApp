import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BriefcaseBusiness, Info } from "lucide-react";

export function PosicionPopOver({ row }: { row: any }) {
  const puesto = row.original.puesto;

  return (
    <div className="flex items-center gap-2">
      <BriefcaseBusiness size={15} />
      <div className="max-w-[100px] truncate">{puesto}</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-6 w-6 p-0">
            <Info size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-1">
            <h4 className="font-medium">Detalles del puesto</h4>
            <p className="text-sm">{puesto}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
