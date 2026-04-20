import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voto Informado Colombia 2026",
  description:
    "Descubre cuál candidato presidencial representa mejor tus ideales. Basado en los programas de gobierno oficiales.",
  openGraph: {
    title: "Voto Informado Colombia 2026",
    description:
      "Responde 27 afirmaciones clave y descubre cuál candidato presidencial representa mejor tus ideales. Basado en los programas de gobierno oficiales.",
    type: "website",
    locale: "es_CO",
    siteName: "Voto Informado Colombia",
    // opengraph-image.tsx at app root auto-generates the preview image
  },
  twitter: {
    card: "summary_large_image",
    title: "Voto Informado Colombia 2026",
    description:
      "Descubre cuál candidato presidencial representa mejor tus ideales. Basado en los programas de gobierno oficiales.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
