# All-page editing and asset structure — proposal for review

Prepared 2026-11-11. Documentation only: this proposal does not change rendering, URLs, metadata, assets, WordPress, staging or DNS. Existing unrelated work is not deployed by this step.

## Folder contract

```text
inceptives-migration/
  src/app/
    page.tsx                         # homepage route
    <slug>/page.tsx                   # explicit static page route
    blog/page.tsx                     # API-based blog listing
    blog/[postSlug]/page.tsx          # API-based article
    [...slug]/page.tsx                # API archives and existing fallback
  src/page-content/
    home/                            # homepage editing files
    <existing-page-folder>/
      Page.tsx                       # page composition
      components/
        Sections.tsx                 # section order/composition
        HeroSection.tsx               # page-specific hero component
        <SectionName>Section.tsx      # page-specific sections
      content.json                   # current text and headings
      layout.json                    # current layout tree and references
      assets.json                    # image/video/background paths, alt, dimensions
      seo.json                       # current title/description/canonical/robots/social
      schema.json                    # current JSON-LD
      styles.css                     # page-specific CSS
    _shared/                         # existing shared page data
  src/components/                    # shared components/header/footer/forms
  public/assets/
    pages/
      home/images/
      home/videos/
      mobile-app-development/images/
      mobile-app-development/videos/
      <existing-page-folder>/images/
      <existing-page-folder>/videos/
    shared/images/                   # logos, repeated icons, shared imagery
    shared/videos/                   # only if shared videos exist
    fonts/                           # shared fonts; keep current working paths
    styles/                          # existing shared stylesheet assets
  PROPOSED_ALL_PAGE_STRUCTURE.csv     # one row per inventoried URL
```

Existing page folders and filenames are preserved. The tree is a contract, not a claim that every page has a hero/video or that all proposed shared subfolders already exist. Do not create empty or fabricated components/assets.

## What changes after approval

1. Resolve each static page image, CSS background, video source and poster to its real local file; audit shared use before moving anything.
2. Use page asset public URLs in assets.json and all corresponding srcset/CSS/video references. Example: /assets/pages/mobile-app-development/images/<actual-filename>.webp. Retain working filenames initially; a filename rename must update all references atomically.
3. Keep logos and genuinely shared files in shared; page manifests point to them instead of duplicating binaries. Each page has an asset manifest even when some files are shared.
4. Keep old /wp-content/uploads/... URLs working as local compatibility aliases. Changing public asset URLs can affect image search, so do not delete those URLs. Preserve alt text, dimensions, captions, original content and schema values.
5. Test every mapped URL, image/video request, responsive layout and metadata before staging deployment. No production or DNS action.

Current issue: assets.json often contains both a real publicUrl and an old src. Having folders alone does not switch the browser URL. Implementation must connect the renderer and CSS to those mappings.

## API-managed content

Blogs, categories, authors, date archives and Press Release stay connected to nextincep.wpenginepowered.com. New/updated/deleted posts must continue to sync at runtime. Do not create static page-content folders or duplicate public media folders for each post. Their SEO stays derived from the CMS through the current adapter. The Press Release wrapper may have local config, but its posts remain dynamic.

## Route exceptions

- /iot-development permanently redirects to /iot-app-development. Its internal page-content/iot-development folder may remain: folder name is independent of public slug.
- /startup-product-development remains on hold and is not restored/published.
- /our-process and /our-manifesto remain excluded; leftover folders are not authorization to publish them.
- Canonicals retain approved production host and no trailing slash for child pages. Homepage is the origin root. No SEO values are rewritten by this proposal.

## Every registered static editing folder (81)

The CSV includes all inventoried URLs, including dynamic routes and exceptions. This table lists the registered static editing folders; publication status must still honor the exceptions above.

| Public route | Content/components/SEO folder | Page assets folder |
| --- | --- | --- |
| / | src/page-content/home/ | public/assets/pages/home/ |
| /about-us | src/page-content/about-us/ | public/assets/pages/about-us/ |
| /ai-agent-development | src/page-content/ai-agent-development/ | public/assets/pages/ai-agent-development/ |
| /ai-app-development-services | src/page-content/ai-app-development-services/ | public/assets/pages/ai-app-development-services/ |
| /ai-automation-services | src/page-content/ai-automation-services/ | public/assets/pages/ai-automation-services/ |
| /ai-chatbot-development-services | src/page-content/ai-chatbot-development-services/ | public/assets/pages/ai-chatbot-development-services/ |
| /ai-development | src/page-content/ai-development/ | public/assets/pages/ai-development/ |
| /ai-development/ai-cost-estimator | src/page-content/ai-development/ai-cost-estimator/ | public/assets/pages/ai-development/ai-cost-estimator/ |
| /ai-mvp-development | src/page-content/ai-mvp-development/ | public/assets/pages/ai-mvp-development/ |
| /android-app-development | src/page-content/android-app-development/ | public/assets/pages/android-app-development/ |
| /app-store-optimization | src/page-content/app-store-optimization/ | public/assets/pages/app-store-optimization/ |
| /ar-app-development | src/page-content/ar-app-development/ | public/assets/pages/ar-app-development/ |
| /backend-api-development | src/page-content/backend-api-development/ | public/assets/pages/backend-api-development/ |
| /blockchain-development | src/page-content/blockchain-development/ | public/assets/pages/blockchain-development/ |
| /business-process-automation | src/page-content/business-process-automation/ | public/assets/pages/business-process-automation/ |
| /computer-vision-development-services | src/page-content/computer-vision-development-services/ | public/assets/pages/computer-vision-development-services/ |
| /contact-us | src/page-content/contact-us/ | public/assets/pages/contact-us/ |
| /cross-platform-app-development | src/page-content/cross-platform-app-development/ | public/assets/pages/cross-platform-app-development/ |
| /custom-software-development | src/page-content/custom-software-development/ | public/assets/pages/custom-software-development/ |
| /dating-app-development-company | src/page-content/dating-app-development-company/ | public/assets/pages/dating-app-development-company/ |
| /digital-product-development | src/page-content/digital-product-development/ | public/assets/pages/digital-product-development/ |
| /discovery-sprint | src/page-content/discovery-sprint/ | public/assets/pages/discovery-sprint/ |
| /dropryde | src/page-content/dropryde/ | public/assets/pages/dropryde/ |
| /ecommerce-app-development-company | src/page-content/ecommerce-app-development-company/ | public/assets/pages/ecommerce-app-development-company/ |
| /education-app-development-company | src/page-content/education-app-development-company/ | public/assets/pages/education-app-development-company/ |
| /fintech-app-development | src/page-content/fintech-app-development/ | public/assets/pages/fintech-app-development/ |
| /fitness-app-development | src/page-content/fitness-app-development/ | public/assets/pages/fitness-app-development/ |
| /flutter-app-development | src/page-content/flutter-app-development/ | public/assets/pages/flutter-app-development/ |
| /food-delivery-app-development | src/page-content/food-delivery-app-development/ | public/assets/pages/food-delivery-app-development/ |
| /founders-letter | src/page-content/founders-letter/ | public/assets/pages/founders-letter/ |
| /generative-ai-development-company | src/page-content/generative-ai-development-company/ | public/assets/pages/generative-ai-development-company/ |
| /healthcare-app-development | src/page-content/healthcare-app-development/ | public/assets/pages/healthcare-app-development/ |
| /interactive-prototyping | src/page-content/interactive-prototyping/ | public/assets/pages/interactive-prototyping/ |
| /ios-app-development | src/page-content/ios-app-development/ | public/assets/pages/ios-app-development/ |
| /iot-app-development | src/page-content/iot-development/ | public/assets/pages/iot-development/ |
| /kotlin-multiplatform-app-development | src/page-content/kotlin-multiplatform-app-development/ | public/assets/pages/kotlin-multiplatform-app-development/ |
| /leadership | src/page-content/leadership/ | public/assets/pages/leadership/ |
| /life-at-inceptives-digital | src/page-content/life-at-inceptives-digital/ | public/assets/pages/life-at-inceptives-digital/ |
| /machine-learning-development-services | src/page-content/machine-learning-development-services/ | public/assets/pages/machine-learning-development-services/ |
| /mobile-app-development | src/page-content/mobile-app-development/ | public/assets/pages/mobile-app-development/ |
| /mobile-app-development-austin | src/page-content/mobile-app-development-austin/ | public/assets/pages/mobile-app-development-austin/ |
| /mobile-app-development-company-dubai-uae | src/page-content/mobile-app-development-company-dubai-uae/ | public/assets/pages/mobile-app-development-company-dubai-uae/ |
| /mobile-app-development-company-in-toronto-canada | src/page-content/mobile-app-development-company-in-toronto-canada/ | public/assets/pages/mobile-app-development-company-in-toronto-canada/ |
| /mobile-app-development-company-london-uk | src/page-content/mobile-app-development-company-london-uk/ | public/assets/pages/mobile-app-development-company-london-uk/ |
| /mobile-app-development-company-singapore | src/page-content/mobile-app-development-company-singapore/ | public/assets/pages/mobile-app-development-company-singapore/ |
| /mobile-app-development-new-york | src/page-content/mobile-app-development-new-york/ | public/assets/pages/mobile-app-development-new-york/ |
| /mobile-app-development-san-francisco | src/page-content/mobile-app-development-san-francisco/ | public/assets/pages/mobile-app-development-san-francisco/ |
| /mobile-game-development | src/page-content/mobile-game-development/ | public/assets/pages/mobile-game-development/ |
| /mvp-development | src/page-content/mvp-development/ | public/assets/pages/mvp-development/ |
| /nlp-development-services | src/page-content/nlp-development-services/ | public/assets/pages/nlp-development-services/ |
| /partnership | src/page-content/partnership/ | public/assets/pages/partnership/ |
| /portfolio | src/page-content/portfolio/ | public/assets/pages/portfolio/ |
| /portfolio/dps-airem | src/page-content/portfolio/dps-airem/ | public/assets/pages/portfolio/dps-airem/ |
| /portfolio/family-entertainment-group | src/page-content/portfolio/family-entertainment-group/ | public/assets/pages/portfolio/family-entertainment-group/ |
| /portfolio/halwar-connect | src/page-content/portfolio/halwar-connect/ | public/assets/pages/portfolio/halwar-connect/ |
| /portfolio/my-tango-event | src/page-content/portfolio/my-tango-event/ | public/assets/pages/portfolio/my-tango-event/ |
| /portfolio/pets-b4-profit | src/page-content/portfolio/pets-b4-profit/ | public/assets/pages/portfolio/pets-b4-profit/ |
| /portfolio/pulse-check-timer | src/page-content/portfolio/pulse-check-timer/ | public/assets/pages/portfolio/pulse-check-timer/ |
| /portfolio/stakbread | src/page-content/portfolio/stakbread/ | public/assets/pages/portfolio/stakbread/ |
| /portfolio/state-of-the-art-chiropractic | src/page-content/portfolio/state-of-the-art-chiropractic/ | public/assets/pages/portfolio/state-of-the-art-chiropractic/ |
| /portfolio/wordsmith-pro | src/page-content/portfolio/wordsmith-pro/ | public/assets/pages/portfolio/wordsmith-pro/ |
| /portfolio/zoom-read | src/page-content/portfolio/zoom-read/ | public/assets/pages/portfolio/zoom-read/ |
| /post-launch-analytics-iteration | src/page-content/post-launch-analytics-iteration/ | public/assets/pages/post-launch-analytics-iteration/ |
| /privacy-policy | src/page-content/privacy-policy/ | public/assets/pages/privacy-policy/ |
| /product-launch-strategy | src/page-content/product-launch-strategy/ | public/assets/pages/product-launch-strategy/ |
| /product-rescue-scaling | src/page-content/product-rescue-scaling/ | public/assets/pages/product-rescue-scaling/ |
| /product-strategy-consulting | src/page-content/product-strategy-consulting/ | public/assets/pages/product-strategy-consulting/ |
| /react-native-app-development | src/page-content/react-native-app-development/ | public/assets/pages/react-native-app-development/ |
| /real-estate-app-development-company | src/page-content/real-estate-app-development-company/ | public/assets/pages/real-estate-app-development-company/ |
| /rpa-development-services | src/page-content/rpa-development-services/ | public/assets/pages/rpa-development-services/ |
| /services | src/page-content/services/ | public/assets/pages/services/ |
| /staff-augmentation | src/page-content/staff-augmentation/ | public/assets/pages/staff-augmentation/ |
| /system-integration-api-automation | src/page-content/system-integration-api-automation/ | public/assets/pages/system-integration-api-automation/ |
| /terms-and-conditions | src/page-content/terms-and-conditions/ | public/assets/pages/terms-and-conditions/ |
| /testimonial | src/page-content/testimonial/ | public/assets/pages/testimonial/ |
| /thank-you | src/page-content/thank-you/ | public/assets/pages/thank-you/ |
| /travel-app-development-company | src/page-content/travel-app-development-company/ | public/assets/pages/travel-app-development-company/ |
| /ui-ux-design | src/page-content/ui-ux-design/ | public/assets/pages/ui-ux-design/ |
| /virtual-reality-development | src/page-content/virtual-reality-development/ | public/assets/pages/virtual-reality-development/ |
| /web-app-development-company | src/page-content/web-app-development-company/ | public/assets/pages/web-app-development-company/ |
| /web-development | src/page-content/web-development/ | public/assets/pages/web-development/ |

## Editing workflow

Open src/page-content/<page-folder>/content.json for text, assets.json for image paths and alt text, components/ for section code, styles.css for page styling, seo.json for metadata and schema.json for JSON-LD. The src/app route delegates to Page.tsx. Do not edit generated .next, content/editable-runtime, node_modules or downloaded cache files. Static edits require a build/deploy; API blog edits do not require committing a static copy.

## Review gate

This delivers the structure first. Asset moves, asset URL rewiring, filename changes and any new implementation wait for the user to approve this proposal.
