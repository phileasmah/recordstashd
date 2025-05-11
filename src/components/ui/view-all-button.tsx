import Link from "next/link";
import { Button } from "./button";

interface ViewAllButtonProps {
  href: string;
}

export function ViewAllButton({ href }: ViewAllButtonProps) {
  return (
    <Link href={href}>
      <Button variant="link" size="sm" className="h-auto group">
        View all
        <svg
          className="-ml-0.5 w-4 h-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </Link>
  );
} 