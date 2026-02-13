import { NextResponse } from "next/server";

const ACCESS_REQUESTS_URL =
  "https://ag-poc-idoc2ay9p1ie.access-governance.us-ashburn-1.oci.oraclecloud.com/access-governance/access-controls/20250331/accessRequests";

export async function GET() {
  try {
    const token = process.env.AG_ACCESS_REQUESTS_BEARER_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "AG_ACCESS_REQUESTS_BEARER_TOKEN is not set",
        },
        { status: 500 }
      );
    }

    const response = await fetch(ACCESS_REQUESTS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        {
          error: "Access Governance API error",
          status: response.status,
          details: text || response.statusText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching access requests:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch access requests",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
