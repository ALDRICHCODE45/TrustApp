"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Ban,
  Loader2,
  RefreshCw,
  Settings,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  Notification,
  NotificationStatus,
  NotificationType,
  Prisma,
} from "@prisma/client";
import {
  NotificationFilters,
  NotificationFilters as NotificationFiltersType,
} from "@/components/notifications/NotificationFilters";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import {
  markAsReadNotification,
  deleteNotification,
  markAllAsRead,
  deleteAllRead,
  getNotificationStats,
} from "@/actions/notifications/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type NotificationWithTask = Prisma.NotificationGetPayload<{
  include: {
    task: {
      include: {
        assignedTo: true;
        notificationRecipients: true;
      };
    };
  };
}>;

export default function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationWithTask[]>(
    []
  );
  const [stats, setStats] = useState<{
    total: number;
    unread: number;
    read: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [isDeletingAllRead, setIsDeletingAllRead] = useState(false);
  const [filters, setFilters] = useState<NotificationFiltersType>({
    status: "ALL",
    type: "ALL",
    dateRange: undefined,
    search: "",
  });

  const userId = session?.user?.id;

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Construir parámetros de consulta
      const params = new URLSearchParams({
        userId,
        includeStats: "true",
      });

      if (filters.status !== "ALL") {
        params.append("status", filters.status);
      }
      if (filters.type !== "ALL") {
        params.append("type", filters.type);
      }
      if (filters.dateRange?.from) {
        params.append("dateFrom", filters.dateRange.from.toISOString());
      }
      if (filters.dateRange?.to) {
        params.append("dateTo", filters.dateRange.to.toISOString());
      }
      if (filters.search.trim()) {
        params.append("search", filters.search.trim());
      }

      const response = await fetch(`/api/notifications?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
        setStats(data.stats);
      } else {
        toast.error("Error al cargar las notificaciones");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Error al cargar las notificaciones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!userId) return;

    try {
      setIsMarkingRead(true);
      const result = await markAsReadNotification(notificationId);

      if (result.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, status: NotificationStatus.READ }
              : n
          )
        );

        // Actualizar estadísticas
        if (stats) {
          setStats({
            ...stats,
            unread: Math.max(0, stats.unread - 1),
            read: stats.read + 1,
          });
        }

        toast.success("Notificación marcada como leída");
      } else {
        toast.error(result.message || "Error al marcar como leída");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error al marcar como leída");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!userId) return;

    try {
      setIsDeleting(true);
      const result = await deleteNotification(notificationId);

      if (result.ok) {
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        // Actualizar estadísticas
        if (stats && deletedNotification) {
          const isUnread =
            deletedNotification.status === NotificationStatus.UNREAD;
          setStats({
            ...stats,
            total: stats.total - 1,
            unread: isUnread ? Math.max(0, stats.unread - 1) : stats.unread,
            read: !isUnread ? Math.max(0, stats.read - 1) : stats.read,
          });
        }

        toast.success("Notificación eliminada");
      } else {
        toast.error(result.message || "Error al eliminar");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;

    try {
      setIsMarkingAllAsRead(true);
      const result = await markAllAsRead(userId);

      if (result.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, status: NotificationStatus.READ }))
        );

        // Actualizar estadísticas
        if (stats) {
          setStats({
            ...stats,
            unread: 0,
            read: stats.total,
          });
        }

        toast.success(result.message);
      } else {
        toast.error(result.message || "Error al marcar todas como leídas");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Error al marcar todas como leídas");
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  const handleDeleteAllRead = async () => {
    if (!userId) return;

    try {
      setIsDeletingAllRead(true);
      const result = await deleteAllRead(userId);

      if (result.ok) {
        setNotifications((prev) =>
          prev.filter((n) => n.status === NotificationStatus.UNREAD)
        );

        // Actualizar estadísticas
        if (stats) {
          setStats({
            ...stats,
            total: stats.unread,
            read: 0,
          });
        }

        toast.success(result.message);
      } else {
        toast.error(result.message || "Error al eliminar las leídas");
      }
    } catch (error) {
      console.error("Error deleting all read:", error);
      toast.error("Error al eliminar las leídas");
    } finally {
      setIsDeletingAllRead(false);
    }
  };

  const handleFiltersChange = (newFilters: NotificationFiltersType) => {
    setFilters(newFilters);
  };

  // Cargar notificaciones al montar y cuando cambien los filtros
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, filters]);

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Centro de Notificaciones</h1>
            {stats && (
              <Badge variant="secondary" className="ml-2">
                {stats.total}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={fetchNotifications}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <NotificationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteAllRead={handleDeleteAllRead}
        isMarkingAllAsRead={isMarkingAllAsRead}
        isDeletingAllRead={isDeletingAllRead}
        stats={stats || undefined}
      />

      <Separator />

      {/* Lista de notificaciones */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando notificaciones...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center text-muted-foreground">
              <Ban className="h-12 w-12" />
              <div>
                <p className="text-lg font-medium">No hay notificaciones</p>
                <p className="text-sm">
                  {filters.status !== "ALL" ||
                  filters.type !== "ALL" ||
                  filters.search ||
                  filters.dateRange
                    ? "No se encontraron notificaciones con los filtros aplicados"
                    : "No tienes notificaciones por el momento"}
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2 p-4">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    isMarkingRead={isMarkingRead}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
