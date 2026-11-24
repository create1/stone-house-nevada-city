import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter, Jost } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/effects/GrainOverlay";
import CustomCursor from "@/components/effects/CustomCursor";
import ScrollProgress from "@/components/effects/ScrollProgress";
import { getVenueJsonLd, getLocalBusinessJsonLd } from "@/lib/structured-data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stonehouse.io"),
  title: {
    default:
      "Stone House | Historic Event Venue in Nevada City, CA — Est. 1857",
    template: "%s",
  },
  description:
    "Six distinctive spaces in Nevada City's most iconic venue. Weddings, corporate events, live music, and private dining in a Gold Country landmark since 1857. Check availability.",
  keywords: [
    "Nevada City wedding venue",
    "Stone House Nevada City",
    "wedding venue Gold Country",
    "historic event venue Nevada City",
    "live music venue",
    "corporate events",
    "Sierra Foothills",
    "Stone House",
  ],
  authors: [{ name: "Stone House" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stonehouse.io",
    siteName: "Stone House",
    title:
      "Stone House | Historic Event Venue in Nevada City, CA — Est. 1857",
    description:
      "Six distinctive spaces in Nevada City's most iconic venue. Weddings, corporate events, live music, and private dining in a Gold Country landmark since 1857. Check availability.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Stone House — Historic Event Venue in Nevada City, California",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Stone House | Historic Event Venue in Nevada City, CA — Est. 1857",
    description:
      "Six distinctive spaces in Nevada City's most iconic venue. Weddings, corporate events, live music, and private dining in a Gold Country landmark since 1857.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-offwhite text-black font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getVenueJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
        />
        <CustomCursor />
        <ScrollProgress />
        <GrainOverlay />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
