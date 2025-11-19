"use client";

import { BackButton } from "@/components/BackButton";
import { UserPlus, LayoutTemplate, ChevronDown } from "lucide-react";
import CustomPagination from "@/components/agTable/CustomPagination";
import { useEffect, useState } from "react";

interface RoleInfo {
  name: string;
  description: string;
}

const REGIONAL_ROLES: RoleInfo[] = [
  { name: "District Manager", description: "Oversees multiple stores within a district, manages operations, and ensures compliance with company standards." },
  { name: "Region Leaders", description: "Leads regional operations, coordinates district managers, and implements strategic initiatives across the region." },
  { name: "VPs", description: "Vice Presidents responsible for high-level strategic planning, decision-making, and organizational leadership." },
  { name: "Support Teams", description: "Provides operational support, training, and assistance to stores and regional management teams." },
];

const STORE_ROLES: RoleInfo[] = [
  { name: "Store manager", description: "Manages daily store operations, staff scheduling, inventory, and customer service standards." },
  { name: "Bar manager", description: "Oversees bar operations, manages bar staff, inventory, and ensures quality beverage service." },
  { name: "Assistant managers", description: "Assists store manager with daily operations, staff supervision, and administrative tasks." },
  { name: "Shift leaders", description: "Leads shifts, supervises staff during assigned periods, and ensures operational standards are met." },
];

const CORPORATE_ROLES: RoleInfo[] = [
  { name: "Franchise Admin", description: "Manages franchise operations, relationships, compliance, and administrative processes for franchise locations." },
  { name: "Technology manager", description: "Oversees IT infrastructure, systems, technology implementations, and technical support across the organization." },
  { name: "customer service manager", description: "Manages customer service operations, handles escalations, and ensures high-quality customer experience." },
];

type CategoryTabKey = "regional" | "store" | "corporate";
type TabKey = "users" | "privileges" | "scope";

const ROLE_CATEGORIES: Record<CategoryTabKey, RoleInfo[]> = {
  regional: REGIONAL_ROLES,
  store: STORE_ROLES,
  corporate: CORPORATE_ROLES,
};

// Default privileges available in the system
const DEFAULT_PRIVILEGES = [
  "View Reports",
  "Manage Users",
  "Manage Stores",
  "View Analytics",
  "Manage Inventory",
  "Manage Access Requests",
  "Approve Access Requests",
  "Manage Roles",
  "View Audit Logs",
  "Manage Settings",
  "Export Data",
  "Manage Permissions",
  "View Dashboard",
  "Manage Certifications",
  "Manage Applications",
  "Manage Entitlements",
  "Manage Groups",
  "View User Details",
  "Manage Schedules",
  "Manage Policies",
];

// Default privileges for each role
const DEFAULT_ROLE_PRIVILEGES: Record<string, string[]> = {
  // Regional Roles
  "District Manager": ["View Reports", "Manage Stores", "View Analytics", "Manage Users", "View Dashboard", "Export Data"],
  "Region Leaders": ["View Reports", "Manage Stores", "View Analytics", "Manage Users", "Manage Roles", "View Dashboard", "Export Data", "Manage Settings"],
  "VPs": ["View Reports", "Manage Stores", "View Analytics", "Manage Users", "Manage Roles", "View Dashboard", "Export Data", "Manage Settings", "View Audit Logs", "Manage Policies"],
  "Support Teams": ["View Reports", "View Analytics", "View Dashboard", "Manage Users", "View User Details"],
  
  // Store Roles
  "Store manager": ["View Reports", "Manage Inventory", "Manage Schedules", "View Dashboard", "View User Details"],
  "Bar manager": ["View Reports", "Manage Inventory", "Manage Schedules", "View Dashboard"],
  "Assistant managers": ["View Reports", "View Dashboard", "Manage Schedules", "View User Details"],
  "Shift leaders": ["View Dashboard", "View Reports", "View User Details"],
  
  // Corporate Roles
  "Franchise Admin": ["Manage Users", "Manage Stores", "View Reports", "Manage Access Requests", "Approve Access Requests", "View Dashboard", "Export Data"],
  "Technology manager": ["Manage Settings", "Manage Applications", "View Audit Logs", "Manage Permissions", "View Dashboard", "Export Data"],
  "customer service manager": ["View User Details", "View Reports", "Manage Access Requests", "View Dashboard", "Manage Certifications"],
};

export default function GatewayAdminRolesSettings() {
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabKey>("regional");
  const [activeRoleIdx, setActiveRoleIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const roles = ROLE_CATEGORIES[activeCategoryTab];
  const role = roles[activeRoleIdx];
  const [rolePrivileges, setRolePrivileges] = useState<Record<string, string[]>>(DEFAULT_ROLE_PRIVILEGES);
  const [allPrivileges, setAllPrivileges] = useState<string[]>(DEFAULT_PRIVILEGES);
  const [selectedPrivilege, setSelectedPrivilege] = useState<string>("");
  const [privPage, setPrivPage] = useState(1);
  const privPageSize = 10;

  // Reset active role index when category tab changes
  useEffect(() => {
    setActiveRoleIdx(0);
  }, [activeCategoryTab]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const privRes = await fetch("https://preview.keyforge.ai/privilegedrole/api/v1/ACMECOM/roleprivilege", { signal: controller.signal });
        if (privRes.ok) {
          const privJson: { privileges?: Array<{ privilegeName: string }>; adminRolePrivileges?: Array<{ adminRole: string; privilegeSet: Array<{ privilegeName: string }> }> } = await privRes.json();
          const map: Record<string, string[]> = { ...DEFAULT_ROLE_PRIVILEGES };
          (privJson.adminRolePrivileges || []).forEach(entry => {
            map[entry.adminRole] = entry.privilegeSet.map(p => p.privilegeName);
          });
          setRolePrivileges(map);
          
          // Merge API privileges with default privileges
          const apiPrivileges = (privJson.privileges || []).map(p => p.privilegeName);
          const mergedPrivileges = [...new Set([...DEFAULT_PRIVILEGES, ...apiPrivileges])];
          setAllPrivileges(mergedPrivileges);
        }
      } catch (e) {
        // keep fallback - use default privileges
        console.error(e);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const PrivilegeSelect = ({
    options,
    value,
    onChange,
  }: { options: string[]; value: string; onChange: (v: string) => void }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative w-[360px]">
        <button
          type="button"
          className="w-full border rounded px-3 py-2 text-sm bg-white flex items-center justify-between"
          onClick={() => setOpen(o => !o)}
        >
          <span className="truncate mr-2">{value || 'Select privilege'}</span>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto border rounded bg-white shadow pb-1">
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${value===opt ? 'bg-gray-50' : ''}`}
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full p-6">
      <div className="mx-auto min-h-[calc(100vh-120px)]">
        <div className="mb-4"><BackButton /></div>

        <div className="bg-white rounded-md shadow overflow-visible">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 text-white bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-600">
                <LayoutTemplate className="w-4 h-4" />
              </div>
              <h2 className="font-semibold">Admin Roles</h2>
            </div>
            <button className="bg-white text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">Submit</button>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-gray-200 px-4 pt-4">
            <div className="flex items-center gap-6">
              {([
                { key: "regional", label: "Regional Role" },
                { key: "store", label: "Store roles" },
                { key: "corporate", label: "Corporate roles" },
              ] as Array<{key: CategoryTabKey; label: string}>).map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveCategoryTab(t.key)}
                  className={`px-1.5 py-2 -mb-px border-b-2 ${activeCategoryTab===t.key ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[280px_1fr] gap-4 p-4 min-h-100">
            {/* Left role list */}
            <div className="border border-gray-200 rounded">
              {roles.map((r, idx) => (
                <button
                  key={r.name}
                  onClick={() => setActiveRoleIdx(idx)}
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 ${idx===activeRoleIdx ? 'bg-red-50 text-red-600 border-l-4 border-red-600' : 'hover:bg-gray-50'}`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            {/* Right content */}
            <div>
              {/* Tabs row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-6 border-b border-gray-200 flex-1">
                  {([
                    { key: "users", label: "Users" },
                    { key: "privileges", label: "Privileges" },
                    { key: "scope", label: "Scope" },
                  ] as Array<{key: TabKey; label: string}>).map(t => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`px-1.5 py-2 -mb-px border-b-2 ${activeTab===t.key ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {activeTab === 'users' && (
                  <button className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded text-sm self-center hover:bg-red-700 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                )}
              </div>

              {/* Role details - show only on Users tab */}
              {activeTab === 'users' && (
                <div className="border border-gray-200 rounded mb-4">
                  <div className="grid grid-cols-[160px_1fr] border-b">
                    <div className="px-4 py-3 font-medium bg-gray-50 border-r">Name</div>
                    <div className="px-4 py-3">{role.name}</div>
                  </div>
                  <div className="grid grid-cols-[160px_1fr]">
                    <div className="px-4 py-3 font-medium bg-gray-50 border-r">Description</div>
                    <div className="px-4 py-3 text-gray-700">{role.description}</div>
                  </div>
                </div>
              )}

              {/* Users table area (empty state) */}
              {activeTab === 'users' && (
                <div className="border border-gray-200 rounded">
                  <div className="grid grid-cols-4 bg-gray-100 text-[13px] text-gray-700">
                    <div className="px-4 py-2 font-medium">User Name</div>
                    <div className="px-4 py-2 font-medium">First Name</div>
                    <div className="px-4 py-2 font-medium">Last Name</div>
                    <div className="px-4 py-2 font-medium">Email</div>
                  </div>
                  <div className="py-10 flex items-center justify-center text-gray-500 text-sm">
                    No Data
                  </div>
                </div>
              )}

              {activeTab === 'privileges' && (
                <div className="border border-gray-200 rounded">
                  {/* Toolbar with centered dropdown */}
                  <div className="flex items-center p-3 gap-3">
                    <span className="text-sm text-gray-700 font-medium">Privileges</span>
                    <div className="flex-1 flex justify-center">
                      <PrivilegeSelect
                        options={allPrivileges}
                        value={selectedPrivilege}
                        onChange={setSelectedPrivilege}
                      />
                    </div>
                    <div className="ml-auto">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors"
                        onClick={() => {
                          if (!selectedPrivilege || !role) return;
                          setRolePrivileges(prev => {
                            const current = prev[role.name] || [];
                            if (current.includes(selectedPrivilege)) return prev;
                            return { ...prev, [role.name]: [...current, selectedPrivilege] };
                          });
                          setSelectedPrivilege("");
                        }}
                      >
                        Add Privilege
                      </button>
                    </div>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-1 bg-gray-100 text-[13px] text-gray-700">
                    <div className="px-4 py-2 font-medium">Privilege Name</div>
                  </div>
                  {(() => {
                    const list = rolePrivileges[role?.name] || [];
                    if (list.length === 0) {
                      return <div className="py-6 text-center text-gray-500 text-sm">No Data</div>;
                    }
                    const start = (privPage - 1) * privPageSize;
                    const end = start + privPageSize;
                    const pageItems = list.slice(start, end);
                    return (
                      <>
                        <div className="text-sm text-gray-800">
                          {pageItems.map((p, i) => (
                            <div key={`${start + i}`} className="px-4 py-2 border-t border-gray-200">{p}</div>
                          ))}
                        </div>
                        <div className="p-2">
                          <CustomPagination
                            totalItems={list.length}
                            currentPage={privPage}
                            totalPages={Math.max(1, Math.ceil(list.length / privPageSize))}
                            pageSize={privPageSize}
                            onPageChange={setPrivPage}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === 'scope' && (
                <div className="border border-gray-200 rounded p-6 text-gray-600 text-sm">No data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

