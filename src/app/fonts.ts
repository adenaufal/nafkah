import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

/*
 * Atlas type: Fraunces for headlines and big numbers, Plus Jakarta Sans
 * (Tokotype's typeface for Jakarta's city identity) for text, JetBrains Mono
 * for receipt figures. next/font self-hosts them at build time.
 */

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${jakarta.variable} ${fraunces.variable} ${mono.variable}`;
