import type { Metadata } from "next";
import { Bebas_Neue, Nunito, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const nunito = Nunito({
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superfasting | Intermittent Fasting for Weight Loss on Telegram",
  description:
    "Intermittent fasting for weight loss, guided daily on Telegram. Simple intermittent fasting diet coaching for Miami and Florida. Join the waitlist.",
  keywords: ["intermittent fasting", "intermittent fasting for weight loss", "fasting for weight loss", "intermittent fasting diet", "Telegram"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17981379200"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17981379200');
          `}
        </Script>
      </head>
      <body className={`${bebasNeue.variable} ${nunito.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
