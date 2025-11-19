"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedLocations, Location } from "@/contexts/SelectedLocationsContext";

interface CustomGroupRow {
  id: string;
  groupName: string;
  description: string;
  createdBy: string;
  creationDate: string;
  numberOfStores: number;
  status: string;
}

const CustomGroupTab: React.FC = () => {
  const { selectedLocations, addLocation, removeLocation } = useSelectedLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<CustomGroupRow[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockGroups: CustomGroupRow[] = [
      {
        id: "1",
        groupName: "High Volume Stores",
        description: "Stores with sales above $1M annually",
        createdBy: "John Smith",
        creationDate: "2023-01-15",
        numberOfStores: 45,
        status: "Active",
      },
      {
        id: "2",
        groupName: "New Store Openings",
        description: "Stores opened in the last 6 months",
        createdBy: "Jane Doe",
        creationDate: "2023-02-20",
        numberOfStores: 12,
        status: "Active",
      },
      {
        id: "3",
        groupName: "Training Stores",
        description: "Designated stores for employee training",
        createdBy: "Bob Johnson",
        creationDate: "2023-03-10",
        numberOfStores: 18,
        status: "Active",
      },
      {
        id: "4",
        groupName: "24/7 Operations",
        description: "Stores operating 24 hours a day",
        createdBy: "Alice Williams",
        creationDate: "2022-11-05",
        numberOfStores: 35,
        status: "Active",
      },
      {
        id: "5",
        groupName: "Drive-Thru Only",
        description: "Stores with drive-thru service only",
        createdBy: "Charlie Brown",
        creationDate: "2023-06-18",
        numberOfStores: 22,
        status: "Active",
      },
      {
        id: "6",
        groupName: "Test Market Stores",
        description: "Stores used for testing new products and promotions",
        createdBy: "Diana Prince",
        creationDate: "2022-09-12",
        numberOfStores: 8,
        status: "Active",
      },
    ];
    setRowData(mockGroups);
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return rowData;
    }
    const query = searchQuery.toLowerCase();
    return rowData.filter((group) =>
      group.groupName.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query) ||
      group.createdBy.toLowerCase().includes(query)
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
        headerName: "Created By",
        field: "createdBy",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Creation Date",
        field: "creationDate",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => formatDate(params.value),
      },
      {
        headerName: "# of Stores",
        field: "numberOfStores",
        flex: 1,
        minWidth: 120,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => params.value?.toLocaleString() || "0",
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 100,
      },
    ],
    []
  );

  const onSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    const newSelectedIds = new Set(selectedRows.map((row: CustomGroupRow) => row.id));
    setSelectedGroups(newSelectedIds);

    // Update context
    const currentSelectedIds = new Set(selectedLocations.filter(l => l.type === 'customGroup').map(l => l.id));
    
    // Add new selections
    selectedRows.forEach((row: CustomGroupRow) => {
      if (!currentSelectedIds.has(row.id)) {
        const location: Location = {
          id: row.id,
          name: row.groupName,
          type: 'customGroup',
          description: row.description,
          numberOfStores: row.numberOfStores,
        };
        addLocation(location);
      }
    });

    // Remove unselected custom groups
    selectedLocations
      .filter(l => l.type === 'customGroup' && !newSelectedIds.has(l.id))
      .forEach(location => removeLocation(location.id));
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Group Name, Description, or Created By..."
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
            Showing {filteredData.length} of {rowData.length} custom groups
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

export default CustomGroupTab;

