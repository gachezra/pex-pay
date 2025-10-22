import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PexPay | Seamless M-Pesa Payments API",
  description:
    "Powerful, secure, and developer-friendly API for M-Pesa STK Push integration. Seamlessly accept M-Pesa payments in your application.",
  verification: {
    google: "EuJXRpbWcnXPIDkyL3ox6DnpDF3bPRys-5FGbcjE1ac",
  },
  openGraph: {
    title: "PexPay | Seamless M-Pesa Payments API",
    description:
      "Powerful, secure, and developer-friendly API for M-Pesa STK Push integration. Seamlessly accept M-Pesa payments in your application.",
    url: "https://pay.pexmon.one",
    siteName: "PexPay",
    images: [
      {
        url: "https://pay.pexmon.one/og-image.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
