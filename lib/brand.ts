export type BrandKey = "horchata" | "avanti";

export function brandFromHost(host: string): BrandKey {
  const h = host.toLowerCase();
  if (h.includes("avantiinteractive.com")) return "avanti";
  return "horchata";
}
