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
  clientes: number;
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
    clientes: { label: "Clientes", color: "#3b82f6" },
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
        console.error("Error obteniendo usuarios:", error);
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

  // Obtener el nombre del usuario según el ID seleccionado
  const getUserName = (userId: string): string => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Usuario";
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">
              Rendimiento de Leads por Mes (2025)
            </CardTitle>
            <CardDescription>{getUserName(selectedUser)}</CardDescription>
          </div>
          <div>
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <div className="w-full h-full mt-4">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="mes"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    height={60}
                    tick={{ fontSize: 12 }}
                    textAnchor="end"
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />

                  <Area
                    dataKey="citasValidadas"
                    type="natural"
                    fill={chartConfig.citasValidadas.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.citasValidadas.color}
                    stackId="a"
                    name={chartConfig.citasValidadas.label}
                  />

                  <Area
                    dataKey="citasAgendadas"
                    type="natural"
                    fill={chartConfig.citasAgendadas.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.citasAgendadas.color}
                    stackId="a"
                    name={chartConfig.citasAgendadas.label}
                  />

                  <Area
                    dataKey="citasAtendidas"
                    type="natural"
                    fill={chartConfig.citasAtendidas.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.citasAtendidas.color}
                    stackId="a"
                    name={chartConfig.citasAtendidas.label}
                  />

                  <Area
                    dataKey="contactosCalidos"
                    type="natural"
                    fill={chartConfig.contactosCalidos.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.contactosCalidos.color}
                    stackId="a"
                    name={chartConfig.contactosCalidos.label}
                  />

                  <Area
                    dataKey="socialSelling"
                    type="natural"
                    fill={chartConfig.socialSelling.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.socialSelling.color}
                    stackId="a"
                    name={chartConfig.socialSelling.label}
                  />
                  <Area
                    dataKey="clientes"
                    type="natural"
                    fill={chartConfig.clientes.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.clientes.color}
                    stackId="a"
                    name={chartConfig.clientes.label}
                  />
                  <Area
                    dataKey="contactos"
                    type="natural"
                    fill={chartConfig.contactos.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.contactos.color}
                    stackId="a"
                    name={chartConfig.contactos.label}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
