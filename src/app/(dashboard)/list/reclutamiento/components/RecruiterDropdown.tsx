import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export const RecruiterDropDown = ({
  reclutador,
  onReclutadorChange,
}: {
  reclutador: string;
  onReclutadorChange: (newReclutador: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {reclutador}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onReclutadorChange("Cesar Romero")}>
          <User />
          Cesar Romero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Aylin Perez")}>
          <User />
          Aylin Perez
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Rodrigo Herrera")}>
          <User />
          Rodrigo Herrera
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Manuel Morales")}>
          <User />
          Manuel Morales
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReclutadorChange("Melissa Flores")}>
          <User />
          Melissa Flores
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
