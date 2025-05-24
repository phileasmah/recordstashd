import Link from "next/link";
import { Button } from "./button";

interface ViewAllButtonProps {
  href: string;
}

export function ViewAllButton({ href }: ViewAllButtonProps) {
  return (
    <Link href={href}>
      <Button className="bg-primary/90 h-10 rounded-3xl px-4 py-3 transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:rounded-md">
        View all
        <svg
          className="-ml-0.5"
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
