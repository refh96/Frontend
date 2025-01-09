// app/layout.js
'use client';
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const metadata = {
  title: "Full Wash Conce", // Cambia el título global aquí
  description: "Bienvenido a Full Wash, tus servicios de lavado de vehículos.", // Descripción opcional
};

function Layout({ children }) {
  // Crear una instancia de QueryClient
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        {/* Proveer el QueryClient a la aplicación */}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default Layout;
