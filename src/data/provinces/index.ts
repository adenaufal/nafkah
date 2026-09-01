import type { ProvinceDataPackage } from "./types";
import { aceh_data } from "./aceh";
import { sumatera_barat_data } from "./sumatera-barat";
import { nusa_tenggara_timur_data } from "./nusa-tenggara-timur";
import { sumatera_utara_data } from "./sumatera-utara";
import { papua_data } from "./papua";
import { bali_data } from "./bali";
import { kalimantan_selatan_data } from "./kalimantan-selatan";
import { jawa_barat_data } from "./jawa-barat";
import { sulawesi_tengah_data } from "./sulawesi-tengah";
import { kepulauan_bangka_belitung_data } from "./kepulauan-bangka-belitung";
import { jawa_timur_data } from "./jawa-timur";
import { jawa_tengah_data } from "./jawa-tengah";
import { sulawesi_selatan_data } from "./sulawesi-selatan";
import { daerah_istimewa_yogyakarta_data } from "./daerah-istimewa-yogyakarta";
import { sumatera_selatan_data } from "./sumatera-selatan";
import { kalimantan_tengah_data } from "./kalimantan-tengah";
import { jambi_data } from "./jambi";
import { riau_data } from "./riau";
import { kalimantan_barat_data } from "./kalimantan-barat";
import { bengkulu_data } from "./bengkulu";
import { kalimantan_timur_data } from "./kalimantan-timur";
import { nusa_tenggara_barat_data } from "./nusa-tenggara-barat";
import { kepulauan_riau_data } from "./kepulauan-riau";
import { gorontalo_data } from "./gorontalo";
import { sulawesi_utara_data } from "./sulawesi-utara";
import { sulawesi_tenggara_data } from "./sulawesi-tenggara";
import { kalimantan_utara_data } from "./kalimantan-utara";
import { maluku_data } from "./maluku";
import { lampung_data } from "./lampung";
import { papua_barat_data } from "./papua-barat";
import { papua_barat_daya_data } from "./papua-barat-daya";
import { papua_selatan_data } from "./papua-selatan";
import { papua_tengah_data } from "./papua-tengah";
import { papua_pegunungan_data } from "./papua-pegunungan";
import { maluku_utara_data } from "./maluku-utara";
import { dki_jakarta_data } from "./dki-jakarta";
import { banten_data } from "./banten";
import { sulawesi_barat_data } from "./sulawesi-barat";

export const ALL_PROVINCE_PACKAGES: ProvinceDataPackage[] = [
  aceh_data,
  sumatera_barat_data,
  nusa_tenggara_timur_data,
  sumatera_utara_data,
  papua_data,
  bali_data,
  kalimantan_selatan_data,
  jawa_barat_data,
  sulawesi_tengah_data,
  kepulauan_bangka_belitung_data,
  jawa_timur_data,
  jawa_tengah_data,
  sulawesi_selatan_data,
  daerah_istimewa_yogyakarta_data,
  sumatera_selatan_data,
  kalimantan_tengah_data,
  jambi_data,
  riau_data,
  kalimantan_barat_data,
  bengkulu_data,
  kalimantan_timur_data,
  nusa_tenggara_barat_data,
  kepulauan_riau_data,
  gorontalo_data,
  sulawesi_utara_data,
  sulawesi_tenggara_data,
  kalimantan_utara_data,
  maluku_data,
  lampung_data,
  papua_barat_data,
  papua_barat_daya_data,
  papua_selatan_data,
  papua_tengah_data,
  papua_pegunungan_data,
  maluku_utara_data,
  dki_jakarta_data,
  banten_data,
  sulawesi_barat_data,
];

export const ALL_REGIONS = ALL_PROVINCE_PACKAGES.flatMap((p) => p.regions);
export const ALL_WAGES = ALL_PROVINCE_PACKAGES.flatMap((p) => p.wages);
export const ALL_COSTS = ALL_PROVINCE_PACKAGES.flatMap((p) => p.costs);
export const ALL_NARRATIVES = ALL_PROVINCE_PACKAGES.flatMap((p) => p.narratives);
