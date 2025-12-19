import type { BrandKey } from "./brand";

export type BrandConfig = {
  key: BrandKey;
  name: string;
  minRetainer: string;
  defaultLocale: "en" | "es";
  logoLight: string;
  logoDark: string;
  logoClassName: string;
  navHeightClassName: string;
  navPaddingYClassName: string;
};

const horchata: BrandConfig = {
  key: "horchata",
  name: "Horchata Labs",
  minRetainer: "€3,000",
  defaultLocale: "es",
  logoLight: "/images/horchata-mark-light-horizontal.png",
  logoDark: "/images/horchata-mark-dark-horiontal.png",
  logoClassName: "h-16 w-auto", // horchata
  navHeightClassName: "min-h-20",
  navPaddingYClassName: "py-3",
};

const avanti: BrandConfig = {
  key: "avanti",
  name: "Avanti Interactive",
  minRetainer: "$3,500",
  defaultLocale: "en",
  logoLight: "/images/avanti-mark-light.png",
  logoDark: "/images/avanti-mark-dark.png",
  logoClassName: "h-12 w-auto", // avanti
  navHeightClassName: "min-h-14",
  navPaddingYClassName: "py-3",
};

export function getBrandConfig(key: BrandKey): BrandConfig {
  return key === "avanti" ? avanti : horchata;
}
