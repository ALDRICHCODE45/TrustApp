import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          Alta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange("Media")}>
          Media
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange("Baja")}>
          Baja
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
