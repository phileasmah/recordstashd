import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RecordStashd",
};

export default function PrivacyPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-1 text-sm">Version 1.0.0</p>
      </header>
      <article className="mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mt-8">Information We Collect</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          When you sign in with Google, we receive your basic profile information (such as your
          name, username, and avatar). Within the app, we store your reviews, ratings, likes, and follows.
        </p>

        <h2 className="text-xl font-semibold mt-8">How We Use Information</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We use your information to operate and improve RecordStashd, including displaying album data, your
          reviews, and social features.
        </p>

        <h2 className="text-xl font-semibold mt-8">Spotify Data</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We access Spotify content via the Spotify API to show album information. We do not store your
          Spotify listening history. Use of Spotify content is subject to Spotify’s terms.
        </p>

        <h2 className="text-xl font-semibold mt-8">Sharing</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We do not sell your personal information. We may share data with service providers that help us
          operate the app (e.g., hosting, authentication) under appropriate agreements.
        </p>

        <h2 className="text-xl font-semibold mt-8">Retention</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We retain account and content data for as long as your account is active. You can delete reviews
          individually or delete your account to remove your data.
        </p>

        <h2 className="text-xl font-semibold mt-8">Your Rights</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          Depending on your location, you may have rights to access, correct, or delete your information.
          Contact us to exercise these rights.
        </p>

        <h2 className="text-xl font-semibold mt-8">Data Deletion</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          To request deletion of your account and data, contact support@recordstashd.app or use in-app
          controls where available. Account deletion removes your reviews, likes, and follows.
        </p>

        <h2 className="text-xl font-semibold mt-8">Security</h2>
        <p className="leading-7 text-zinc-300 mt-4">
          We use industry-standard security measures to protect your information. No system is completely
          secure.
        </p>

        <h2 className="text-xl font-semibold mt-8">Children</h2>
        <p className="leading-7 text-zinc-300 mt-4">RecordStashd is not intended for children under 13.</p>

        <h2 className="text-xl font-semibold mt-8">Changes</h2>
        <p className="leading-7 text-zinc-300 mt-4">We may update this policy. If we make material changes, we will notify you.</p>

        <h2 className="text-xl font-semibold mt-8">Contact</h2>
        <p className="leading-7 text-zinc-300 mt-4">Contact us at support@recordstashd.app.</p>
      </article>
    </section>
  );
}


