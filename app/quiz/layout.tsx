"use client";

import Link from "next/link";
import { ArrowLeft, Vote } from "lucide-react";
import { MatchTrackerMini } from "@/components/match/match-tracker-mini";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <Vote className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Voto Informado</span>
          </Link>
          <MatchTrackerMini />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
