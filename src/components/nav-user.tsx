"use client";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";

export function NavUser({
  user,
  hasPendingTasks,
}: {
  user: User;
  hasPendingTasks: boolean;
}) {
  const { isMobile } = useSidebar();
  const name = user.name;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name!!}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg object-contain">
                    {name ? name.slice(0, 2).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                {hasPendingTasks && (
                  <div className="absolute -right-1 -top-1">
                    <Badge
                      variant="outline"
                      className="h-4 w-4 rounded-full bg-white p-0 flex items-center justify-center"
                    >
                      <span
                        className="size-2.5 rounded-full bg-red-500 animate-pulse"
                        aria-hidden="true"
                      ></span>
                    </Badge>
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold ">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name!!}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.id}`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Perfil
                  {hasPendingTasks && (
                    <div className="absolute -left-1 -top-1">
                      <Badge
                        variant="outline"
                        className="h-4 w-4 rounded-full bg-white p-0 flex items-center justify-center"
                      >
                        <span
                          className="size-2.5 rounded-full bg-red-500 animate-pulse"
                          aria-hidden="true"
                        ></span>
                      </Badge>
                    </div>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
