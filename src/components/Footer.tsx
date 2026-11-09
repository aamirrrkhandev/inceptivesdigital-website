import { data } from "@/lib/content";
import { Picture, Video } from "./Media";
import { ContactForm } from "./Interactions";
export default function Footer() {
  const blocks = data.footerBlocks;
  const menus = blocks.filter((b) => b.type === "nav-menu.default").slice(0, 5);
  const labels = [
    "Services",
    "Industries",
    "Case Studies",
    "Locations",
    "Company",
  ];
  const locations = blocks.filter((b) => b.type === "image-box.default");
  const images = blocks
    .filter((b) => b.type === "image.default")
    .flatMap((b) => b.images);
  return (
    <>
      <section className="contact-section" id="contact">
        <div className="container split">
          <div className="contact-art">
            <Picture image={images.find((x) => x.alt === "Locations")!} />
          </div>
          <div>
            <h2>Get in touch!</h2>
            <p className="contact-tagline">
              Scalable solutions from teams worldwide!
            </p>
            <ContactForm />
            <p className="legal-links">
              <a href="https://inceptivesdigital.com/privacy-policy">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="https://inceptivesdigital.com/terms-and-conditions">
                Terms of Services
              </a>
            </p>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="/">
                <img
                  src="/assets/update-logo.png"
                  alt="Inceptives Digital"
                  width="160"
                  height="48"
                />
              </a>
              <p>
                We build apps, digital products, and AI-powered systems for
                businesses that cannot afford to get it wrong.
              </p>
              <a href="mailto:info@inceptivesdigital.com">
                info@inceptivesdigital.com
              </a>
              <a href="tel:+14697888527">(469) 788-8527</a>
              <div className="social-links">
                <a href="https://www.linkedin.com/company/inceptivesdigital/">
                  Linkedin
                </a>
                <a href="https://www.instagram.com/inceptivesdigital/">
                  Instagram
                </a>
                <a href="https://www.facebook.com/inceptivesdigital">
                  Facebook
                </a>
              </div>
            </div>
            <div className="footer-menus">
              {menus.map((m, i) => (
                <div key={i}>
                  <h3>{labels[i]}</h3>
                  {m.links
                    .filter(
                      (x, j, a) => a.findIndex((y) => y.href === x.href) === j,
                    )
                    .map((l) => (
                      <a key={l.href} href={l.href}>
                        {l.text}
                      </a>
                    ))}
                </div>
              ))}
            </div>
          </div>
          <div className="review-row">
            <div>
              <h3>Recognized and Reviewed On</h3>
              <p>
                Independent reviews and industry recognition from established
                B2B platforms.
              </p>
            </div>
            <div className="badges">
              {images
                .filter((x) => x.alt.includes("Review Badge"))
                .map((x) => (
                  <Picture key={x.src} image={x} />
                ))}
            </div>
          </div>
          <h3 className="locations-heading">Our Locations</h3>
          <div className="locations-grid">
            {locations.map((l, i) => (
              <article key={i}>
                <Picture image={l.images[0]} />
                <h4>{l.text.replace(l.description, "")}</h4>
                {l.links[0] ? (
                  <a href={l.links[0].href}>{l.description}</a>
                ) : (
                  <p>{l.description}</p>
                )}
              </article>
            ))}
          </div>
          <div className="copyright">
            <p>{blocks.find((b) => b.text.startsWith("©"))?.text}</p>
            <div>
              <a href="https://inceptivesdigital.com/privacy-policy">
                Privacy Policy
              </a>
              <a href="https://inceptivesdigital.com/terms-and-conditions">
                Terms of Use
              </a>
            </div>
            <a href="https://www.dmca.com/Protection/Status.aspx?ID=f91eaa7d-6fbf-4058-bfda-4801f7c9b566">
              <img
                src="/assets/dmca-badge.png"
                alt="DMCA.com Protection Status"
                width="100"
                height="20"
                loading="lazy"
              />
            </a>
          </div>
        </div>
        <div className="footer-video">
          <Video name="footer.mp4" />
        </div>
      </footer>
    </>
  );
}
