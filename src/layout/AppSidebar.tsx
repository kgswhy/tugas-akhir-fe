// src/layout/AppSidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useUrgentReminders } from "../context/UrgentReminderContext";

const navItems = [
  {
    name: "Reminder",
    path: "/dashboard/reminder",
  },
  {
    name: "Users",
    path: "/dashboard/users",
  },
  {
    name: "Customers",
    path: "/dashboard/customers",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { hasUrgentReminders } = useUrgentReminders();
  const pathname = usePathname();

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <nav className="flex flex-col gap-4 mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-2 rounded-lg relative ${pathname === item.path
                ? "bg-brand-500 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
          >
            <span className={`${!isExpanded && !isHovered ? "hidden" : ""}`}>
              {item.name}
            </span>
            {item.path === "/dashboard/reminder" && hasUrgentReminders && (
              <>
                {/* Dot for expanded state */}
                <span className={`absolute ${!isExpanded && !isHovered ? "hidden" : "block"} right-2 top-2 flex h-2 w-2`}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                {/* Dot for collapsed state */}
                <span className={`absolute ${!isExpanded && !isHovered ? "block" : "hidden"} right-2 top-1 flex h-2 w-2`}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;