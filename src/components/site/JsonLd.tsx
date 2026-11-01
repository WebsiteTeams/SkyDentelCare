import { SITE_URL } from "@/lib/constants";
import type { SettingsDTO } from "@/types";

/** Dentist / LocalBusiness data from verified settings. Ratings and reviews are intentionally omitted. */
export function ClinicJsonLd({ settings }: { settings: SettingsDTO }) {
  const hasAddress = settings.streetAddress || settings.city;
  const sameAs = [settings.instagramUrl, settings.facebookUrl].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness"],
    name: settings.clinicName,
    url: SITE_URL,
    ...(settings.seoDescription ? { description: settings.seoDescription } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.content.heroImage ? { image: settings.content.heroImage.url } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.streetAddress,
            addressLocality: settings.city,
            addressRegion: settings.region,
            postalCode: settings.postalCode,
            addressCountry: settings.country,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return <JsonLdScript data={data} />;
}

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escaped so admin-entered text cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
