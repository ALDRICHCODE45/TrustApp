import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingDown, TrendingUp, TriangleRight } from "lucide-react";

export const PriorityDropdown = ({
  priority,
  onPriorityChange,
}: {
  priority: string;
  onPriorityChange: (newPriority: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {priority}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onPriorityChange("Alta")}>
          <TrendingUp />
          Alta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange("Media")}>
          <TriangleRight />
          Media
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange("Baja")}>
          <TrendingDown />
          Baja
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
