import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { NAV_LINKS } from "@/lib/constants";
import { toTelHref, toWhatsAppUrl } from "@/lib/utils";
import type { SettingsDTO, TreatmentDTO } from "@/types";
import { formatAddress } from "./address";

const heading = "text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ice";
const link = "text-white/85 transition-colors hover:text-white hover:underline underline-offset-4";

export function Footer({ settings, treatments }: { settings: SettingsDTO; treatments: TreatmentDTO[] }) {
  const address = formatAddress(settings);
  const hasVisit = address || settings.phone || settings.whatsapp || settings.email || settings.hours.length > 0;

  return (
    <footer className="bg-navy text-white">
      <div className="container-site pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo inverse />
            <p className="mt-7 max-w-sm text-white/80">
              {settings.seoDescription || "Personalized dental care with compassion and clarity."}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className={heading}>Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/appointment" className={link}>Book Appointment</Link>
              </li>
            </ul>
          </nav>

          {treatments.length > 0 ? (
            <div className="lg:col-span-2">
              <h2 className={heading}>Treatments</h2>
              <ul className="mt-5 space-y-3">
                {treatments.slice(0, 6).map((t) => (
                  <li key={t._id}>
                    <Link href={`/treatments/${t.slug}`} className={link}>{t.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {hasVisit ? (
            <div className="lg:col-span-3">
              <h2 className={heading}>Visit</h2>
              <address className="mt-5 space-y-3 not-italic">
                {address ? <p className="text-white/85">{address}</p> : null}
                {settings.phone ? <p><a href={toTelHref(settings.phone)} className={link}>{settings.phone}</a></p> : null}
                {settings.whatsapp ? (
                  <p><a href={toWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp</a></p>
                ) : null}
                {settings.email ? <p><a href={`mailto:${settings.email}`} className={`${link} break-all`}>{settings.email}</a></p> : null}
              </address>
              {settings.hours.length > 0 ? (
                <ul className="mt-6 space-y-1.5 text-sm text-white/80">
                  {settings.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4"><span>{h.days}</span><span>{h.hours}</span></li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/15 pt-7 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.clinicName}. All rights reserved.</p>
          {settings.instagramUrl || settings.facebookUrl ? (
            <ul className="flex gap-6">
              {settings.instagramUrl ? <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className={link}>Instagram</a></li> : null}
              {settings.facebookUrl ? <li><a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className={link}>Facebook</a></li> : null}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
