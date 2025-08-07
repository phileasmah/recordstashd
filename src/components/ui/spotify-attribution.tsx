"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import SpotifyLogoBlack from "../svgs/spotify-logo-black";

interface SpotifyAttributionProps {
  href?: string;
  className?: string;
  size?: "sm" | "md";
  variant?: "badge" | "inline";
  label?: string;
  asButton?: boolean;
}

export function SpotifyAttribution({
  href,
  className,
  size = "sm",
  variant = "badge",
  label,
  asButton,
}: SpotifyAttributionProps) {
  if (!href) return null;

  const sizeClasses =
    size === "sm"
      ? "h-5 px-2 text-[11px] [&_svg]:size-3.5"
      : "h-6 px-2.5 text-xs [&_svg]:size-4";

  if (variant === "inline") {
    if (asButton) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(href, "_blank", "noopener,noreferrer");
          }}
          className={cn(
            "text-muted-foreground inline-flex items-center gap-1.5 hover:underline",
            className,
          )}
        >
          <SpotifyLogoBlack className="size-4" />
          <span>{label ?? "On Spotify"}</span>
        </button>
      );
    }
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-muted-foreground inline-flex items-center gap-1.5 hover:underline",
          className,
        )}
      >
        <SpotifyLogoBlack className="size-4" />
        <span>{label ?? "On Spotify"}</span>
      </Link>
    );
  }

  if (asButton) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(href, "_blank", "noopener,noreferrer");
        }}
        aria-label={label ?? "Open on Spotify"}
        className={cn(
          "bg-background/80 text-foreground/80 hover:text-foreground/90 border border-border/70 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-background/60 inline-flex items-center gap-1 rounded-full transition-colors",
          sizeClasses,
          className,
        )}
      >
        <SpotifyLogoBlack />
        <span className="hidden sm:inline">{label ?? "Open on Spotify"}</span>
      </button>
    );
  }
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ?? "Open on Spotify"}
      className={cn(
        "bg-background/80 text-foreground/80 hover:text-foreground/90 border border-border/70 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-background/60 inline-flex items-center gap-1 rounded-full transition-colors",
        sizeClasses,
        className,
      )}
    >
      <SpotifyLogoBlack />
      <span className="hidden sm:inline">{label ?? "Open on Spotify"}</span>
    </Link>
  );
}

export default SpotifyAttribution;


