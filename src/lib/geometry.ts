import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { RegionFeatureProps } from "./types";

/**
 * Geometry loading.
 *
 * The shipped asset is simplified TopoJSON (HDX COD-AB Indonesia adm2,
 * simplified with mapshaper — see README for the exact command). HDX uses
 * pcode "ID3173"; the join key converts it to kode wilayah "31.73".
 *
 * Swapping in a different source: adjust `adaptGeoJSON` (or the fetch URL in
 * loader.ts). Everything downstream consumes the normalised FeatureCollection.
 */

const HDX_PCODE = /^ID(\d{2})(\d{2})$/;

export function pcodeToKodeWilayah(pcode: string): string | null {
  const m = HDX_PCODE.exec(pcode);
  return m ? `${m[1]}.${m[2]}` : null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const NON_ADMINISTRATIVE_CODES = new Set([
  "12.88", // Danau Toba
  "13.88", // Danau (Singkarak/Maninjau)
  "16.88", // Danau (Ranau)
  "18.88", // Danau
  "32.88", // Waduk Cirata
  "33.88", // Waduk Kedungombo
  "33.99", // Hutan Lindung
  "71.88", // Danau (Tondano)
]);

export function topologyToFeatureCollection(
  topology: any,
): FeatureCollection<Geometry, RegionFeatureProps> {
  const objectName = Object.keys(topology.objects)[0];
  const fc = feature(topology, topology.objects[objectName]) as any;

  const features = fc.features
    .map((f: any) => {
      const p = f.properties ?? {};
      const kode =
        pcodeToKodeWilayah(String(p.adm2_pcode ?? "")) ??
        (typeof p.kode === "string" ? p.kode : null) ??
        (typeof p.Kode === "string" ? p.Kode : null);
      if (!kode || NON_ADMINISTRATIVE_CODES.has(kode) || kode.endsWith(".88") || kode.endsWith(".99")) {
        return null;
      }
      return {
        type: "Feature" as const,
        geometry: f.geometry,
        properties: {
          kode,
          name: String(p.adm2_name ?? p.name ?? p.KAB_KOT ?? kode),
          province: String(p.adm1_name ?? p.province ?? p.PROV ?? ""),
        } satisfies RegionFeatureProps,
      };
    })
    .filter(Boolean);

  return { type: "FeatureCollection", features };
}
