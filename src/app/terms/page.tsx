import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | RecordStashd",
};

export default function TermsPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Use</h1>
        <p className="text-muted-foreground mt-1 text-sm">Version 1.0.0</p>
      </header>
      <article className="mx-auto max-w-3xl">
        <p className="leading-7 text-zinc-300 mt-4">
          Welcome to RecordStashd. By accessing or using our service, you agree to these Terms of Use.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Using RecordStashd</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          You must be at least 13 years old (or the minimum age required in your jurisdiction) to use this
          service. You are responsible for your account and all activity under it.
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Your Content</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          You retain ownership of reviews and ratings you post. By posting, you grant us a non-exclusive
          license to host and display your content in connection with the service.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Spotify Data</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We use the Spotify API to display album information. RecordStashd is not affiliated with Spotify.
          Use of Spotify content is subject to Spotify’s terms and branding guidelines.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Prohibited Conduct</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          Do not misuse the service.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
          <li>Posting unlawful or infringing content</li>
          <li>Harassing or impersonating others</li>
          <li>Attempting to disrupt or abuse the platform</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">5. Termination</h2>
        <p className="leading-7 text-zinc-300 mt-4">We may suspend or terminate accounts that violate these terms.</p>

        <h2 className="text-xl font-semibold mt-8">6. Changes</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We may update these Terms. If we make material changes, we will notify you and may request
          re-consent.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Contact</h2>
        <p className="leading-7 text-zinc-300 mt-4">Contact us at support@recordstashd.app.</p>
      </article>
    </section>
  );
}


