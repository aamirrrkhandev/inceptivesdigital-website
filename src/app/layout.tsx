import type { Metadata } from "next";
import "./site.css";
import { indexingAllowed } from "@/lib/seo-policy";
import GhlTracking from "@/components/GhlTracking";
import CallRailTracking from "@/components/CallRailTracking";
import SourceAnalytics from "@/components/SourceAnalytics";
import ChatLauncher from "@/components/ChatLauncher";
export const metadata: Metadata = {
  metadataBase: new URL("https://inceptivesdigital.com"),
  icons: {
    icon: [
      {url:"/favicon.ico?v=20261111",sizes:"any"},
      {url:"/favicon-32x32.png?v=20261111",sizes:"32x32",type:"image/png"},
      {url:"/favicon-16x16.png?v=20261111",sizes:"16x16",type:"image/png"},
      {url:"/icon-192.png?v=20261111",sizes:"192x192",type:"image/png"},
    ],
    apple: [{url:"/apple-touch-icon.png?v=20261111",sizes:"180x180",type:"image/png"}],
  },
  robots: indexingAllowed
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <link rel="preload" href="/assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/assets/styles/site-typography.css?v=20261111-icons-inner-h1" />
      </head>
      <body>
        <noscript><iframe title="Google Tag Manager" src="https://www.googletagmanager.com/ns.html?id=GTM-5BV286F5" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        {children}
        <GhlTracking />
        <CallRailTracking />
        <ChatLauncher />
        <SourceAnalytics />
      </body>
    </html>
  );
}
