
import { Link } from "react-router";
import { CodeXml, ArrowUpRight } from "lucide-react";
import logo from "../assets/logo/medique-logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-[#DAE0E7] bg-white dark:border-[#374151] dark:bg-[#1F2937]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <img src={logo} alt="MediQue" className="h-9 w-auto" />
            </Link>

            <p className="max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
              A simpler way to manage hospital queues.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
            <Link
              to="/"
              className="transition-colors hover:text-[#0B81B7] dark:hover:text-[#72C9EB]"
            >
              Home
            </Link>

            <Link
              to="/track-queue"
              className="transition-colors hover:text-[#0B81B7] dark:hover:text-[#72C9EB]"
            >
              Track Queue
            </Link>

            <Link
              to="/about"
              className="transition-colors hover:text-[#0B81B7] dark:hover:text-[#72C9EB]"
            >
              About
            </Link>

            <a
              href="https://github.com/ShaikMohammedHaneef/medi-que"
              target="_blank"
              rel="noreferrer"
              aria-label="MediQue GitHub repository"
              className="inline-flex items-center gap-0.5 transition-colors hover:text-[#0B81B7] dark:hover:text-[#72C9EB]"
            >
              GitHub
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#DAE0E7] py-4 text-center text-xs text-slate-500 dark:border-[#374151] dark:text-slate-400 sm:text-left">
          © {new Date().getFullYear()} MediQue. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
