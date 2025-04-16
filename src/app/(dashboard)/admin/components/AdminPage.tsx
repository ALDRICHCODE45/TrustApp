"use client";
import { Users, DollarSign } from "lucide-react";
import { AttendanceChart } from "@/components/AttendanceChart";
import { EmployeeDistribution } from "@/components/CountCharts";
import { StatCard } from "@/components/UserCard";
import { FinanceChart } from "@/components/FinanceChart";
import { EventCalendar } from "@/components/EventCalendar";
import { Announcments } from "@/components/Announcements";
import Link from "next/link";

export const userStatsMockData = {
  users: {
    title: "Usuarios",
    value: 1234,
    icon: <Users />,
  },
  clients: {
    title: "Clientes",
    value: 853,
    icon: <Users />,
  },
  income: {
    title: "Ingresos",
    value: 12345,
    icon: <DollarSign />,
  },
  expenses: {
    title: "Egresos",
    value: 5432,
    icon: <DollarSign />,
  },
};

export function AdminPage({
  userCount,
  userId,
}: {
  userCount: number;
  userId: string;
}) {
  const userData = {
    title: "Usuarios",
    value: userCount,
    icon: <Users />,
  };

  return (
    <div className="p-6 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STATS ROW */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/list/users">
            <StatCard {...userData} />
          </Link>
          <Link href="/list/clientes">
            <StatCard {...userStatsMockData.clients} />
          </Link>
          <Link href="/list/facturas">
            <StatCard {...userStatsMockData.income} />
          </Link>
          <Link href="/list/cuentas">
            <StatCard {...userStatsMockData.expenses} />
          </Link>
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
          <EventCalendar userId={userId} />
          <Announcments />
        </div>
      </div>
    </div>
  );
}
