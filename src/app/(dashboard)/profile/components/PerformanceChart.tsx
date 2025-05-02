"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Calendar, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLeadsUsers } from "@/actions/users/create-user";

// Definir los tipos principales
interface User {
  id: string;
  name: string;
}

interface PerformanceData {
  month: string;
  leads: number;
  clientes: number;
}

interface PerformanceStats {
  totalLeads: number;
  totalClientes: number;
  conversionRate: string;
}

interface ApiResponse {
  chartData: PerformanceData[];
  stats: PerformanceStats;
}

// Tipo para las opciones de rango de fecha
type DateRangeOption = "year" | "quarter" | "month" | "lastYear";

// Función para obtener datos de la API con tipado
const fetchLeadPerformanceData = async (
  userId: string,
  dateRange: DateRangeOption,
): Promise<PerformanceData[]> => {
  try {
    const response = await fetch(
      `/api/lead-performance?userId=${userId}&dateRange=${dateRange}`,
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.chartData || [];
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return [];
  }
};

export const LeadPerformanceChart: React.FC = () => {
  // Estados con tipado
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRangeOption>("year");
  const [data, setData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<PerformanceStats>({
    totalLeads: 0,
    totalClientes: 0,
    conversionRate: "0.00",
  });

  // Etiquetas para las opciones de rango de fecha
  const dateRangeLabels: Record<DateRangeOption, string> = {
    year: "Año 2025",
    quarter: "Trimestre actual",
    month: "Mes actual",
    lastYear: "Último año",
  };

  // Configuración del gráfico
  const chartConfig = {
    leads: { label: "Prospectos", color: "#94a3b8" },
    clientes: { label: "Clientes", color: "#3b82f6" },
  };

  // Obtener usuarios de la API cuando el componente se monta
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const response = await getLeadsUsers();
        const data: { users: User[] } = { users: response };
        setUsers(data.users);

        // Establecer el primer usuario como seleccionado si existen usuarios
        if (data.users && data.users.length > 0) {
          setSelectedUser(data.users[0].id);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Usuarios de respaldo en caso de que la API falle
        setUsers([
          { id: "user1", name: "Juan Pérez" },
          { id: "user2", name: "María García" },
          { id: "user3", name: "Carlos López" },
        ]);

        // Establecer el primer usuario de respaldo
        setSelectedUser("user1");
      }
    };

    fetchUsers();
  }, []);

  // Cargar datos cuando cambia el usuario o el rango de fecha
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!selectedUser) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/lead-performance?userId=${selectedUser}&dateRange=${dateRange}`,
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const responseData: ApiResponse = await response.json();
        setData(responseData.chartData || []);
        setStats(responseData.stats);
      } catch (error) {
        console.error("Error loading performance data:", error);
        setData([]);
        setStats({ totalLeads: 0, totalClientes: 0, conversionRate: "0.00" });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedUser, dateRange]);

  // Obtener el nombre del usuario según el ID seleccionado
  const getUserName = (userId: string): string => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Usuario";
  };

  // Calcular totales para mostrar en el footer
  const totalLeads = data.reduce((acc, cur) => acc + cur.leads, 0);
  const totalClientes = data.reduce((acc, cur) => acc + cur.clientes, 0);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">
              Rendimiento de Generador de Leads
            </CardTitle>
            <CardDescription>
              {getUserName(selectedUser)} - {dateRangeLabels[dateRange]}
            </CardDescription>
          </div>

          <div className="flex space-x-2">
            {/* Selección de usuario */}
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selección de rango de fecha */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{dateRangeLabels[dateRange]}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDateRange("month")}>
                  Mes actual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("quarter")}>
                  Trimestre actual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("year")}>
                  Año 2025
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("lastYear")}>
                  Último año
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={269}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                interval={dateRange === "month" ? 2 : 0}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                name="Prospectos"
                dataKey="leads"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                barSize={dateRange === "month" ? 8 : 16}
              />
              <Bar
                name="Clientes"
                dataKey="clientes"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={dateRange === "month" ? 8 : 16}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <div>Total de prospectos: {stats.totalLeads || totalLeads}</div>
          <div>
            Conversión a clientes: {stats.totalClientes || totalClientes} (
            {stats.conversionRate}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadPerformanceChart;
