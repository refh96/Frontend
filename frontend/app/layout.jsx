// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Full Wash Conce", // Cambia el título global aquí
  description: "Bienvenido a Full Wash, tus servicios de lavado de vehículos.", // Descripción opcional
};

function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export default Layout;
