import KanbanBoardPage from "../components/kanbanReclutadorBoard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function KanbanReclutadorPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4">
            {/* Top row with title and actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 w-full">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex-grow">
                  Seguimiento de Vacantes
                </h1>

                {/* Mobile actions dropdown */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Badge
                          variant="secondary"
                          className="text-sm px-3 py-1 mr-2"
                        >
                          Activas: <span className="font-semibold">12</span>{" "}
                          vacantes
                        </Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Vacante
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Activas: <span className="font-semibold">12</span> vacantes
                </Badge>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Vacante
                </Button>
              </div>
            </div>

            {/* Separator line */}
            <Separator />

            {/* Bottom row with filters and search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="my">Mis vacantes</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Buscar por puesto o departamento..."
                    className="h-8 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <KanbanBoardPage />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
