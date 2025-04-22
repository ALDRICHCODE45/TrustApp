"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, FilterIcon, SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Oficina, User } from "@prisma/client";
import { LeadWithRelations } from "../page";
import { Input } from "@/components/ui/input";

interface KanbanFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  generadores: User[];
  initialLeads: LeadWithRelations[];
}

export interface FilterState {
  generadorId: string | null;
  fechaProspeccion: Date | null;
  oficina: Oficina | null;
  searchTerm: string;
}

export function KanbanFilters({
  onFilterChange,
  generadores,
  initialLeads,
}: KanbanFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    generadorId: null,
    fechaProspeccion: null,
    oficina: null,
    searchTerm: "",
  });

  // Extract unique offices from generators
  const uniqueOffices = Array.from(
    new Set(generadores.map((gen) => gen.Oficina)),
  );

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      generadorId: null,
      fechaProspeccion: null,
      oficina: null,
      searchTerm: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.generadorId || filters.fechaProspeccion || filters.oficina;

  return (
    <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center">
          <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por empresa..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="pl-8 h-9 w-[200px]"
          />
        </div>

        {/* Generator filter */}
        <Select
          value={filters.generadorId || ""}
          onValueChange={(value) =>
            handleFilterChange("generadorId", value || null)
          }
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Generador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los generadores</SelectItem>
            {generadores.map((gen) => (
              <SelectItem key={gen.id} value={gen.id}>
                {gen.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Office filter */}
        <Select
          value={filters.oficina || "all"}
          onValueChange={(value) =>
            handleFilterChange("oficina", (value as Oficina) || null)
          }
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Oficina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las oficinas</SelectItem>
            {uniqueOffices.map((oficina) => (
              <SelectItem key={oficina} value={oficina}>
                {oficina}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal h-9",
                !filters.fechaProspeccion && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.fechaProspeccion ? (
                format(filters.fechaProspeccion, "PPP", { locale: es })
              ) : (
                <span>Fecha de prospección</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.fechaProspeccion || undefined}
              onSelect={(date) => handleFilterChange("fechaProspeccion", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
