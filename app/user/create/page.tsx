"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const [userUniqueIdentifier, setUserUniqueIdentifier] = useState("");
  const [userType, setUserType] = useState<"regular" | "admin">("regular");
  const [selectedApplication, setSelectedApplication] = useState("");
  const [selectedEntitlement, setSelectedEntitlement] = useState("");
  const [selectedAdminRole, setSelectedAdminRole] = useState<string>("");
  const [isAdminRolesDropdownOpen, setIsAdminRolesDropdownOpen] = useState(false);
  const adminRolesDropdownRef = useRef<HTMLDivElement>(null);

  // Admin roles options by category
  const adminRoleOptions = {
    regional: [
      "District Manager",
      "Region Leaders",
      "VPs",
      "Support Teams",
    ],
    store: [
      "Store manager",
      "Bar manager",
      "Assistant managers",
      "Shift leaders",
    ],
    corporate: [
      "Franchise Admin",
      "Technology manager",
      "customer service manager",
    ],
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        adminRolesDropdownRef.current &&
        !adminRolesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAdminRolesDropdownOpen(false);
      }
    }

    if (isAdminRolesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdminRolesDropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      userUniqueIdentifier,
      userType,
      selectedApplication,
      selectedEntitlement,
      selectedAdminRole,
    });
    // Navigate back or show success message
    router.push("/user");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-8 px-4 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/user")}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="ml-2">Back to Users</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create User</h1>
          <p className="text-gray-600 mt-1">Add a new user to the system</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Unique Identifier */}
            <div className="relative">
              <input
                type="text"
                value={userUniqueIdentifier}
                onChange={(e) => setUserUniqueIdentifier(e.target.value)}
                className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                placeholder=" "
                required
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                userUniqueIdentifier
                  ? 'top-0.5 text-xs text-blue-600' 
                  : 'top-3.5 text-sm text-gray-500'
              }`}>
                User Unique Identifier <span className="text-red-500">*</span>
              </label>
            </div>

            {/* User Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                User Type <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                {[
                  { value: "regular", label: "Regular User" },
                  { value: "admin", label: "Admin Roles" },
                ].map((option, index, array) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setUserType(option.value as "regular" | "admin")
                    }
                    className={`px-4 py-2 min-w-16 rounded-md border border-gray-300 ${
                      userType === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } ${index === 0 && "rounded-r-none"} ${
                      index === array.length - 1 && "rounded-l-none"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Regular User Fields */}
            {userType === "regular" && (
              <>
                {/* Select Application */}
                <div className="relative">
                  <input
                    type="text"
                    value={selectedApplication}
                    onChange={(e) => setSelectedApplication(e.target.value)}
                    className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    selectedApplication
                      ? 'top-0.5 text-xs text-blue-600' 
                      : 'top-3.5 text-sm text-gray-500'
                  }`}>
                    Select Application <span className="text-red-500">*</span>
                  </label>
                </div>

                {/* Select Entitlement */}
                <div className="relative">
                  <input
                    type="text"
                    value={selectedEntitlement}
                    onChange={(e) => setSelectedEntitlement(e.target.value)}
                    className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    selectedEntitlement
                      ? 'top-0.5 text-xs text-blue-600' 
                      : 'top-3.5 text-sm text-gray-500'
                  }`}>
                    Select Entitlement <span className="text-red-500">*</span>
                  </label>
                </div>
              </>
            )}

            {/* Admin Roles Fields */}
            {userType === "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Admin Roles <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={adminRolesDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsAdminRolesDropdownOpen(!isAdminRolesDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white flex items-center justify-between"
                  >
                    <span className="text-gray-500">
                      {selectedAdminRole || "Select admin roles..."}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isAdminRolesDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isAdminRolesDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                      <div className="p-2 space-y-2">
                        {/* Regional Role Tab */}
                        <div>
                          <div className="flex items-center p-1">
                            <div className="w-3 h-3 rounded-full border-2 mr-2 flex items-center justify-center border-blue-500 bg-blue-500">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              Regional Role
                            </span>
                          </div>
                          <div className="ml-5 mt-1 space-y-1">
                            {adminRoleOptions.regional.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                              >
                                <input
                                  type="radio"
                                  name="adminRole"
                                  checked={selectedAdminRole === option}
                                  onChange={() => {
                                    setSelectedAdminRole(option);
                                    setIsAdminRolesDropdownOpen(false);
                                  }}
                                  className="mr-2"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Store roles Tab */}
                        <div>
                          <div className="flex items-center p-1">
                            <div className="w-3 h-3 rounded-full border-2 mr-2 flex items-center justify-center border-blue-500 bg-blue-500">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              Store roles
                            </span>
                          </div>
                          <div className="ml-5 mt-1 space-y-1">
                            {adminRoleOptions.store.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                              >
                                <input
                                  type="radio"
                                  name="adminRole"
                                  checked={selectedAdminRole === option}
                                  onChange={() => {
                                    setSelectedAdminRole(option);
                                    setIsAdminRolesDropdownOpen(false);
                                  }}
                                  className="mr-2"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Corporate roles Tab */}
                        <div>
                          <div className="flex items-center p-1">
                            <div className="w-3 h-3 rounded-full border-2 mr-2 flex items-center justify-center border-blue-500 bg-blue-500">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              Corporate roles
                            </span>
                          </div>
                          <div className="ml-5 mt-1 space-y-1">
                            {adminRoleOptions.corporate.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                              >
                                <input
                                  type="radio"
                                  name="adminRole"
                                  checked={selectedAdminRole === option}
                                  onChange={() => {
                                    setSelectedAdminRole(option);
                                    setIsAdminRolesDropdownOpen(false);
                                  }}
                                  className="mr-2"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/user")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

