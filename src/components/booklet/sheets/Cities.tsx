import type { BookletFacts } from "@/data/bookletFacts";
import { rpShort } from "@/lib/format";
import { roundSalary } from "@/lib/income";
import { SalaryTable } from "../SalaryTable";
import { Sheet, SheetHead } from "../Sheet";

/** A round, recognisable salary to start from; the reader can change it. */
const START = 5_000_000;

export function Cities({ f }: { f: BookletFacts }) {
  const median = roundSalary(f.medianWage);
  const presets = [
    { label: `Median upah minimum ${rpShort(median)}`, value: median },
    ...[START, 7_500_000, 10_000_000].map((v) => ({
      label: rpShort(v),
      value: v,
    })),
  ];
  return (
    <Sheet id="kota">
      <SheetHead
        id="kota"
        title="Rupiah yang sama terasa berbeda di tiap kota."
        lead={`Satu angka gaji diuji di kota-kota besar dengan profil ${f.noun} yang sama; yang berbeda hanya biaya hidupnya. Kota diurutkan dari biaya hidup tertinggi.`}
      />
      <div className="mt-6 paper:mt-[6mm]">
        <SalaryTable
          cities={f.cities.map(
            ({ code, label, province, wage, wageKind, cost }) => ({
              code,
              label,
              province,
              wage,
              wageKind,
              cost,
            }),
          )}
          initial={START}
          presets={presets}
          noun={f.noun}
        />
      </div>
    </Sheet>
  );
}
