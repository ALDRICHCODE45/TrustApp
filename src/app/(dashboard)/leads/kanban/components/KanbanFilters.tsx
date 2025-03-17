import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadStatus } from "@/lib/data";
import { CalendarIcon, FilterIcon } from "lucide-react";

type KanbanFiltersProps = {
  onFilterChange: (filters: any) => void;
};

export const KanbanFilters: React.FC<KanbanFiltersProps> = ({
  onFilterChange,
}) => {
  return (
    <div className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 w-full border-b">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Leads Board</h2>
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Cliente Filter */}
          <Input placeholder="Buscar por cliente..." className="w-full" />

          {/* Generador de Leads Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Generador de Leads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="juan">Juan Pérez</SelectItem>
              <SelectItem value="maria">María García</SelectItem>
            </SelectContent>
          </Select>

          {/* Oficina Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Oficina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="oficina1">Oficina 1</SelectItem>
              <SelectItem value="oficina2">Oficina 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Estado Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.values(LeadStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <div className="flex gap-2">
            <Button variant="outline" className="w-full">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Fecha
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
