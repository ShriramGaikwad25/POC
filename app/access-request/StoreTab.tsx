"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";

interface StoreRow {
  id: string;
  storeName: string;
  storeNumber: string;
  location: string;
  brand: string;
  region: string;
  status: string;
}

const StoreTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<StoreRow[]>([]);
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockStores: StoreRow[] = [
      {
        id: "1",
        storeName: "Arby's Downtown",
        storeNumber: "ARB-001",
        location: "New York, NY",
        brand: "Arby's",
        region: "Northeast",
        status: "Active",
      },
      {
        id: "2",
        storeName: "Baskin-Robbins Main St",
        storeNumber: "BR-045",
        location: "Los Angeles, CA",
        brand: "Baskin-Robbins",
        region: "West",
        status: "Active",
      },
      {
        id: "3",
        storeName: "Buffalo Wild Wings Central",
        storeNumber: "BWW-123",
        location: "Chicago, IL",
        brand: "Buffalo Wild Wings",
        region: "Midwest",
        status: "Active",
      },
      {
        id: "4",
        storeName: "Dunkin' Express",
        storeNumber: "DD-789",
        location: "Houston, TX",
        brand: "Dunkin'",
        region: "South",
        status: "Active",
      },
      {
        id: "5",
        storeName: "Jimmy John's University",
        storeNumber: "JJ-234",
        location: "Phoenix, AZ",
        brand: "Jimmy John's",
        region: "West",
        status: "Active",
      },
      {
        id: "6",
        storeName: "SONIC Drive-In",
        storeNumber: "SON-567",
        location: "Philadelphia, PA",
        brand: "SONIC",
        region: "Northeast",
        status: "Active",
      },
    ];
    setRowData(mockStores);
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return rowData;
    }
    const query = searchQuery.toLowerCase();
    return rowData.filter((store) =>
      store.storeName.toLowerCase().includes(query) ||
      store.storeNumber.toLowerCase().includes(query) ||
      store.location.toLowerCase().includes(query) ||
      store.brand.toLowerCase().includes(query) ||
      store.region.toLowerCase().includes(query)
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
        headerName: "Store Name",
        field: "storeName",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Store Number",
        field: "storeNumber",
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Location",
        field: "location",
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
        headerName: "Region",
        field: "region",
        flex: 1,
        minWidth: 120,
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
    const newSelectedIds = new Set(selectedRows.map((row: StoreRow) => row.id));
    setSelectedStores(newSelectedIds);
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Store Name, Number, Location, Brand, or Region..."
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
            Showing {filteredData.length} of {rowData.length} stores
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

export default StoreTab;

