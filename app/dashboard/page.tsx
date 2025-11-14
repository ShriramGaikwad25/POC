"use client";

import React from "react";
import { User, Key, Store, Users, Shield, Settings } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import "../dashboard.css";

export default function Dashboard() {
  const cards = [
    {
      title: "My Profile",
      href: "/profile",
      icon: User,
      color: "blue" as const,
      description: "View and manage your profile information",
    },
    {
      title: "Request Access",
      href: "/access-request",
      icon: Key,
      color: "green" as const,
      description: "Request access to applications and resources",
    },
    {
      title: "My Stores",
      href: "/stores",
      icon: Store,
      color: "purple" as const,
      description: "Manage your application stores and repositories",
    },
    {
      title: "My Users",
      href: "/user",
      icon: Users,
      color: "indigo" as const,
      description: "View and manage user accounts",
    },
    {
      title: "Roles",
      href: "/roles",
      icon: Shield,
      color: "orange" as const,
      description: "Manage roles and permissions",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      color: "gray" as const,
      description: "Configure application settings",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Quick access to your most used features</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
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
  );
}
