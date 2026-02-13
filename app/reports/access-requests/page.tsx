"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";

type TableRow = Record<string, unknown>;

function normalizeToRows(data: unknown): TableRow[] {
  if (Array.isArray(data)) return data as TableRow[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as TableRow[];
    if (Array.isArray(obj.accessRequests)) return obj.accessRequests as TableRow[];
    if (Array.isArray(obj.data)) return obj.data as TableRow[];
    if (Array.isArray(obj.results)) return obj.results as TableRow[];
  }
  return [];
}

const ID_COLUMN_CANDIDATES = [
  "id",
  "accessRequestId",
  "accessRequestID",
  "requestId",
  "request_id",
  "access_request_id",
];

function getColumns(rows: TableRow[]): string[] {
  if (rows.length === 0) return [];
  const first = rows[0];
  return Object.keys(first).filter((k) => first[k] !== undefined && first[k] !== null);
}

function getIdColumn(columns: string[]): string | null {
  for (const candidate of ID_COLUMN_CANDIDATES) {
    const found = columns.find((c) => c.toLowerCase() === candidate.toLowerCase());
    if (found) return found;
  }
  return null;
}

function cellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function AccessRequestsPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/reports/access-requests")
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const rows = normalizeToRows(json);
        setData(rows);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || err?.error || "Failed to load access requests");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = getColumns(data);
  const idColumn = getIdColumn(columns);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 max-w-[1600px] mx-auto">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Reports — Access Requests</h1>
            <p className="text-gray-600 text-sm mt-1">
              Access requests from Access Governance
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col gap-2 px-6 py-4 bg-blue-50 text-blue-900 border-t border-blue-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>Access requests are not configured.</span>
              </div>
              <p className="text-sm text-blue-800">
                Set <code className="bg-blue-100 px-1 rounded font-mono text-xs">AG_ACCESS_REQUESTS_BEARER_TOKEN</code> to your <code className="bg-blue-100 px-1 rounded font-mono text-xs">accessToken</code> JWT, or the full cookie string (e.g. <code className="bg-blue-100 px-1 rounded font-mono text-xs">accessToken=eyJ...; uidTenant=...; ...</code>). On Vercel: Project → Settings → Environment Variables, add the variable, then redeploy.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              {data.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  No access requests found.
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {columns.map((col) => (
                        <th
                          key={col}
                          className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-normal break-words align-top ${col.toLowerCase() === "justification" ? "min-w-[280px] w-[30%]" : ""}`}
                        >
                          {col.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        {columns.map((col) => {
                          const value = row[col];
                          const isIdCol = idColumn === col && value != null && String(value).trim() !== "";
                          return (
                            <td
                              key={col}
                              className="px-4 py-3 text-sm text-gray-800 whitespace-normal break-words align-top"
                            >
                              {isIdCol ? (
                                <Link
                                  href={`/reports/access-requests/${encodeURIComponent(String(value))}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                  {cellValue(value)}
                                </Link>
                              ) : (
                                cellValue(value)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
