"use client";

import dynamic from "next/dynamic";

/**
 * The whole shell is interactive and map-first; render it client-side only.
 * (SSR of "use client" components still executes render code on the server,
 * and parts of this tree — MapLibre especially — must never see a server.)
 */
const AppShell = dynamic(() => import("@/components/AppShell"), {
 ssr: false,
 loading: () => (
  <div className="flex h-dvh items-center justify-center bg-surface text-sm text-muted">
   Memuat peta…
  </div>
 ),
});

export default function ClientShell() {
 return <AppShell />;
}
