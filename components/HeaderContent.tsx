"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Dropdown from "./Dropdown";
import { formatDateMMDDYY } from "@/utils/utils";
import { UserRowData } from "@/types/certification";
import HorizontalTabs from "@/components/HorizontalTabs";
import { ChevronDown, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartData } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "@/lib/ag-grid-setup";
import CertificationProgress from "./CertificationProgress";
import UserProgress from "./UserProgress";
import { useAuth } from "@/contexts/AuthContext";
import { getCookie, COOKIE_NAMES, getCurrentUser } from "@/lib/auth";
import { useLeftSidebar } from "@/contexts/LeftSidebarContext";

// Register Chart.js components and plugin
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

// Dynamically import AgGridReact with SSR disabled
const AgGridReact = dynamic(() => import("ag-grid-react").then((mod) => mod.AgGridReact), {
  ssr: false,
});

// Dynamically import Bar chart with SSR disabled
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

const PopupButton = ({
  username,
  userId,
  userStatus,
  manager,
  department,
  jobTitle,
  userType,
  onClose,
}: {
  username: string;
  userId: string;
  userStatus: string;
  manager: string;
  department: string;
  jobTitle: string;
  userType: "Internal" | "External";
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: username,
    email: "",
    comments: "",
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure chart and grid render only on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sample user data adapted to PopupButton props
  const userData = {
    firstName: username.split(" ")[0] || "Unknown",
    lastName: username.split(" ")[1] || "",
    email: `${username.replace(" ", ".").toLowerCase()}@example.com`,
    displayName: username,
    alias: userId.toLowerCase(),
    phone: "+1 (555) 123-4567",
    title: jobTitle,
    department: department,
    startDate: "2023-01-15",
    userType: userType,
    managerEmail: manager.includes("@") ? manager : `${manager.replace(" ", ".").toLowerCase()}@example.com`,
    tags: ["User", userType],
  };

  // Sample access data
  const accessData = {
    accounts: 20,
    apps: 10,
    entitlements: 60,
    violations: 5,
  };

  // Sample account data
  const accountData = [
    {
      accountId: "ACC001",
      accountStatus: "Active",
      risk: "Low",
      appName: "CRM App",
      discoveryDate: "2023-06-01",
      lastSyncDate: "2025-08-20",
      lastAccessReview: "2025-07-15",
      insights: "High usage",
      mfa: "Enabled",
      complianceViolation: "None",
    },
    {
      accountId: "ACC002",
      accountStatus: "Suspended",
      risk: "High",
      appName: "HR Portal",
      discoveryDate: "2023-05-10",
      lastSyncDate: "2025-08-18",
      lastAccessReview: "2025-06-30",
      insights: "Inactive account",
      mfa: "Disabled",
      complianceViolation: "SoD Violation",
    },
  ];

  const ProfileTab = () => {
    const initials = `${userData.firstName[0]}${userData.lastName[0] || ""}`.toUpperCase();
    const colors = ["#7f3ff0", "#0099cc", "#777", "#d7263d", "#ffae00"];
    const bgColor = colors[userData.email.length % colors.length];

    return (
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Name</label>
            <p className="text-sm text-gray-900">{userData.displayName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Email</label>
            <p className="text-sm text-blue-600">{userData.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Title</label>
            <p className="text-sm text-gray-900">{userData.title}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Department</label>
            <p className="text-sm text-gray-900">{userData.department}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Manager Email</label>
            <p className="text-sm text-blue-600">{userData.managerEmail}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">User Type</label>
            <p className="text-sm text-gray-900">{userData.userType}</p>
          </div>
        </div>
      </div>
    );
  };

  const AccessTab = () => {
    const accountColumnDefs = useMemo(
      () => [
        {
          headerName: "Account ID",
          field: "accountId",
          flex: 1,
          cellRenderer: (params: any) => (
            <span>
              {params.value} ({params.data.accountStatus})
            </span>
          ),
        },
        { headerName: "App Name", field: "appName", flex: 1 },
        {
          headerName: "MFA",
          field: "mfa",
          flex: 1,
          cellRenderer: (params: any) => (
            <span className={params.value === "Enabled" ? "text-green-600" : "text-red-600"}>
              {params.value}
            </span>
          ),
        },
        {
          headerName: "Compliance Violation",
          field: "complianceViolation",
          flex: 1,
          cellRenderer: (params: any) => (
            <span className={params.value === "None" ? "text-green-600" : "text-red-600"}>
              {params.value}
            </span>
          ),
        },
      ] as any[],
      []
    );

    return (
      <div className="p-4 bg-white rounded-lg">
        <div className="ag-theme-alpine" style={{ height: 150, width: "100%" }}>
          <AgGridReact
            rowData={accountData}
            columnDefs={accountColumnDefs}
            defaultColDef={{ sortable: true, filter: true }}
          />
        </div>
      </div>
    );
  };

  const tabsData = [
    {
      label: "Profile",
      icon: ChevronDown,
      iconOff: ChevronRight,
      component: ProfileTab,
    },
    {
      label: "Access",
      icon: ChevronDown,
      iconOff: ChevronRight,
      component: AccessTab,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-3">
      <div className="bg-white p-3 rounded-lg shadow-lg w-full max-w-sm max-h-[75vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-lg font-semibold"
        >
          X
        </button>
        <HorizontalTabs
          tabs={tabsData}
          activeIndex={tabIndex}
          onChange={setTabIndex}
        />
      </div>
    </div>
  );
};

const HeaderContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { isVisible, toggleSidebar } = useLeftSidebar();

  // State for header info and user details
  const [headerInfo, setHeaderInfo] = useState({
    campaignName: "",
    status: "",
    snapshotAt: "",
    dueDate: "",
    daysLeft: 0,
  });

  const [userDetails, setUserDetails] = useState<{
    username: string;
    userId: string;
    userStatus: string;
    manager: string;
    department: string;
    jobTitle: string;
    userType: "Internal" | "External";
  } | null>(null);

  // State for certification progress
  const [progressData, setProgressData] = useState({
    totalItems: 0,
    approvedCount: 0,
    pendingCount: 0,
    revokedCount: 0,
    delegatedCount: 0,
    remediatedCount: 0,
  });

  // State for user-based progress (matching access review page)
  const [userProgressData, setUserProgressData] = useState({
    totalItems: 0,
    approvedCount: 0,
    pendingCount: 0,
    percentage: 0,
  });

  // State for PopupButton
  const [showPopupButton, setShowPopupButton] = useState(false);

  // State for application details
  const [applicationDetails, setApplicationDetails] = useState<{
    applicationName: string;
    owner: string;
    lastSync: string;
  } | null>(null);

  // Avatar mapping and fallbacks (reuse logic from TreeClient)
  const [avatarErrorIndexByKey, setAvatarErrorIndexByKey] = useState<Record<string, number>>({});
  const [avatarMap, setAvatarMap] = useState<Record<string, string>>({});
  const [availableRandomSvgs, setAvailableRandomSvgs] = useState<string[]>([]);
  const [maleNames, setMaleNames] = useState<Set<string>>(new Set());
  const [femaleNames, setFemaleNames] = useState<Set<string>>(new Set());

  const getHeaderUserKey = (u: any): string => {
    if (!u) return "";
    return String(u.userId || u.username || u.email || u.id || u.username || "");
  };

  const getFirstName = (u: any): string => {
    const full = String(u?.username || "").trim();
    if (!full) return "";
    return full.split(/\s+/)[0].toLowerCase();
  };

  const isLikelyMale = (u: any): boolean => {
    const gender = String(u?.gender || u?.sex || "").toLowerCase();
    if (gender === 'male' || gender === 'm') return true;
    if (gender === 'female' || gender === 'f') return false;
    const first = getFirstName(u);
    if (!first) return false;
    if (maleNames.size > 0 && maleNames.has(first)) return true;
    if (femaleNames.size > 0 && femaleNames.has(first)) return false;
    return false;
  };

  const getAvatarCandidates = (u: any): string[] => {
    const candidates: string[] = [];
    // Prefer a global header image if present
    candidates.push(
      "/pictures/user_image2.jpg",
      "/pictures/user_image2.png",
      "/pictures/user_image2.webp",
      "/pictures/user_image2.jpeg",
    );
    if (u) {
      if (isLikelyMale(u)) {
        candidates.push(
          "/pictures/user_male.svg",
          "/pictures/user_male.png",
          "/pictures/user_male.jpg",
          "/pictures/user_male.webp",
          "/pictures/user_male.jpeg",
        );
      } else {
        candidates.push(
          "/pictures/user_female.svg",
          "/pictures/user_female.png",
          "/pictures/user_female.jpg",
          "/pictures/user_female.webp",
          "/pictures/user_female.jpeg",
        );
      }
    }
    // Deterministic random SVG per user if provided
    if (u && Array.isArray(availableRandomSvgs) && availableRandomSvgs.length > 0) {
      const key = getHeaderUserKey(u);
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
      }
      const filename = availableRandomSvgs[hash % availableRandomSvgs.length];
      if (filename) {
        const normalized = filename.startsWith('/') ? filename : `/pictures/${filename}`;
        candidates.push(normalized);
      }
    }
    if (u) {
      const mapKeyCandidates = [
        String(u.userId || "").trim(),
        String(u.username || "").trim(),
        String(u.email || "").trim(),
        String(u.id || "").trim(),
      ].filter(Boolean);
      for (const k of mapKeyCandidates) {
        const mapped = avatarMap[k];
        if (mapped) {
          const normalized = mapped.startsWith("/") ? mapped : `/pictures/${mapped}`;
          candidates.push(normalized);
          break;
        }
      }
      const rawParts = [
        String(u.photoFilename || "").trim(),
        String(u.userId || "").trim(),
        String(u.username || "").trim(),
        String(u.email || "").trim(),
        String(u.id || "").trim(),
        String(u.username || "").trim(),
        String(u.username || "").trim().replace(/\s+/g, "_")
      ].filter(Boolean);
      const exts = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
      for (const part of rawParts) {
        for (const ext of exts) {
          candidates.push(`/pictures/${part}${ext}`);
        }
      }
    }
    candidates.push("/User.jpg");
    return Array.from(new Set(candidates));
  };

  const renderUserAvatar = (u: any, size: number, roundedClass: string) => {
    const userKey = getHeaderUserKey(u);
    const candidates = getAvatarCandidates(u);
    const index = Math.max(0, avatarErrorIndexByKey[userKey] ?? 0);
    const src = candidates[Math.min(index, candidates.length - 1)];
    return (
      <Image
        src={src}
        alt="User Avatar"
        width={size}
        height={size}
        className={`${roundedClass}`}
        onError={() => {
          setAvatarErrorIndexByKey((prev) => {
            const next = { ...prev } as Record<string, number>;
            next[userKey] = Math.min((prev[userKey] ?? 0) + 1, candidates.length - 1);
            return next;
          });
        }}
      />
    );
  };

  // Check if we should show the header (for access-review pages, but not app-owner or individual applications)
  const shouldShowHeader =
    pathname?.includes('/access-review/') &&
    !pathname?.includes('/applications/');

  // Check if we should show app-owner specific header
  const shouldShowAppOwnerHeader = pathname?.includes('/app-owner');

  // Check if we should show campaign-specific header (only when inside a specific campaign)
  const shouldShowCampaignHeader = pathname?.includes('/campaigns/manage-campaigns/');


  // Calculate days left
  const calculateDaysLeft = (expirationDateStr: string): number => {
    if (!expirationDateStr) return 0;
    const expiration = new Date(expirationDateStr);
    const now = new Date();
    const diffTime = expiration.getTime() - now.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };

  // Handler for Profile click in dropdown
  const handleProfileClick = () => {
    if (userDetails) {
      router.push(`/profile`);
    }
  };

  // Handler for Logout click in dropdown
  const handleLogoutClick = () => {
    logout();
  };

  // Update header data function
  const updateHeaderData = (data: UserRowData[]) => {
    if (data.length > 0) {
      const firstItem = data[0];
      const daysLeft = calculateDaysLeft(firstItem.certificationExpiration || "");

      setHeaderInfo({
        campaignName: firstItem.certificationName || "Campaign Name",
        status: "",
        snapshotAt: "",
        dueDate: firstItem.certificationExpiration || "",
        daysLeft: daysLeft,
      });

      setUserDetails({
        username: firstItem.fullName || "IAM Admin",
        userId: firstItem.id || "N/A",
        userStatus: firstItem.status || "Active",
        manager: firstItem.manager || "N/A",
        department: firstItem.department || "N/A",
        jobTitle: firstItem.jobtitle || "N/A",
        userType: firstItem.userType || "Internal",
      });
    }
  };

  // Update progress data function
  const updateProgressData = (data: any) => {
    setProgressData(data);
  };

  // Calculate user-based progress (matching access review page)
  const calculateUserProgress = (userData: any) => {
    const total = userData.numOfEntitlements || 0;
    const approved = userData.numOfEntitlementsCertified || 0;
    const rejected = userData.numOfEntitlementsRejected || 0;
    const revoked = userData.numOfEntitlementsRevoked || 0;
    const completed = approved + rejected + revoked; // Certified, rejected, and revoked all count as progress
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalItems: total,
      approvedCount: approved,
      rejectedCount: rejected,
      revokedCount: revoked,
      completedCount: completed,
      pendingCount: pending,
      percentage: percentage,
    };
  };

  // Effect to populate header info from localStorage
  useEffect(() => {
    const updateHeaderData = () => {
      try {
        // Prefer campaign summary if available (for campaign manage pages)
        const selectedCampaignSummary = localStorage.getItem("selectedCampaignSummary");
        if (selectedCampaignSummary) {
          const summary = JSON.parse(selectedCampaignSummary);
          const daysLeft = calculateDaysLeft(summary.dueDate || "");

          setHeaderInfo({
            campaignName: summary.campaignName || "Campaign Name",
            status: summary.status || "",
            snapshotAt: summary.snapshotAt || "",
            dueDate: summary.dueDate || "",
            daysLeft: daysLeft,
          });
        }

        const sharedRowData = localStorage.getItem("sharedRowData");
        if (sharedRowData) {
          const data = JSON.parse(sharedRowData);
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
            const daysLeft = calculateDaysLeft(firstItem.certificationExpiration || "");

            // Only update header info if we don't have campaign summary data
            if (!selectedCampaignSummary) {
              setHeaderInfo((prev) => ({
                campaignName: firstItem.certificationName || prev.campaignName || "Campaign Name",
                status: prev.status || "",
                snapshotAt: prev.snapshotAt || "",
                dueDate: firstItem.certificationExpiration || prev.dueDate || "",
                daysLeft: prev.dueDate ? prev.daysLeft : daysLeft,
              }));
            }

            setUserDetails({
              username: firstItem.fullName || "IAM Admin",
              userId: firstItem.id || "N/A",
              userStatus: firstItem.status || "Active",
              manager: firstItem.manager || "N/A",
              department: firstItem.department || "N/A",
              jobTitle: firstItem.jobtitle || "N/A",
              userType: firstItem.userType || "Internal",
            });

            // Calculate user-based progress
            const userProgress = calculateUserProgress(firstItem);
            setUserProgressData(userProgress);
          }
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    };

    // Initial call
    updateHeaderData();

    // Listen for storage changes
    const handleStorageChange = () => {
      updateHeaderData();
    };

    // Listen for custom localStorage change event
    const handleLocalStorageChange = () => {
      updateHeaderData();
    };

    // Listen for progress data changes
    const handleProgressDataChange = (event: CustomEvent) => {
      updateProgressData(event.detail);

      // Check if it's user-based progress data (from getUserProgress)
      if (event.detail && event.detail.percentage !== undefined) {
        // This is user-based progress data
        const userProgress = {
          totalItems: event.detail.total || 0,
          approvedCount: event.detail.approved || 0,
          pendingCount: event.detail.pending || 0,
          percentage: event.detail.percentage || 0
        };
        setUserProgressData(userProgress);
      } else if (event.detail && event.detail.totalItems !== undefined) {
        // This is entitlement-based progress data (fallback)
        const userProgress = {
          totalItems: event.detail.totalItems,
          approvedCount: event.detail.approvedCount,
          pendingCount: event.detail.pendingCount,
          percentage: event.detail.totalItems > 0 ?
            Math.round(((event.detail.approvedCount + event.detail.revokedCount + event.detail.delegatedCount + event.detail.remediatedCount) / event.detail.totalItems) * 100) : 0
        };
        setUserProgressData(userProgress);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleLocalStorageChange);
    window.addEventListener('progressDataChange', handleProgressDataChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
      window.removeEventListener('progressDataChange', handleProgressDataChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    fetch('/pictures/male_names.json', { signal: controller1.signal })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (Array.isArray(data)) setMaleNames(new Set(data.map((s: any) => String(s).toLowerCase())));
      })
      .catch(() => {});
    fetch('/pictures/female_names.json', { signal: controller2.signal })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (Array.isArray(data)) setFemaleNames(new Set(data.map((s: any) => String(s).toLowerCase())));
      })
      .catch(() => {});
    return () => { controller1.abort(); controller2.abort(); };
  }, []);

  // Effect to handle application details
  useEffect(() => {
    const handleApplicationDataChange = (event: CustomEvent) => {
      console.log('Application data change event received:', event.detail);
      setApplicationDetails(event.detail);
    };

    // Load application details from localStorage on mount
    const loadApplicationDetails = () => {
      try {
        const stored = localStorage.getItem('applicationDetails');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('Loaded application details from localStorage:', parsed);
          setApplicationDetails(parsed);
        }
      } catch (error) {
        console.error('Error loading application details:', error);
      }
    };

    // Initial load
    loadApplicationDetails();

    // Listen for application data changes
    window.addEventListener('applicationDataChange', handleApplicationDataChange as EventListener);

    return () => {
      window.removeEventListener('applicationDataChange', handleApplicationDataChange as EventListener);
    };
  }, []);

  // Load optional avatars mapping shared with TreeClient
  useEffect(() => {
    const controller = new AbortController();
    fetch('/pictures/avatars.json', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (data && typeof data === 'object') {
          setAvatarMap(data as Record<string, string>);
        }
      })
      .catch(() => {})
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/pictures/random_svgs.json', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (Array.isArray(data)) {
          setAvailableRandomSvgs(data.filter((s: any) => typeof s === 'string'));
        }
      })
      .catch(() => {})
    return () => controller.abort();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('HeaderContent - pathname:', pathname);
    console.log('HeaderContent - applicationDetails:', applicationDetails);
    console.log('HeaderContent - shouldShowHeader:', shouldShowHeader);
    console.log('HeaderContent - shouldShowAppOwnerHeader:', shouldShowAppOwnerHeader);
    console.log('HeaderContent - shouldShowCampaignHeader:', shouldShowCampaignHeader);
  }, [pathname, applicationDetails, shouldShowHeader, shouldShowAppOwnerHeader, shouldShowCampaignHeader]);

  return (
    <div className="flex h-[60px] w-full items-center justify-between text-sm pl-0 pr-4" style={{ backgroundColor: '#DC143C' }}>
      {/* Left Section */}
      <div className="flex items-center h-full -ml-3 flex-1">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center px-3 py-3 mr-4 text-white hover:bg-white/10 rounded-md transition-colors"
          title={isVisible ? "Hide sidebar" : "Show sidebar"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-200 h-5 w-5 flex-shrink-0"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Logo and Brand */}
        <div className="flex items-center gap-2 mr-8">
          <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized "I" that looks like a fork with three tines extending upwards */}
            <path d="M10 10V26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Three fork tines at the top - left, center, right */}
            <path d="M6 6L6 10M10 6L10 10M14 6L14 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <text x="26" y="22" fill="white" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" letterSpacing="2">NSPIRE</text>
          </svg>
        </div>

        {applicationDetails && pathname?.includes('/applications/') ? (
          <div className="flex h-full items-center header-content">
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Application: {applicationDetails.applicationName}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Owner: {applicationDetails.owner}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Last Sync: {formatDateMMDDYY(applicationDetails.lastSync)}
              </p>
            </div>
          </div>
        ) : shouldShowHeader ? (
          <div className="flex h-full items-center header-content">
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                {headerInfo.campaignName || "Quarterly Access Review - Megan Jackson"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Generated On {headerInfo.snapshotAt ? formatDateMMDDYY(headerInfo.snapshotAt) : "N/A"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Due In {headerInfo.daysLeft || 0} days
                <span className="font-bold ml-1 text-white">
                  ({headerInfo.dueDate ? formatDateMMDDYY(headerInfo.dueDate) : "N/A"})
                </span>
              </p>
            </div>
            {/* User Progress */}
            <div className="flex items-center px-4">
              <UserProgress progressData={userProgressData} />
            </div>
          </div>
        ) : shouldShowCampaignHeader ? (
          <div className="flex h-full items-center header-content">
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                {headerInfo.campaignName || "Campaign"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                {headerInfo.status ? `Status: ${headerInfo.status}` : "Status: N/A"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                {headerInfo.snapshotAt ? `Data Snapshot: ${formatDateMMDDYY(headerInfo.snapshotAt)}` : "Data Snapshot: N/A"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                {headerInfo.dueDate ? `Due on ${formatDateMMDDYY(headerInfo.dueDate)}` : "Due on N/A"}
                <span className="font-bold ml-1 text-white">
                  ({headerInfo.daysLeft || 0} days left)
                </span>
              </p>
            </div>
          </div>
        ) : shouldShowAppOwnerHeader ? (
          <div className="flex h-full items-center header-content">
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                {headerInfo.campaignName || "App Owner Review"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Generated On: {headerInfo.snapshotAt ? formatDateMMDDYY(headerInfo.snapshotAt) : "N/A"}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-white text-lg">•</span>
            </div>
            <div className="flex items-center px-4">
              <p className="text-sm font-medium text-white">
                Due In {headerInfo.daysLeft || 0} days
                <span className="font-bold ml-1 text-white">
                  ({headerInfo.dueDate ? formatDateMMDDYY(headerInfo.dueDate) : "N/A"})
                </span>
              </p>
            </div>
            {/* User Progress */}
            <div className="flex items-center px-4">
              <UserProgress progressData={userProgressData} />
            </div>
          </div>
        ) : (
          <div className="flex items-center px-4">
            {}
          </div>
        )}
      </div>

      {/* Center Section */}
      <div className="flex items-center justify-center flex-1 absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
        <h1 className="text-white font-semibold text-xl">Franchise User Management Portal</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center h-full justify-end gap-4 px-4 flex-1">
        <div className="flex items-center gap-3">
          {renderUserAvatar(userDetails, 36, "object-cover rounded-full w-9 h-9")}
          <span className="text-white font-medium text-sm">
            {(() => {
              // Prefer authenticated user from context (set to userid at login)
              if (user?.email) return user.email;
              // Fallback to cookie `uidTenant`
              try {
                const raw = getCookie(COOKIE_NAMES.UID_TENANT);
                if (raw) {
                  const parsed = JSON.parse(raw);
                  if (parsed?.userid) return parsed.userid;
                }
              } catch {}
              // Fallback to any current user util
              const current = getCurrentUser();
              if (current?.email) return current.email;
              return userDetails?.username || "IAM Admin";
            })()}
          </span>
          <Dropdown
            Icon={() => (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            className="!p-0 !bg-transparent !border-0"
            title="User profile"
          >
            <button
              onClick={handleProfileClick}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Profile
            </button>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <button
              onClick={handleLogoutClick}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </Dropdown>
        </div>
      </div>

      {/* PopupButton */}
      {showPopupButton && userDetails && (
        <PopupButton
          username={userDetails.username}
          userId={userDetails.userId}
          userStatus={userDetails.userStatus}
          manager={userDetails.manager}
          department={userDetails.department}
          jobTitle={userDetails.jobTitle}
          userType={userDetails.userType}
          onClose={() => setShowPopupButton(false)}
        />
      )}
    </div>
  );
};

export default HeaderContent;