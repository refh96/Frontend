// app/layout.js
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Full Wash Conce",
  description: "Bienvenido a Full Wash, tus servicios de lavado de vehículos.",
};

function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.png" />
        {/* Fragmento oficial de Google AdSense */}
        <Script
          id="adsense-script"
          strategy="beforeInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7870558147553980"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

export default Layout;
