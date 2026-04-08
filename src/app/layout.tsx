import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Masterclass Cejas & Pestañas | Curso Online Profesional",
  description:
    "Aprendé cejas, lifting, pestañas pelo a pelo y volumen ruso desde cero. Curso online 100% en video. Acceso de por vida.",
  openGraph: {
    title: "Masterclass Cejas & Pestañas | Curso Online Profesional",
    description:
      "Aprendé cejas, lifting, pestañas pelo a pelo y volumen ruso desde cero. Acceso de por vida.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* META PIXEL */}
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
            fbq('init', '959287627054852');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* GOOGLE ANALYTICS — reemplazar REEMPLAZAR_GA4_ID con el nuevo ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=REEMPLAZAR_GA4_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'REEMPLAZAR_GA4_ID');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=959287627054852&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
