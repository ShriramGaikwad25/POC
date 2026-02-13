"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatReportTimestamp } from "@/utils/utils";

type DeletedTargetRow = {
  TARGET_SYSTEM_NAME: string;
  ACCOUNT_KEY: string;
  PRIMARY_EMAIL: string;
  ORPHAN_INSIGHT: string;
  "Discovery Date": string;
  "Last Sync": string;
};

const COLUMNS: { key: keyof DeletedTargetRow; label: string; wrapColumn?: boolean; compactPadding?: boolean; compactPaddingRight?: boolean; compactPaddingLeft?: boolean }[] = [
  { key: "TARGET_SYSTEM_NAME", label: "Target System", compactPaddingRight: true },
  { key: "ACCOUNT_KEY", label: "Account Key", wrapColumn: true, compactPaddingLeft: true },
  { key: "PRIMARY_EMAIL", label: "Primary Email", wrapColumn: true },
  { key: "ORPHAN_INSIGHT", label: "Orphan Insight" },
  { key: "Discovery Date", label: "Discovery Date", compactPadding: true },
  { key: "Last Sync", label: "Last Sync", compactPadding: true },
];

const DELETED_TARGET_DATA: DeletedTargetRow[] = [
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "Jeremiah_Almanzar@student.uml.edu", PRIMARY_EMAIL: "Jeremiah_Almanzar@student.uml.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 07.39.16.182989941 PM GMT", "Last Sync": "11-FEB-26 07.39.16.182989941 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "amarbasu@umass.edu", PRIMARY_EMAIL: "amarbasu@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 07.33.57.700934108 PM GMT", "Last Sync": "11-FEB-26 07.33.57.700934108 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "yihanxu@umass.edu", PRIMARY_EMAIL: "yihanxu@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 07.16.43.026334762 PM GMT", "Last Sync": "11-FEB-26 07.16.43.026334762 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "Wajiha.Albreizat001@umb.edu", PRIMARY_EMAIL: "Wajiha.Albreizat001@umb.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 07.02.18.074080511 PM GMT", "Last Sync": "11-FEB-26 07.02.18.074080511 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "trodsamai@umass.edu", PRIMARY_EMAIL: "trodsamai@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 07.02.18.068392139 PM GMT", "Last Sync": "11-FEB-26 07.02.18.068392139 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "egeertsma@umass.edu", PRIMARY_EMAIL: "egeertsma@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 06.47.23.005374240 PM GMT", "Last Sync": "11-FEB-26 06.47.23.005374240 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "emitan@umass.edu", PRIMARY_EMAIL: "emitan@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 06.37.36.459286482 PM GMT", "Last Sync": "11-FEB-26 06.37.36.459286482 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "sjlopez@umass.edu", PRIMARY_EMAIL: "sjlopez@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "11-FEB-26 07.50.00.517564890 AM GMT", "Last Sync": "11-FEB-26 07.50.00.517564890 AM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "SohaIftikhar_Cheema@student.uml.edu", PRIMARY_EMAIL: "SohaIftikhar_Cheema@student.uml.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "07-FEB-26 11.08.23.569919895 PM GMT", "Last Sync": "11-FEB-26 07.47.08.276726538 AM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "gloffredo@umass.edu", PRIMARY_EMAIL: "gloffredo@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.126777153 PM GMT", "Last Sync": "10-FEB-26 07.43.07.126777153 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "agriffen@umass.edu", PRIMARY_EMAIL: "agriffen@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.121425002 PM GMT", "Last Sync": "10-FEB-26 07.43.07.121425002 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "tsossa@umass.edu", PRIMARY_EMAIL: "tsossa@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.116161876 PM GMT", "Last Sync": "10-FEB-26 07.43.07.116161876 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "dfernandezro@umass.edu", PRIMARY_EMAIL: "dfernandezro@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.109537334 PM GMT", "Last Sync": "10-FEB-26 07.43.07.109537334 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "twoolley@umass.edu", PRIMARY_EMAIL: "twoolley@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.103922284 PM GMT", "Last Sync": "10-FEB-26 07.43.07.103922284 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "echica@umass.edu", PRIMARY_EMAIL: "echica@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.098606288 PM GMT", "Last Sync": "10-FEB-26 07.43.07.098606288 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "jamenuvor@umass.edu", PRIMARY_EMAIL: "jamenuvor@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.093259965 PM GMT", "Last Sync": "10-FEB-26 07.43.07.093259965 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "cgismondi@umass.edu", PRIMARY_EMAIL: "cgismondi@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.087687850 PM GMT", "Last Sync": "10-FEB-26 07.43.07.087687850 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "yunlee@umass.edu", PRIMARY_EMAIL: "yunlee@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.080755732 PM GMT", "Last Sync": "10-FEB-26 07.43.07.080755732 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "gkatta@umass.edu", PRIMARY_EMAIL: "gkatta@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.075383691 PM GMT", "Last Sync": "10-FEB-26 07.43.07.075383691 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "jbarndt@umass.edu", PRIMARY_EMAIL: "jbarndt@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.069190323 PM GMT", "Last Sync": "10-FEB-26 07.43.07.069190323 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "mintravaia@umass.edu", PRIMARY_EMAIL: "mintravaia@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.063829089 PM GMT", "Last Sync": "10-FEB-26 07.43.07.063829089 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "hopehealy@umass.edu", PRIMARY_EMAIL: "hopehealy@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.058362574 PM GMT", "Last Sync": "10-FEB-26 07.43.07.058362574 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "ralfattani@umass.edu", PRIMARY_EMAIL: "ralfattani@umass.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.051688677 PM GMT", "Last Sync": "10-FEB-26 07.43.07.051688677 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "Abdel_Jurf@student.uml.edu", PRIMARY_EMAIL: "Abdel_Jurf@student.uml.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.029155656 PM GMT", "Last Sync": "10-FEB-26 07.43.07.029155656 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "Janice_Clark@student.uml.edu", PRIMARY_EMAIL: "Janice_Clark@student.uml.edu", ORPHAN_INSIGHT: "USER_DELETED", "Discovery Date": "10-FEB-26 07.43.07.023755862 PM GMT", "Last Sync": "10-FEB-26 07.43.07.023755862 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.fec12f545290ad60dac7a45691ed9bb1", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.52.15.936831495 PM GMT", "Last Sync": "11-FEB-26 07.52.42.227204677 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.a7aad23c57f1485b6f4625f8602f465f", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "11-FEB-26 07.50.52.557572257 PM GMT", "Last Sync": "11-FEB-26 07.50.52.557572257 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.2d79f386748162aa6ae6f863f833cb2a", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.58.35.502831554 PM GMT", "Last Sync": "11-FEB-26 07.48.51.903286455 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.f6be86d550c65f7dbde35b6490429f7e", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.58.35.501445480 PM GMT", "Last Sync": "11-FEB-26 07.46.54.454967062 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.a3df996a8e342c9dac5ebb4c023b8105", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.58.35.499929330 PM GMT", "Last Sync": "11-FEB-26 07.46.53.557051604 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.721269cfdb0c7207aff7fe6ebeec7eb3", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.58.35.504291049 PM GMT", "Last Sync": "11-FEB-26 07.45.25.356823646 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.fec12f545290ad60dac7a45691ed9bb1", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.51.39.839049187 PM GMT", "Last Sync": "11-FEB-26 07.36.36.925540914 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.a7aad23c57f1485b6f4625f8602f465f", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "11-FEB-26 07.34.03.882120612 PM GMT", "Last Sync": "11-FEB-26 07.34.03.882120612 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.2d79f386748162aa6ae6f863f833cb2a", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.50.41.639015933 PM GMT", "Last Sync": "11-FEB-26 07.21.47.908178174 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.f6be86d550c65f7dbde35b6490429f7e", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.50.41.637577499 PM GMT", "Last Sync": "11-FEB-26 07.11.54.402939730 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.a3df996a8e342c9dac5ebb4c023b8105", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.50.41.636145817 PM GMT", "Last Sync": "11-FEB-26 07.07.14.021436802 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.721269cfdb0c7207aff7fe6ebeec7eb3", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "10-FEB-26 07.45.33.267478620 PM GMT", "Last Sync": "11-FEB-26 06.57.22.230184104 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.d7a80d5b600312f5e767600fac776ee9", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.17.00.332846972 PM GMT", "Last Sync": "07-FEB-26 11.17.00.332846972 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.f576329bf4bc3c929ddc62401b38d58a", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.17.00.330754403 PM GMT", "Last Sync": "07-FEB-26 11.17.00.330754403 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.b9de37e08ffa68403a58d8bfe734666e", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.16.59.489780554 PM GMT", "Last Sync": "07-FEB-26 11.16.59.489780554 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.3cb9044f0c24c25fd73e6c68d6dd299c", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.14.08.963926224 PM GMT", "Last Sync": "07-FEB-26 11.14.08.963926224 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.3cb9044f0c24c25fd73e6c68d6dd299c", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.12.52.746463386 PM GMT", "Last Sync": "07-FEB-26 11.12.52.746463386 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.d7a80d5b600312f5e767600fac776ee9", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.10.40.230712674 PM GMT", "Last Sync": "07-FEB-26 11.10.40.230712674 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.f576329bf4bc3c929ddc62401b38d58a", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.10.40.229006568 PM GMT", "Last Sync": "07-FEB-26 11.10.40.229006568 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.identity.OCI.88e94816-8414-44d2-81c7-8271181676a5.b9de37e08ffa68403a58d8bfe734666e", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "07-FEB-26 11.10.40.227301966 PM GMT", "Last Sync": "07-FEB-26 11.10.40.227301966 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.3ccb31b7e22fe9371ca0ca1446694382", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "06-FEB-26 12.37.04.936607148 PM GMT", "Last Sync": "06-FEB-26 12.37.04.936607148 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.aa5cac690ee03969df6171ea7b2177ed", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "06-FEB-26 12.37.04.934808513 PM GMT", "Last Sync": "06-FEB-26 12.37.04.934808513 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.c5e678853864f8093eb003ba14e47ade", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "06-FEB-26 12.37.04.932995314 PM GMT", "Last Sync": "06-FEB-26 12.37.04.932995314 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.6c1f1aafc8796baea26c1a02ba396c43", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "06-FEB-26 12.37.04.931221536 PM GMT", "Last Sync": "06-FEB-26 12.37.04.931221536 PM GMT" },
  { TARGET_SYSTEM_NAME: "OCI-POC", ACCOUNT_KEY: "targetId.account.OCI.88e94816-8414-44d2-81c7-8271181676a5.07df369ce274acd4347d555daf1114fd", PRIMARY_EMAIL: "", ORPHAN_INSIGHT: "", "Discovery Date": "06-FEB-26 12.37.04.929262378 PM GMT", "Last Sync": "06-FEB-26 12.37.04.929262378 PM GMT" },
];

export default function DeletedTargetIdentityReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 md:px-6 max-w-[1600px] mx-auto">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h1 className="text-xl font-semibold text-blue-700">Deleted Target Identity Report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Accounts and identities removed from target systems
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {COLUMNS.map(({ key, label, wrapColumn, compactPadding, compactPaddingRight, compactPaddingLeft }) => (
                    <th
                      key={key}
                      className={`py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-normal break-words align-top ${wrapColumn ? "min-w-0 w-[280px] max-w-[280px]" : ""} ${compactPadding ? "px-1" : "px-4"} ${compactPaddingRight ? "pr-1" : ""} ${compactPaddingLeft ? "pl-1" : ""}`}
                      style={wrapColumn ? { maxWidth: 280 } : undefined}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DELETED_TARGET_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                    {COLUMNS.map(({ key, wrapColumn, compactPadding, compactPaddingRight, compactPaddingLeft }) => (
                      <td
                        key={key}
                        className={`py-3 text-gray-800 whitespace-normal break-words align-top ${wrapColumn ? "min-w-0 max-w-[280px]" : ""} ${compactPadding ? "px-1" : "px-4"} ${compactPaddingRight ? "pr-1" : ""} ${compactPaddingLeft ? "pl-1" : ""}`}
                        style={wrapColumn ? { maxWidth: 280 } : undefined}
                      >
                        {row[key] !== undefined && row[key] !== "" ? (key === "Discovery Date" || key === "Last Sync" ? formatReportTimestamp(row[key]) : String(row[key])) : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
