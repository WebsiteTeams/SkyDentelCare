import { Footer } from "@/components/site/Footer";
import { ClinicJsonLd } from "@/components/site/JsonLd";
import { Navbar } from "@/components/site/Navbar";
import { getPublishedTreatments, getSettings } from "@/lib/data/public";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, treatments] = await Promise.all([getSettings(), getPublishedTreatments()]);
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-md bg-navy px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Navbar phone={settings.phone} announcement={settings.content.announcement} />
      <main id="main">{children}</main>
      <Footer settings={settings} treatments={treatments} />
      <ClinicJsonLd settings={settings} />
    </>
  );
}
