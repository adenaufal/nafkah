import type { Assumptions } from "./types";

/**
 * Ringkasan asumsi aktif dalam satu baris, dipakai bersama oleh chip
 * perbandingan (baki) dan header drawer asumsi (profil aktif, AP-03).
 * Huruf kecil semua agar cocok ditampilkan sebagai teks chip.
 */
export function assumptionSummary(a: Assumptions): string {
  const household = { single: "single", couple: "pasangan", family: "keluarga" };
  const lifestyle = {
    budget: "hemat",
    moderate: "standar",
    comfortable: "nyaman",
  };
  const housing = {
    room: "rusun/kost",
    studio: "rumah KPR",
    oneBedroom: "apartemen",
  };
  const transport = {
    motorcycle: "motor",
    publicTransport: "kend. umum",
    rideHailing: "ojol",
  };
  const parts = [household[a.householdType]];
  if (a.children > 0) parts.push(`${a.children} anak`);
  parts.push(lifestyle[a.lifestyle], housing[a.housing], transport[a.transport]);
  if (a.dualIncome && a.householdType !== "single") parts.push("2 upah");
  if (a.installmentMonthly != null && a.installmentMonthly > 0) {
    parts.push("cicilan sendiri");
  }
  return parts.join(" · ");
}
