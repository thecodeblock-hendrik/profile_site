import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thecodeblock.net"),
  title: "the codeblock | Hendrik Oosthuizen",
  description:
    "The professional profile of Hendrik Oosthuizen—operations and SaaS delivery leader, presented by the codeblock.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "the codeblock | Hendrik Oosthuizen",
    description: "Operations, SaaS delivery, and digital transformation leadership.",
    url: "/",
    siteName: "the codeblock",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
