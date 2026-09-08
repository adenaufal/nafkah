import type { ExpenseCategoryKey } from "@/lib/types";

/** Category metadata for labels, tooltips and chart colors. */
export const EXPENSE_CATEGORIES: {
  key: ExpenseCategoryKey;
  label: string;
  color: string;
}[] = [
  { key: "housing", label: "Sewa hunian", color: "#c2452d" },
  { key: "food", label: "Makanan & sembako", color: "#e0704f" },
  { key: "transport", label: "Transportasi", color: "#d9a441" },
  { key: "utilities", label: "Utilitas", color: "#4c8b9e" },
  { key: "connectivity", label: "Internet & data", color: "#6d5fb8" },
  { key: "healthcare", label: "Kesehatan", color: "#1d7a4f" },
  { key: "personalCare", label: "Perawatan diri", color: "#b0688c" },
  { key: "leisure", label: "Rekreasi", color: "#7a9e43" },
  { key: "education", label: "Pendidikan / pengasuhan anak", color: "#2563a8" },
  { key: "contingency", label: "Tabungan / dana cadangan", color: "#4a6b57" },
];
