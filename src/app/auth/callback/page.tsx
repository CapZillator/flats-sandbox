import { Suspense } from "react";
import type { Metadata } from "next";
import { MagicLinkVerifier } from "@/features/auth/components/magic-link-verifier/MagicLinkVerifier";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthCallbackPage() {
  return (
    <main className="authCallback">
      <Suspense fallback={<div className="statePanel">Signing you in…</div>}>
        <MagicLinkVerifier />
      </Suspense>
    </main>
  );
}
