"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatReportTimestamp } from "@/utils/utils";

type OrphanAccountRow = {
  TARGET_SYSTEM_NAME: string;
  ACCOUNT_KEY: string;
  PRIMARY_EMAIL: string;
  FULL_NAME: string;
  ORPHAN_INSIGHT: string;
  "First Detected": string;
  "Last Detected": string;
};

const WRAP_COLUMN_DEFAULT_WIDTH = 280;
const WRAP_COLUMN_PRIMARY_EMAIL_WIDTH = 360;

const COLUMNS: { key: keyof OrphanAccountRow; label: string; wrapColumn?: boolean; compactPaddingRight?: boolean; compactPaddingLeft?: boolean; wrapWidth?: number }[] = [
  { key: "TARGET_SYSTEM_NAME", label: "Target System", compactPaddingRight: true },
  { key: "ACCOUNT_KEY", label: "Account Key", wrapColumn: true, compactPaddingLeft: true },
  { key: "PRIMARY_EMAIL", label: "Primary Email", wrapColumn: true, wrapWidth: WRAP_COLUMN_PRIMARY_EMAIL_WIDTH },
  { key: "FULL_NAME", label: "Full Name" },
  { key: "ORPHAN_INSIGHT", label: "Orphan Insight" },
  { key: "First Detected", label: "First Detected" },
  { key: "Last Detected", label: "Last Detected" },
];

const ORPHAN_ACCOUNT_DATA: OrphanAccountRow[] = [
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "AADTests1@devumassp.dev", PRIMARY_EMAIL: "AADTests1@devexch.umassp.edu", FULL_NAME: "ADTests1, ADTests A", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.895001464 AM GMT", "Last Detected": "12-FEB-26 06.37.31.690540060 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "mmenzi@devumassp.dev", PRIMARY_EMAIL: "", FULL_NAME: "Menzi, Maria", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.888523311 AM GMT", "Last Detected": "12-FEB-26 06.37.31.685393331 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "satest008@devexch.umassp.edu", PRIMARY_EMAIL: "satest008@devexch.umassp.edu", FULL_NAME: "Heena Khurana", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.882337506 AM GMT", "Last Detected": "12-FEB-26 06.37.31.680317929 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML122@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML122@devexch.umassp.edu", FULL_NAME: "SAPRFUML122", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.876098278 AM GMT", "Last Detected": "12-FEB-26 06.37.31.675202357 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "studentumm071@devexch.umassp.edu", PRIMARY_EMAIL: "studentumm071@devexch.umassp.edu", FULL_NAME: "studentumm071", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.859661781 AM GMT", "Last Detected": "12-FEB-26 06.37.31.660806364 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "HealthMailbox3c856ba8132a460c9180bd1b84684f98@devexch.umassp.edu", PRIMARY_EMAIL: "HealthMailbox3c856ba8132a460c9180bd1b84684f98@devexch.umassp.edu", FULL_NAME: "HealthMailbox-excdev1601-005", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.846938543 AM GMT", "Last Detected": "12-FEB-26 06.37.31.651265958 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "EJets1@devumassp.dev", PRIMARY_EMAIL: "EJets1@devumassp.dev", FULL_NAME: "Jets1, EmpMonFN M", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.835775457 AM GMT", "Last Detected": "12-FEB-26 06.37.29.804324535 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML021@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML021@devexch.umassp.edu", FULL_NAME: "SAPRFUML021", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.829624655 AM GMT", "Last Detected": "12-FEB-26 06.37.29.798795515 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMD171@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMD171@devexch.umassp.edu", FULL_NAME: "SAPRFUMD171", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.823356444 AM GMT", "Last Detected": "12-FEB-26 06.37.29.793704541 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML136@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML136@devexch.umassp.edu", FULL_NAME: "SAPRFUML136", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.816961659 AM GMT", "Last Detected": "12-FEB-26 06.37.29.788544681 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "CCrossSection3@devumassp.dev", PRIMARY_EMAIL: "CCrossSection3@devexch.umassp.edu", FULL_NAME: "CrossSection3, CrossSection C", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.808275124 AM GMT", "Last Detected": "12-FEB-26 06.37.29.783285001 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "satest027@devexch.umassp.edu", PRIMARY_EMAIL: "satest027@devexch.umassp.edu", FULL_NAME: "Daniel Thibeault ", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.801878958 AM GMT", "Last Detected": "12-FEB-26 06.37.29.778168097 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML415@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML415@devexch.umassp.edu", FULL_NAME: "SAPRFUML415", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.45.202633037 AM GMT", "Last Detected": "12-FEB-26 06.37.29.773140507 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "pdavis@devexch.umassp.edu", PRIMARY_EMAIL: "pdavis@devexch.umassp.edu", FULL_NAME: "Davis, Patrick", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.778440558 AM GMT", "Last Detected": "12-FEB-26 06.37.29.755157461 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "eevans@devexch.umassp.edu", PRIMARY_EMAIL: "eevans@devexch.umassp.edu", FULL_NAME: "Evans, Eric", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.771979703 AM GMT", "Last Detected": "12-FEB-26 06.37.29.749838230 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SToktorbaeva@devexch.umassp.edu", PRIMARY_EMAIL: "SToktorbaeva@devexch.umassp.edu", FULL_NAME: "Toktorbaeva, Seil", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.765345532 AM GMT", "Last Detected": "12-FEB-26 06.37.29.744664660 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SSingh1@devumassp.dev", PRIMARY_EMAIL: "SSingh1@devumassp.dev", FULL_NAME: "Singh1, Sugandha", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.753470099 AM GMT", "Last Detected": "12-FEB-26 06.37.29.734872752 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW012@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW012@devexch.umassp.edu", FULL_NAME: "SAPRFLAW012", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.747320198 AM GMT", "Last Detected": "12-FEB-26 06.37.29.729678891 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW017@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW017@devexch.umassp.edu", FULL_NAME: "SAPRFLAW017", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.740951192 AM GMT", "Last Detected": "12-FEB-26 06.37.29.723971171 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW030@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW030@devexch.umassp.edu", FULL_NAME: "SAPRFLAW030", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.734799228 AM GMT", "Last Detected": "12-FEB-26 06.37.29.718786564 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW034@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW034@devexch.umassp.edu", FULL_NAME: "SAPRFLAW034", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.728142474 AM GMT", "Last Detected": "12-FEB-26 06.37.29.713712695 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW008@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW008@devexch.umassp.edu", FULL_NAME: "SAPRFLAW008", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.721839749 AM GMT", "Last Detected": "12-FEB-26 06.37.29.708722293 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW032@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW032@devexch.umassp.edu", FULL_NAME: "SAPRFLAW032", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.714147714 AM GMT", "Last Detected": "12-FEB-26 06.37.29.703553290 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW037@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW037@devexch.umassp.edu", FULL_NAME: "SAPRFLAW037", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.708114101 AM GMT", "Last Detected": "12-FEB-26 06.37.29.694668909 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW011@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW011@devexch.umassp.edu", FULL_NAME: "SAPRFLAW011", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.702008908 AM GMT", "Last Detected": "12-FEB-26 06.37.29.689294855 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW005@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW005@devexch.umassp.edu", FULL_NAME: "SAPRFLAW005", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.695761910 AM GMT", "Last Detected": "12-FEB-26 06.37.29.684045189 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFLAW018@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFLAW018@devexch.umassp.edu", FULL_NAME: "SAPRFLAW018", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.687984514 AM GMT", "Last Detected": "12-FEB-26 06.37.29.678916538 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SATESTUMD042@devexch.umassp.edu", PRIMARY_EMAIL: "SATESTUMD042@devexch.umassp.edu", FULL_NAME: "SATESTUMD042", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.682024793 AM GMT", "Last Detected": "12-FEB-26 06.37.29.673123227 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB151@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB151@devexch.umassp.edu", FULL_NAME: "SAPRFUMB151", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.675916576 AM GMT", "Last Detected": "12-FEB-26 06.37.29.666127471 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB180@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB180@devexch.umassp.edu", FULL_NAME: "SAPRFUMB180", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.669867579 AM GMT", "Last Detected": "12-FEB-26 06.37.29.660921883 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML254@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML254@devexch.umassp.edu", FULL_NAME: "SAPRFUML254", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.663759702 AM GMT", "Last Detected": "12-FEB-26 06.37.29.655859111 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB173@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB173@devexch.umassp.edu", FULL_NAME: "SAPRFUMB173", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.657661050 AM GMT", "Last Detected": "12-FEB-26 06.37.29.649370266 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB242@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB242@devexch.umassp.edu", FULL_NAME: "SAPRFUMB242", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.651418108 AM GMT", "Last Detected": "12-FEB-26 06.37.29.642470716 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB202@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB202@devexch.umassp.edu", FULL_NAME: "SAPRFUMB202", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.645484047 AM GMT", "Last Detected": "12-FEB-26 06.37.29.637542579 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML156@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML156@devexch.umassp.edu", FULL_NAME: "SAPRFUML156", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.639317840 AM GMT", "Last Detected": "12-FEB-26 06.37.29.632745840 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML163@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML163@devexch.umassp.edu", FULL_NAME: "SAPRFUML163", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.633280913 AM GMT", "Last Detected": "12-FEB-26 06.37.29.627319677 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML345@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML345@devexch.umassp.edu", FULL_NAME: "SAPRFUML345", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.627289554 AM GMT", "Last Detected": "12-FEB-26 06.37.29.622347693 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML209@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML209@devexch.umassp.edu", FULL_NAME: "SAPRFUML209", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.621099982 AM GMT", "Last Detected": "12-FEB-26 06.37.29.617515731 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML358@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML358@devexch.umassp.edu", FULL_NAME: "SAPRFUML358", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.612965061 AM GMT", "Last Detected": "12-FEB-26 06.37.29.612568494 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMD052@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMD052@devexch.umassp.edu", FULL_NAME: "SAPRFUMD052", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.604716906 AM GMT", "Last Detected": "12-FEB-26 06.37.29.607561456 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML040@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML040@devexch.umassp.edu", FULL_NAME: "SAPRFUML040", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.598561366 AM GMT", "Last Detected": "12-FEB-26 06.37.29.602470482 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB033@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB033@devexch.umassp.edu", FULL_NAME: "SAPRFUMB033", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.592339706 AM GMT", "Last Detected": "12-FEB-26 06.37.29.597492078 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB068@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB068@devexch.umassp.edu", FULL_NAME: "SAPRFUMB068", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.585998453 AM GMT", "Last Detected": "12-FEB-26 06.37.29.592451850 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML171@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML171@devexch.umassp.edu", FULL_NAME: "SAPRFUML171", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.579726786 AM GMT", "Last Detected": "12-FEB-26 06.37.29.587537183 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMD031@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMD031@devexch.umassp.edu", FULL_NAME: "SAPRFUMD031", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.573534962 AM GMT", "Last Detected": "12-FEB-26 06.37.29.582456804 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML418@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML418@devexch.umassp.edu", FULL_NAME: "SAPRFUML418", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.567510713 AM GMT", "Last Detected": "12-FEB-26 06.37.29.577542468 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUML240@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUML240@devexch.umassp.edu", FULL_NAME: "SAPRFUML240", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.561346921 AM GMT", "Last Detected": "12-FEB-26 06.37.29.572544965 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB196@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB196@devexch.umassp.edu", FULL_NAME: "SAPRFUMB196", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.555201036 AM GMT", "Last Detected": "12-FEB-26 06.37.29.567637999 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMD005@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMD005@devexch.umassp.edu", FULL_NAME: "SAPRFUMD005", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.549036133 AM GMT", "Last Detected": "12-FEB-26 06.37.29.562796052 AM GMT" },
  { TARGET_SYSTEM_NAME: "ADPODEV", ACCOUNT_KEY: "SAPRFUMB215@devexch.umassp.edu", PRIMARY_EMAIL: "SAPRFUMB215@devexch.umassp.edu", FULL_NAME: "SAPRFUMB215", ORPHAN_INSIGHT: "NO_MATCH", "First Detected": "16-JAN-26 10.44.46.542681830 AM GMT", "Last Detected": "12-FEB-26 06.37.29.557862306 AM GMT" },
];

export default function OrphanAccountReportPage() {
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
            <h1 className="text-xl font-semibold text-blue-700">Orphan Account Report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Accounts without active owners or matching identity
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {COLUMNS.map(({ key, label, wrapColumn, wrapWidth, compactPaddingRight, compactPaddingLeft }) => {
                    const w = wrapColumn ? (wrapWidth ?? WRAP_COLUMN_DEFAULT_WIDTH) : null;
                    return (
                    <th
                      key={key}
                      className={`py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-normal break-words align-top ${w ? "min-w-0" : ""} ${compactPaddingRight ? "pr-1 pl-4" : compactPaddingLeft ? "pl-1 pr-4" : "px-4"}`}
                      style={w ? { width: w, maxWidth: w } : undefined}
                    >
                      {label}
                    </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ORPHAN_ACCOUNT_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                    {COLUMNS.map(({ key, wrapColumn, wrapWidth, compactPaddingRight, compactPaddingLeft }) => {
                    const w = wrapColumn ? (wrapWidth ?? WRAP_COLUMN_DEFAULT_WIDTH) : null;
                    return (
                      <td
                        key={key}
                        className={`py-3 text-gray-800 whitespace-normal break-words align-top ${w ? "min-w-0" : ""} ${compactPaddingRight ? "pr-1 pl-4" : compactPaddingLeft ? "pl-1 pr-4" : "px-4"}`}
                        style={w ? { maxWidth: w } : undefined}
                      >
                        {row[key] !== undefined && row[key] !== "" ? (key === "First Detected" || key === "Last Detected" ? formatReportTimestamp(row[key]) : String(row[key])) : "—"}
                      </td>
                    );
                    })}
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
