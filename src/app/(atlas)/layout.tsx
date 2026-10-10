import { fontVariables } from "../fonts";

/** App, Metode and Tentang share the Atlas type and paper surface. */
export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${fontVariables} atlas`}>{children}</div>;
}
