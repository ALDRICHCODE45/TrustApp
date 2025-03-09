import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadStatus } from "@/lib/data";
import {
  Award,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Contact,
  UserRound,
  UserSearch,
} from "lucide-react";
import { useState } from "react";

export const LeadChangeStatus = ({ row }: { row: any }) => {
  const status = row.getValue("status") as LeadStatus;
  const [newStatus, setStatus] = useState(status);

  const handleStatusChange = (newStatus: LeadStatus) => {
    setStatus(newStatus);
    // Aquí se puede realizar cualquier acción adicional, como hacer una llamada a la API para actualizar el estado
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {newStatus}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.Contacto)}
          className="flex items-center space-x-2"
        >
          <Contact className="h-5 w-5 " />
          <span>Contacto</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.SocialSelling)}
          className="flex items-center space-x-2"
        >
          <UserRound className="h-5 w-5 " />
          <span>Social Selling</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.ContactoCalido)}
          className="flex items-center space-x-2"
        >
          <UserSearch className="h-5 w-5 " />
          <span>Contacto Calido</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.Prospecto)}
          className="flex items-center space-x-2"
        >
          <CalendarCheck className="h-5 w-5 " />
          <span>Prospecto</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.CitaAgendada)}
          className="flex items-center space-x-2"
        >
          <CalendarClock className="h-5 w-5" />
          <span>Cita Agendada</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.CitaValidada)}
          className="flex items-center space-x-2"
        >
          <Calendar className="h-5 w-5" />
          <span>Cita Validada</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(LeadStatus.Cliente)}
          className="flex items-center space-x-2"
        >
          <Award size={17} />
          <span>Cliente</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
