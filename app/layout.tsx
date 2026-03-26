import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "El Precio del Poder | The Human Cost of Mexico's Drug War",
  description:
    "An interactive data journalism piece tracing Mexico's narcotrafficking violence across six presidential administrations (1990-2024). How did we get here?",
  keywords: [
    "Mexico",
    "drug war",
    "narcotrafficking",
    "El Mencho",
    "CJNG",
    "data journalism",
    "interactive",
  ],
  authors: [{ name: "CPSC 481 Final Project" }],
  openGraph: {
    title: "El Precio del Poder | The Human Cost of Mexico's Drug War",
    description:
      "An interactive data journalism piece tracing Mexico's narcotrafficking violence across six presidential administrations.",
    type: "article",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSans.variable} antialiased`}
    >
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
