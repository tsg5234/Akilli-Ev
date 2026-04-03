import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Aile Panosu",
  description: "Türkçe aile görev yönetim uygulaması",
  applicationName: "Aile Panosu",
  appleWebApp: {
    capable: true,
    title: "Aile Panosu",
    statusBarStyle: "black-translucent"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
