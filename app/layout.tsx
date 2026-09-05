import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hendrik Oosthuizen | Operations & SaaS Delivery Leader",
  description:
    "Regional operations and SaaS delivery leader specialising in enterprise implementations, service excellence, and scalable multi-site operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
