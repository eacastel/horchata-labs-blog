import "server-only";
import { headers } from "next/headers";
import { brandFromHost, type BrandKey } from "./brand";

export async function getBrand(): Promise<BrandKey> {
  const forced = process.env.NEXT_PUBLIC_BRAND as BrandKey | undefined;
  if (forced === "horchata" || forced === "avanti") return forced;

  const h = await headers();
  const host = h.get("host") ?? "";
  return brandFromHost(host);
}
