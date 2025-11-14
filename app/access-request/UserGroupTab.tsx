"use client";
import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedGroups, UserGroup } from "@/contexts/SelectedGroupsContext";

interface UserGroupRow {
  id: string;
  groupName: string;
  description: string;
  creationDate: string;
  numberOfUsers: number;
}

const UserGroupTab: React.FC = () => {
  const { selectedGroups: contextSelectedGroups, addGroup, removeGroup } = useSelectedGroups();
  const [rowData, setRowData] = useState<UserGroupRow[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());

  // Sync local selected IDs with context
  useEffect(() => {
    const ids = new Set(contextSelectedGroups.map((g) => g.id));
    setSelectedGroupIds(ids);
  }, [contextSelectedGroups]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockGroups: UserGroupRow[] = [
      {
        id: "1",
        groupName: "IT Administrators",
        description: "Group for IT administrators with system access",
        creationDate: "2023-01-15",
        numberOfUsers: 25,
      },
      {
        id: "2",
        groupName: "HR Managers",
        description: "Human resources management team",
        creationDate: "2023-02-20",
        numberOfUsers: 12,
      },
      {
        id: "3",
        groupName: "Finance Team",
        description: "Financial operations and accounting team",
        creationDate: "2023-03-10",
        numberOfUsers: 18,
      },
      {
        id: "4",
        groupName: "Sales Department",
        description: "Sales and business development team",
        creationDate: "2022-11-05",
        numberOfUsers: 45,
      },
      {
        id: "5",
        groupName: "Marketing Group",
        description: "Marketing and communications team",
        creationDate: "2023-06-18",
        numberOfUsers: 22,
      },
      {
        id: "6",
        groupName: "Executive Team",
        description: "Executive leadership and management",
        creationDate: "2022-09-12",
        numberOfUsers: 8,
      },
      {
        id: "7",
        groupName: "Store Managers",
        description: "Regional and store management personnel",
        creationDate: "2023-04-25",
        numberOfUsers: 150,
      },
      {
        id: "8",
        groupName: "Operations Team",
        description: "Operations and logistics management",
        creationDate: "2023-05-30",
        numberOfUsers: 35,
      },
    ];
    setRowData(mockGroups);
  }, []);

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
        headerName: "Group Name",
        field: "groupName",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Description",
        field: "description",
        flex: 2,
        minWidth: 250,
      },
      {
        headerName: "Creation Date",
        field: "creationDate",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => formatDate(params.value),
      },
      {
        headerName: "# of Users",
        field: "numberOfUsers",
        flex: 1,
        minWidth: 120,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => params.value?.toLocaleString() || "0",
      },
    ],
    []
  );

  const onRowClicked = (event: any) => {
    const groupId = event.data.id;
    if (selectedGroupIds.has(groupId)) {
      removeGroup(groupId);
    } else {
      const group: UserGroup = {
        id: event.data.id,
        groupName: event.data.groupName,
        description: event.data.description,
        creationDate: event.data.creationDate,
        numberOfUsers: event.data.numberOfUsers,
      };
      addGroup(group);
    }
  };

  const onSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    const newSelectedIds = new Set(selectedRows.map((row: UserGroupRow) => row.id));
    
    // Add new groups
    selectedRows.forEach((row: UserGroupRow) => {
      if (!contextSelectedGroups.find((g) => g.id === row.id)) {
        const group: UserGroup = {
          id: row.id,
          groupName: row.groupName,
          description: row.description,
          creationDate: row.creationDate,
          numberOfUsers: row.numberOfUsers,
        };
        addGroup(group);
      }
    });

    // Remove unselected groups
    contextSelectedGroups.forEach((group) => {
      if (!newSelectedIds.has(group.id)) {
        removeGroup(group.id);
      }
    });
  };

  // Sync ag-grid selection with context when rowData or context changes
  useEffect(() => {
    if (rowData.length > 0 && contextSelectedGroups.length > 0) {
      // This will be handled by the grid's internal selection state
      // The onSelectionChanged will keep them in sync
    }
  }, [rowData, contextSelectedGroups]);

  return (
    <div className="p-6">
      {/* Table */}
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onRowClicked={onRowClicked}
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={false}
          isRowSelectable={(params) => true}
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

export default UserGroupTab;
