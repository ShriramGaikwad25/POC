"use client";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { executeQuery } from "@/lib/api";
import type { ColDef } from "ag-grid-enterprise";
import dynamic from "next/dynamic";
import "@/lib/ag-grid-setup";

// Dynamically import AgGridReact with SSR disabled
const AgGridReact = dynamic(() => import("ag-grid-react").then((mod) => mod.AgGridReact), {
  ssr: false,
});

type ProfileUser = {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  alias: string;
  phone?: string;
  title?: string;
  department?: string;
  startDate?: string;
  userType?: string;
  managerEmail?: string;
  tags: string[];
};

const buildUserFromStorage = (): ProfileUser => {
  try {
    // Prefer the full raw user saved from the list page
    const fullStr = localStorage.getItem("selectedUserRawFull");
    if (fullStr) {
      const u = JSON.parse(fullStr);
      const displayName = u.displayname || u.displayName || `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || u.username || "Unknown";
      const email = u.email?.work || u.customattributes?.emails?.[0]?.value || u.username || "no-email@example.com";
      return {
        firstName: u.firstname || u.customattributes?.name?.givenName || displayName.split(" ")[0] || "",
        lastName: u.lastname || u.customattributes?.name?.familyName || displayName.split(" ").slice(1).join(" ") || "",
        email,
        displayName,
        alias: u.username || u.customattributes?.id || email,
        phone: u.phonenumber?.work || u.customattributes?.phoneNumbers?.[0]?.value || "",
        title: u.title || u.customattributes?.title || "",
        department: u.department || u.customattributes?.enterpriseUser?.department || "",
        startDate: u.startdate || u.customattributes?.["urn:ietf:params:scim:schemas:extension:custom"]?.startdate || "",
        userType: u.employeetype || u.customattributes?.userType || "",
        managerEmail: u.managername || u.customattributes?.enterpriseUser?.manager?.value || "",
        tags: [u.employeetype || u.customattributes?.userType || "User"].filter(Boolean),
      };
    }
  } catch {}
  try {
    // Fallback to the lightweight selected row
    const sel = localStorage.getItem("selectedUserRaw");
    if (sel) {
      const s = JSON.parse(sel);
      const displayName = s.name || "Unknown";
      const [fn, ...rest] = displayName.split(" ");
      return {
        firstName: fn || "",
        lastName: rest.join(" "),
        email: s.email || "no-email@example.com",
        displayName,
        alias: s.email || displayName,
        phone: "",
        title: s.title || "",
        department: s.department || "",
        startDate: "",
        userType: s.tags || "",
        managerEmail: s.managerName || "",
        tags: [s.tags || "User"].filter(Boolean),
      };
    }
  } catch {}
  // Final fallback
  return {
    firstName: "",
    lastName: "",
    email: "no-email@example.com",
    displayName: "Unknown",
    alias: "",
    phone: "",
    title: "",
    department: "",
    startDate: "",
    userType: "",
    managerEmail: "",
    tags: ["User"],
  };
};

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<ProfileUser>(() => buildUserFromStorage());

  // Ensure chart and grid render only on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Re-read after mount to ensure access to localStorage
    setUserData(buildUserFromStorage());
  }, []);

  const ProfileTab = () => {
    const initials = `${(userData.firstName || "")[0] || "U"}${(userData.lastName || "")[0] || ""}`.toUpperCase();
    const colors = ["#7f3ff0", "#0099cc", "#777", "#d7263d", "#ffae00"];
    // Ensure same color on server and initial client render to avoid hydration mismatch
    const bgColor = isMounted
      ? colors[(userData.email || "").length % colors.length]
      : colors[0];
    const displayedInitials = isMounted ? initials : "";

    return (
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Profile Picture - Centered */}
          <div className="flex-shrink-0 flex justify-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
              style={{ backgroundColor: bgColor }}
            >
              {displayedInitials}
            </div>
          </div>
          
          {/* User Details - Right Side */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">First Name</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.firstName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Name</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.lastName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{userData.email}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.displayName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alias</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.alias}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.phone || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.title}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.department}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.startDate || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">User Type</label>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{userData.userType}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manager Email</label>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{userData.managerEmail}</p>
            </div>
            
            {userData.tags && userData.tags.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tags</label>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {userData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 border border-blue-300 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AllAccessTab = () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [dynamicCols, setDynamicCols] = useState<ColDef[]>([]);

    useEffect(() => {
      const getUserIdFromStorage = (): string => {
        try {
          const fullStr = localStorage.getItem("selectedUserRawFull");
          if (fullStr) {
            const u = JSON.parse(fullStr);
            return (
              u.userid || u.id || u.userId || u.customattributes?.id || "0109868e-b00c-4f24-ae5f-258029cce1d6"
            );
          }
        } catch {}
        try {
          const sel = localStorage.getItem("selectedUserRaw");
          if (sel) {
            const s = JSON.parse(sel);
            return s.id || s.userId || "0109868e-b00c-4f24-ae5f-258029cce1d6";
          }
        } catch {}
        return "0109868e-b00c-4f24-ae5f-258029cce1d6";
      };

      const fetchAllAccess = async () => {
        try {
          const userId = getUserIdFromStorage();
          const res: any = await executeQuery<any>(
            "select * from vw_user_with_applications_entitlements where userid = ?::uuid",
            [userId]
          );
          // Handle concrete response shape: { resultSet: [ { applications: [ { entitlements: [...] } ] } ] }
          if (Array.isArray(res?.resultSet)) {
            const flatEntRows: any[] = [];
            for (const user of res.resultSet) {
              const apps = Array.isArray(user?.applications) ? user.applications : [];
              for (const app of apps) {
                const ents = Array.isArray(app?.entitlements) ? app.entitlements : [];
                for (const ent of ents) {
                  flatEntRows.push({
                    entitlementName: ent?.entitlementname,
                    entitlementType: ent?.entitlementType,
                    application: app?.application,
                    accountName: app?.accountname,
                    lastLogin: app?.lastlogin,
                  });
                }
              }
            }

            setRowData(flatEntRows);

            const desiredCols: ColDef[] = [
              { headerName: "Entitlement ", field: "entitlementName", flex: 1.5 },
              { headerName: "Type", field: "entitlementType", flex: 1 },
              { headerName: "Application", field: "application", flex: 1.2 },
              { headerName: "Account", field: "accountName", flex: 1.2 },
              {
                headerName: "Last Login",
                field: "lastLogin",
                flex: 1,
                valueFormatter: (p: any) => require("@/utils/utils").formatDateMMDDYYSlashes(p.value),
              },
            ];
            setDynamicCols(desiredCols);
            return;
          }
          // Normalize possible response shapes
          const items = ((): any[] => {
            if (Array.isArray(res?.items)) return res.items;
            if (Array.isArray(res?.data?.items)) return res.data.items;
            if (Array.isArray(res?.rows)) return res.rows;
            if (Array.isArray(res?.data?.rows)) return res.data.rows;
            if (Array.isArray(res?.results)) return res.results;
            if (Array.isArray(res?.data?.results)) return res.data.results;
            if (Array.isArray(res?.data)) return res.data;
            if (Array.isArray(res)) return res;
            if (res && typeof res === "object") {
              // As a last resort, try to find an array property
              const firstArray = Object.values(res).find((v: any) => Array.isArray(v));
              if (Array.isArray(firstArray)) return firstArray as any[];
            }
            return [];
          })();
          setRowData(items);
          // Helper to resolve a value from multiple possible key aliases on each row
          const valueByAliases = (data: any, aliases: string[]) => {
            for (const a of aliases) {
              if (data[a] !== undefined) return data[a];
              const lower = a.toLowerCase();
              const hit = Object.keys(data).find((k) => k.toLowerCase() === lower);
              if (hit) return data[hit];
            }
            return undefined;
          };

          const desiredCols: ColDef[] = [
            {
              headerName: "Entitlement Name",
              colId: "entitlementName",
              valueGetter: (p: any) =>
                valueByAliases(p.data, ["entitlementname", "entitlement_name", "ent_name", "entname"]),
              flex: 1.5,
            },
            {
              headerName: "entitlementType",
              colId: "entitlementType",
              valueGetter: (p: any) =>
                valueByAliases(p.data, [
                  "entitlementtype",
                  "entitlement_type",
                  "ent_type",
                  "enttype",
                  "entitlementcategory",
                ]),
              flex: 1,
            },
            {
              headerName: "Application",
              colId: "application",
              valueGetter: (p: any) =>
                valueByAliases(p.data, [
                  "application",
                  "applicationname",
                  "application_name",
                  "appname",
                  "app_name",
                  "applicationdisplayname",
                ]),
              flex: 1.2,
            },
            {
              headerName: "Account name",
              colId: "accountName",
              valueGetter: (p: any) =>
                valueByAliases(p.data, [
                  "account",
                  "accountname",
                  "account_name",
                  "username",
                  "useraccount",
                  "user_name",
                ]),
              flex: 1.2,
            },
            {
              headerName: "Last Login",
              colId: "lastLogin",
              valueGetter: (p: any) =>
                valueByAliases(p.data, [
                  "lastlogin",
                  "last_login",
                  "lastlogindate",
                  "last_login_date",
                ]),
              flex: 1,
            },
          ];
          // If none of the desired columns resolve for the first row, fall back to showing all keys
          const desiredResolved = desiredCols.some((c) => {
            try {
              const val = (c as any).valueGetter?.({ data: items[0] });
              return val !== undefined && val !== null;
            } catch {
              return false;
            }
          });
          if (desiredResolved) {
            setDynamicCols(desiredCols);
          } else {
            const keys = Object.keys(items[0] || {});
            const fallback = keys.map((k) => ({ headerName: k, field: k, flex: 1 } as ColDef));
            setDynamicCols(fallback);
          }
        } catch (e) {
          setRowData([]);
          setDynamicCols([]);
        }
      };

      fetchAllAccess();
    }, []);

    return (
      <div className="bg-white rounded-lg shadow-md p-3">
        {isMounted && (
          <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={dynamicCols}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="space-y-6">
        <ProfileTab />
        <AllAccessTab />
      </div>
    </>
  );
}


