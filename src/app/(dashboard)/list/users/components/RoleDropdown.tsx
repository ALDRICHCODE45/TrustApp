import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/lib/data";
import { BadgeCent, DollarSign, Shield, UserRoundSearch } from "lucide-react";

export const RoleDropDown = ({
  role,
  onRoleChange,
}: {
  role: string;
  onRoleChange: (newRole: Role) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {role}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onRoleChange(Role.reclutador)}>
          <UserRoundSearch />
          Reclutador
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange(Role.generadorLeads)}>
          <DollarSign />
          G.L
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange(Role.admin)}>
          <Shield />
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange(Role.marketing)}>
          <BadgeCent />
          Marketing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
