"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Upload, Search } from "lucide-react";
import { executeQuery } from "@/lib/api";
import dynamic from "next/dynamic";
const AgGridReact = dynamic(() => import("ag-grid-react").then(mod => mod.AgGridReact), { ssr: false });
import "@/lib/ag-grid-setup";
import { ColDef } from "ag-grid-enterprise";

interface User {
  id: string;
  name: string;
  email: string;
  title?: string;
  department?: string;
  empId?: string;
  manager?: string;
  storeLocation?: string;
  brand?: string;
  startDate?: string;
}

interface UserRow {
  id: string;
  displayName: string;
  email: string;
  empId: string;
  manager: string;
  storeLocation: string;
  brand: string;
  startDate: string;
  title?: string;
  department?: string;
}

interface FormData {
  step1: {
    groupName: string;
    description: string;
    owner: string;
    tags: string;
    ownerIsReviewer: boolean;
  };
  step2: {
    selectionMethod: "specific" | "selectEach" | "upload";
    specificUserExpression: { attribute: any; operator: any; value: string; logicalOp: string; id: string }[];
    selectedUsers: string[];
    uploadedFile: File | null;
  };
}

export default function CreateStorePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [validationStatus, setValidationStatus] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState<UserRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [gridApi, setGridApi] = useState<any>(null);
  const [isUpdatingSelection, setIsUpdatingSelection] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    step1: {
      groupName: "",
      description: "",
      owner: "",
      tags: "",
      ownerIsReviewer: false,
    },
    step2: {
      selectionMethod: "specific",
      specificUserExpression: [],
      selectedUsers: [],
      uploadedFile: null,
    },
  });

  const steps = [
    { id: 1, title: "Group Details" },
    { id: 2, title: "Select Users" },
    { id: 3, title: "Review & Submit" },
  ];

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const query = "SELECT * FROM usr WHERE lower(department) = ?";
        const parameters = ["operations"];
        
        const response = await executeQuery(query, parameters);
        
        let userList: User[] = [];
        
        if (response && typeof response === 'object' && 'resultSet' in response && Array.isArray((response as any).resultSet)) {
          const sourceArray: any[] = (response as any).resultSet;
          userList = sourceArray.map((user: any) => ({
            name: user.displayname || user.displayName || user.firstname + " " + user.lastname || "Unknown",
            email: user.email?.work || user.customattributes?.emails?.[0]?.value || user.username || "Unknown",
            title: user.title || user.customattributes?.title || "",
            department: user.department || user.customattributes?.enterpriseUser?.department || "",
          }));
        } else if (response && Array.isArray(response)) {
          userList = response.map((user: any) => ({
            name: user.displayname || user.displayName || user.firstname + " " + user.lastname || "Unknown",
            email: user.email?.work || user.customattributes?.emails?.[0]?.value || user.username || "Unknown",
            title: user.title || user.customattributes?.title || "",
            department: user.department || user.customattributes?.enterpriseUser?.department || "",
          }));
        }
        
        // Fallback to default users if API response is empty
        if (userList.length === 0) {
          userList = [
            {
              id: "1",
              name: "Aamod Radwan",
              email: "aamod.radwan@zillasecurity.io",
              title: "Staff",
              department: "Sales",
            },
            {
              id: "2",
              name: "Abdulah Thibadeau",
              email: "abdulah.thibadeau@zillasecurity.io",
              title: "Manager - IT & Security",
              department: "IT & Security",
            },
          ];
        }
        
        // Add IDs to users if they don't have them
        userList = userList.map((user, index) => ({
          ...user,
          id: user.id || `user-${index}`,
        }));
        
        setUsers(userList);
        
        // Convert to UserRow format for the table
        const rows: UserRow[] = userList.map((user, index) => ({
          id: user.id || `user-${index}`,
          displayName: user.name,
          email: user.email,
          empId: user.empId || `EMP${String(index + 1).padStart(3, "0")}`,
          manager: user.manager || "Manager Name",
          storeLocation: user.storeLocation || "Store Location",
          brand: user.brand || user.department || "Brand",
          startDate: user.startDate || new Date().toISOString().split("T")[0],
          title: user.title,
          department: user.department,
        }));
        
        setRowData(rows);
      } catch (err) {
        console.error("Error fetching users:", err);
        // Fallback to default users on error
        const fallbackUsers: User[] = [
          {
            id: "1",
            name: "Aamod Radwan",
            email: "aamod.radwan@zillasecurity.io",
            title: "Staff",
            department: "Sales",
          },
          {
            id: "2",
            name: "Abdulah Thibadeau",
            email: "abdulah.thibadeau@zillasecurity.io",
            title: "Manager - IT & Security",
            department: "IT & Security",
          },
        ];
        setUsers(fallbackUsers);
        
        // Convert to UserRow format for the table
        const rows: UserRow[] = fallbackUsers.map((user, index) => ({
          id: user.id || `user-${index}`,
          displayName: user.name,
          email: user.email,
          empId: user.empId || `EMP${String(index + 1).padStart(3, "0")}`,
          manager: user.manager || "Manager Name",
          storeLocation: user.storeLocation || "Store Location",
          brand: user.brand || user.department || "Brand",
          startDate: user.startDate || new Date().toISOString().split("T")[0],
          title: user.title,
          department: user.department,
        }));
        
        setRowData(rows);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Validate Step 1
  useEffect(() => {
    const isValid =
      formData.step1.groupName.trim() !== "" &&
      formData.step1.description.trim() !== "" &&
      formData.step1.owner.trim() !== "";
    setValidationStatus((prev) => {
      const newStatus = [...prev];
      newStatus[0] = isValid;
      return newStatus;
    });
  }, [formData.step1]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || !hasSearched) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return rowData.filter((user) =>
      user.displayName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.empId.toLowerCase().includes(query) ||
      user.manager.toLowerCase().includes(query) ||
      user.storeLocation.toLowerCase().includes(query) ||
      user.brand.toLowerCase().includes(query)
    );
  }, [rowData, searchQuery, hasSearched]);

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
        headerCheckboxSelection: false,
        pinned: "left",
        filter: false,
        sortable: false,
      },
      {
        headerName: "Display Name",
        field: "displayName",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Emp ID",
        field: "empId",
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "Manager",
        field: "manager",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Store Location",
        field: "storeLocation",
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
        headerName: "Start Date",
        field: "startDate",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params: any) => formatDate(params.value),
      },
    ],
    []
  );

  const onSelectionChanged = (event: any) => {
    if (isUpdatingSelection) {
      return;
    }
    
    const selectedRows = event.api.getSelectedRows();
    const selectedUserId = selectedRows.length > 0 ? [selectedRows[0].id] : [];
    
    setFormData((prev) => {
      if (JSON.stringify(prev.step2.selectedUsers.sort()) !== JSON.stringify(selectedUserId.sort())) {
        return {
          ...prev,
          step2: {
            ...prev.step2,
            selectedUsers: selectedUserId,
          },
        };
      }
      return prev;
    });
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  // Sync selected rows when formData changes
  useEffect(() => {
    if (gridApi && formData.step2.selectionMethod === "specific" && !isUpdatingSelection) {
      const selectedRowNodes = gridApi.getSelectedRows();
      const currentSelectedIds = selectedRowNodes.map((row: UserRow) => row.id);
      const formSelectedIds = formData.step2.selectedUsers;
      
      if (JSON.stringify(currentSelectedIds.sort()) !== JSON.stringify(formSelectedIds.sort())) {
        setIsUpdatingSelection(true);
        gridApi.deselectAll();
        formSelectedIds.forEach((userId) => {
          const rowNode = gridApi.getRowNode(userId);
          if (rowNode) {
            rowNode.setSelected(true);
          }
        });
        setTimeout(() => setIsUpdatingSelection(false), 0);
      }
    }
  }, [gridApi, formData.step2.selectionMethod]);

  // Validate Step 2
  useEffect(() => {
    let isValid = false;
    if (formData.step2.selectionMethod === "specific") {
      isValid = formData.step2.selectedUsers.length > 0;
    } else if (formData.step2.selectionMethod === "selectEach") {
      isValid = formData.step2.selectedUsers.length > 0;
    } else if (formData.step2.selectionMethod === "upload") {
      isValid = formData.step2.uploadedFile !== null;
    }
    setValidationStatus((prev) => {
      const newStatus = [...prev];
      newStatus[1] = isValid;
      return newStatus;
    });
  }, [formData.step2]);

  // Step 3 is always valid if we reach it
  useEffect(() => {
    if (currentStep === 3) {
      setValidationStatus((prev) => {
        const newStatus = [...prev];
        newStatus[2] = true;
        return newStatus;
      });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (validationStatus[currentStep - 1] && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would send the form data to your API
      console.log("Submitting user group:", formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("User Group created successfully!");
      router.push("/stores");
    } catch (error) {
      console.error("Error creating user group:", error);
      alert("An error occurred while creating the user group. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        step2: {
          ...prev.step2,
          uploadedFile: file,
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/stores")}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="ml-2">Back to Stores</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!validationStatus[currentStep - 1]}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    !validationStatus[currentStep - 1]
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {currentStep === 1 && (
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={formData.step1.groupName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    step1: { ...prev.step1, groupName: e.target.value },
                  }))
                }
                className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                placeholder=" "
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.step1.groupName
                  ? 'top-0.5 text-xs text-blue-600' 
                  : 'top-3.5 text-sm text-gray-500'
              }`}>
                User Group Name <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <textarea
                value={formData.step1.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    step1: { ...prev.step1, description: e.target.value },
                  }))
                }
                className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline resize-none"
                placeholder=" "
                rows={4}
              />
              <label className={`absolute left-4 top-3.5 transition-all duration-200 pointer-events-none ${
                formData.step1.description
                  ? 'top-0.5 text-xs text-blue-600' 
                  : 'text-sm text-gray-500'
              }`}>
                Description <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.step1.owner}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    step1: { ...prev.step1, owner: e.target.value },
                  }))
                }
                className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                placeholder=" "
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.step1.owner
                  ? 'top-0.5 text-xs text-blue-600' 
                  : 'top-3.5 text-sm text-gray-500'
              }`}>
                Owner <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.step1.tags}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    step1: { ...prev.step1, tags: e.target.value },
                  }))
                }
                className="w-full px-4 pt-5 pb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                placeholder=" "
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.step1.tags
                  ? 'top-0.5 text-xs text-blue-600' 
                  : 'top-3.5 text-sm text-gray-500'
              }`}>
                Tags
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ownerIsReviewer"
                checked={formData.step1.ownerIsReviewer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    step1: { ...prev.step1, ownerIsReviewer: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="ownerIsReviewer" className="text-base font-medium text-gray-700 cursor-pointer">
                Owner is Reviewer
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Users Method <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                {[
                  { value: "specific", label: "Specific Users" },
                  { value: "selectEach", label: "Select Each User" },
                  { value: "upload", label: "Upload File" },
                ].map((option, index, array) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        step2: {
                          ...prev.step2,
                          selectionMethod: option.value as "specific" | "selectEach" | "upload",
                        },
                      }));
                      // Reset search state when switching methods
                      if (option.value === "specific") {
                        setHasSearched(false);
                        setSearchQuery("");
                      }
                    }}
                    className={`px-4 py-2 min-w-16 rounded-md border border-gray-300 ${
                      formData.step2.selectionMethod === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } ${index === 0 && "rounded-r-none"} ${
                      array.length > 2 &&
                      index === 1 &&
                      "rounded-none border-r-0 border-l-0"
                    } ${index === array.length - 1 && "rounded-l-none"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 1 - Specific Users */}
            {formData.step2.selectionMethod === "specific" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search and Select Users <span className="text-red-500">*</span>
                </label>

                {/* Search Bar */}
                <div className="mb-4">
                  <div className="flex gap-2 max-w-md">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search by Display Name, Email, Emp ID, Manager, Store Location, or Brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            setHasSearched(true);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasSearched(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Search
                    </button>
                  </div>
                  {hasSearched && searchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Showing {filteredData.length} of {rowData.length} users
                    </p>
                  )}
                </div>

                {/* Table - Only show after search */}
                {hasSearched && (
                  <>
                    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
                      <AgGridReact
                        rowData={filteredData}
                        columnDefs={columnDefs}
                        rowSelection="single"
                        onSelectionChanged={onSelectionChanged}
                        onGridReady={onGridReady}
                        suppressRowClickSelection={false}
                        defaultColDef={{
                          sortable: true,
                          filter: true,
                          resizable: true,
                        }}
                        domLayout="normal"
                        rowHeight={50}
                        headerHeight={40}
                        isRowSelectable={(params: any) => true}
                        getRowId={(params: any) => params.data.id}
                      />
                    </div>

                    {formData.step2.selectedUsers.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        1 user selected
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Option 2 - Select Each User */}
            {formData.step2.selectionMethod === "selectEach" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Users <span className="text-red-500">*</span>
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {users.map((user) => (
                    <label
                      key={user.email}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.step2.selectedUsers.includes(
                          user.email
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              step2: {
                                ...prev.step2,
                                selectedUsers: [
                                  ...prev.step2.selectedUsers,
                                  user.email,
                                ],
                              },
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              step2: {
                                ...prev.step2,
                                selectedUsers: prev.step2.selectedUsers.filter(
                                  (email) => email !== user.email
                                ),
                              },
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span>
                        {user.name} ({user.email})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Option 3 - Upload File */}
            {formData.step2.selectionMethod === "upload" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      CSV, XLSX, XLS files only
                    </span>
                  </label>
                  {formData.step2.uploadedFile && (
                    <div className="mt-4 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        Selected: {formData.step2.uploadedFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Review Your User Group
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-md space-y-3">
              <div>
                <span className="font-medium text-gray-700">Group Name:</span>
                <span className="ml-2 text-gray-900">
                  {formData.step1.groupName}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Description:</span>
                <span className="ml-2 text-gray-900">
                  {formData.step1.description}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Owner:</span>
                <span className="ml-2 text-gray-900">
                  {formData.step1.owner}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tags:</span>
                <span className="ml-2 text-gray-900">
                  {formData.step1.tags || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Owner is Reviewer:</span>
                <span className="ml-2 text-gray-900">
                  {formData.step1.ownerIsReviewer ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Selection Method:
                </span>
                <span className="ml-2 text-gray-900">
                  {formData.step2.selectionMethod === "specific"
                    ? "Specific Users"
                    : formData.step2.selectionMethod === "selectEach"
                    ? "Select Each User"
                    : "Upload File"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Selected Users:</span>
                <div className="ml-2 mt-1">
                  {formData.step2.selectionMethod === "specific" && (
                    <div className="text-gray-900">
                      {formData.step2.selectedUsers.length > 0 ? (
                        <div>
                          <p className="text-sm mb-2">
                            1 user selected
                          </p>
                          <ul className="list-disc list-inside mt-1 text-sm">
                            {formData.step2.selectedUsers.map((userId) => {
                              const user = rowData.find((u) => u.id === userId);
                              return (
                                <li key={userId}>
                                  {user?.displayName || userId} ({user?.email || ""})
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-500">No user selected</span>
                      )}
                    </div>
                  )}
                  {formData.step2.selectionMethod === "selectEach" && (
                    <div className="text-gray-900">
                      {formData.step2.selectedUsers.length} user(s) selected
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {formData.step2.selectedUsers.map((email) => {
                          const user = users.find((u) => u.email === email);
                          return (
                            <li key={email}>
                              {user?.name || email} ({email})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {formData.step2.selectionMethod === "upload" && (
                    <div className="text-gray-900">
                      {formData.step2.uploadedFile?.name || "No file selected"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
