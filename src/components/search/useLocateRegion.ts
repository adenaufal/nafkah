"use client";

import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { findFeatureAt } from "@/lib/geo";

type LocateStatus = "idle" | "locating" | "error";

/**
 * "Daerah di lokasiku": one browser geolocation read, matched against the
 * local boundary polygons. The position never leaves the device and is not
 * stored — only the matching region gets selected.
 */
export function useLocateRegion(onFound: (code: string) => void) {
  const { state } = useApp();
  const [status, setStatus] = useState<LocateStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const fail = (text: string) => {
    setStatus("error");
    setMessage(text);
  };

  const locate = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      fail("Browser ini tidak menyediakan lokasi. Cari daerahmu lewat nama.");
      return;
    }
    const features = state.geometry?.features;
    if (!features) {
      fail("Batas wilayah belum termuat. Coba lagi sebentar lagi.");
      return;
    }
    setStatus("locating");
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const hit = findFeatureAt(
          pos.coords.longitude,
          pos.coords.latitude,
          features,
        );
        if (!hit) {
          fail("Lokasimu tidak berada di salah satu dari 514 daerah.");
          return;
        }
        setStatus("idle");
        onFound(hit.properties.kode);
      },
      (err) =>
        fail(
          err.code === err.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Izinkan di pengaturan browser, atau cari daerahmu lewat nama."
            : err.code === err.TIMEOUT
              ? "Lokasi terlalu lama didapat. Coba lagi."
              : "Lokasi tidak tersedia saat ini.",
        ),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const clear = () => {
    setStatus("idle");
    setMessage(null);
  };

  return { locate, status, message, clear };
}
