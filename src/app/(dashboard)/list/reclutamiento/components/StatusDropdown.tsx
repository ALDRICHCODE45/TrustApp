import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Lightbulb, MessageCircleOff, Search, Users } from "lucide-react";

export const StatusDropdown = ({
  status,
  onStatusChange,
}: {
  status: string;
  onStatusChange: (newStatus: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStatusChange("Hunting")}>
          <Users />
          Hunting
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Cancelada")}>
          <Ban />
          Cancelada
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Entrevistas")}>
          <Search />
          Entrevistas
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Perdida")}>
          <MessageCircleOff />
          Perdida
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Placement")}>
          <Lightbulb />
          Placement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
