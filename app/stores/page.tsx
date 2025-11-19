"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(
  () => import("ag-grid-react").then((mod) => mod.AgGridReact),
  { ssr: false }
);
import {
  ColDef,
  GridApi,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-enterprise";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  ArrowRight,
  Plus,
  Search,
} from "lucide-react";
import { formatDateMMDDYY } from "@/utils/utils";
import "@/lib/ag-grid-setup";
import Accordion from "@/components/Accordion";
import Exports from "@/components/agTable/Exports";
import CustomPagination from "@/components/agTable/CustomPagination";
import { useRightSidebar } from "@/contexts/RightSidebarContext";
import { useRouter } from "next/navigation";
import HorizontalTabs from "@/components/HorizontalTabs";

interface DataItem {
  label: string;
  value: number;
  color?: string;
}

const dataStore: Record<string, DataItem[]> = {
  storeSummary: [
    { label: "Active Stores", value: 0 },
    { label: "Inactive Stores", value: 0 },
    { label: "Stores without Manager", value: 0 },
  ],
};

interface CustomGroupRow {
  id: string;
  storeName: string;
  storeNumber: string;
  location: string;
  brand: string;
  region: string;
  status: string;
}

// Custom Groups Tab Component
const CustomGroupsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<CustomGroupRow[]>([]);
  const gridApiRef = useRef<GridApi | null>(null);

  useEffect(() => {
    // Static data from Request Access - Store selection
    const mockStores: CustomGroupRow[] = [
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

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Store Name, Number, Location, Brand, or Region..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              gridApiRef.current?.setGridOption("quickFilterText", e.target.value);
            }}
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
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
          domLayout="normal"
          rowHeight={50}
          headerHeight={40}
        />
      </div>
    </div>
  );
};

// My Stores Tab Component
const MyStoresTab: React.FC = () => {
  const { openSidebar, closeSidebar } = useRightSidebar();
  const [mounted, setMounted] = useState(false);
  const gridApiRef = useRef<GridApi | null>(null);
  const [selected, setSelected] = useState<{ [key: string]: number | null }>(
    {}
  );
  const [storesRowData, setStoresRowData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  // Wrapper function to handle page changes and close sidebar
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    closeSidebar();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side pagination logic
  const totalItems = storesRowData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = storesRowData.slice(startIndex, endIndex);

  const handleSelect = (category: string, index: number) => {
    setSelected((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "storeId",
        headerName: "Store ID",
        flex: 1.5,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex flex-col gap-0">
            <span className="text-md text-gray-800">{params.value || "-"}</span>
          </div>
        ),
      },
      {
        field: "storeName",
        headerName: "Store Name",
        flex: 2,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex flex-col gap-0">
            <span className="text-md text-gray-800">{params.value || "-"}</span>
          </div>
        ),
      },
      {
        field: "manager",
        headerName: "Manager",
        flex: 2,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex flex-col gap-0">
            <span className="text-md text-gray-800">{params.value || "-"}</span>
          </div>
        ),
      },
      {
        field: "brand",
        headerName: "Brand",
        flex: 1.5,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex flex-col gap-0">
            <span className="text-md text-gray-800">{params.value || "-"}</span>
          </div>
        ),
      },
      {
        field: "address",
        headerName: "Address",
        flex: 2.5,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex flex-col gap-0">
            <span className="text-md text-gray-800">{params.value || "-"}</span>
          </div>
        ),
      },
      {
        field: "region",
        headerName: "Region",
        flex: 1.5,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex flex-col gap-0">
            <span className="text-md text-gray-800">{params.value || "-"}</span>
          </div>
        ),
      },
      {
        field: "operatingSince",
        headerName: "Operating Since",
        flex: 1.5,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value ? formatDateMMDDYY(params.value) : "-",
      },
      {
        field: "__action__",
        headerName: "Actions",
        width: 150,
        sortable: false,
        filter: false,
        suppressHeaderMenuButton: true,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex items-center gap-2 h-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Edit"
              aria-label="Edit store"
              onClick={() => {
                const row = params?.data || {};
                const EditStoreSidebar = () => {
                  const [storeType, setStoreType] = useState("");
                  const [changeOwner, setChangeOwner] = useState(false);

                  // Assign Store Owner state
                  const [ownerType, setOwnerType] = useState<"User" | "Group">("User");
                  const [selectedAttribute, setSelectedAttribute] = useState<string>("username");
                  const [searchValue, setSearchValue] = useState("");
                  const [selectedItem, setSelectedItem] = useState<Record<string, string> | null>(null);

                  const users: Record<string, string>[] = [
                    { username: "john", email: "john@example.com", role: "admin" },
                    { username: "jane", email: "jane@example.com", role: "user" },
                  ];
                  const groups: Record<string, string>[] = [
                    { name: "admins", email: "admins@corp.com", role: "admin" },
                    { name: "devs", email: "devs@corp.com", role: "developer" },
                  ];
                  const userAttributes = [
                    { value: "username", label: "Username" },
                    { value: "email", label: "Email" },
                  ];
                  const groupAttributes = [
                    { value: "name", label: "Group Name" },
                    { value: "role", label: "Role" },
                  ];
                  const sourceData = ownerType === "User" ? users : groups;
                  const currentAttributes = ownerType === "User" ? userAttributes : groupAttributes;
                  const filteredData =
                    searchValue.trim() === ""
                      ? []
                      : sourceData.filter((item) => {
                          const value = item[selectedAttribute];
                          return value?.toLowerCase().includes(searchValue.toLowerCase());
                        });
                  
                  return (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                          <div className="text-sm text-gray-700 break-words">
                            {row.storeName || "-"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Store Type</label>
                          <select 
                            value={storeType}
                            onChange={(e) => setStoreType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value=""></option>
                            <option value="Application Store">Application Store</option>
                            <option value="Repository Store">Repository Store</option>
                            <option value="Configuration Store">Configuration Store</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Change Store Owner</span>
                          <span className="text-sm text-gray-900">No</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={changeOwner}
                              onChange={(e) => setChangeOwner(e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                          </label>
                          <span className="text-sm text-gray-900">Yes</span>
                        </div>
                        {changeOwner && (
                          <div className="mt-2">
                            <div className="flex mt-3 bg-gray-100 p-1 rounded-md">
                              {(["User", "Group"] as const).map((type) => (
                                <button
                                  key={type}
                                  className={`flex-1 py-2.5 px-3 text-sm font-medium transition-colors ${
                                    ownerType === type
                                      ? "bg-white text-[#15274E] border border-gray-300 shadow-sm relative z-10 rounded-md"
                                      : "bg-transparent text-gray-500 hover:text-gray-700 rounded-md"
                                  }`}
                                  onClick={() => {
                                    setOwnerType(type);
                                    const initialAttr = type === "User" ? userAttributes[0] : groupAttributes[0];
                                    setSelectedAttribute(initialAttr?.value || "");
                                    setSearchValue("");
                                    setSelectedItem(null);
                                  }}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Select Attribute</label>
                              <div className="relative">
                                <select
                                  value={selectedAttribute}
                                  onChange={(e) => setSelectedAttribute(e.target.value)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {currentAttributes.map((attr) => (
                                    <option key={attr.value} value={attr.value}>
                                      {attr.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Search Value</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search" />
                              </div>
                            </div>
                            {searchValue.trim() !== "" && (
                              <div className="max-h-36 overflow-auto border rounded p-2 mt-3 text-sm bg-gray-50">
                                {filteredData.length === 0 ? (
                                  <p className="text-gray-500 italic">No results found.</p>
                                ) : (
                                  <ul className="space-y-1">
                                    {filteredData.map((item, index) => (
                                      <li key={index} className={`p-2 border rounded cursor-pointer transition-colors ${selectedItem === item ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"}`} onClick={() => {
                                        setSelectedItem(item);
                                        setSearchValue(item[selectedAttribute]);
                                      }}>
                                        {Object.values(item).join(" | ")}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex justify-center items-center p-3 border-t border-gray-200 bg-gray-50 min-h-[60px]">
                        <button 
                          onClick={() => { 
                            // Handle save logic here
                            console.log("Save clicked", { storeType, changeOwner, selectedItem });
                          }} 
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  );
                };
                
                openSidebar(<EditStoreSidebar />, { widthPx: 450 });
              }}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const row = params?.data || {};
                const InfoSidebar = () => {
                  const [sectionsOpen, setSectionsOpen] = useState({
                    general: true,
                  });
                  const scrollContainerRef = useRef<HTMLDivElement>(null);

                  useEffect(() => {
                    if (scrollContainerRef.current) {
                      const style = document.createElement('style');
                      style.id = 'hide-scrollbar-style';
                      if (!document.getElementById('hide-scrollbar-style')) {
                        style.textContent = `
                          .sidebar-scroll-container::-webkit-scrollbar {
                            display: none;
                          }
                        `;
                        document.head.appendChild(style);
                      }
                    }
                  }, []);

                  return (
                    <div className="flex flex-col h-full">
                      <div 
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto sidebar-scroll-container"
                        style={{
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                      >
                        {/* Header Section */}
                        <div className="p-4 border-b bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h2 className="text-lg font-semibold">Store Details</h2>
                              <div className="mt-2">
                                <span className="text-xs uppercase text-gray-500">
                                  Store Name:
                                </span>
                                <div className="text-md font-medium break-words break-all whitespace-normal max-w-full">
                                  {row.storeName || "-"}
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="text-xs uppercase text-gray-500">
                                  Store Type:
                                </span>
                                <div className="text-md font-medium break-words break-all whitespace-normal max-w-full">
                                  {row.storeType || "-"}
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="text-xs uppercase text-gray-500">
                                  Description:
                                </span>
                                <p className="text-sm text-gray-700 break-words break-all whitespace-pre-wrap max-w-full">
                                  {row.description || row.storeDescription || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* General Accordion Section */}
                        <div className="p-4 space-y-4">
                          <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                            <button
                              className="flex items-center justify-between w-full text-left text-md font-semibold text-gray-800 p-3 bg-gray-50 rounded-t-md"
                              onClick={() =>
                                setSectionsOpen((s: any) => ({ ...s, general: !s.general }))
                              }
                            >
                              <span>General</span>
                              {sectionsOpen.general ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronRight size={20} />
                              )}
                            </button>
                            {sectionsOpen.general && (
                              <div className="p-4 space-y-4">
                                <div className="flex space-x-4">
                                  <div className="flex-1">
                                    <label className="text-xs uppercase text-gray-500 font-medium">Owner</label>
                                    <div className="text-sm text-gray-900 mt-1 break-words">
                                      {row.owner || row.storeOwner || "N/A"}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs uppercase text-gray-500 font-medium">Last Updated</label>
                                    <div className="text-sm text-gray-900 mt-1">
                                      {row.lastUpdated ? formatDateMMDDYY(row.lastUpdated) : "N/A"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-4">
                                  <div className="flex-1">
                                    <label className="text-xs uppercase text-gray-500 font-medium">Status</label>
                                    <div className="text-sm text-gray-900 mt-1 break-words">
                                      {row.status || row.storeStatus || "N/A"}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs uppercase text-gray-500 font-medium">Location</label>
                                    <div className="text-sm text-gray-900 mt-1 break-words">
                                      {row.location || "N/A"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-4">
                                  <div className="flex-1">
                                    <label className="text-xs uppercase text-gray-500 font-medium">Repository URL</label>
                                    <div className="text-sm text-gray-900 mt-1 break-words">
                                      {row.repositoryUrl || row.repoUrl || "N/A"}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs uppercase text-gray-500 font-medium">Version</label>
                                    <div className="text-sm text-gray-900 mt-1 break-words">
                                      {row.version || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                };
                
                openSidebar(<InfoSidebar />, { widthPx: 500 });
              }}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Info"
              aria-label="View store details"
            >
              <ArrowRight
                color="#55544dff"
                size={20}
                className="transform scale-[0.9]"
              />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Fetch stores data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Convert date strings from MM/DD/YYYY to YYYY-MM-DD format for proper date handling
        const parseDate = (dateStr: string): string => {
          const [month, day, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };

        setStoresRowData([
          {
            storeId: "6067",
            storeName: "CNN Center",
            manager: "John Smith",
            brand: "Arby",
            address: "1 CNN Center, Atlanta",
            region: "SouthEast",
            operatingSince: parseDate("11/7/2014"),
          },
          {
            storeId: "358682",
            storeName: "Metropark Store",
            manager: "Aaron Smith",
            brand: "Dunkin",
            address: "499 Thornall Street, Edison",
            region: "NorthEast",
            operatingSince: parseDate("6/15/2010"),
          },
          {
            storeId: "359422",
            storeName: "Piedmont Store",
            manager: "Rob Harvey",
            brand: "Dunkin",
            address: "120 Piedmont Ave, Atlanta",
            region: "SouthEast",
            operatingSince: parseDate("9/16/2016"),
          },
          {
            storeId: "359739",
            storeName: "Moreland Store",
            manager: "Michael Freel",
            brand: "Dunkin",
            address: "1250 Moreland Ave SE",
            region: "SouthEast",
            operatingSince: parseDate("4/12/2015"),
          },
          {
            storeId: "7749",
            storeName: "Airport Store",
            manager: "John Willis",
            brand: "Arby",
            address: "6000 N Terminal Pkwy, Atlanta",
            region: "SouthEast",
            operatingSince: parseDate("7/12/2012"),
          },
        ]);
      } catch (error) {
        console.error("Error fetching stores data:", error);
        // Add same data on error
        const parseDate = (dateStr: string): string => {
          const [month, day, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };

        setStoresRowData([
          {
            storeId: "6067",
            storeName: "CNN Center",
            manager: "John Smith",
            brand: "Arby",
            address: "1 CNN Center, Atlanta",
            region: "SouthEast",
            operatingSince: parseDate("11/7/2014"),
          },
          {
            storeId: "358682",
            storeName: "Metropark Store",
            manager: "Aaron Smith",
            brand: "Dunkin",
            address: "499 Thornall Street, Edison",
            region: "NorthEast",
            operatingSince: parseDate("6/15/2010"),
          },
          {
            storeId: "359422",
            storeName: "Piedmont Store",
            manager: "Rob Harvey",
            brand: "Dunkin",
            address: "120 Piedmont Ave, Atlanta",
            region: "SouthEast",
            operatingSince: parseDate("9/16/2016"),
          },
          {
            storeId: "359739",
            storeName: "Moreland Store",
            manager: "Michael Freel",
            brand: "Dunkin",
            address: "1250 Moreland Ave SE",
            region: "SouthEast",
            operatingSince: parseDate("4/12/2015"),
          },
          {
            storeId: "7749",
            storeName: "Airport Store",
            manager: "John Willis",
            brand: "Arby",
            address: "6000 N Terminal Pkwy, Atlanta",
            region: "SouthEast",
            operatingSince: parseDate("7/12/2012"),
          },
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div
        className="ag-theme-alpine"
        style={{ width: "100%" }}
      >
        <div className="relative mb-2">
            <Accordion
              iconClass="top-1 right-0 rounded-full text-white bg-purple-800"
              open={true}
            >
              <div className="p-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-800">
                    Filters
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* First row - Store Summary (3 items) */}
                  <div className="flex">
                    {dataStore.storeSummary.map((item, index) => (
                      <div
                        key={`storeSummary-${index}`}
                        className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-colors bg-white border border-gray-200 w-1/3 ${
                          selected.storeSummary === index
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-100"
                        } ${item.color || ""}`}
                        onClick={() => handleSelect("storeSummary", index)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border-2"
                            style={{
                              borderColor: "#6EC6FF",
                              backgroundColor:
                                selected.storeSummary === index
                                  ? "#6EC6FF"
                                  : "transparent",
                            }}
                          ></div>
                          <span
                            className={`text-sm ${
                              selected.storeSummary === index
                                ? "text-blue-900"
                                : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            selected.storeSummary === index
                              ? "text-blue-700 border-blue-300"
                              : "text-gray-900 border-gray-300"
                          } bg-white border px-2 py-1 rounded text-xs min-w-[20px] text-center`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
          {/* Search bar and Export in the same row */}
          <div className="mb-2 relative z-10 pt-4">
            <div className="flex items-center justify-between mb-2">
              <input
                value={searchText}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchText(val);
                  gridApiRef.current?.setGridOption("quickFilterText", val);
                }}
                placeholder="Search..."
                className="border border-gray-300 rounded px-3 h-9 text-sm w-80"
              />
              <Exports gridApi={gridApiRef.current} />
            </div>
            <div className="flex justify-center">
              <CustomPagination
                totalItems={totalItems}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(newPageSize) => {
                  if (typeof newPageSize === "number") {
                    setPageSize(newPageSize);
                    setCurrentPage(1); // Reset to first page when changing page size
                  }
                  closeSidebar();
                }}
                pageSizeOptions={[10, 20, 50, 100]}
              />
            </div>
          </div>
          {mounted && (
            <AgGridReact
              rowData={paginatedData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="autoHeight"
              onGridReady={(params) => {
                gridApiRef.current = params.api;
              }}
            />
          )}
          <div className="flex justify-center">
            <CustomPagination
              totalItems={totalItems}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={(newPageSize) => {
                if (typeof newPageSize === "number") {
                  setPageSize(newPageSize);
                  setCurrentPage(1); // Reset to first page when changing page size
                }
                closeSidebar();
              }}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>

  );
};

// Main Stores Page Component
export default function StoresPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "My Stores",
      component: MyStoresTab,
    },
    {
      label: "Custom Groups",
      component: CustomGroupsTab,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-8 px-4">
        <div className="ag-theme-alpine" style={{ width: "100%" }}>
          <div className="relative mb-2">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
              <h1 className="text-xl font-bold text-blue-950">My Stores</h1>
              <button
                onClick={() => router.push("/stores/create")}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                title="Create Custom Group"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Group</span>
              </button>
            </div>
            <HorizontalTabs
              tabs={tabs}
              activeIndex={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
