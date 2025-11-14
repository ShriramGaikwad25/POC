"use client";

import React from "react";
import { BackButton } from "@/components/BackButton";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RolesPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Roles</h1>
            <p className="text-gray-600 mt-1">Manage roles and permissions</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Admin Roles</h2>
            <p className="text-blue-700 mb-4">Manage administrative roles and their privileges.</p>
            <button
              onClick={() => router.push("/settings/gateway/admin-roles")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Admin Roles
            </button>
          </div>
          
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Role management</p>
            <p className="text-gray-500 text-sm mt-2">Configure and manage user roles and permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

