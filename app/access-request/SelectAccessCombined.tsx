"use client";
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Search, Check, User, Users } from "lucide-react";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";
import { useSelectedApps, App } from "@/contexts/SelectedAppsContext";
import { useSelectedEntitlements, Entitlement } from "@/contexts/SelectedEntitlementsContext";
import HorizontalTabs from "@/components/HorizontalTabs";

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

interface MirrorUser {
  id: string;
  name: string;
  email: string;
  username: string;
  department?: string;
  jobTitle?: string;
}

interface MirrorAccess {
  id: string;
  name: string;
  entitlementType: string;
  applicationName: string;
  description: string;
  risk: "Low" | "Medium" | "High";
}

const SelectAccessCombined: React.FC = () => {
  const { selectedApps: contextSelectedApps, addApp, removeApp } = useSelectedApps();
  const { selectedEntitlements: contextSelectedEntitlements, addEntitlement, removeEntitlement } = useSelectedEntitlements();
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [allApps, setAllApps] = useState<AppRow[]>([]);
  const [allEntitlements, setAllEntitlements] = useState<EntitlementRow[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [entitlementGridApi, setEntitlementGridApi] = useState<any>(null);
  const gridInitializedRef = useRef(false);
  
  // Mirror Access state
  const [mirrorSearchValue, setMirrorSearchValue] = useState("");
  const [mirrorSearchResults, setMirrorSearchResults] = useState<MirrorUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [selectedMirrorUser, setSelectedMirrorUser] = useState<MirrorUser | null>(null);
  const [mirrorUserAccess, setMirrorUserAccess] = useState<MirrorAccess[]>([]);
  const [selectedMirrorAccessIds, setSelectedMirrorAccessIds] = useState<Set<string>>(new Set());
  const [appliedAccessIds, setAppliedAccessIds] = useState<Set<string>>(new Set());

  // Sync local selected app IDs with context (one-way only)
  useEffect(() => {
    if (contextSelectedApps) {
      const ids = new Set(contextSelectedApps.map((a) => a.id));
      setSelectedAppIds(ids);
    }
  }, [contextSelectedApps]);

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

  // Memoize selected app names to prevent unnecessary recalculations
  const selectedAppNames = useMemo(() => {
    if (!contextSelectedApps || contextSelectedApps.length === 0) return [];
    return contextSelectedApps.map((app) => app.applicationName);
  }, [contextSelectedApps]);

  // Filter entitlements by selected apps only (without search query)
  const entitlementsForSelectedApps = useMemo(() => {
    if (selectedAppNames.length > 0) {
      return allEntitlements.filter((ent) => selectedAppNames.includes(ent.applicationName));
    }
    return [];
  }, [allEntitlements, selectedAppNames]);

  // Filter entitlements based on selected apps and search query
  const filteredEntitlements = useMemo(() => {
    let filtered = entitlementsForSelectedApps;

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
  }, [entitlementsForSelectedApps, searchQuery]);

  // Removed continuous sync useEffect to prevent blinking - selection is handled by onSelectionChanged only

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

  const onEntitlementSelectionChanged = useCallback((event: any) => {
    if (!event?.api) return;
    
    const selectedRows = event.api.getSelectedRows() || [];
    const selectedIds = new Set(selectedRows.map((row: EntitlementRow) => row.id));
    const currentIds = new Set(contextSelectedEntitlements.map((e) => e.id));
    
    // Add new selections
    selectedRows.forEach((row: EntitlementRow) => {
      if (row && !currentIds.has(row.id)) {
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

    // Remove unselected
    contextSelectedEntitlements.forEach((entitlement) => {
      if (!selectedIds.has(entitlement.id)) {
        removeEntitlement(entitlement.id);
      }
    });
  }, [contextSelectedEntitlements, addEntitlement, removeEntitlement]);

  // Mirror Access functions
  const mockUserSearch = (value: string): MirrorUser[] => {
    const mockUsers: MirrorUser[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        username: "jsmith",
        department: "IT",
        jobTitle: "Software Engineer",
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        username: "jdoe",
        department: "HR",
        jobTitle: "HR Manager",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        username: "bjohnson",
        department: "Finance",
        jobTitle: "Financial Analyst",
      },
      {
        id: "4",
        name: "Alice Williams",
        email: "alice.williams@example.com",
        username: "awilliams",
        department: "Sales",
        jobTitle: "Sales Manager",
      },
    ];

    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.username.toLowerCase().includes(value.toLowerCase())
    );
  };

  const mockRetrieveAccess = (userId: string): MirrorAccess[] => {
    // Return mock access based on user
    const mockAccess: MirrorAccess[] = [
      {
        id: `mirror-${userId}-1`,
        name: "Administrator",
        entitlementType: "Role",
        applicationName: "Active Directory",
        description: "Full administrative access to Active Directory",
        risk: "High",
      },
      {
        id: `mirror-${userId}-2`,
        name: "Finance Manager",
        entitlementType: "Role",
        applicationName: "Oracle ERP",
        description: "Access to financial management functions",
        risk: "Medium",
      },
      {
        id: `mirror-${userId}-3`,
        name: "HR Recruiter",
        entitlementType: "Role",
        applicationName: "SAP HR",
        description: "Access to recruitment and candidate management",
        risk: "Low",
      },
    ];
    return mockAccess;
  };

  const handleMirrorSearch = () => {
    if (mirrorSearchValue.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        const results = mockUserSearch(mirrorSearchValue);
        setMirrorSearchResults(results);
        setIsSearching(false);
      }, 500);
    }
  };

  const handleMirrorUserSelect = (user: MirrorUser) => {
    setSelectedMirrorUser(user);
    setMirrorUserAccess([]);
    setSelectedMirrorAccessIds(new Set());
    setAppliedAccessIds(new Set());
    setMirrorSearchResults([]);
  };

  const handleRetrieveMirrorAccess = () => {
    if (selectedMirrorUser) {
      setIsRetrieving(true);
      setTimeout(() => {
        const access = mockRetrieveAccess(selectedMirrorUser.id);
        setMirrorUserAccess(access);
        setIsRetrieving(false);
      }, 500);
    }
  };

  const handleMirrorAccessToggle = (accessId: string) => {
    setSelectedMirrorAccessIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(accessId)) {
        newSelected.delete(accessId);
      } else {
        newSelected.add(accessId);
      }
      return newSelected;
    });
  };

  const handleSelectAllMirrorAccess = () => {
    setSelectedMirrorAccessIds((prev) => {
      if (prev.size === mirrorUserAccess.length) {
        return new Set();
      } else {
        return new Set(mirrorUserAccess.map((a) => a.id));
      }
    });
  };

  const handleApplyMirrorAccess = () => {
    // Convert selected mirror access to entitlements and add to context
    const selectedIds = Array.from(selectedMirrorAccessIds);
    selectedIds.forEach((accessId) => {
      const access = mirrorUserAccess.find((a) => a.id === accessId);
      if (access && !contextSelectedEntitlements.find((e) => e.id === accessId)) {
        const entitlement: Entitlement = {
          id: access.id,
          entitlementName: access.name,
          entitlementType: access.entitlementType,
          applicationName: access.applicationName,
          description: access.description,
          risk: access.risk,
          lastReviewed: new Date().toISOString().split('T')[0],
          scope: "Mirrored Access",
        };
        addEntitlement(entitlement);
      }
    });
    
    // Mark applied access IDs and filter to show only applied items
    setAppliedAccessIds(new Set(selectedIds));
    
    // Clear mirror access selection after applying
    setSelectedMirrorAccessIds(new Set());
  };

  const handleMirrorKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMirrorSearch();
    }
  };

  // Applications & Entitlements Tab Component - Completely rewritten with minimal approach
  const ApplicationsEntitlementsTab: React.FC = () => {
    const [localSelectedEntitlementIds, setLocalSelectedEntitlementIds] = useState<Set<string>>(new Set());
    
    // Initialize local selection from context once on mount
    useEffect(() => {
      if (contextSelectedEntitlements.length > 0) {
        const ids = new Set(contextSelectedEntitlements.map((e) => e.id));
        setLocalSelectedEntitlementIds(ids);
      }
    }, []); // Only on mount

    // Handle entitlement selection
    const handleEntitlementToggle = useCallback((entitlementId: string) => {
      const isCurrentlySelected = localSelectedEntitlementIds.has(entitlementId);
      const entitlement = filteredEntitlements.find((e) => e.id === entitlementId);
      
      if (isCurrentlySelected) {
        // Remove from local state
        setLocalSelectedEntitlementIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(entitlementId);
          return newSet;
        });
        // Remove from context - use setTimeout to avoid render issues
        setTimeout(() => removeEntitlement(entitlementId), 0);
      } else if (entitlement) {
        // Add to local state
        setLocalSelectedEntitlementIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(entitlementId);
          return newSet;
        });
        // Add to context - use setTimeout to avoid render issues
        setTimeout(() => {
          const entitlementData: Entitlement = {
            id: entitlement.id,
            entitlementName: entitlement.entitlementName,
            entitlementType: entitlement.entitlementType,
            applicationName: entitlement.applicationName,
            description: entitlement.description,
            risk: entitlement.risk,
            lastReviewed: entitlement.lastReviewed,
            scope: entitlement.scope,
          };
          addEntitlement(entitlementData);
        }, 0);
      }
    }, [localSelectedEntitlementIds, filteredEntitlements, addEntitlement, removeEntitlement]);

    // Handle select all / deselect all
    const handleSelectAllEntitlements = useCallback(() => {
      const allSelected = filteredEntitlements.every((ent) => localSelectedEntitlementIds.has(ent.id));
      
      if (allSelected) {
        // Deselect all - batch update local state first
        const newSet = new Set(localSelectedEntitlementIds);
        const entitlementsToRemove: string[] = [];
        filteredEntitlements.forEach((ent) => {
          if (newSet.has(ent.id)) {
            newSet.delete(ent.id);
            entitlementsToRemove.push(ent.id);
          }
        });
        setLocalSelectedEntitlementIds(newSet);
        
        // Then remove from context
        setTimeout(() => {
          entitlementsToRemove.forEach((entId) => {
            removeEntitlement(entId);
          });
        }, 0);
      } else {
        // Select all - batch update local state first
        const newSet = new Set(localSelectedEntitlementIds);
        const entitlementsToAdd: Entitlement[] = [];
        filteredEntitlements.forEach((ent) => {
          if (!newSet.has(ent.id)) {
            newSet.add(ent.id);
            entitlementsToAdd.push({
              id: ent.id,
              entitlementName: ent.entitlementName,
              entitlementType: ent.entitlementType,
              applicationName: ent.applicationName,
              description: ent.description,
              risk: ent.risk,
              lastReviewed: ent.lastReviewed,
              scope: ent.scope,
            });
          }
        });
        setLocalSelectedEntitlementIds(newSet);
        
        // Then add to context
        setTimeout(() => {
          entitlementsToAdd.forEach((entitlementData) => {
            addEntitlement(entitlementData);
          });
        }, 0);
      }
    }, [filteredEntitlements, localSelectedEntitlementIds, addEntitlement, removeEntitlement]);

    return (
      <div className="flex gap-6 h-[600px] w-full">
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

        {/* Right Side - Entitlements List */}
        <div className="flex-1 flex flex-col min-w-0">
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
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search entitlements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllEntitlements}
                    disabled={filteredEntitlements.length === 0}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap flex-shrink-0 ${
                      filteredEntitlements.length === 0
                        ? "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
                        : filteredEntitlements.length > 0 && filteredEntitlements.every((ent) => localSelectedEntitlementIds.has(ent.id))
                        ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {filteredEntitlements.length > 0 && filteredEntitlements.every((ent) => localSelectedEntitlementIds.has(ent.id))
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Showing entitlements for: {contextSelectedApps.map(a => a.applicationName).join(", ")}
                    {filteredEntitlements.length > 0 && (
                      <span className="ml-2">({filteredEntitlements.length} available)</span>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>

          {contextSelectedApps.length > 0 && filteredEntitlements.length > 0 ? (
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="divide-y divide-gray-200">
                {filteredEntitlements.map((entitlement) => {
                  const isSelected = localSelectedEntitlementIds.has(entitlement.id);
                  return (
                    <div
                      key={entitlement.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          onClick={() => handleEntitlementToggle(entitlement.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{entitlement.entitlementName}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(entitlement.risk)}`}>
                              {entitlement.risk} Risk
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{entitlement.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Scope: {entitlement.scope}</span>
                            <span>•</span>
                            <span>Type: {entitlement.entitlementType}</span>
                            <span>•</span>
                            <span>App: {entitlement.applicationName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : contextSelectedApps.length > 0 ? (
            <div className="flex-1 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500">No entitlements found for selected applications</p>
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

  // Mirror Access Tab Component
  const MirrorAccessTab: React.FC = () => (
    <div className="w-full h-[600px] overflow-y-auto">
      {/* User Search Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search User
        </label>
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={mirrorSearchValue}
              onChange={(e) => setMirrorSearchValue(e.target.value)}
              onKeyPress={handleMirrorKeyPress}
              placeholder="Search by name, email, or username..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleMirrorSearch}
            disabled={!mirrorSearchValue.trim()}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mirrorSearchValue.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="mb-6 p-4 text-center text-gray-500">
          Searching users...
        </div>
      )}

      {!isSearching && mirrorSearchResults.length > 0 && !selectedMirrorUser && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Search Results ({mirrorSearchResults.length})
          </h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {mirrorSearchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleMirrorUserSelect(user)}
                  className="flex items-center gap-3 p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <span className="text-xs text-gray-500">({user.username})</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-gray-500 mt-1">
                        {user.department} {user.jobTitle && `• ${user.jobTitle}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected User Display */}
      {selectedMirrorUser && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{selectedMirrorUser.name}</p>
              <p className="text-sm text-gray-600">{selectedMirrorUser.email}</p>
              {selectedMirrorUser.department && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedMirrorUser.department} {selectedMirrorUser.jobTitle && `• ${selectedMirrorUser.jobTitle}`}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedMirrorUser(null);
                setMirrorUserAccess([]);
                setSelectedMirrorAccessIds(new Set());
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Change User
            </button>
          </div>
        </div>
      )}

      {/* Retrieve Access Button */}
      {selectedMirrorUser && mirrorUserAccess.length === 0 && (
        <div className="mb-6">
          <button
            onClick={handleRetrieveMirrorAccess}
            disabled={isRetrieving}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isRetrieving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isRetrieving ? "Retrieving..." : "Retrieve Access"}
          </button>
        </div>
      )}

      {/* User Access List */}
      {isRetrieving && (
        <div className="mb-6 p-4 text-center text-gray-500">
          Retrieving user access...
        </div>
      )}

      {mirrorUserAccess.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              {appliedAccessIds.size > 0 
                ? `Applied Access (${appliedAccessIds.size} of ${mirrorUserAccess.length})`
                : `User Access (${mirrorUserAccess.length})`
              }
            </h3>
            {appliedAccessIds.size === 0 && (
              <button
                onClick={handleSelectAllMirrorAccess}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedMirrorAccessIds.size === mirrorUserAccess.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {mirrorUserAccess
              .filter((access) => appliedAccessIds.size === 0 || appliedAccessIds.has(access.id))
              .map((access) => {
              const isSelected = selectedMirrorAccessIds.has(access.id);
              return (
                <div
                  key={access.id}
                  className={`flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition-colors ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      onClick={() => handleMirrorAccessToggle(access.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-800 font-medium">{access.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(access.risk)}`}>
                          {access.risk} Risk
                        </span>
                        {appliedAccessIds.has(access.id) && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{access.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{access.applicationName} • {access.entitlementType}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Apply Button */}
      {mirrorUserAccess.length > 0 && selectedMirrorAccessIds.size > 0 && appliedAccessIds.size === 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleApplyMirrorAccess}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
          >
            Apply Selected Access
          </button>
        </div>
      )}
    </div>
  );

  const tabs = [
    {
      label: "Applications & Entitlements",
      component: ApplicationsEntitlementsTab,
    },
    {
      label: "Mirror Access",
      component: MirrorAccessTab,
    },
  ];

  return (
    <div className="w-full">
      <HorizontalTabs
        tabs={tabs}
        activeIndex={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
};

export default SelectAccessCombined;

