// app/layout.js
import './globals.css';
import ClientLayout from '../ClientLayout';
// Define las propiedades de metadata (funciona solo en componentes de servidor)
export const metadata = {
  title: "Full Wash Conce",
  description: "Bienvenido a Full Wash, tus servicios de lavado de vehículos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
