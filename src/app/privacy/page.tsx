import { LegalArticle, PageHeader, Paragraph, SectionHeading } from "@/components/ui/typography";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RecordStashd",
};

export default function PrivacyPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <PageHeader title="Privacy Policy" versionLabel={`Version ${PRIVACY_POLICY_VERSION}`} />
      <LegalArticle>
        <SectionHeading>Information We Collect</SectionHeading>
        <Paragraph>
          When you sign in with Spotify via Clerk, we receive your basic profile information (such as your
          name, username, and avatar). Within the app, we store your reviews, ratings, likes, and follows.
        </Paragraph>

        <SectionHeading>How We Use Information</SectionHeading>
        <Paragraph>
          We use your information to operate and improve RecordStashd, including displaying album data, your
          reviews, and social features.
        </Paragraph>

        <SectionHeading>Spotify Data</SectionHeading>
        <Paragraph>
          We access Spotify content via the Spotify API to show album information. We do not store your
          Spotify listening history. Use of Spotify content is subject to Spotify’s terms.
        </Paragraph>

        <SectionHeading>Sharing</SectionHeading>
        <Paragraph>
          We do not sell your personal information. We may share data with service providers that help us
          operate the app (e.g., hosting, authentication) under appropriate agreements.
        </Paragraph>

        <SectionHeading>Retention</SectionHeading>
        <Paragraph>
          We retain account and content data for as long as your account is active. You can delete reviews
          individually or delete your account to remove your data.
        </Paragraph>

        <SectionHeading>Your Rights</SectionHeading>
        <Paragraph>
          Depending on your location, you may have rights to access, correct, or delete your information.
          Contact us to exercise these rights.
        </Paragraph>

        <SectionHeading>Data Deletion</SectionHeading>
        <Paragraph>
          To request deletion of your account and data, contact support@recordstashd.app or use in-app
          controls where available. Account deletion removes your reviews, likes, and follows.
        </Paragraph>

        <SectionHeading>Security</SectionHeading>
        <Paragraph>
          We use industry-standard security measures to protect your information. No system is completely
          secure.
        </Paragraph>

        <SectionHeading>Children</SectionHeading>
        <Paragraph>RecordStashd is not intended for children under 13.</Paragraph>

        <SectionHeading>Changes</SectionHeading>
        <Paragraph>We may update this policy. If we make material changes, we will notify you.</Paragraph>

        <SectionHeading>Contact</SectionHeading>
        <Paragraph>Contact us at support@recordstashd.app.</Paragraph>
      </LegalArticle>
    </section>
  );
}


