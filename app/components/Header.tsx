"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AnC_COUNCIL_URL = "https://anc-website-blond.vercel.app";

export default function Header() {
  const pathname = usePathname();
  const onTeamPage = pathname === "/team";

  return (
    <header className="w-full bg-transparent mb-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <img
            src="https://anc-website-blond.vercel.app/_next/image?url=%2Fimages%2Flogo%2Fanc_logo2.png&w=128&q=75"
            alt="AnC Council logo"
            className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
          />
          <div className="flex flex-col leading-tight">
            <span className="whitespace-nowrap text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              Ask AnC
            </span>
            <span className="whitespace-nowrap text-xs text-slate-500 sm:text-sm">AnC Council</span>
          </div>
        </Link>

        <nav className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href={onTeamPage ? "/" : "/team"}
            className="inline-flex items-center whitespace-nowrap rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-white sm:px-3 sm:py-2 sm:text-sm"
          >
            {onTeamPage ? "← Back to Chat" : "Meet the Team"}
          </Link>
          <a
            href={AnC_COUNCIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-slate-700 sm:px-3 sm:py-2 sm:text-sm"
          >
            AnC Council ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
