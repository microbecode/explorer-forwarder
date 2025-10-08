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
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://explorer-forwarder.vercel.app"
      : "http://localhost:3000"
  ),
  title: "Explorer forwarder",
  description: "A simple URL forwarder service based on ERC-7950",
  openGraph: {
    title: "Explorer forwarder",
    description: "A simple URL forwarder service based on ERC-7950",
    images: [
      {
        url: "/metaimage.png",
        width: 1200,
        height: 630,
        alt: "Explorer forwarder - ERC-7950 based URL forwarder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorer forwarder",
    description: "A simple URL forwarder service based on ERC-7950",
    images: ["/metaimage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
