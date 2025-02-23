import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export const GeneratorDropDown = ({
  generador,
  onGeneratorChange,
}: {
  generador: string;
  onGeneratorChange: (newGl: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User />
          {generador}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onGeneratorChange("Cesar Romero")}>
          <User />
          Cesar Romero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGeneratorChange("Aylin Perez")}>
          <User />
          Aylin Perez
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGeneratorChange("Rodrigo Herrera")}>
          <User />
          Rodrigo Herrera
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGeneratorChange("Manuel Morales")}>
          <User />
          Manuel Morales
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGeneratorChange("Melissa Flores")}>
          <User />
          Melissa Flores
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
