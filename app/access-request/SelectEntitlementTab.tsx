"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedApps } from "@/contexts/SelectedAppsContext";
import { useSelectedEntitlements, Entitlement } from "@/contexts/SelectedEntitlementsContext";

interface EntitlementRow {
  id: string;
  entitlementName: string;
  entitlementType: string;
  applicationName: string;
  description: string;
  risk: string;
  lastReviewed: string;
}

const SelectEntitlementTab: React.FC = () => {
  const { selectedApps } = useSelectedApps();
  const { selectedEntitlements: contextSelectedEntitlements, addEntitlement, removeEntitlement } = useSelectedEntitlements();
  const [searchQuery, setSearchQuery] = useState("");
  const [allEntitlements, setAllEntitlements] = useState<EntitlementRow[]>([]);
  const [selectedEntitlementIds, setSelectedEntitlementIds] = useState<Set<string>>(new Set());

  // Sync local selected IDs with context
  useEffect(() => {
    const ids = new Set(contextSelectedEntitlements.map((e) => e.id));
    setSelectedEntitlementIds(ids);
  }, [contextSelectedEntitlements]);

  // Mock data - replace with actual API call
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
      },
      {
        id: "2",
        entitlementName: "Finance Manager",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Access to financial management functions",
        risk: "Medium",
        lastReviewed: "2024-01-08",
      },
      {
        id: "3",
        entitlementName: "HR Recruiter",
        entitlementType: "Role",
        applicationName: "SAP HR",
        description: "Access to recruitment and candidate management",
        risk: "Low",
        lastReviewed: "2024-01-05",
      },
      {
        id: "4",
        entitlementName: "Employee Self-Service",
        entitlementType: "Profile",
        applicationName: "Workday",
        description: "Self-service access to employee information",
        risk: "Low",
        lastReviewed: "2024-01-12",
      },
      {
        id: "5",
        entitlementName: "Sales Representative",
        entitlementType: "Role",
        applicationName: "Salesforce CRM",
        description: "Access to sales opportunities and customer data",
        risk: "Medium",
        lastReviewed: "2024-01-09",
      },
      {
        id: "6",
        entitlementName: "IT Support",
        entitlementType: "Role",
        applicationName: "ServiceNow",
        description: "Access to IT service management and ticketing",
        risk: "Medium",
        lastReviewed: "2024-01-07",
      },
      {
        id: "7",
        entitlementName: "Read Only Access",
        entitlementType: "Permission",
        applicationName: "Active Directory",
        description: "Read-only access to directory information",
        risk: "Low",
        lastReviewed: "2024-01-11",
      },
      {
        id: "8",
        entitlementName: "Database Administrator",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Full access to database administration",
        risk: "High",
        lastReviewed: "2024-01-06",
      },
      {
        id: "9",
        entitlementName: "User Account Manager",
        entitlementType: "Role",
        applicationName: "Active Directory",
        description: "Manage user accounts and permissions",
        risk: "Medium",
        lastReviewed: "2024-01-09",
      },
      {
        id: "10",
        entitlementName: "Financial Analyst",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Access to financial reporting and analysis",
        risk: "Medium",
        lastReviewed: "2024-01-08",
      },
    ];
    setAllEntitlements(mockEntitlements);
  }, []);

  // Filter entitlements based on selected apps and search query
  const filteredData = useMemo(() => {
    let filtered = allEntitlements;

    // First filter by selected applications
    if (selectedApps.length > 0) {
      const selectedAppNames = selectedApps.map((app) => app.applicationName);
      filtered = filtered.filter((ent) => selectedAppNames.includes(ent.applicationName));
    } else {
      // If no apps selected, show empty or message
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
  }, [allEntitlements, selectedApps, searchQuery]);

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
        headerName: "Entitlement Name",
        field: "entitlementName",
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Type",
        field: "entitlementType",
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Application",
        field: "applicationName",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Description",
        field: "description",
        flex: 2,
        minWidth: 250,
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
      {
        headerName: "Last Reviewed",
        field: "lastReviewed",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params: any) => formatDate(params.value),
      },
    ],
    []
  );

  const onSelectionChanged = (event: any) => {
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
    <div className="p-6">
      {/* Message if no apps selected */}
      {selectedApps.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please select at least one application from the "Select App" tab to view entitlements.
          </p>
        </div>
      )}

      {/* Selected Apps Info */}
      {selectedApps.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Showing entitlements for {selectedApps.length} selected application(s): {selectedApps.map(a => a.applicationName).join(", ")}
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Entitlement Name, Type, Application, or Description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={selectedApps.length === 0}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none pr-10 ${
              selectedApps.length === 0 ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {searchQuery && selectedApps.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredData.length} of {allEntitlements.filter(e => selectedApps.some(a => a.applicationName === e.applicationName)).length} entitlements
          </p>
        )}
      </div>

      {/* Table */}
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={false}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          domLayout="normal"
          rowHeight={50}
          headerHeight={40}
        />
      </div>
    </div>
  );
};

export default SelectEntitlementTab;

