import { cn } from "@/lib/utils";
import * as React from "react";

export function PageHeader({
  title,
  versionLabel,
  className,
}: {
  title: string;
  versionLabel?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-8", className)}>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {versionLabel ? (
        <p className="text-muted-foreground mt-1 text-sm">{versionLabel}</p>
      ) : null}
    </header>
  );
}

export function SectionHeading({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h2 className={cn("text-xl font-semibold mt-8", className)}>{children}</h2>
  );
}

export function Paragraph({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <p className={cn("leading-7 text-zinc-300 mt-4", className)}>{children}</p>
  );
}

export function BulletList({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <ul className={cn("mt-4 list-disc space-y-2 pl-6 text-zinc-300", className)}>
      {children}
    </ul>
  );
}

export function LegalArticle({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <article className={cn("mx-auto max-w-3xl", className)}>{children}</article>
  );
}


