import Script from "next/script";

// Public identifiers copied from the current WordPress site. GA4 and LiveChat
// are managed inside this existing GTM container; do not install them twice.
export default function SourceAnalytics() {
  return <>
    <Script id="inceptives-source-analytics-queue" strategy="afterInteractive">{`
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({'gtm.start':performance.timeOrigin||Date.now(),event:'gtm.js',site_environment:location.hostname.endsWith('.vercel.app')?'staging':'production'});
    `}</Script>
    <Script id="inceptives-source-analytics" strategy="lazyOnload">{`
    (function(w,d){
      var h=w.location.hostname;
      if(!['inceptivesdigital.com','www.inceptivesdigital.com','inceptives-homepage-review.vercel.app'].includes(h)&&!(h.startsWith('inceptives-homepage-review-')&&h.endsWith('.vercel.app')))return;
      w.dataLayer=w.dataLayer||[];
      if(!d.getElementById('inceptives-source-gtm')){
        var g=d.createElement('script');g.id='inceptives-source-gtm';g.async=true;
        g.fetchPriority='low';
        g.src='https://www.googletagmanager.com/gtm.js?id=GTM-5BV286F5';
        g.onload=function(){d.documentElement.dataset.sourceGtm='ready'};
        g.onerror=function(){d.documentElement.dataset.sourceGtm='unavailable'};
        d.head.appendChild(g);
      }
      if(!d.getElementById('vtag-ai-js')){
        var l=d.createElement('script');l.id='vtag-ai-js';l.async=true;
        l.fetchPriority='low';
        l.src='https://r2.leadsy.ai/tag.js';l.dataset.pid='1iKDbwnIEhjXkU4nY';l.dataset.version='062024';
        l.onload=function(){d.documentElement.dataset.sourceLeadsy='ready'};
        l.onerror=function(){d.documentElement.dataset.sourceLeadsy='unavailable'};
        d.head.appendChild(l);
      }
    })(window,document);
  `}</Script>
  </>;
}
