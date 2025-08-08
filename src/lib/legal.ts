export const TERMS_VERSION = "1.0.0";
export const PRIVACY_POLICY_VERSION = "1.0.0";

export const LOCAL_STORAGE_CONSENT_KEY = "recordstashd.legalConsent";

export interface LegalConsentStored {
  termsVersion: string;
  privacyPolicyVersion: string;
  acceptedAt: number; // epoch ms when user checked the box pre-auth
}

