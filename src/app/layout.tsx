import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AXO — Ecosistema Comercial Regional",
  description:
    "AXO by Megasion Desarrollos INC. — Marketplace, movilidad y logística para Posadas, Encarnación y la región.",
  keywords: ["AXO", "Posadas", "Encarnación", "marketplace", "delivery", "movilidad", "Misiones"],
  authors: [{ name: "Megasion Desarrollos INC." }],
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-axo-bg text-axo-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
