"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatReportTimestamp } from "@/utils/utils";
import { USER_PERMISSION_DATA, type UserPermissionRow } from "./data";

const COL_WIDTHS: Record<string, string> = {
  EVENT_TIME_UTC: "7%",
  ACTION: "6%",
  APPLICATION: "6%",
  DISPLAY_NAME: "11%",
  USER_LOGIN_IN_PAYLOAD: "9%",
  USER_LOGIN: "7%",
  PERMISSION_TYPE: "7%",
  PERMISSION_NAME: "7%",
  RESOURCE_DISPLAY_NAME: "9%",
  GRANT_TYPE: "11%",
  STATUS: "8%",
  _details: "2%",
};

const COLUMNS: { key: keyof UserPermissionRow; label: string }[] = [
  { key: "EVENT_TIME_UTC", label: "Event Time" },
  { key: "ACTION", label: "Action" },
  { key: "APPLICATION", label: "App" },
  { key: "DISPLAY_NAME", label: "Display Name" },
  { key: "USER_LOGIN_IN_PAYLOAD", label: "Login (Payload)" },
  { key: "USER_LOGIN", label: "User Login" },
  { key: "PERMISSION_TYPE", label: "Perm Type" },
  { key: "PERMISSION_NAME", label: "Permission" },
  { key: "RESOURCE_DISPLAY_NAME", label: "Resource" },
  { key: "GRANT_TYPE", label: "Grant" },
  { key: "STATUS", label: "Status" },
];

function hasAccessBundleOrPolicy(row: UserPermissionRow): boolean {
  const a = row.ACCESS_BUNDLE_NAME;
  const p = row.POLICY_NAME;
  return (a !== undefined && a !== "") || (p !== undefined && p !== "");
}

export default function UserPermissionReportPage() {
  const [detailRow, setDetailRow] = useState<UserPermissionRow | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-none px-4 py-3 md:px-6 md:py-4">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          Back to Reports
        </Link>
      </div>

      <div className="flex-1 min-h-0 overflow-auto px-4 md:px-6 pb-4">
        <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex-none px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
            <h1 className="text-base md:text-xl font-semibold text-blue-700">User Permission Report</h1>
            <p className="text-sm text-gray-500 mt-1">Permission add/remove events by user and application</p>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
          <table className="border-collapse text-xs table-fixed w-full">
            <colgroup>
              {COLUMNS.map(({ key }) => (
                <col key={key} style={{ width: COL_WIDTHS[key] ?? "auto" }} />
              ))}
              <col style={{ width: COL_WIDTHS._details }} />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
              <tr>
                {COLUMNS.map(({ key, label }) => (
                  <th key={key} className="px-1 py-1.5 text-left font-semibold text-gray-600 uppercase tracking-tight whitespace-normal break-words align-top overflow-hidden">
                    {label}
                  </th>
                ))}
                <th className="px-0.5 py-1.5 w-8 text-center font-semibold text-gray-600 uppercase tracking-tight" aria-label="Details" />
              </tr>
            </thead>
            <tbody>
              {USER_PERMISSION_DATA.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                  {COLUMNS.map(({ key }) => {
                    const raw = row[key];
                    const isEmpty = raw === undefined || raw === "";
                    const display =
                      isEmpty ? "—" : key === "EVENT_TIME_UTC" ? formatReportTimestamp(raw) : String(raw);
                    return (
                      <td key={key} className="px-1 py-1.5 text-gray-800 whitespace-normal break-words align-top overflow-hidden">
                        {display}
                      </td>
                    );
                  })}
                  <td className="px-0.5 py-1.5 align-middle text-center">
                    {hasAccessBundleOrPolicy(row) ? (
                      <button
                        type="button"
                        onClick={() => setDetailRow(row)}
                        className="inline-flex items-center justify-center w-7 h-7 border border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        title="Show Access Bundle and Policy"
                        aria-label="Show Access Bundle and Policy"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {detailRow !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDetailRow(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Access Bundle and Policy details"
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-auto px-5 pt-4 pb-4 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailRow(null)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <section className="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden">
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Access Bundle</span>
                </div>
                <div className="px-3 py-3 min-h-[2.5rem]">
                  <p className="text-sm text-gray-900 break-words leading-relaxed">
                    {detailRow.ACCESS_BUNDLE_NAME !== undefined && detailRow.ACCESS_BUNDLE_NAME !== ""
                      ? detailRow.ACCESS_BUNDLE_NAME
                      : "—"}
                  </p>
                </div>
              </section>
              <section className="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden">
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Policy</span>
                </div>
                <div className="px-3 py-3 min-h-[2.5rem]">
                  <p className="text-sm text-gray-900 break-words leading-relaxed font-mono text-[13px]">
                    {detailRow.POLICY_NAME !== undefined && detailRow.POLICY_NAME !== ""
                      ? detailRow.POLICY_NAME
                      : "—"}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
