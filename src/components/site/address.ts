import type { SettingsDTO } from "@/types";

export function formatAddress(s: Pick<SettingsDTO, "streetAddress" | "city" | "region" | "postalCode" | "country">): string {
  const locality = [s.city, s.region].filter(Boolean).join(", ");
  return [s.streetAddress, [locality, s.postalCode].filter(Boolean).join(" "), s.country].filter(Boolean).join(", ");
}
