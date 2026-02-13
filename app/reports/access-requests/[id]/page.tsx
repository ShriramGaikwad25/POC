"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { formatReportTimestamp } from "@/utils/utils";

type DetailData = Record<string, unknown>;

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function cellDisplay(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function isArrayOrObject(value: unknown): boolean {
  return Array.isArray(value) || (value !== null && typeof value === "object");
}

function ArrayAsTable({ items }: { items: unknown[] }) {
  if (items.length === 0) {
    return <span className="text-gray-500 text-sm">No items</span>;
  }
  const allObjects = items.every(isPlainObject);
  if (allObjects) {
    const rows = items as Record<string, unknown>[];
    const columns = Array.from(
      new Set(rows.flatMap((r) => Object.keys(r)))
    ).filter((k) => rows.some((r) => r[k] !== undefined && r[k] !== null));
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50/50 shadow-sm">
        <table className="w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-normal break-words align-top"
                >
                  {formatKey(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/80">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-3 text-gray-800 whitespace-normal break-words align-top"
                  >
                    {cellDisplay(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50/50 shadow-sm">
      <table className="w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-normal break-words align-top">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50/80">
              <td className="px-4 py-3 text-gray-800 whitespace-normal break-words align-top">
                {cellDisplay(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <pre className="text-xs bg-gray-50 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap border border-gray-100 max-h-32 overflow-y-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  if (Array.isArray(value)) {
    return <ArrayAsTable items={value} />;
  }
  const s = String(value);
  const formatted = formatReportTimestamp(s);
  return formatted !== s ? formatted : s;
}

export default function AccessRequestDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No Access Request ID provided");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/reports/access-requests/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json as DetailData);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || err?.error || "Failed to load access request detail");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const entries = data ? Object.entries(data) : [];
  const scalarEntries = entries.filter(([, v]) => !isArrayOrObject(v));
  const complexEntries = entries.filter(([, v]) => isArrayOrObject(v));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full flex-1 py-5 px-4 md:px-6 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/reports/access-requests"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Access Requests
          </Link>
          <span className="text-xs text-gray-500 font-mono truncate max-w-full" title={id}>
            {id}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col min-0">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50/50 shrink-0">
            <h1 className="text-xl font-semibold text-blue-700">Access Request Detail</h1>
          </div>

          {loading && (
            <div className="flex-1 flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center gap-2 px-4 md:px-6 py-3 bg-red-50 text-red-800 border-t border-red-100 shrink-0">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!loading && !error && data && (
            <div className="flex-1 overflow-auto px-4 md:px-6 py-5 md:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {scalarEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className={`py-3 px-4 rounded-lg bg-gray-50/60 border border-gray-100 min-w-0 ${key.toLowerCase() === "justification" ? "sm:col-span-2 xl:col-span-2" : ""}`}
                  >
                    <dt className="text-xs font-medium text-blue-600 uppercase tracking-wide whitespace-normal break-words">
                      {formatKey(key)}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-normal break-words">
                      {formatValue(value)}
                    </dd>
                  </div>
                ))}
              </div>
              {complexEntries.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-gray-200">
                  {complexEntries.map(([key, value]) => (
                    <div key={key} className="min-w-0 pb-2">
                      <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                        {formatKey(key)}
                      </h3>
                      <div className="min-w-0">{formatValue(value)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
