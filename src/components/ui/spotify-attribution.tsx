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

  const inlineSvgSizeClass = size === "sm" ? "size-4" : "size-5";
  const badgeSvgSizeClass = size === "sm" ? "[&_svg]:size-3" : "[&_svg]:size-4";

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
          <SpotifyLogoBlack className={inlineSvgSizeClass} />
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
        <SpotifyLogoBlack className={inlineSvgSizeClass} />
        <span>{label ?? "On Spotify"}</span>
      </Link>
    );
  }

  // Badge variant (dark-friendly and matches padding of Badge component)
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
          // Match Badge: px-2 py-0.5 text-xs, rounded-md, gap-1
          "inline-flex items-center justify-center rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow]",
          badgeSvgSizeClass,
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
        // Match Badge: px-2 py-0.5 text-xs, rounded-md, gap-1
        "inline-flex items-center justify-center rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow]",
        badgeSvgSizeClass,
        className,
      )}
    >
      <SpotifyLogoBlack />
      <span className="hidden sm:inline">{label ?? "Open on Spotify"}</span>
    </Link>
  );
}

export default SpotifyAttribution;


