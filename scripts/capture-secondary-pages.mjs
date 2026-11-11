import fs from "node:fs";
import { chromium } from "@playwright/test";
const pages = process.argv[2]
  ? [process.argv[2]]
  : [
      "web-development",
      "staff-augmentation",
      "iot-development",
      "virtual-reality-development",
      "ar-app-development",
    ];
const browser = await chromium.launch();
try {
  for (const slug of pages) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await page.goto("https://inceptives.vercel.app/" + slug, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1800);
    if (slug === "staff-augmentation") {
      const script = await page.locator('script[src*="/app/staff-augmentation/page-"]').first().getAttribute("src");
      if (!script) throw new Error("Original staff questionnaire script missing");
      const response = await fetch(new URL(script, "https://inceptives.vercel.app"));
      if (!response.ok) throw new Error("Original staff questionnaire script unavailable");
      fs.writeFileSync("audit/secondary-vercel/staff-augmentation-page.js", await response.text());
    }
    const groups = await page.evaluate(() =>
      [...document.querySelectorAll("button")]
        .filter((b) => b.textContent.trim() === "Platforms")
        .map((b, i) => {
          const root = b.parentElement.parentElement;
          root.dataset.secondaryTabs = "tabs-" + i;
          const panel = root.children[1];
          panel.dataset.secondaryTabPanel = "true";
          return {
            id: "tabs-" + i,
            labels: [...b.parentElement.children]
              .filter((e) => e.tagName === "BUTTON")
              .map((e) => e.textContent.trim()),
          };
        }),
    );
    const variants = {};
    if (["staff-augmentation", "mobile-game-development"].includes(slug)) {
      const labels = await page.evaluate(() => {
        const first = [...document.querySelectorAll("span")].find(
          (e) => e.textContent.trim() === "01.",
        );
        if (!first) return [];
        const control = first.parentElement.parentElement;
        const row = control.parentElement;
        const widget = row.parentElement.parentElement;
        widget.dataset.secondaryTabs = "process-0";
        widget.dataset.secondaryProcess = "true";
        widget.lastElementChild.dataset.secondaryTabPanel = "true";
        return [...row.children].map((el, i) => {
          el.dataset.secondaryTab = String(i);
          const number=[...el.querySelectorAll("span")].find(span=>/^0\d\.$/.test(span.textContent.trim()));
          if(number)number.parentElement.dataset.secondaryStepIndicator="true";
          return el.textContent.trim();
        });
      });
      variants["process-0"] = [];
      for (let i = 0; i < labels.length; i++) {
        const widget = page.locator('[data-secondary-tabs="process-0"]');
        await widget.locator('[data-secondary-tab="' + i + '"]').click();
        await page.waitForTimeout(450);
        variants["process-0"].push({
          label: labels[i],
          html: await widget.locator("[data-secondary-tab-panel]").innerHTML(),
        });
      }
      await page
        .locator('[data-secondary-tabs="process-0"] [data-secondary-tab="0"]')
        .click();
    }
    for (const group of groups) {
      variants[group.id] = [];
      for (const label of group.labels) {
        const root = page.locator('[data-secondary-tabs="' + group.id + '"]');
        await root.getByRole("button", { name: label, exact: true }).click();
        await page.waitForTimeout(450);
        variants[group.id].push({
          label,
          html: await root.locator("[data-secondary-tab-panel]").innerHTML(),
        });
      }
      await page
        .locator('[data-secondary-tabs="' + group.id + '"]')
        .getByRole("button", { name: group.labels[0], exact: true })
        .click();
    }
    // Closed React FAQ answers are absent from initial HTML. Capture every
    // original answer through its real control before converting to React.
    const questions=await page.evaluate(()=>[...document.querySelectorAll("h3")].filter(h=>h.parentElement?.parentElement?.classList.contains("cursor-pointer")).map((h,i)=>{
      const card=h.parentElement.parentElement;card.dataset.captureFaq=String(i);
      return {question:h.textContent.trim(),initialOpen:card.children.length>1};
    }));
    const faqs=[];
    for(let i=0;i<questions.length;i++) {
      const card=page.locator('[data-capture-faq="'+i+'"]');
      if(await card.evaluate(el=>el.children.length<2))await card.locator("h3").click();
      await page.waitForFunction(el=>el.children.length>=2,await card.elementHandle());
      await page.waitForTimeout(350);
      faqs.push({...questions[i],html:await card.evaluate(el=>el.lastElementChild.outerHTML),text:await card.evaluate(el=>el.lastElementChild.textContent.trim())});
    }
    await page.evaluate(faqs=>{for(let i=0;i<faqs.length;i++){
      const card=document.querySelector('[data-capture-faq="'+i+'"]');
      if(card.children.length<2){const template=document.createElement("template");template.innerHTML=faqs[i].html;const answer=template.content.firstElementChild;answer.hidden=true;card.append(answer);}
      card.removeAttribute("data-capture-faq");
    }},faqs);
    fs.writeFileSync("audit/secondary-vercel/"+slug+"-faqs.json",JSON.stringify(faqs,null,2));
    const html = await page.content();
    fs.writeFileSync("audit/secondary-vercel/" + slug + "-rendered.html", html);
    fs.writeFileSync(
      "audit/secondary-vercel/" + slug + "-tabs.json",
      JSON.stringify(variants),
    );
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "audit/secondary-vercel/" + slug + "-desktop.png",
    });
    console.log(JSON.stringify({ slug, groups: groups.length }));
    await page.close();
  }
} finally {
  await browser.close();
}
