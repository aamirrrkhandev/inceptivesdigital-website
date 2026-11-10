"use client";

import { useEffect, useRef, useState } from "react";
import "./schedule-meeting.css";

const CALENDLY_EMBED_URL =
  "https://calendly.com/inceptivesdigital-info/30min?background_color=111111&primary_color=00ce44&text_color=ffffff&hide_event_type_details=1&embed_type=Inline";

export default function ScheduleMeetingSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldLoadIframe) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadIframe(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadIframe]);

  return (
    <section
      id="schedule-meeting"
      aria-labelledby="schedule-meeting-heading"
      className="id-schedule-section"
    >
      <div className="id-schedule-container">
        <div ref={containerRef} className="id-schedule-card">
          {/* LEFT COLUMN: Meeting Information */}
          <div className="id-schedule-left">
            <div aria-hidden="true" className="id-schedule-glow" />

            <div className="id-schedule-left-inner">
              <div>
                <span className="id-schedule-eyebrow">LET&apos;S CONNECT</span>
                <h2
                  id="schedule-meeting-heading"
                  className="id-schedule-heading"
                >
                  Schedule a Meeting
                </h2>
                <p className="id-schedule-lead">
                  Book a convenient time to discuss your product idea, business
                  goals, and technical requirements with our team.
                </p>
              </div>

              <div className="id-schedule-features">
                {/* Feature 1: 30 Minutes */}
                <div className="id-schedule-feature-item">
                  <div className="id-schedule-feature-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="id-schedule-feature-title">30 Minutes</h3>
                    <p className="id-schedule-feature-subtitle">
                      Focused product consultation
                    </p>
                  </div>
                </div>

                {/* Feature 2: Online Meeting */}
                <div className="id-schedule-feature-item">
                  <div className="id-schedule-feature-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="id-schedule-feature-title">
                      Online Meeting
                    </h3>
                    <p className="id-schedule-feature-subtitle">
                      Meeting details provided after booking
                    </p>
                  </div>
                </div>

                {/* Feature 3: Product & Technical Team */}
                <div className="id-schedule-feature-item">
                  <div className="id-schedule-feature-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                        clipRule="evenodd"
                      />
                      <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="id-schedule-feature-title">
                      Product &amp; Technical Team
                    </h3>
                    <p className="id-schedule-feature-subtitle">
                      Discuss your project with our specialists
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Calendly Calendar */}
          <div className="id-schedule-right">
            {shouldLoadIframe ? (
              <iframe
                title="Schedule a Meeting with Inceptives Digital"
                src={CALENDLY_EMBED_URL}
                className="id-schedule-iframe"
                loading="lazy"
                allow="fullscreen"
              />
            ) : (
              <div className="id-schedule-placeholder">
                <div className="id-schedule-placeholder-icon">
                  <svg
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="id-schedule-placeholder-title">
                  30-Minute Product Strategy &amp; Engineering Call
                </p>
                <p className="id-schedule-placeholder-sub">
                  Select a date and time slot that works best for your schedule.
                </p>
                <button
                  type="button"
                  onClick={() => setShouldLoadIframe(true)}
                  className="id-schedule-load-btn"
                >
                  Load Interactive Calendar
                </button>
              </div>
            )}
            <a
              className="id-schedule-booking-link"
              href={CALENDLY_EMBED_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open booking calendar in a new tab
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
