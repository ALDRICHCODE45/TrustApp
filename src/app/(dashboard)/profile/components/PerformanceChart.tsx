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

export const LeadPerformanceChart = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [data, setData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configuración del gráfico
  const chartConfig = {
    contactos: { label: "Contactos", color: "#e2e8f0" },
    socialSelling: { label: "S.S", color: "#cbd5e1" },
    contactosCalidos: { label: "C.C", color: "#94a3b8" },
    citasAgendadas: { label: "C.A", color: "#64748b" },
    citasValidadas: { label: "C.V", color: "#475569" },
    citasAtendidas: { label: "C.At", color: "#334155" },
    asignadas: { label: "Asignadas", color: "#1e293b" },
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
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium ">Rendimiento</CardTitle>
            <CardDescription className="text-sm ">
              Progreso mensual
            </CardDescription>
          </div>
          <div className="w-40">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full border-gray-200 text-sm">
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
      <CardContent className="pb-4">
        {/* Contenedor con altura fija para evitar el salto */}
        <div className="w-full h-[320px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-white/90 backdrop-blur-sm z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
            </div>
          ) : null}

          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#f1f5f9"
                  opacity={0.6}
                />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  domain={[0, "dataMax + 10"]}
                />
                <ChartTooltip
                  cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      className="bg-white border border-gray-200 shadow-sm"
                    />
                  }
                />

                {Object.entries(chartConfig).map(([key, config]) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={config.color}
                    fillOpacity={0.4}
                    stroke={config.color}
                    strokeWidth={1.5}
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
