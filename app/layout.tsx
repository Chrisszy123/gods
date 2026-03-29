import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import MetaPixel from "@/components/MetaPixel";


// === BRAND FONTS ===
// Place font files in /public/fonts/
const cogsBolts = localFont({
src: "./fonts/cogs_and_bolts/cogs_and_bolts.ttf",
variable: "--font-cogs",
display: "swap",
});


const nexa = localFont({
src: [
{ path: "./fonts/nexa/Nexa-ExtraLight.ttf", weight: "400", style: "normal" },
{ path: "./fonts/nexa/Nexa-Heavy.ttf", weight: "700", style: "normal" },
],
variable: "--font-nexa",
display: "swap",
});

export const metadata: Metadata = {
  title: "Gods of the Stage - Premium Talent Hunt",
  description: "Lights. Crowd. Power. This is not a competition, it's a coronation. Register now for the ultimate talent hunt experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cogsBolts.variable} ${nexa.variable} antialiased`}
      >
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
