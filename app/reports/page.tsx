"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  LogIn,
  UserX,
  Key,
  UserCog,
  ChevronLeft,
} from "lucide-react";
import DashboardCard from "@/components/DashboardCard";

const reportCards = [
  {
    title: "Access Requests Report",
    href: "/reports/access-requests",
    icon: FileText,
    color: "blue" as const,
    description: "View and manage access requests from Access Governance",
  },
  {
    title: "Last Login Report",
    href: "/reports/last-login",
    icon: LogIn,
    color: "green" as const,
    description: "View last login activity and session reports",
  },
  {
    title: "Deleted Target Identity Report",
    href: "/reports/deleted-target-identity",
    icon: UserX,
    color: "purple" as const,
    description: "Report on deleted target identities and accounts",
  },
  {
    title: "User Permission Report",
    href: "/reports/user-permission",
    icon: Key,
    color: "indigo" as const,
    description: "View user permissions and entitlement reports",
  },
  {
    title: "Orphan Account Report",
    href: "/reports/orphan-account",
    icon: UserCog,
    color: "orange" as const,
    description: "Identify accounts without active owners or assignments",
  },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 md:px-6 max-w-7xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Choose a report to view</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              href={card.href}
              icon={card.icon}
              description={card.description}
              color={card.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
