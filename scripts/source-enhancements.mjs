// Render the public template's JS-created structure on the server for equivalent styling.
export function prepareSourceDom($, row) {
  const policy = $(
    "#id-contact-popup .id-cp__form .elementor-widget-icon-list",
  ).first();
  const policyFooter = $("#id-contact-popup .id-cp__policy-footer").first();
  if (policy.length && policyFooter.length) policyFooter.append(policy);
  const settingsScript = $("script")
    .toArray()
    .map((el) => $(el).html() || "")
    .find((code) => code.includes("var cfturnstileElementorSettings ="));
  const settingsMatch = settingsScript?.match(
    /cfturnstileElementorSettings\s*=\s*(\{[^;]+\})/,
  );
  if (settingsMatch) {
    const settings = JSON.parse(settingsMatch[1]);
    if (settings.mode === "turnstile" && settings.sitekey)
      $("form.elementor-form").each((_, form) => {
        const button = $(form).find('button[type="submit"]').first();
        if (!button.length) return;
        const widget = $("<div></div>").attr({
          class: "elementor-turnstile-field",
          "data-contact-verification": "true",
          "data-sitekey": settings.sitekey,
          "data-theme": settings.theme || "auto",
          style:
            "display:block;margin:10px 0 15px 0;width:100%;min-height:72px;",
        });
        button.before(widget);
      });
  }
  $('[id^="id-blog-"]').each((_, element) => {
    const root = $(element);
    const article = root.find(".id-article-body").first();
    if (!article.length) return;
    const id = root.attr("id");
    const headings = article.find("h2,h3");
    root.find(".id-toc-links,.id-mobile-toc-links").each((_, nav) => {
      const list = $(nav);
      list.empty();
      headings.each((i, h) => {
        const heading = $(h);
        const target = `${id}-section-${i + 1}`;
        heading.attr("id", target);
        const link = $("<a></a>")
          .attr("href", "#" + target)
          .text(heading.text().trim());
        if (h.tagName === "h3") link.addClass("id-subheading");
        list.append(link);
      });
    });
    if (!headings.length)
      root.find(".id-toc-card,.id-mobile-toc-button").attr("hidden", "");
    article.find("table").each((_, table) => {
      const target = $(table).closest("figure.wp-block-table").length
        ? $(table).closest("figure.wp-block-table")
        : $(table);
      if (!target.closest(".id-table-scroll").length)
        target.wrap(
          '<div class="id-table-scroll" role="region" aria-label="Scrollable comparison table" tabindex="0"></div>',
        );
    });
    root.find(".custom-accordion .accordion-item").each((i, item) => {
      const el = $(item);
      const target = `${id}-takeaways-${i}`;
      el.removeClass("active");
      el.find(".accordion-header")
        .first()
        .attr({
          type: "button",
          "aria-controls": target,
          "aria-expanded": "false",
        });
      el.find(".accordion-content")
        .first()
        .attr({ id: target, "aria-hidden": "true" });
      el.find(".accordion-icon").first().text("+").attr("aria-hidden", "true");
    });
    const ai = root.find(".id-right-sidebar .id-ai-summary").first();
    if (ai.length && !root.find(".id-mobile-ai-summary").length) {
      const mobile = $('<div class="id-mobile-ai-summary"></div>').append(
        ai.clone(),
      );
      const last = article.find(".schema-faq").last();
      if (last.length) last.after(mobile);
      else article.append(mobile);
    }
  });
  $(".schema-faq").each((faqIndex, faq) =>
    $(faq)
      .find(".schema-faq-section")
      .each((index, section) => {
        const el = $(section),
          question = el.find(".schema-faq-question").first(),
          answer = el.find(".schema-faq-answer").first();
        if (!question.length || !answer.length) return;
        const id = `faq-answer-${row.key.slice(0, 8)}-${faqIndex}-${index}`;
        question
          .text(question.text().trim())
          .attr({
            role: "button",
            tabindex: "0",
            "aria-expanded": "false",
            "aria-controls": id,
          });
        answer.attr("id", id);
        if (!answer.closest(".schema-faq-answer-wrap").length)
          answer.wrap(
            '<div class="schema-faq-answer-wrap"><div class="schema-faq-answer-inner"></div></div>',
          );
        el.removeClass("is-open");
      }),
  );
  $(".press-post-content").each((_, article) => {
    const toc = $(".press-content-headings").first();
    $(article)
      .find("h2,h3")
      .each((i, h) => {
        const heading = $(h);
        let id = heading.attr("id");
        if (!id) {
          id = `press-${h.tagName}-${row.key.slice(0, 8)}-${i}`;
          heading.attr("id", id);
        }
        if (!heading.parent().hasClass("press-content-head"))
          heading.wrap('<div class="press-content-head"></div>');
        heading.addClass("press-content-head-processed");
        if (
          toc.length &&
          !toc
            .find("a")
            .toArray()
            .some((a) => $(a).attr("href") === "#" + id)
        )
          toc.append(
            $("<a></a>")
              .attr("href", "#" + id)
              .addClass(h.tagName === "h3" ? "press-toc-h3" : "press-toc-h2")
              .text(heading.text().trim()),
          );
      });
  });
  $('.e-n-tab-title[aria-selected="true"]').addClass("activeicons-btn");
  $('.tabsteck-logssect .e-n-tab-title[aria-selected="true"]').addClass(
    "active",
  );
  $('.e-n-accordion-item-title[aria-expanded="true"]').addClass("active");
}
