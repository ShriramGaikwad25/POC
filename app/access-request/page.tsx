"use client";
import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import HorizontalTabs from "@/components/HorizontalTabs";
import UserSearchTab from "./UserSearchTab";
import UserGroupTab from "./UserGroupTab";
import StoreTab from "./StoreTab";
import RegionTab from "./RegionTab";
import CustomGroupTab from "./CustomGroupTab";
import SelectAccessCombined from "./SelectAccessCombined";
import { useSelectedUsers } from "@/contexts/SelectedUsersContext";
import { useSelectedGroups } from "@/contexts/SelectedGroupsContext";
import { useSelectedApps } from "@/contexts/SelectedAppsContext";
import { useSelectedEntitlements } from "@/contexts/SelectedEntitlementsContext";

const AccessRequest: React.FC = () => {
  const { selectedUsers, removeUser, clearUsers } = useSelectedUsers();
  const { selectedGroups, removeGroup, clearGroups } = useSelectedGroups();
  const { selectedApps, removeApp, clearApps } = useSelectedApps();
  const { selectedEntitlements, clearEntitlements } = useSelectedEntitlements();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeLocationTab, setActiveLocationTab] = useState(0);

  const steps = [
    { id: 1, title: "Select User" },
    { id: 2, title: "Select Location" },
    { id: 3, title: "Select Access" },
  ];

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const userTabs = [
    {
      label: "Select User",
      component: UserSearchTab,
    },
    {
      label: "User Group",
      component: UserGroupTab,
    },
  ];

  const locationTabs = [
    {
      label: "Store",
      component: StoreTab,
    },
    {
      label: "Region",
      component: RegionTab,
    },
    {
      label: "Custom Group",
      component: CustomGroupTab,
    },
  ];


  return (
    <div>
      <h1 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2 text-blue-950">
        Access Request
      </h1>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? "bg-red-600 text-white"
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
            {currentStep === 3 ? (
              <button
                onClick={() => {
                  // Handle submit logic here
                  console.log("Submitting access request...");
                  
                  // Clear all selections
                  clearUsers();
                  clearGroups();
                  clearApps();
                  clearEntitlements();
                  
                  // Reset to step 1
                  setCurrentStep(1);
                  setActiveTab(0);
                  setActiveLocationTab(0);
                }}
                disabled={selectedEntitlements.length === 0}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  selectedEntitlements.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Submit Request
              </button>
            ) : currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Step 1 Content */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <HorizontalTabs
            tabs={userTabs}
            activeIndex={activeTab}
            onChange={setActiveTab}
          />
        </div>
      )}

      {/* Step 2 Content - Select Location */}
      {currentStep === 2 && (
        <>
          {/* Show Selected Users/Groups at the top */}
          {(selectedUsers.length > 0 || selectedGroups.length > 0) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Selected Users ({selectedUsers.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="relative p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                      >
                        <button
                          onClick={() => removeUser(user.id)}
                          className="absolute top-1 right-1 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Remove user"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="pr-6">
                          <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-1">{user.username}</p>
                          <p className="text-xs text-gray-600 truncate mt-1">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className="truncate">{user.department}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Groups */}
              {selectedGroups.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Selected User Groups ({selectedGroups.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedGroups.map((group) => (
                      <div
                        key={group.id}
                        className="relative p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                      >
                        <button
                          onClick={() => removeGroup(group.id)}
                          className="absolute top-1 right-1 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Remove group"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="pr-6">
                          <p className="font-medium text-sm text-gray-900 truncate">{group.groupName}</p>
                          <p className="text-xs text-gray-500 truncate mt-1">{group.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className="truncate">{group.numberOfUsers} users</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location Selection Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <HorizontalTabs
              tabs={locationTabs}
              activeIndex={activeLocationTab}
              onChange={setActiveLocationTab}
            />
          </div>
        </>
      )}

      {/* Step 3 Content - Select Access */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Access</h2>
          <SelectAccessCombined />
        </div>
      )}
    </div>
  );
};

export default AccessRequest;
