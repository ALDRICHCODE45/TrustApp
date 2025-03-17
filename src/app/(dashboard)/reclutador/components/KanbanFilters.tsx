import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

{
  /* interface KanbanFiltersProps { */
}
{
  /*   onFilterChange: (filters: any) => void; */
}
{
  /*   reclutadores: { id: number; name: string }[]; */
}
{
  /*   clientes: { id: number; cuenta: string }[]; */
}
{
  /*   tipos: string[]; */
}
{
  /* } */
}

export function KanbanFilters() {
  {
    /* const [filters, setFilters] = useState({ */
  }
  {
    /*   search: "", */
  }
  {
    /*   reclutador: "", */
  }
  {
    /*   cliente: "", */
  }
  {
    /*   tipo: "", */
  }
  {
    /*   fecha: null as Date | null, */
  }
  {
    /* }); */
  }

  {
    /* const handleFilterChange = (key: string, value: any) => { */
  }
  {
    /*   const newFilters = { ...filters, [key]: value }; */
  }
  {
    /*   setFilters(newFilters); */
  }
  {
    /*   onFilterChange(newFilters); */
  }
  {
    /* }; */
  }

  {
    /* const clearFilters = () => { */
  }
  {
    /*   const clearedFilters = { */
  }
  {
    /*     search: "", */
  }
  {
    /*     reclutador: "", */
  }
  {
    /*     cliente: "", */
  }
  {
    /*     tipo: "", */
  }
  {
    /*     fecha: null, */
  }
  {
    /*   }; */
  }
  {
    /*   setFilters(clearedFilters); */
  }
  {
    /*   onFilterChange(clearedFilters); */
  }
  {
    /* }; */
  }

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button
          variant="ghost"
          size="sm"
          //onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Input
            placeholder="Buscar vacante..."
            //value={filters.search}
            //onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Select
          //value={filters.reclutador}
          //onValueChange={(value) => handleFilterChange("reclutador", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Reclutador" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
          //value={filters.cliente}
          //onValueChange={(value) => handleFilterChange("cliente", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
          //value={filters.tipo}
          //onValueChange={(value) => handleFilterChange("tipo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {/* {filters.fecha ? ( */}
                {/*   format(filters.fecha, "PPP") */}
                {/* ) : ( */}
                {/*   <span>Fecha entrega</span> */}
                {/* )} */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                //selected={filters.fecha!}
                //onSelect={(date) => handleFilterChange("fecha", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
