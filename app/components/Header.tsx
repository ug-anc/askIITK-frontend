"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ANC_COUNCIL_URL = "https://anc-website-blond.vercel.app";

export default function Header() {
  const pathname = usePathname();
  const onTeamPage = pathname === "/team";

  return (
    <header className="w-full bg-transparent mb-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://anc-website-blond.vercel.app/_next/image?url=%2Fimages%2Flogo%2Fanc_logo2.png&w=128&q=75"
            alt="ANC Council logo"
            className="h-10 w-10 "
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Ask AnC
            </span>
            <span className="text-sm text-slate-500">ANC Council</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href={onTeamPage ? "/" : "/team"}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white"
          >
            {onTeamPage ? "← Back to Chat" : "Meet the Team"}
          </Link>
          <a
            href={ANC_COUNCIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
          >
            ANC Council ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
