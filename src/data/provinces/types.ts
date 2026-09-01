import type {
  CostProfile,
  Region,
  WageRecord,
} from "@/lib/types";
import type { RegionNarrative } from "@/data/narratives";

export interface ProvinceDataPackage {
  provinceName: string;
  provinceCode: string;
  regions: Region[];
  wages: WageRecord[];
  costs: CostProfile[];
  narratives: RegionNarrative[];
}
