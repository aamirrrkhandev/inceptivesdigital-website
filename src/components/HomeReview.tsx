import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Picture, Video } from "@/components/Media";
import {
  CaseCarousel,
  ProcessTabs,
  ScheduleButton,
} from "@/components/Interactions";
import { data, section, texts, headings, getCards } from "@/lib/content";

const Roadmap = () => (
  <a className="button" href="#contact">
    Start My Product Roadmap
  </a>
);
function Reviews({ mobile = false }: { mobile?: boolean }) {
  const s = section(mobile ? "7530ae0c" : "30e1b4df");
  const links = [
    "https://clutch.co/profile/inceptives-digital",
    "https://www.bark.com/en/us/b/inceptives-digital/",
    "https://www.trustpilot.com/review/inceptivesdigital.com",
  ];
  return (
    <div className="badges">
      {s.images.slice(0, 3).map((x, i) => (
        <a href={links[i]} key={x.src}>
          <Picture image={x} eager />
        </a>
      ))}
    </div>
  );
}
export default function Home() {
  const services = getCards("597d6232");
  const industries = getCards("34840db5");
  const t = section("2d15886").blocks;
  const quotes = t.flatMap((b, i) =>
    b.type === "text-editor.default" && i > 5
      ? [{ quote: b.text, name: t[i + 1]?.text, role: t[i + 2]?.text }]
      : [],
  );
  const blogs = section("3d8222f1").blocks.filter(
    (b) => b.type === "theme-post-title.default",
  );
  const blogImages = section("3d8222f1")
    .blocks.filter(
      (b) => b.type === "image.default" && b.images[0].alt !== "Sparkle",
    )
    .map((b) => b.images[0]);
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero">
          <div className="hero-desktop container">
            <div className="hero-media">
              <Video name="comp-bannerhero.mp4" poster="videopost-1.png" />
              <div className="hero-green">
                <div className="hero-copy">
                  <h1>{headings("30e1b4df")[0]}</h1>
                  <p>{texts("30e1b4df")[0]}</p>
                  <div className="hero-actions">
                    <a className="button dark" href="#contact">
                      Get A Call Now!
                    </a>
                    <ScheduleButton />
                  </div>
                </div>
                <Reviews />
              </div>
            </div>
          </div>
          <div className="hero-mobile">
            <h2>{headings("7530ae0c")[0]}</h2>
            <p>{texts("7530ae0c")[0]}</p>
            <a className="button" href="#contact">
              Get A Call Now!
            </a>
            <ScheduleButton />
            <Video name="comp-bannerhero.mp4" poster="videopost-1.png" />
            <Reviews mobile />
          </div>
        </section>
        <section
          className="media-marquee"
          aria-label="Media and review platform logos"
        >
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-set" key={copy} aria-hidden={copy === 1}>
                {section("accfdfe").images.map((x) => (
                  <Picture image={x} key={x.src} />
                ))}
              </div>
            ))}
          </div>
        </section>
        <section className="capabilities section muted">
          <div className="container split">
            <div>
              <h2>{headings("2e8ddb3e")[0]}</h2>
              <p>{texts("2e8ddb3e")[0]}</p>
            </div>
            <Picture image={section("2e8ddb3e").images[0]} />
          </div>
        </section>
        <section className="services section">
          <div className="container">
            <div className="section-top">
              <div>
                <h2>
                  We build what your <em>business</em>
                  <br /> runs on
                </h2>
                <p>{texts("597d6232")[0]}</p>
              </div>
              <Roadmap />
            </div>
            <div className="services-grid">
              {services.map((s) => (
                <article key={s.title}>
                  <Video name="home-video-con.mp4" />
                  <Picture image={s.image} />
                  <h3>
                    <a href={s.href}>{s.title}</a>
                  </h3>
                  <p>{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="clients section muted">
          <div className="container">
            <h2>
              From Startups to <span>Growing Enterprises</span>
            </h2>
            <div className="clients-grid">
              {section("fedacfa").images.map((x) => (
                <div key={x.src}>
                  <Picture image={x} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="showreel">
          <Video name="homesection-video.mp4" controls />
        </section>
        <section className="case-studies section muted">
          <div className="container">
            <div className="section-top">
              <h2>{headings("59803898")[0]}</h2>
              <a
                className="button"
                href="https://inceptivesdigital.com/portfolio"
              >
                View All Case Studies
              </a>
            </div>
            <CaseCarousel />
          </div>
        </section>
        <section className="awards section muted">
          <div className="container">
            <h2>{headings("a34ee8c")[0]}</h2>
            <div className="award-grid">
              {section("a34ee8c").images.map((x) => (
                <Picture key={x.src} image={x} />
              ))}
            </div>
          </div>
        </section>
        <section className="testimonials section muted">
          <div className="container split">
            <div>
              <h2>{headings("2d15886")[0]}</h2>
              <p>{texts("2d15886")[0]}</p>
              <div className="badges">
                {section("2d15886")
                  .images.slice(0, 3)
                  .map((x) => (
                    <Picture key={x.src} image={x} />
                  ))}
              </div>
            </div>
            <div
              className="quote-list"
              tabIndex={0}
              aria-label="Client testimonials"
            >
              {quotes.map((q) => (
                <blockquote key={q.name}>
                  <p>{q.quote}</p>
                  <cite>
                    <span>{q.name}</span> {q.role}
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
        <section className="industries section">
          <div className="container">
            <h2>{headings("34840db5")[0]}</h2>
            <div className="industries-grid">
              {industries.map((s) => (
                <article key={s.title}>
                  <Picture image={s.image} />
                  <h3>{s.href ? <a href={s.href}>{s.title}</a> : s.title}</h3>
                  <p>{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="discovery section">
          <div className="container">
            <div>
              <em>Discovery sprint</em>
              <h2>{headings("6b4cc2a8")[1]}</h2>
              <p>{texts("6b4cc2a8")[0]}</p>
              <Roadmap />
            </div>
          </div>
        </section>
        <section className="process section muted">
          <div className="container">
            <h2>
              Senior minds on your product.{" "}
              <em>
                Every
                <br /> stage. Every decision.
              </em>
            </h2>
            <p className="center">{texts("65722df4")[0]}</p>
            <ProcessTabs />
          </div>
        </section>
        <section className="schedule section muted" id="schedule">
          <div className="container">
            <h2>{headings("6b826671")[0]}</h2>
            <iframe
              title="Calendly Scheduling Page"
              src="https://calendly.com/inceptivesdigital-info/30min?background_color=191919&primary_color=blue&text_color=ffffff&embed_type=Inline&embed_domain=1"
              loading="lazy"
            />
          </div>
        </section>
        <section className="success section">
          <div className="container split">
            <div className="success-panel">
              <h2>{headings("27b4bf69")[0]}</h2>
              <div className="stats">
                <div>
                  <strong>70+</strong>
                  <h3>Applications Launched!!</h3>
                </div>
                <div>
                  <strong>150+</strong>
                  <h3>Active Developers</h3>
                </div>
                <div>
                  <strong>3 Million</strong>
                  <h3>Downloads on App Store!</h3>
                </div>
              </div>
              <fieldset>
                <legend>recognition from industry leader!</legend>
                {section("27b4bf69")
                  .images.slice(0, 2)
                  .map((x) => (
                    <Picture image={x} key={x.src} />
                  ))}
              </fieldset>
            </div>
            <div className="success-art">
              <div className="success-images">
                {section("27b4bf69")
                  .images.slice(2)
                  .map((x) => (
                    <Picture image={x} key={x.src} />
                  ))}
              </div>
            </div>
          </div>
        </section>
        <section className="blog section muted">
          <div className="container">
            <h2>
              Your Go-To Business <span>Growth Blog!</span>
            </h2>
            <p className="center">{texts("3d8222f1")[0]}</p>
            <div className="blog-grid">
              {blogs.map((b, i) => (
                <article key={b.text}>
                  <a href={b.links[0].href}>
                    <Picture image={blogImages[i]} />
                  </a>
                  <div>
                    <img
                      className="sparkle"
                      src="/assets/sparkle.png"
                      alt="Sparkle"
                      loading="lazy"
                    />
                    <h3>
                      <a href={b.links[0].href}>{b.text}</a>
                    </h3>
                    <a href={b.links[0].href}>Read More →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="faq section">
          <div className="container">
            <h2>Frequently Asked Questions.</h2>
            <div className="faq-list">
              {data.faq.map((f, i) => (
                <details key={f.question} open={i === 0} name="homepage-faq">
                  <summary>
                    <h3>{f.question}</h3>
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="closing section">
          <div className="container">
            <div>
              <h2>{headings("2cdbf5fa")[0]}</h2>
              <p>{texts("2cdbf5fa")[0]}</p>
              <Roadmap />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data.meta.schema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
