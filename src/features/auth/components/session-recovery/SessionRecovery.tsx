"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { CurrentUser } from "@/shared/api/types";

export function SessionRecovery() {
  const router = useRouter();
  const refreshed = useRef(false);
  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: async ({ signal }) => {
      const result = await browserApi<{ user: CurrentUser }>("/auth/me", {
        signal,
      });
      refreshed.current = true;

      return result.user;
    },
    retry: false,
  });

  useEffect(() => {
    if (!sessionQuery.data || !refreshed.current) {
      return;
    }

    refreshed.current = false;
    router.refresh();
  }, [router, sessionQuery.data]);

  return null;
}
