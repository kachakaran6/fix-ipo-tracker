"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Building2,
  Menu,
} from "lucide-react";
import { AddIPOApplicationModal } from "@/components/add-ipo-application-modal";
import { AddIPONameModal } from "@/components/add-ipo-name-modal";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { IPOName } from "@/lib/types";

interface NavigationProps {
  ipoNames: IPOName[];
  onDataChange: () => void;
}

export function Navigation({ ipoNames, onDataChange }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ipos", label: "Applications", icon: FileText },
    // { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const renderNavItems = () =>
    navItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sm font-medium ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      );
    });

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden p-2 border-b">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IPO Tracker
              </span>
            </div>
            <nav className="flex flex-col space-y-1">{renderNavItems()}</nav>
            <div className="mt-auto pt-4 py-2 border-t px-4 w-full">
              <div className="flex flex-col gap-3">
                <AddIPONameModal onIPONameAdded={onDataChange} />
                <AddIPOApplicationModal
                  ipoNames={ipoNames}
                  onApplicationAdded={onDataChange}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:fixed md:flex-col md:w-64 md:h-screen md:overflow-y-auto border-r bg-white p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            IPO Tracker
          </span>
        </div>
        <nav className="flex flex-col space-y-1">{renderNavItems()}</nav>
        <div className="mt-auto pt-4 py-2 border-t px-4 w-full">
          <div className="flex flex-col gap-3">
            <AddIPONameModal onIPONameAdded={onDataChange} />
            <AddIPOApplicationModal
              ipoNames={ipoNames}
              onApplicationAdded={onDataChange}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
