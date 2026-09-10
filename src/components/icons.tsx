import type { IconProps, IconWeight } from "@phosphor-icons/react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Buildings,
  CaretLeft,
  CaretRight,
  ChartBar,
  Check,
  CheckCircle,
  Coffee,
  Coins,
  Drop,
  ForkKnife,
  Gear,
  GithubLogo,
  GlobeHemisphereWest,
  House,
  Heartbeat,
  ImageSquare,
  Info,
  List,
  LockKey,
  MagnifyingGlass,
  MapPin,
  MapTrifold,
  Money,
  Minus,
  Moon,
  Palette,
  Plus,
  Printer,
  PushPin,
  Question,
  ShareNetwork,
  ShieldCheck,
  Stack,
  Student,
  Sun,
  Tote,
  Train,
  WarningCircle,
  WifiSlash,
  X,
} from "@phosphor-icons/react";

const ICONS = {
  arrowClockwise: ArrowClockwise,
  arrowCounterClockwise: ArrowCounterClockwise,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowSquareOut: ArrowSquareOut,
  arrowUpRight: ArrowUpRight,
  bookOpen: BookOpen,
  briefcase: Briefcase,
  buildings: Buildings,
  caretLeft: CaretLeft,
  caretRight: CaretRight,
  chartBar: ChartBar,
  check: Check,
  checkCircle: CheckCircle,
  coffee: Coffee,
  coins: Coins,
  drop: Drop,
  forkKnife: ForkKnife,
  gear: Gear,
  github: GithubLogo,
  globe: GlobeHemisphereWest,
  house: House,
  heartbeat: Heartbeat,
  image: ImageSquare,
  info: Info,
  list: List,
  lock: LockKey,
  magnifyingGlass: MagnifyingGlass,
  mapPin: MapPin,
  map: MapTrifold,
  money: Money,
  minus: Minus,
  moon: Moon,
  palette: Palette,
  plus: Plus,
  printer: Printer,
  pushPin: PushPin,
  question: Question,
  share: ShareNetwork,
  shieldCheck: ShieldCheck,
  stack: Stack,
  student: Student,
  sun: Sun,
  tote: Tote,
  train: Train,
  warning: WarningCircle,
  wifiSlash: WifiSlash,
  x: X,
} as const;

export type AppIconName = keyof typeof ICONS;

type AppIconProps = Omit<IconProps, "size" | "weight"> & {
  name: AppIconName;
  size?: IconProps["size"];
  weight?: IconWeight;
};

/**
 * One icon entry point keeps the app's outline weight and default size
 * consistent, while still allowing a deliberate size change for dense UI.
 */
export function AppIcon({
  name,
  size = 16,
  weight = "regular",
  ...props
}: AppIconProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" size={size} weight={weight} {...props} />;
}
