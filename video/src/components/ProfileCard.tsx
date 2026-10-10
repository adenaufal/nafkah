import { C, FONT, UI } from "../theme";
import { Touch } from "./Touch";
import { Card, Kicker, Seg, Stepper, Switch } from "./ui";

const px = (v: number) => v * UI;

export interface ProfileTouch {
  target: "family" | "plus" | "dual";
  press: number;
  ripple: number;
}

/** "Profil rumah tangga" editor, trimmed to the three controls in the VO. */
export function ProfileCard({
  width,
  household,
  kids,
  dual,
  salaryLabel,
  touch,
}: {
  width: number;
  /** 0 Lajang · 1 Pasangan · 2 Keluarga (fractional while sliding). */
  household: number;
  kids: number;
  /** Switch position 0→1. */
  dual: number;
  salaryLabel: string;
  touch?: ProfileTouch;
}) {
  const pad = px(16);
  const inner = width - pad * 2;
  const segPad = px(3);
  const familyX = segPad + ((inner - segPad * 2) * 2.5) / 3;
  const label = {
    fontFamily: FONT.sans,
    fontSize: px(14.5),
    fontWeight: 650,
    color: C.ink,
  } as const;
  return (
    <Card style={{ width, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Kicker>Profil rumah tangga</Kicker>
        <span
          style={{
            fontFamily: FONT.sans,
            fontSize: px(12),
            fontWeight: 700,
            color: C.accentInk,
            background: C.accentSoft,
            borderRadius: 999,
            padding: `${px(4)}px ${px(10)}px`,
          }}
        >
          {salaryLabel}
        </span>
      </div>
      <div style={{ position: "relative", marginTop: px(9) }}>
        <Seg options={["Lajang", "Pasangan", "Keluarga"]} at={household} height={36} />
        {touch?.target === "family" && (
          <Touch x={familyX} y={px(18)} press={touch.press} ripple={touch.ripple} />
        )}
      </div>
      <div
        style={{
          position: "relative",
          marginTop: px(8),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={label}>Jumlah anak</span>
        <Stepper value={kids} unit="anak" />
        {touch?.target === "plus" && (
          <Touch x={inner - px(18)} y={px(18.5)} press={touch.press} ripple={touch.ripple} />
        )}
      </div>
      <div
        style={{
          position: "relative",
          marginTop: px(8),
          paddingTop: px(8),
          borderTop: `${px(1)}px solid ${C.rule}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={label}>Pasangan ikut bekerja</span>
        <Switch t={dual} />
        {touch?.target === "dual" && (
          <Touch x={inner - px(20)} y={px(8) + px(12)} press={touch.press} ripple={touch.ripple} />
        )}
      </div>
    </Card>
  );
}
