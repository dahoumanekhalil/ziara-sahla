import type { Metadata } from "next";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import { LangProvider } from "@/context/LangContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";
import WhatsAppFab from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Ziara-Sahla – Voyages culturels en groupe en Algérie",
  description:
    "Ziara-Sahla organise des circuits culturels en groupe en Algérie pour clients européens et francophones. Sécurisés, authentiques et inoubliables.",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png" },
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <UIProvider>
              <Nav />
              <Sidebar />
              {children}
              <Footer />
              <QuoteModal />
              <WhatsAppFab />
            </UIProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
