import KanbanLeadsBoard from "./components/KanbanLeadsBoard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreateLeadForm } from "../../list/leads/components/CreateLeadForm";

function App() {
  return (
    <div className="min-h-screen">
      <header className=" border-b">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4">
            {/* Top row with logo and actions */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 " />
                <h1 className="text-2xl font-bold tracking-tight">
                  Gestión de Leads
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Total: <span className="font-semibold"> 8 leads</span>
                </Badge>
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <CreateLeadForm />
              </div>
            </div>

            {/* Separator line */}
            <Separator />

            {/* Bottom row with filters */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  Todos
                </Button>
                <Button variant="ghost" size="sm">
                  Sin asignar
                </Button>
                <Button variant="ghost" size="sm">
                  Mis leads
                </Button>
              </div>
              <div className="w-64">
                <Input
                  placeholder="Filtrar por nombre o empresa..."
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <KanbanLeadsBoard />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default App;
