"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedUsers, User } from "@/contexts/SelectedUsersContext";

interface UserRow {
  id: string;
  displayName: string;
  empId: string;
  manager: string;
  storeCode: string;
  brand: string;
  startDate: string;
}

const UserSearchTab: React.FC = () => {
  const { selectedUsers: contextSelectedUsers, addUser, removeUser } = useSelectedUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<UserRow[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: UserRow[] = [
      {
        id: "1",
        displayName: "John Smith",
        empId: "EMP001",
        manager: "Jane Doe",
        storeCode: "6067",
        brand: "Arby's",
        startDate: "2023-01-15",
      },
      {
        id: "2",
        displayName: "Jane Doe",
        empId: "EMP002",
        manager: "Bob Johnson",
        storeCode: "359422",
        brand: "Baskin-Robbins",
        startDate: "2022-05-20",
      },
      {
        id: "3",
        displayName: "Bob Johnson",
        empId: "EMP003",
        manager: "Alice Williams",
        storeCode: "359739",
        brand: "Buffalo Wild Wings",
        startDate: "2023-03-10",
      },
      {
        id: "4",
        displayName: "Alice Williams",
        empId: "EMP004",
        manager: "Charlie Brown",
        storeCode: "7749",
        brand: "Dunkin'",
        startDate: "2022-11-05",
      },
      {
        id: "5",
        displayName: "Charlie Brown",
        empId: "EMP005",
        manager: "Diana Prince",
        storeCode: "358682",
        brand: "Jimmy John's",
        startDate: "2023-06-18",
      },
      {
        id: "6",
        displayName: "Diana Prince",
        empId: "EMP006",
        manager: "John Smith",
        storeCode: "306008",
        brand: "SONIC",
        startDate: "2022-09-12",
      },
    ];
    setRowData(mockUsers);
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return rowData;
    }
    const query = searchQuery.toLowerCase();
    return rowData.filter((user) =>
      user.displayName.toLowerCase().includes(query) ||
      user.empId.toLowerCase().includes(query) ||
      user.manager.toLowerCase().includes(query) ||
      user.storeCode.toLowerCase().includes(query) ||
      user.brand.toLowerCase().includes(query)
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
        headerName: "Display Name",
        field: "displayName",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Emp ID",
        field: "empId",
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "Manager",
        field: "manager",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Store Code",
        field: "storeCode",
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Brand",
        field: "brand",
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Start Date",
        field: "startDate",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params: any) => formatDate(params.value),
      },
    ],
    []
  );

  const onRowClicked = (event: any) => {
    const userId = event.data.id;
    const isSelected = selectedRowIds.has(userId);

    if (isSelected) {
      setSelectedRowIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      removeUser(userId);
    } else {
      setSelectedRowIds((prev) => new Set(prev).add(userId));
      const user: User = {
        id: event.data.id,
        name: event.data.displayName,
        email: `${event.data.displayName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        username: event.data.empId,
        department: event.data.brand,
        jobTitle: "Employee",
        employeeId: event.data.empId,
      };
      addUser(user);
    }
  };

  const onSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    const newSelectedIds = new Set(selectedRows.map((row: UserRow) => row.id));
    setSelectedRowIds(newSelectedIds);

    // Update context
    selectedRows.forEach((row: UserRow) => {
      if (!contextSelectedUsers.find((u) => u.id === row.id)) {
        const user: User = {
          id: row.id,
          name: row.displayName,
          email: `${row.displayName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          username: row.empId,
          department: row.brand,
          jobTitle: "Employee",
          employeeId: row.empId,
        };
        addUser(user);
      }
    });

    // Remove unselected users
    contextSelectedUsers.forEach((user) => {
      if (!newSelectedIds.has(user.id)) {
        removeUser(user.id);
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
            placeholder="Search by Display Name, Emp ID, Manager, Store Code, or Brand..."
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
            Showing {filteredData.length} of {rowData.length} users
          </p>
        )}
      </div>

      {/* Table */}
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onRowClicked={onRowClicked}
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

export default UserSearchTab;
