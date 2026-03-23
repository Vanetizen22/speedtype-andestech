import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeedType - Competencia de Escritura",
  description: "SpeedType Contest by AndesTech - Competencia de escritura rapida",
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
