"use client";
import { useState } from "react";
import data from "@/content/interactions.json";
export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <header className="header">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <a href="/" aria-label="Inceptives Digital home">
        <img
          className="brand"
          src="/assets/update-logo.png"
          alt="Inceptives Digital"
          width="150"
          height="45"
        />
      </a>
      <button
        className="menu-toggle"
        aria-expanded={mobile}
        aria-controls="navigation"
        onClick={() => setMobile(!mobile)}
        aria-label={mobile ? "Close menu" : "Open menu"}
      >
        {mobile ? "×" : "☰"}
      </button>
      <nav
        id="navigation"
        className={mobile ? "navigation is-open" : "navigation"}
        aria-label="Main navigation"
      >
        {data.nav.map((n) => (
          <div
            className={
              "nav-item " + (n.text === "Services" ? "services-menu" : "")
            }
            key={n.text}
            onMouseEnter={() => {
              if (!mobile) setOpen(n.text);
            }}
            onMouseLeave={() => setOpen(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(null);
            }}
          >
            {n.links.length > 1 ? (
              <>
                <button
                  onClick={(event) =>
                    setOpen(
                      mobile || event.detail === 0
                        ? open === n.text
                          ? null
                          : n.text
                        : n.text,
                    )
                  }
                  aria-expanded={open === n.text}
                >
                  {n.text}
                </button>
                <div className="dropdown" hidden={open !== n.text}>
                  {n.text === "Services" ? (
                    <ServiceMenu links={n.links} />
                  ) : (
                    n.links
                      .filter((l) => l.href.startsWith("https:"))
                      .map((l) => (
                        <a href={l.href} key={l.href}>
                          {l.text}
                        </a>
                      ))
                  )}
                </div>
              </>
            ) : (
              <a href={n.href}>{n.text}</a>
            )}
          </div>
        ))}
      </nav>
      <a className="header-phone" href="tel:+14697888527">
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2C9 19 5 15 3 7c-1-2 0-4 2-4Z" />
        </svg>{" "}
        &nbsp;(469) 788-8527
      </a>
      <a className="button header-cta" href="#contact">
        Get In Touch
      </a>
    </header>
  );
}
function ServiceMenu({ links }: { links: { href: string; text: string }[] }) {
  const group = (title: string, start: number, end: number) => (
    <div className="menu-group">
      <h4>{title}</h4>
      {links.slice(start, end).map((l) => (
        <a href={l.href} key={l.href}>
          {l.text}
        </a>
      ))}
    </div>
  );
  return (
    <>
      <div>
        <h3>Application Development</h3>
        {group("", 1, 3)}
        {group("By Platform", 3, 8)}
        {group("By Type", 8, 11)}
        {group("Launch & Growth", 11, 14)}
      </div>
      <div>
        <h3>Artificial Intelligence</h3>
        {group("AI Servicess", 14, 22)}
        {group("Automation", 22, 26)}
      </div>
      <div>
        <h3>Digital Product Development</h3>
        {group("By Engagement", 26, 32)}
        {group("By Craft", 32, 34)}
        <a href={links[0].href}>Services</a>
      </div>
    </>
  );
}
