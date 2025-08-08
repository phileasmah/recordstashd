"use client";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    LOCAL_STORAGE_CONSENT_KEY,
    PRIVACY_POLICY_VERSION,
    TERMS_VERSION,
    type LegalConsentStored,
} from "@/lib/legal";
import { cn } from "@/lib/utils";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CONSENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LegalConsentStored;
        if (
          parsed.termsVersion === TERMS_VERSION &&
          parsed.privacyPolicyVersion === PRIVACY_POLICY_VERSION
        ) {
          setHasConsented(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const onToggleConsent = () => {
    const next = !hasConsented;
    setHasConsented(next);
    try {
      if (next) {
        const payload: LegalConsentStored = {
          termsVersion: TERMS_VERSION,
          privacyPolicyVersion: PRIVACY_POLICY_VERSION,
          acceptedAt: Date.now(),
        };
        localStorage.setItem(LOCAL_STORAGE_CONSENT_KEY, JSON.stringify(payload));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_CONSENT_KEY);
      }
    } catch {
      // ignore
    }
  };

  return (
    <Card className="mt-40 relative mx-auto max-w-[460px] border-zinc-800 bg-zinc-950 p-8">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-white">RecordStashd</h1>
        <p className="text-center text-sm text-zinc-400">
          Sign in to start reviewing albums
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <label className="flex items-start gap-3 text-sm text-zinc-200">
          <Checkbox checked={hasConsented} onCheckedChange={onToggleConsent} />
          <span>
            I agree to the
            {" "}
            <Link className="underline" href="/terms" target="_blank">
              Terms of Use
            </Link>
            {" "}and acknowledge the{ " "}
            <Link className="underline" href="/privacy" target="_blank">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <div className="flex justify-center">
          <div className={cn(!hasConsented && "pointer-events-none opacity-50")}
          >
            <SignIn path="/sign-in" routing="path" />
          </div>
        </div>
        {!hasConsented && (
          <p className="text-xs text-zinc-400 text-center">
            You must accept the Terms to continue.
          </p>
        )}
      </div>
    </Card>
  );
}
