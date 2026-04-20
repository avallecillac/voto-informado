"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2, X as CloseIcon } from "lucide-react";

interface ShareButtonsProps {
  topCandidate: string;
  topPercentage: number;
}

/* ============ Brand icons (lucide doesn't ship brand logos) ============ */

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/* ============================== Component ============================== */

export function ShareButtons({
  topCandidate,
  topPercentage,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [igModalOpen, setIgModalOpen] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://voto-informado.co";

  const shareText = `Mi match presidencial para Colombia 2026 es ${topCandidate} con ${Math.round(
    topPercentage
  )}% de coincidencia. Descubre el tuyo basándote en los programas de gobierno oficiales.`;

  const shareUrl = siteUrl;
  const fullShareString = `${shareText} ${shareUrl}`;

  // X / Twitter — works with intent URL
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(
    "VotoInformado,Colombia2026"
  )}`;

  // Facebook — only URL; text comes from OG metadata on target page
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  // WhatsApp — wa.me accepts URL with pre-filled text
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    fullShareString
  )}`;

  const copyFullText = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(fullShareString);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      return true;
    } catch {
      return false;
    }
  };

  const handleInstagram = async () => {
    // Try native share sheet on mobile (user can pick IG Stories / Direct)
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (
      isMobile &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: "Voto Informado Colombia 2026",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled; fall through to modal
      }
    }

    // Desktop: open a modal explaining the copy+paste flow
    await copyFullText();
    setIgModalOpen(true);
  };

  return (
    <div className="rounded-lg border bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold">Comparte tu resultado</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Ayuda a que más personas voten con información. Invita a tus amigos a
        descubrir su match.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {/* WhatsApp — first because it's the most used channel in Colombia */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>

        {/* X (Twitter) */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <XIcon className="h-4 w-4" />
          <span>X</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-[#1877F2] px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1565c0]"
        >
          <FacebookIcon className="h-4 w-4" />
          <span>Facebook</span>
        </a>

        {/* Instagram */}
        <button
          onClick={handleInstagram}
          className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <InstagramIcon className="h-4 w-4" />
          <span>Instagram</span>
        </button>

        {/* Copiar */}
        <Button
          variant="outline"
          size="sm"
          onClick={copyFullText}
          className="col-span-2 gap-2 h-auto py-2.5 sm:col-span-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copiar texto</span>
            </>
          )}
        </Button>
      </div>

      {copied && !igModalOpen && (
        <p className="mt-3 text-center text-xs text-green-700">
          ✓ Texto copiado al portapapeles.
        </p>
      )}

      {/* Instagram instructions modal */}
      {igModalOpen && (
        <InstagramModal
          text={fullShareString}
          onClose={() => setIgModalOpen(false)}
        />
      )}
    </div>
  );
}

/* ======================== Instagram flow modal ========================= */

function InstagramModal({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <InstagramIcon className="h-5 w-5 text-[#DD2A7B]" />
          <h3 className="text-base font-semibold">Compartir en Instagram</h3>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Instagram no permite compartir automáticamente desde la web. Sigue
          estos pasos:
        </p>

        <ol className="mt-3 space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DD2A7B] text-xs font-bold text-white">
              1
            </span>
            <span>
              Ya copiamos tu resultado al portapapeles ✓
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DD2A7B] text-xs font-bold text-white">
              2
            </span>
            <span>Abre Instagram y crea un post o historia</span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DD2A7B] text-xs font-bold text-white">
              3
            </span>
            <span>Pega el texto (Ctrl/Cmd + V) en la descripción</span>
          </li>
        </ol>

        <div className="mt-4 rounded-md border bg-gray-50 p-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Texto copiado:
          </p>
          <p className="text-xs leading-relaxed">{text}</p>
        </div>

        <div className="mt-5 flex gap-2">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] px-3 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <InstagramIcon className="h-4 w-4" />
            Abrir Instagram
          </a>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
