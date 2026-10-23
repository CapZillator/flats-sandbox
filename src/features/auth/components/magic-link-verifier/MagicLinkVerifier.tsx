"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { CurrentUser } from "@/shared/api/types";
import { getSafeCallbackUrl } from "@/features/auth/callback-url";

export function MagicLinkVerifier() {
  const search = useSearchParams();
  const router = useRouter();
  const ran = useRef(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const email = search.get("email");
  const token = search.get("token");
  const callbackUrl = getSafeCallbackUrl(search.get("callbackUrl"), "/account");
  const verifyMutation = useMutation({
    mutationFn: () =>
      email && token
        ? browserApi<{ user: CurrentUser }>("/auth/magic-link/verify", {
            method: "POST",
            body: JSON.stringify({ email, token }),
          })
        : browserApi<{ user: CurrentUser }>("/auth/me"),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.session, user);
      router.replace(callbackUrl);
    },
    onError: (cause) => {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    },
  });

  useEffect(() => {
    if (ran.current) {
      return;
    }

    ran.current = true;
    verifyMutation.mutate();
  }, [verifyMutation]);

  return (
    <div className="statePanel">
      {error ? (
        <>
          <span className="stateIcon">!</span>

          <h1>{error}</h1>
        </>
      ) : (
        <>
          <span className="spinner" />

          <h1>Signing you in…</h1>
        </>
      )}
    </div>
  );
}
