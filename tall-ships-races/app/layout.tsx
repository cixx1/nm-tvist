import type { Metadata } from "next";
import { Big_Shoulders, Albert_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  display: "swap",
});

const sans = Albert_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tall Ships Races Kristiansand 2025",
  description:
    "Tall Ships Races stopper i Kristiansand 30. juli til 2. august 2025. Skip, konserter, omvisninger og familieaktiviteter i sentrum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
