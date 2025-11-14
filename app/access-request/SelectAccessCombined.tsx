"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, Check } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedApps, App } from "@/contexts/SelectedAppsContext";
import { useSelectedEntitlements, Entitlement } from "@/contexts/SelectedEntitlementsContext";

interface AppRow {
  id: string;
  applicationName: string;
  applicationType: string;
  owner: string;
  department: string;
  status: string;
  lastSync: string;
}

interface EntitlementRow {
  id: string;
  entitlementName: string;
  entitlementType: string;
  applicationName: string;
  description: string;
  risk: string;
  lastReviewed: string;
  scope: string;
}

const SelectAccessCombined: React.FC = () => {
  const { selectedApps: contextSelectedApps, addApp, removeApp } = useSelectedApps();
  const { selectedEntitlements: contextSelectedEntitlements, addEntitlement, removeEntitlement } = useSelectedEntitlements();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [allApps, setAllApps] = useState<AppRow[]>([]);
  const [allEntitlements, setAllEntitlements] = useState<EntitlementRow[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [selectedEntitlementIds, setSelectedEntitlementIds] = useState<Set<string>>(new Set());

  // Sync local selected IDs with context
  useEffect(() => {
    const ids = new Set(contextSelectedApps.map((a) => a.id));
    setSelectedAppIds(ids);
  }, [contextSelectedApps]);

  useEffect(() => {
    const ids = new Set(contextSelectedEntitlements.map((e) => e.id));
    setSelectedEntitlementIds(ids);
  }, [contextSelectedEntitlements]);

  // Mock data for apps
  useEffect(() => {
    const mockApps: AppRow[] = [
      {
        id: "1",
        applicationName: "Active Directory",
        applicationType: "Directory Service",
        owner: "IT Department",
        department: "IT",
        status: "Active",
        lastSync: "2024-01-15",
      },
      {
        id: "2",
        applicationName: "Oracle ERP",
        applicationType: "ERP System",
        owner: "Finance Team",
        department: "Finance",
        status: "Active",
        lastSync: "2024-01-14",
      },
      {
        id: "3",
        applicationName: "SAP HR",
        applicationType: "HR System",
        owner: "HR Department",
        department: "HR",
        status: "Active",
        lastSync: "2024-01-13",
      },
      {
        id: "4",
        applicationName: "Workday",
        applicationType: "HRIS",
        owner: "HR Department",
        department: "HR",
        status: "Active",
        lastSync: "2024-01-12",
      },
      {
        id: "5",
        applicationName: "Salesforce CRM",
        applicationType: "CRM",
        owner: "Sales Team",
        department: "Sales",
        status: "Active",
        lastSync: "2024-01-11",
      },
      {
        id: "6",
        applicationName: "ServiceNow",
        applicationType: "ITSM",
        owner: "IT Department",
        department: "IT",
        status: "Active",
        lastSync: "2024-01-10",
      },
    ];
    setAllApps(mockApps);
  }, []);

  // Mock data for entitlements
  useEffect(() => {
    const mockEntitlements: EntitlementRow[] = [
      {
        id: "1",
        entitlementName: "Administrator",
        entitlementType: "Role",
        applicationName: "Active Directory",
        description: "Full administrative access to Active Directory",
        risk: "High",
        lastReviewed: "2024-01-10",
        scope: "Global",
      },
      {
        id: "2",
        entitlementName: "Finance Manager",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Access to financial management functions",
        risk: "Medium",
        lastReviewed: "2024-01-08",
        scope: "Finance Department",
      },
      {
        id: "3",
        entitlementName: "HR Recruiter",
        entitlementType: "Role",
        applicationName: "SAP HR",
        description: "Access to recruitment and candidate management",
        risk: "Low",
        lastReviewed: "2024-01-05",
        scope: "HR Department",
      },
      {
        id: "4",
        entitlementName: "Employee Self-Service",
        entitlementType: "Profile",
        applicationName: "Workday",
        description: "Self-service access to employee information",
        risk: "Low",
        lastReviewed: "2024-01-12",
        scope: "All Employees",
      },
      {
        id: "5",
        entitlementName: "Sales Representative",
        entitlementType: "Role",
        applicationName: "Salesforce CRM",
        description: "Access to sales opportunities and customer data",
        risk: "Medium",
        lastReviewed: "2024-01-09",
        scope: "Sales Department",
      },
      {
        id: "6",
        entitlementName: "IT Support",
        entitlementType: "Role",
        applicationName: "ServiceNow",
        description: "Access to IT service management and ticketing",
        risk: "Medium",
        lastReviewed: "2024-01-07",
        scope: "IT Department",
      },
      {
        id: "7",
        entitlementName: "Read Only Access",
        entitlementType: "Permission",
        applicationName: "Active Directory",
        description: "Read-only access to directory information",
        risk: "Low",
        lastReviewed: "2024-01-11",
        scope: "Global",
      },
      {
        id: "8",
        entitlementName: "Database Administrator",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Full access to database administration",
        risk: "High",
        lastReviewed: "2024-01-06",
        scope: "IT Department",
      },
      {
        id: "9",
        entitlementName: "User Account Manager",
        entitlementType: "Role",
        applicationName: "Active Directory",
        description: "Manage user accounts and permissions",
        risk: "Medium",
        lastReviewed: "2024-01-09",
        scope: "IT Department",
      },
      {
        id: "10",
        entitlementName: "Financial Analyst",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Access to financial reporting and analysis",
        risk: "Medium",
        lastReviewed: "2024-01-08",
        scope: "Finance Department",
      },
    ];
    setAllEntitlements(mockEntitlements);
  }, []);

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!appSearchQuery.trim()) {
      return allApps;
    }
    const query = appSearchQuery.toLowerCase();
    return allApps.filter((app) =>
      app.applicationName.toLowerCase().includes(query) ||
      app.applicationType.toLowerCase().includes(query) ||
      app.owner.toLowerCase().includes(query) ||
      app.department.toLowerCase().includes(query)
    );
  }, [allApps, appSearchQuery]);

  // Filter entitlements based on selected apps and search query
  const filteredEntitlements = useMemo(() => {
    let filtered = allEntitlements;

    // First filter by selected applications
    if (contextSelectedApps.length > 0) {
      const selectedAppNames = contextSelectedApps.map((app) => app.applicationName);
      filtered = filtered.filter((ent) => selectedAppNames.includes(ent.applicationName));
    } else {
      // If no apps selected, show empty
      filtered = [];
    }

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ent) =>
        ent.entitlementName.toLowerCase().includes(query) ||
        ent.entitlementType.toLowerCase().includes(query) ||
        ent.applicationName.toLowerCase().includes(query) ||
        ent.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allEntitlements, contextSelectedApps, searchQuery]);

  const handleAppToggle = (app: AppRow) => {
    if (selectedAppIds.has(app.id)) {
      removeApp(app.id);
    } else {
      const appData: App = {
        id: app.id,
        applicationName: app.applicationName,
        applicationType: app.applicationType,
        owner: app.owner,
        department: app.department,
        status: app.status,
        lastSync: app.lastSync,
      };
      addApp(appData);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "",
        field: "select",
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: "left",
        filter: false,
        sortable: false,
      },
      {
        headerName: "Entitlement",
        field: "entitlementName",
        flex: 2,
        minWidth: 250,
        cellRenderer: (params: any) => {
          return (
            <div style={{ padding: '8px 0', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                {params.data.entitlementName}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.4' }}>
                {params.data.description}
              </div>
            </div>
          );
        },
        autoHeight: true,
        wrapText: true,
      },
      {
        headerName: "Scope",
        field: "scope",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Risk",
        field: "risk",
        flex: 1,
        minWidth: 100,
        cellRenderer: (params: any) => {
          const risk = params.value || "Unknown";
          return (
            <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(risk)}`}>
              {risk}
            </span>
          );
        },
      },
    ],
    []
  );

  const onEntitlementSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    const newSelectedIds = new Set(selectedRows.map((row: EntitlementRow) => row.id));
    setSelectedEntitlementIds(newSelectedIds);

    // Add new entitlements to context
    selectedRows.forEach((row: EntitlementRow) => {
      if (!contextSelectedEntitlements.find((e) => e.id === row.id)) {
        const entitlement: Entitlement = {
          id: row.id,
          entitlementName: row.entitlementName,
          entitlementType: row.entitlementType,
          applicationName: row.applicationName,
          description: row.description,
          risk: row.risk,
          lastReviewed: row.lastReviewed,
          scope: row.scope,
        };
        addEntitlement(entitlement);
      }
    });

    // Remove unselected entitlements from context
    contextSelectedEntitlements.forEach((entitlement) => {
      if (!newSelectedIds.has(entitlement.id)) {
        removeEntitlement(entitlement.id);
      }
    });
  };

  return (
    <div className="flex gap-6 h-[600px]">
      {/* Left Side - Applications List */}
      <div className="w-1/4 flex flex-col border-r border-gray-200 pr-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Applications</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={appSearchQuery}
              onChange={(e) => setAppSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredApps.map((app) => {
            const isSelected = selectedAppIds.has(app.id);
            return (
              <div
                key={app.id}
                onClick={() => handleAppToggle(app)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{app.applicationName}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredApps.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No applications found
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Entitlements Table */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            Entitlements
            {contextSelectedApps.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredEntitlements.length} available)
              </span>
            )}
          </h3>
          {contextSelectedApps.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                Please select at least one application from the left to view entitlements.
              </p>
            </div>
          )}
          {contextSelectedApps.length > 0 && (
            <>
              <div className="relative max-w-md mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search entitlements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {contextSelectedApps.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Showing entitlements for: {contextSelectedApps.map(a => a.applicationName).join(", ")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {contextSelectedApps.length > 0 ? (
          <div className="flex-1 ag-theme-alpine" style={{ minHeight: 0 }}>
            <AgGridReact
              rowData={filteredEntitlements}
              columnDefs={columnDefs}
              rowSelection="multiple"
              onSelectionChanged={onEntitlementSelectionChanged}
              suppressRowClickSelection={false}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
              domLayout="normal"
              getRowHeight={() => 80}
              headerHeight={40}
              suppressSizeToFit={false}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">Select an application to view entitlements</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectAccessCombined;

