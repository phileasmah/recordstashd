import {
    BulletList,
    LegalArticle,
    PageHeader,
    Paragraph,
    SectionHeading,
} from "@/components/ui/typography";
import { TERMS_VERSION } from "@/lib/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | RecordStashd",
};

export default function TermsPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <PageHeader title="Terms of Use" versionLabel={`Version ${TERMS_VERSION}`} />
      <LegalArticle>
        <Paragraph>
          Welcome to RecordStashd. By accessing or using our service, you agree to these Terms of Use.
        </Paragraph>

        <SectionHeading>1. Using RecordStashd</SectionHeading>
        <Paragraph>
          You must be at least 13 years old (or the minimum age required in your jurisdiction) to use this
          service. You are responsible for your account and all activity under it.
        </Paragraph>

        <SectionHeading>2. Your Content</SectionHeading>
        <Paragraph>
          You retain ownership of reviews and ratings you post. By posting, you grant us a non-exclusive
          license to host and display your content in connection with the service.
        </Paragraph>

        <SectionHeading>3. Spotify Data</SectionHeading>
        <Paragraph>
          We use the Spotify API to display album information. RecordStashd is not affiliated with Spotify.
          Use of Spotify content is subject to Spotify’s terms and branding guidelines.
        </Paragraph>

        <SectionHeading>4. Prohibited Conduct</SectionHeading>
        <Paragraph>
          Do not misuse the service.
        </Paragraph>
        <BulletList>
          <li>Posting unlawful or infringing content</li>
          <li>Harassing or impersonating others</li>
          <li>Attempting to disrupt or abuse the platform</li>
        </BulletList>

        <SectionHeading>5. Termination</SectionHeading>
        <Paragraph>We may suspend or terminate accounts that violate these terms.</Paragraph>

        <SectionHeading>6. Changes</SectionHeading>
        <Paragraph>
          We may update these Terms. If we make material changes, we will notify you and may request
          re-consent.
        </Paragraph>

        <SectionHeading>7. Contact</SectionHeading>
        <Paragraph>Contact us at support@recordstashd.app.</Paragraph>
      </LegalArticle>
    </section>
  );
}


