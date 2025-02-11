import { type ReactElement } from "react";
import { Button } from "./ui/button";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface AnnouncementsProps {}
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function Announcements({}: AnnouncementsProps): ReactElement {
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Nuevo mensaje",
      description: "You have a new message from John Doe",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Solicitud de amistad",
      description: "Jane Smith sent you a friend request",
      time: "Hace una hora",
      read: false,
    },
    {
      id: "3",
      title: "Actualizar el sistema",
      description: "Your system has been updated successfully",
      time: "hace 2 dias",
      read: true,
    },
  ];

  return (
    <>
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl ">Notificaciones</CardTitle>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 rounded-md p-3 transition-all ${
                  notification.read ? "bg-background" : "bg-muted"
                }`}
              >
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
