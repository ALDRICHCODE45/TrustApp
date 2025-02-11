import { Announcements } from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import { EventCalendar } from "@/components/EventCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityList } from "@/components/ActivityList";
import { type ReactElement } from "react";

export interface PageProps {}

export default function StudentPage({}: PageProps): ReactElement {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Calendario y Actividades</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar" className="w-full h-full">
              <TabsList className="flex w-full">
                <TabsTrigger className="w-full" value="calendar">
                  Calendario
                </TabsTrigger>
                <TabsTrigger className="w-full" value="activities">
                  Actividades
                </TabsTrigger>
              </TabsList>
              <TabsContent value="calendar">
                <div className="h-[1200px]">
                  <BigCalendar />
                </div>
              </TabsContent>
              <TabsContent value="activities">
                <ActivityList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <EventCalendar />
          </CardContent>
        </Card>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <Announcements />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
