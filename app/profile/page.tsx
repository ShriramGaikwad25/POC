"use client";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import type { ColDef } from "ag-grid-enterprise";
import dynamic from "next/dynamic";
import "@/lib/ag-grid-setup";

// Dynamically import AgGridReact with SSR disabled
const AgGridReact = dynamic(() => import("ag-grid-react").then((mod) => mod.AgGridReact), {
  ssr: false,
});

type ProfileUser = {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  alias: string;
  phone?: string;
  title?: string;
  department?: string;
  startDate?: string;
  userType?: string;
  managerEmail?: string;
  tags: string[];
};

// Static user data - using current data as static
const getStaticUserData = (): ProfileUser => {
  return {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    displayName: "John Doe",
    alias: "jdoe",
    phone: "+1 (555) 123-4567",
    title: "Franchise Admin",
    department: "IT Department",
    startDate: "2023-01-15",
    userType: "Internal",
    managerEmail: "manager@example.com",
    tags: ["User", "Internal"],
  };
};

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  // Use static data instead of reading from localStorage
  const userData = getStaticUserData();

  // Ensure chart and grid render only on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const ProfileTab = () => {
    const initials = `${(userData.firstName || "")[0] || "U"}${(userData.lastName || "")[0] || ""}`.toUpperCase();
    const colors = ["#7f3ff0", "#0099cc", "#777", "#d7263d", "#ffae00"];
    // Ensure same color on server and initial client render to avoid hydration mismatch
    const bgColor = isMounted
      ? colors[(userData.email || "").length % colors.length]
      : colors[0];
    const displayedInitials = isMounted ? initials : "";

    return (
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Profile Picture - Centered */}
          <div className="flex-shrink-0 flex justify-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
              style={{ backgroundColor: bgColor }}
            >
              {displayedInitials}
            </div>
          </div>
          
          {/* User Details - Right Side */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">First Name</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.firstName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Name</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.lastName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{userData.email}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.displayName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alias</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.alias}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.phone || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.title}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.department}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.startDate || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">User Type</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.userType}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manager Email</label>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{userData.managerEmail}</p>
            </div>
            
            {userData.tags && userData.tags.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tags</label>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {userData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 border border-blue-300 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AllAccessTab = () => {
    // Static access data - using current data as static
    const staticRowData = [
      {
        entitlementName: "Administrator",
        entitlementType: "Role",
        application: "CRM System",
        accountName: "jdoe",
        lastLogin: "2025-01-15",
      },
      {
        entitlementName: "Editor",
        entitlementType: "Permission",
        application: "Document Management",
        accountName: "john.doe",
        lastLogin: "2025-01-14",
      },
      {
        entitlementName: "Viewer",
        entitlementType: "Role",
        application: "Analytics Dashboard",
        accountName: "jdoe",
        lastLogin: "2025-01-13",
      },
    ];

    const staticCols: ColDef[] = [
      { headerName: "Entitlement ", field: "entitlementName", flex: 1.5 },
      { headerName: "Type", field: "entitlementType", flex: 1 },
      { headerName: "Application", field: "application", flex: 1.2 },
      { headerName: "Account", field: "accountName", flex: 1.2 },
      {
        headerName: "Last Login",
        field: "lastLogin",
        flex: 1,
        valueFormatter: (p: any) => require("@/utils/utils").formatDateMMDDYYSlashes(p.value),
      },
    ];

    return (
      <div className="bg-white rounded-lg shadow-md p-3">
        {isMounted && (
          <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
              rowData={staticRowData}
              columnDefs={staticCols}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="space-y-6">
        <ProfileTab />
        <AllAccessTab />
      </div>
    </>
  );
}


