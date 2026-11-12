import { readFile } from "node:fs/promises";
import path from "node:path";
import { indexingAllowed } from "@/lib/seo-policy";

// Recovered independent HTML pages must not inherit the migrated site's CSS/layout.
export async function standaloneDirectory(directory: "reviews" | "custom-mobile-application-development") {
  const original = await readFile(path.join(process.cwd(), "public", directory, "index.html"), "utf8");
  let html = original
    // This transient Cloudflare origin challenge is not part of the authored page.
    .replace(/<script>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?<\/script>/g, "");
  if (!/<base\s/i.test(html)) html = html.replace(/<head>/i, `<head><base href="/${directory}/">`);
  if (directory === "custom-mobile-application-development") {
    // Replace only the legacy submit callback; keep the original layout and input tracking.
    const legacy=/form\.addEventListener\('submit', function \(event\) \{[\s\S]*?\n\t\t\t\t\}\);(?=\r?\n\t\t\t\}\);\r?\n\t\t\}\)\(\);)/;
    if (!legacy.test(html)) throw new Error("Original landing form callback could not be identified safely.");
    html=html.replace(legacy,"");
    const ids:Record<string,string>={"Hero Form":"custom-mobile-hero-enquiry","Footer Form":"custom-mobile-footer-enquiry","CTA Modal Form":"custom-mobile-modal-enquiry"};
    html=html.replace(/<form class="id-form lead-form" data-form-name="([^"]+)">/g,(_match,name:string)=>{
      if(!ids[name])throw new Error("Unknown standalone enquiry form.");
      return `<form class="id-form lead-form" data-contact-form id="${ids[name]}" data-form-name="${name}">`;
    });
    html=html.replace(/<\/body>/i,'<script type="module" src="/assets/standalone-forms/landing.js"></script></body>');
    // The production static-file matcher needs the literal ampersand URL-encoded.
    html = html.replaceAll("Smart Device & Wearable Apps.png", "Smart%20Device%20%26%20Wearable%20Apps.png");
    html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/custom-mobile-application-development/recovery.css"></head>');
  }
  return new Response(html, { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate",
    ...(directory === "reviews" ? { "X-Robots-Tag": indexingAllowed ? "noindex, follow" : "noindex, nofollow" }
      : !indexingAllowed ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
  }});
}
