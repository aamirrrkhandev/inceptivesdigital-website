// Generated from src/lib/callrail-transport.ts; run scripts/prepare-standalone-form-runtime.mjs
"use client";



const pending = new Map                 ();
let observing = false;

// The installed native SDK sends XHR and does not invoke the callback documented
// for captureForm. Observe only its public capture endpoint; never send a second
// request, change its payload, or treat a queued invocation as an acknowledgement.
function observeTransport() {
  if (observing) return;
  observing = true;
  const urls = new WeakMap                     ();
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method        , url              , async          = true, username                , password                ) {
    urls.delete(this);
    try {
      const target = new URL(String(url), location.href);
      if (method.toUpperCase() === "POST" && target.protocol === "https:" && target.hostname.endsWith(".callrail.com") && target.pathname.endsWith("/form_capture.json")) urls.set(this, target);
    } catch { /* Unrelated requests remain untouched. */ }
    return originalOpen.call(this, method, url, async, username, password);
  };
  XMLHttpRequest.prototype.send = function(body                                           ) {
    if (urls.has(this) && typeof body === "string") {
      try {
        const payload = JSON.parse(body);
        const entry = pending.get(payload.form_metadata?.["data-callrail-submission-id"]);
        if (entry && typeof payload.uuid === "string") {
          this.addEventListener("loadend", () => {
            let rejected = false;
            try {
              const result = JSON.parse(this.responseText || "null");
              rejected = result?.success === false || Boolean(result?.error);
            } catch { /* Native response need not contain JSON. */ }
            entry.finish(this.status >= 200 && this.status < 300 && !rejected ? "confirmed" : "rejected");
          }, { once: true });
        }
      } catch { /* Preserve the SDK's transport on unexpected payloads. */ }
    }
    return originalSend.call(this, body);
  };
}

export function captureWithAcknowledgement(form                 , capture            )                   {
  observeTransport();
  const id = crypto.randomUUID();
  form.dataset.callrailSubmissionId = id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish("unconfirmed"), 5000);
    const finish = (outcome         ) => {
      if (!pending.has(id)) return;
      clearTimeout(timer);
      pending.delete(id);
      resolve(outcome);
    };
    pending.set(id, { finish });
    try { capture(); } catch (error) {
      clearTimeout(timer);
      pending.delete(id);
      reject(error);
    }
  });
}
