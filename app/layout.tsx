import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aakaash Charles | Software Engineer",
  description:
    "Portfolio of Aakaash Charles – Full-Stack & Software Systems Engineer",

  icons: {
    icon: "/favico.png", 
  },

  openGraph: {
    title: "Aakaash Charles | Software Engineer",
    description:
      "Full-Stack & Software Systems Engineer building scalable systems.",
    url: "https://hey-charles.vercel.app/",
    siteName: "Aakaash Charles Portfolio",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Aakaash Charles Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aakaash Charles | Software Engineer",
    description:
      "Full-Stack & Software Systems Engineer building scalable systems.",
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
