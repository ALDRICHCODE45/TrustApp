import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Status } from "@/lib/data";
import { Ban, CircleUser } from "lucide-react";

export const StateDropdown = ({
  state,
  onStateChange,
}: {
  state: Status;
  onStateChange: (newRole: Status) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {state}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStateChange(Status.active)}>
          <CircleUser />
          Activo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStateChange(Status.inactive)}>
          <Ban />
          Inactivo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
