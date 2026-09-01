import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-4 text-center">
      <h1 className="text-4xl font-bold text-ink">404</h1>
      <p className="mb-6 text-muted">Halaman tidak ditemukan.</p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong"
      >
        Kembali ke Peta
      </Link>
    </div>
  );
}
