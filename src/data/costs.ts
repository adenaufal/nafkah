import type { ExpenseCategoryKey } from "@/lib/types";

/**
 * Category keys and labels, in the fixed order used by tables, exports and
 * the cost bars. Bars draw categories with a warm neutral ramp (BudgetBar in
 * src/components/ui.tsx), so categories carry no colour of their own.
 */
export const EXPENSE_CATEGORIES: {
  key: ExpenseCategoryKey;
  label: string;
}[] = [
  { key: "housing", label: "Sewa hunian" },
  { key: "food", label: "Makanan & sembako" },
  { key: "transport", label: "Transportasi" },
  { key: "utilities", label: "Utilitas" },
  { key: "connectivity", label: "Internet & data" },
  { key: "healthcare", label: "Kesehatan" },
  { key: "personalCare", label: "Perawatan diri" },
  { key: "leisure", label: "Rekreasi" },
  { key: "education", label: "Pendidikan / pengasuhan anak" },
  { key: "contingency", label: "Tabungan / dana cadangan" },
];
