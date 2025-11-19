"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RolesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/gateway/admin-roles");
  }, [router]);

  return null;
}


