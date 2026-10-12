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
    owner: "rumah sendiri",
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

/** "lajang" / "pasangan" / "keluarga dengan 2 anak" — for headline sentences. */
export function householdNoun(a: Assumptions): string {
  if (a.householdType === "single")
    return a.children > 0 ? `lajang dengan ${a.children} anak` : "lajang";
  if (a.householdType === "couple" && a.children === 0) return "pasangan";
  return a.children > 0 ? `keluarga dengan ${a.children} anak` : "keluarga";
}

/**
 * One-line profile in the app's own words ("lajang", not "single"), for
 * display. The CSV keeps assumptionSummary so exported files stay stable.
 */
export function profileSummary(a: Assumptions): string {
  // "Longgar", not "nyaman": Nyaman is also the name of a result band.
  const lifestyle = {
    budget: "hemat",
    moderate: "standar",
    comfortable: "longgar",
  };
  const housing = {
    room: "rusun/kost",
    studio: "rumah KPR",
    oneBedroom: "apartemen",
    owner: "rumah sendiri",
  };
  const transport = {
    motorcycle: "motor",
    publicTransport: "kendaraan umum",
    rideHailing: "ojol",
  };
  const ownInstallment = (a.installmentMonthly ?? 0) > 0;
  const parts = [
    householdNoun(a),
    lifestyle[a.lifestyle],
    ownInstallment ? "cicilan sendiri" : housing[a.housing],
    transport[a.transport],
  ];
  if (a.includeSavings) parts.push("+tabungan");
  if (a.wageBasis === "takeHome") parts.push("setelah potongan (est.)");
  if (a.dualIncome && a.householdType !== "single") parts.push("2 upah");
  return parts.join(" · ");
}
