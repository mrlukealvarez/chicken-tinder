import type { Metadata, Viewport } from "next";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chicken Tinder",
  description: "Swipe right on dinner. Match with your partner. Eat.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chicken Tinder",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Chicken Tinder",
    description: "Swipe right on dinner. Match with your partner. Eat.",
    type: "website",
    siteName: "Chicken Tinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chicken Tinder",
    description: "Swipe right on dinner. Match with your partner. Eat.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[var(--ct-bg)]">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
