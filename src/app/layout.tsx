import type { Metadata } from "next";
import "./site.css";
import { indexingAllowed } from "@/lib/seo-policy";
import GhlTracking from "@/components/GhlTracking";
export const metadata: Metadata = {
  metadataBase: new URL("https://inceptivesdigital.com"),
  robots: indexingAllowed
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        {children}
        <GhlTracking />
      </body>
    </html>
  );
}
