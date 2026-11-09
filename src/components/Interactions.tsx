"use client";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { asset } from "@/lib/assets";
import data from "@/content/interactions.json";
import { Picture } from "./Media";
export function ScheduleButton({
  children = "Schedule A Call",
  className = "button outline",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className={className} onClick={() => dialog.current?.showModal()}>
        {children}
      </button>
      <dialog
        ref={dialog}
        className="schedule-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close scheduling dialog"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <iframe
          title="Calendly Scheduling Page"
          src="https://calendly.com/inceptivesdigital-info/30min?embed_type=Inline&background_color=141414&text_color=ffffff&primary_color=00c853"
          loading="lazy"
        />
      </dialog>
    </>
  );
}
export function ProcessTabs() {
  const [active, setActive] = useState(0);
  const tabs = data.tabs;
  const labels = [
    "Product Intelligence",
    "Design",
    "Engineering",
    "Testing",
    "Launch",
    "Partnership",
  ];
  function keys(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById("process-tab-" + next)?.focus();
  }
  return (
    <>
      <div
        className="process-tabs"
        role="tablist"
        aria-label="Our development process"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={"process-tab-" + i}
            role="tab"
            aria-selected={active === i}
            aria-controls={"process-panel-" + i}
            tabIndex={active === i ? 0 : -1}
            onKeyDown={(e) => keys(e, i)}
            onClick={() => setActive(i)}
          >
            <span className="process-icon">
              <Picture image={t.images[0]} />
              <small>0{i + 1}.</small>
            </span>
            <span>{labels[i]}</span>
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          id={"process-panel-" + i}
          className="process-panel"
          role="tabpanel"
          aria-labelledby={"process-tab-" + i}
          hidden={active !== i}
        >
          <Picture image={t.images[0]} />
          <div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
          </div>
        </div>
      ))}
    </>
  );
}
export function CaseCarousel() {
  const [active, setActive] = useState(0);
  const cases = data.cases;
  return (
    <>
      <div
        className="case-stage"
        aria-roledescription="carousel"
        aria-label="Selected case studies"
      >
        {cases.map((c, i) => {
          const images = c.blocks
            .filter((b) => b.type === "image.default")
            .flatMap((b) => b.images);
          const title = c.blocks.find((b) => b.type === "heading.default");
          const subtitle = c.blocks.find(
            (b) => b.type === "text-editor.default",
          )?.text;
          const link = c.blocks
            .flatMap((b) => b.links)
            .find((l) => l.text.includes("Case Study"));
          return (
            <article
              className={"case-card case-" + i}
              key={i}
              hidden={active !== i}
              aria-label={`${i + 1} of ${cases.length}: ${title?.text}`}
            >
              <div className="case-copy">
                {images[0] && (
                  <Picture image={images[0]} className="case-logo" />
                )}
                <h3>{title?.text}</h3>
                {i === 0 ? (
                  <>
                    <p className="case-subtitle">{subtitle}</p>
                    {c.blocks
                      .filter((b) => b.type === "image-box.default")
                      .map((b, j) => (
                        <div key={j}>
                          <h4>{b.title}</h4>
                          <p>{b.text.replace(b.title, "")}</p>
                        </div>
                      ))}
                    <h4>The Outcome</h4>
                    <ul>
                      <li>90% reduction in manual paperwork</li>
                      <li>1,000+ security personnel supported</li>
                      <li>Better visibility across field operations</li>
                    </ul>
                  </>
                ) : (
                  <>
                    {c.blocks
                      .filter((b) => b.type === "heading.default")
                      .slice(1)
                      .map((b, j) => (
                        <h4 key={j}>{b.text}</h4>
                      ))}
                    <p>{subtitle}</p>
                    {c.blocks
                      .filter((b) => b.type === "image-box.default")
                      .map((b, j) => (
                        <p key={j}>{b.text}</p>
                      ))}
                  </>
                )}
                {link && (
                  <a className="button case-link" href={link.href}>
                    {link.text} →
                  </a>
                )}
              </div>
              <div className="case-art">
                {images.find((x) => x.alt.includes("Screens")) && (
                  <picture>
                    <source
                      media="(max-width:767px)"
                      srcSet={asset(
                        images.filter((x) => x.alt.includes("Screens")).at(-1)!
                          .src,
                      )}
                    />
                    <Picture
                      image={images.find((x) => x.alt.includes("Screens"))!}
                    />
                  </picture>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="carousel-controls">
        <button
          aria-label="Previous slide"
          onClick={() => setActive((active + cases.length - 1) % cases.length)}
        >
          ←
        </button>
        <span className="sr-only" aria-live="polite">
          Case study {active + 1} of {cases.length}
        </span>
        <button
          aria-label="Next slide"
          onClick={() => setActive((active + 1) % cases.length)}
        >
          →
        </button>
      </div>
    </>
  );
}
export function ContactForm() {
  const [status, setStatus] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(
      "Staging preview: validation passed. Your message has not been sent. Please use the live website to contact our team.",
    );
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          <span className="sr-only">First Name</span>
          <input
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            required
          />
        </label>
        <label>
          <span className="sr-only">Last Name</span>
          <input
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            required
          />
        </label>
        <label className="full">
          <span className="sr-only">Email</span>
          <input
            type="email"
            name="email"
            placeholder="Email:"
            autoComplete="email"
            required
          />
        </label>
        <label>
          <span className="sr-only">Phone</span>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 555-5555"
            autoComplete="tel"
            required
          />
        </label>
        <label>
          <span className="sr-only">Subject</span>
          <input name="subject" placeholder="Subject" />
        </label>
        <label className="full">
          <span className="sr-only">Message</span>
          <textarea name="message" placeholder="Message:" rows={2} required />
        </label>
      </div>
      {["transactional", "marketing and promotional"].map((t) => (
        <label className="consent" key={t}>
          <input type="checkbox" name={t} />{" "}
          <span>
            I consent to receive {t} messages from Inceptives Digital at the
            phone number provided. Message frequency may vary. Message &amp;
            data rates may apply. Reply HELP for help or STOP to opt out.
          </span>
        </label>
      ))}
      <button className="button submit" type="submit">
        Submit!
      </button>
      {status && (
        <p role="status" className="form-status">
          {status}
        </p>
      )}
    </form>
  );
}
