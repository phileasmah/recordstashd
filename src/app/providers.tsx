"use client";

import {
    LOCAL_STORAGE_CONSENT_KEY,
    PRIVACY_POLICY_VERSION,
    TERMS_VERSION,
    type LegalConsentStored,
} from "@/lib/legal";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient, useConvex } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// This is for providers that don't have use use client 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConsentRecorder>{children}</ConsentRecorder>
    </ConvexProviderWithClerk>
  );
}

function ConsentRecorder({ children }: { children: React.ReactNode }) {
  const convex = useConvex();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CONSENT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as LegalConsentStored;
      if (
        parsed.termsVersion === TERMS_VERSION &&
        parsed.privacyPolicyVersion === PRIVACY_POLICY_VERSION
      ) {
        convex
          .mutation(api.users.recordLegalConsent, {
            termsVersion: parsed.termsVersion,
            privacyPolicyVersion: parsed.privacyPolicyVersion,
            acceptedAt: parsed.acceptedAt,
          })
          .catch(() => {});
        // optional: keep it until versions change
      }
    } catch {}
  }, [convex, isSignedIn]);

  return <>{children}</>;
}
