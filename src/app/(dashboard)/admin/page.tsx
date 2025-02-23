import { Announcements } from "@/components/Announcements";
import { AttendanceChart } from "@/components/AttendanceChart";
import { CountCharts } from "@/components/CountCharts";
import { EventCalendar } from "@/components/EventCalendar";
import { FinanceChart } from "@/components/FinanceChart";
import { UserCard } from "@/components/UserCard";
import { type ReactElement } from "react";

export interface pageProps {}

export default function AdminPage({}: pageProps): ReactElement {
  return (
    <>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* USER CARDS */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="Charly" />
            <UserCard type="Clientes" />
            <UserCard type="Ingresos" />
            <UserCard type="Egresos" />
          </div>
          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHARTS */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountCharts />
            </div>
            {/* ATTENDANCE CHARTS */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          {/* BOTTOM CHARTS */}
          <div className="w-full h-[500px]">
            <FinanceChart />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          <Announcements />
        </div>
      </div>
    </>
  );
}
