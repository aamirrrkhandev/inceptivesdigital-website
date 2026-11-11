import type { Metadata } from "next";
import "./site.css";
import { indexingAllowed } from "@/lib/seo-policy";
import GhlTracking from "@/components/GhlTracking";
import CallRailTracking from "@/components/CallRailTracking";
import SourceAnalytics from "@/components/SourceAnalytics";
import ChatLauncher from "@/components/ChatLauncher";
export const metadata: Metadata = {
  metadataBase: new URL("https://inceptivesdigital.com"),
  robots: indexingAllowed
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <link rel="preload" href="/assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/assets/styles/site-typography.css" />
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
