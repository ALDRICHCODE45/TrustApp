"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-400 ">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start  justify-between flex-col md:flex-row">
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};
