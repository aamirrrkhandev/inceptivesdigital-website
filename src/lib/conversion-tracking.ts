"use client";

// GTM owns the vendor pixels. Keep customer details out of the shared data layer.
export async function recordConfirmedLead(form: HTMLFormElement): Promise<void> {
  try {
    if (!/^(www\.)?inceptivesdigital\.com$/.test(location.hostname)) return;
    const target = window as typeof window & { dataLayer?: Record<string, unknown>[] };
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 200);
      target.dataLayer = target.dataLayer || [];
      target.dataLayer.push({
        event: "lead_submitted",
        event_id: crypto.randomUUID(),
        source_site: "nextjs",
        source_form: form.id || form.getAttribute("name") || "website_enquiry",
        lead_type: form.id === "id-ios-form" ? "ios_assessment" : "website_lead",
        conversion_path: location.pathname,
        booking_requested: false,
        booking_status: "not_requested",
        eventCallback: () => { window.clearTimeout(timer); resolve(); },
        eventTimeout: 180,
      });
    });
  } catch {
    // Analytics must never turn an accepted enquiry into a failed submission.
  }
}
