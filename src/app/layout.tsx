import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { VisualEditsMessenger } from "orchids-visual-edits";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MAPmobile | Mobile Automotive Pro - Denver Metro",
  description: "Professional mobile electronics installation in the Denver Metro area. Remote starts, car audio, alarms, and more - we come to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <CartProvider>
          <Navbar />
        <main className="min-h-screen pt-16">
            {/* Component Tree Refreshed */}
            {children}
          </main>
            <Footer />
            <CookieBanner />
            <Toaster position="top-center" />
        </CartProvider>
        
        {/* Orchids specific scripts */}
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="0f08fcff-aa8a-4276-bf1e-97b54865f92e"
        />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}