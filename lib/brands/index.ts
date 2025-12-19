import { horchataBrand } from "./horchata";
import { avantiBrand } from "./avanti";
import type { BrandKey } from "../brand";

export function getBrandConfig(key: BrandKey) {
  return key === "avanti" ? avantiBrand : horchataBrand;
}
