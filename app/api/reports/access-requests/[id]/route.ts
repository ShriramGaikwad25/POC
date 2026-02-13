import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  "https://ag-poc-idoc2ay9p1ie.access-governance.us-ashburn-1.oci.oraclecloud.com/access-governance/access-controls/20250331/accessRequests";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Access Request ID is required" },
        { status: 400 }
      );
    }

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

    const url = `${BASE_URL}/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
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
    console.error("Error fetching access request detail:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch access request detail",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
