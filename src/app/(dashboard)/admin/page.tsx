"use client";
import { Users, DollarSign } from "lucide-react";
import { AttendanceChart } from "@/components/AttendanceChart";
import { EmployeeDistribution } from "@/components/CountCharts";
import { StatCard } from "@/components/UserCard";
import { FinanceChart } from "@/components/FinanceChart";
import { EventCalendar } from "@/components/EventCalendar";
import { Announcments } from "@/components/Announcements";

export const userStatsMockData = {
  users: {
    title: "Usuarios",
    value: "1,234",
    trend: "up" as "up",
    icon: <Users />,
  },
  clients: {
    title: "Clientes",
    value: "853",
    trend: "up" as "up",
    icon: <Users />,
  },
  income: {
    title: "Ingresos",
    value: "$12,345",
    trend: "up" as "up",
    icon: <DollarSign />,
  },
  expenses: {
    title: "Egresos",
    value: "$5,432",
    trend: "down" as "down",
    icon: <DollarSign />,
  },
};

export default function Dashboard() {
  return (
    <div className="p-6 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STATS ROW */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard {...userStatsMockData.users} />
          <StatCard {...userStatsMockData.clients} />
          <StatCard {...userStatsMockData.income} />
          <StatCard {...userStatsMockData.expenses} />
        </div>
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DONUT CHART */}
          <div className="md:col-span-1">
            <EmployeeDistribution />
          </div>
          {/* BAR CHART */}
          <div className="md:col-span-2">
            <AttendanceChart />
          </div>
          {/* LINE CHART */}
          <div className="md:col-span-3">
            <FinanceChart />
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-6">
          <EventCalendar />
          <Announcments />
        </div>
      </div>
    </div>
  );
}
