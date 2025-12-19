"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      router.replace("/dashboard");
    } else {
      router.replace("/Login");
    }
  }, [router, searchParams]);

  return <div>Logging you in...</div>;
}
