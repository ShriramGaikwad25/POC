"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedLocations, Location } from "@/contexts/SelectedLocationsContext";

interface RegionRow {
  id: string;
  regionName: string;
  description: string;
  numberOfStores: number;
  states: string;
  status: string;
}

const RegionTab: React.FC = () => {
  const { selectedLocations, addLocation, removeLocation } = useSelectedLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<RegionRow[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRegions: RegionRow[] = [
      {
        id: "1",
        regionName: "Northeast",
        description: "Northeast region covering New York, Pennsylvania, and surrounding states",
        numberOfStores: 125,
        states: "NY, PA, NJ, CT, MA",
        status: "Active",
      },
      {
        id: "2",
        regionName: "Southeast",
        description: "Southeast region covering Florida, Georgia, and surrounding states",
        numberOfStores: 180,
        states: "FL, GA, SC, NC, TN",
        status: "Active",
      },
      {
        id: "3",
        regionName: "Midwest",
        description: "Midwest region covering Illinois, Ohio, and surrounding states",
        numberOfStores: 150,
        states: "IL, OH, MI, IN, WI",
        status: "Active",
      },
      {
        id: "4",
        regionName: "Southwest",
        description: "Southwest region covering Texas, Arizona, and surrounding states",
        numberOfStores: 200,
        states: "TX, AZ, NM, OK",
        status: "Active",
      },
      {
        id: "5",
        regionName: "West",
        description: "West region covering California, Washington, and surrounding states",
        numberOfStores: 220,
        states: "CA, WA, OR, NV",
        status: "Active",
      },
      {
        id: "6",
        regionName: "Mountain",
        description: "Mountain region covering Colorado, Utah, and surrounding states",
        numberOfStores: 95,
        states: "CO, UT, WY, MT",
        status: "Active",
      },
    ];
    setRowData(mockRegions);
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return rowData;
    }
    const query = searchQuery.toLowerCase();
    return rowData.filter((region) =>
      region.regionName.toLowerCase().includes(query) ||
      region.description.toLowerCase().includes(query) ||
      region.states.toLowerCase().includes(query)
    );
  }, [rowData, searchQuery]);

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
        headerName: "Region Name",
        field: "regionName",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Description",
        field: "description",
        flex: 2,
        minWidth: 300,
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
        headerName: "States",
        field: "states",
        flex: 1,
        minWidth: 200,
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
    const newSelectedIds = new Set(selectedRows.map((row: RegionRow) => row.id));
    setSelectedRegions(newSelectedIds);

    // Update context
    const currentSelectedIds = new Set(selectedLocations.filter(l => l.type === 'region').map(l => l.id));
    
    // Add new selections
    selectedRows.forEach((row: RegionRow) => {
      if (!currentSelectedIds.has(row.id)) {
        const location: Location = {
          id: row.id,
          name: row.regionName,
          type: 'region',
          description: row.description,
          numberOfStores: row.numberOfStores,
        };
        addLocation(location);
      }
    });

    // Remove unselected regions
    selectedLocations
      .filter(l => l.type === 'region' && !newSelectedIds.has(l.id))
      .forEach(location => removeLocation(location.id));
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Region Name, Description, or States..."
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
            Showing {filteredData.length} of {rowData.length} regions
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

export default RegionTab;

