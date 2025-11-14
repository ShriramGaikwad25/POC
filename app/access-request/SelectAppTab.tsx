"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedApps, App } from "@/contexts/SelectedAppsContext";

interface AppRow {
  id: string;
  applicationName: string;
  applicationType: string;
  owner: string;
  department: string;
  status: string;
  lastSync: string;
}

const SelectAppTab: React.FC = () => {
  const { selectedApps: contextSelectedApps, addApp, removeApp } = useSelectedApps();
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<AppRow[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());

  // Sync local selected IDs with context
  useEffect(() => {
    const ids = new Set(contextSelectedApps.map((a) => a.id));
    setSelectedAppIds(ids);
  }, [contextSelectedApps]);

  // Mock data - replace with actual API call
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
    setRowData(mockApps);
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return rowData;
    }
    const query = searchQuery.toLowerCase();
    return rowData.filter((app) =>
      app.applicationName.toLowerCase().includes(query) ||
      app.applicationType.toLowerCase().includes(query) ||
      app.owner.toLowerCase().includes(query) ||
      app.department.toLowerCase().includes(query)
    );
  }, [rowData, searchQuery]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
        headerName: "Application Name",
        field: "applicationName",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Application Type",
        field: "applicationType",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Owner",
        field: "owner",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Department",
        field: "department",
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "Last Sync",
        field: "lastSync",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params: any) => formatDate(params.value),
      },
    ],
    []
  );

  const onSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    const newSelectedIds = new Set(selectedRows.map((row: AppRow) => row.id));
    setSelectedAppIds(newSelectedIds);

    // Add new apps to context
    selectedRows.forEach((row: AppRow) => {
      if (!contextSelectedApps.find((a) => a.id === row.id)) {
        const app: App = {
          id: row.id,
          applicationName: row.applicationName,
          applicationType: row.applicationType,
          owner: row.owner,
          department: row.department,
          status: row.status,
          lastSync: row.lastSync,
        };
        addApp(app);
      }
    });

    // Remove unselected apps from context
    contextSelectedApps.forEach((app) => {
      if (!newSelectedIds.has(app.id)) {
        removeApp(app.id);
      }
    });
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Application Name, Type, Owner, or Department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredData.length} of {rowData.length} applications
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

export default SelectAppTab;

