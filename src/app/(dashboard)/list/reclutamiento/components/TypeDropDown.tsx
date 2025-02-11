import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCcw, SquarePlus } from "lucide-react";

export const TypeDropdown = ({
  tipo,
  onTipoChange,
}: {
  tipo: string;
  onTipoChange: (newReclutador: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {tipo}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onTipoChange("Nueva")}>
          <SquarePlus />
          Nueva
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTipoChange("Recompra")}>
          <RefreshCcw />
          Recompra
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
