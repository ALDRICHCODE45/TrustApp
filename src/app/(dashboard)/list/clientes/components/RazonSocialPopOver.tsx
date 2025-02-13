import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye } from "lucide-react";

export function RazonSocialPopOver({ razon_social }: { razon_social: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Eye />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-55">
        {/* <CardDescription>{razon_social}</CardDescription> */}
        <span className="text-xs">{razon_social}</span>
      </PopoverContent>
    </Popover>
  );
}
