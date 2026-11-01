import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { toTelHref, toWhatsAppUrl } from "@/lib/utils";
import type { SettingsDTO } from "@/types";
import { formatAddress } from "./address";
import { ContactForm } from "./ContactForm";

function Detail({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-5 border-b border-border py-6">
      <Icon className="mt-1 size-5 shrink-0 text-teal" aria-hidden />
      <div className="min-w-0 flex-1">
        <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-navy">{label}</h3>
        <div className="mt-2 text-lg text-charcoal">{children}</div>
      </div>
    </div>
  );
}

export function ContactSection({ settings }: { settings: SettingsDTO }) {
  const address = formatAddress(settings);
  const hasDetails = address || settings.phone || settings.whatsapp || settings.email || settings.hours.length > 0;

  return (
    <>
      <section className="section-y !pt-16 md:!pt-20">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          {hasDetails ? (
            <div className="lg:col-span-5">
              <h2 className="display-3">Find us</h2>
              <div className="mt-5 border-t border-border">
                {address ? (
                  <Detail icon={MapPin} label="Address">
                    <p>{address}</p>
                    {settings.mapsLinkUrl ? (
                      <a href={settings.mapsLinkUrl} target="_blank" rel="noopener noreferrer" className="link-rule mt-3 inline-block text-base">Get directions</a>
                    ) : null}
                  </Detail>
                ) : null}
                {settings.phone ? (
                  <Detail icon={Phone} label="Phone"><a href={toTelHref(settings.phone)} className="hover:underline">{settings.phone}</a></Detail>
                ) : null}
                {settings.whatsapp ? (
                  <Detail icon={MessageCircle} label="WhatsApp">
                    <a href={toWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:underline">{settings.whatsapp}</a>
                  </Detail>
                ) : null}
                {settings.email ? (
                  <Detail icon={Mail} label="Email"><a href={`mailto:${settings.email}`} className="break-all hover:underline">{settings.email}</a></Detail>
                ) : null}
                {settings.hours.length > 0 ? (
                  <Detail icon={Clock} label="Working hours">
                    <dl className="space-y-1.5 text-base">
                      {settings.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-6">
                          <dt>{h.days}</dt>
                          <dd className="font-medium text-navy">{h.hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </Detail>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className={hasDetails ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8"}>
            <h2 className="display-3">Send us a message</h2>
            <p className="mt-3 mb-9 text-charcoal">For appointments, please use the booking form so we have the details we need.</p>
            <ContactForm />
          </div>
        </div>
      </section>
      {settings.mapsEmbedUrl ? (
        <section aria-label="Map">
          <iframe
            src={settings.mapsEmbedUrl}
            title={`Map showing ${settings.clinicName}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[28rem] w-full border-0"
          />
        </section>
      ) : null}
    </>
  );
}
