import type { Metadata } from "next";
import "./site.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://inceptivesdigital.com"),
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
