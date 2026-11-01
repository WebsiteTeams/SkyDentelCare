import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "SkyDentalClinic | Premium Dental Care", template: "%s | SkyDentalClinic" },
  description: "Personalized dental care with modern technology and compassionate professionals.",
  applicationName: "SkyDentalClinic",
};

export const viewport: Viewport = { themeColor: "#123B50" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
