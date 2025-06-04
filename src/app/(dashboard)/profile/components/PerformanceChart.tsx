"use client";
import React, { useState, useEffect } from "react";
import {
  XAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
} from "recharts";
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
import { getLeadsUsers } from "@/actions/users/create-user";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getAnalitycsByUserAction } from "@/actions/leads/getLeadAnalitycsByUser";

// Definir los tipos principales
interface User {
  id: string;
  name: string;
}

interface PerformanceData {
  mes: string;
  contactos: number;
  socialSelling: number;
  contactosCalidos: number;
  citasAgendadas: number;
  citasValidadas: number;
  asignadas: number;
  citasAtendidas: number;
}

export const LeadPerformanceChart: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [data, setData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configuración del gráfico
  const chartConfig = {
    contactos: { label: "Contactos", color: "#94a3b8" },
    socialSelling: { label: "S.S", color: "#6366f1" },
    contactosCalidos: { label: "C.C", color: "#f59e0b" },
    citasAgendadas: { label: "C.A", color: "#ec4899" },
    citasValidadas: { label: "C.V", color: "#8b5cf6" },
    citasAtendidas: { label: "C.At", color: "#94a3b8" },
    asignadas: { label: "Asignadas", color: "#3b82f6" },
  };

  // Obtener usuarios cuando el componente se monta
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const response = await getLeadsUsers();
        setUsers(response);

        // Establecer el primer usuario como seleccionado si existen usuarios
        if (response && response.length > 0) {
          setSelectedUser(response[0].id);
        }
      } catch (error) {
        // Usuarios de respaldo en caso de que la API falle
        const backupUsers = [
          { id: "user1", name: "Juan Pérez" },
          { id: "user2", name: "María García" },
          { id: "user3", name: "Carlos López" },
        ];
        setUsers(backupUsers);
        setSelectedUser(backupUsers[0].id);
      }
    };

    fetchUsers();
  }, []);

  // Cargar datos cuando cambia el usuario seleccionado
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!selectedUser) return;

      setIsLoading(true);
      try {
        const performanceData = await getAnalitycsByUserAction(selectedUser);

        setData(performanceData || []);
      } catch (error) {
        console.error("Error cargando datos de rendimiento:", error);
        setData([]);
        throw new Error("Error cargando los datos de rendimiento");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedUser]);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">Rendimiento de Leads</CardTitle>
            <CardDescription>
              Visualiza tu rendimiento y progreso
            </CardDescription>
          </div>
          <div className="w-40">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Contenedor con altura fija para evitar el salto */}
        <div className="w-full h-[378px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-white/80 backdrop-blur-sm z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : null}

          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />

                {Object.entries(chartConfig).map(([key, config]) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={config.color}
                    fillOpacity={0.2}
                    stroke={config.color}
                    strokeWidth={2}
                    stackId="a"
                    name={config.label}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
