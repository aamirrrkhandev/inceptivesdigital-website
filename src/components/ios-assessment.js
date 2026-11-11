// Adapted from the current public iOS assessment; server scoring stays authoritative.
import { isGhlReplay, recordGhlSubmission } from "../lib/ghl-tracking";
import { captureCallRailSubmission } from "../lib/callrail";
import { createTurnstileProtection } from "../lib/turnstile";
import { recordConfirmedLead } from "../lib/conversion-tracking";
export function mountIOSAssessment() {
  const controller = new AbortController();
  let redirectTimer;
  const root = document.getElementById("id-ios-348952");
  if (!root) return;
  const form = root.querySelector("form"),
    steps = [...root.querySelectorAll(".id-ios-step")],
    prev = root.querySelector(".id-ios-back"),
    next = root.querySelector(".id-ios-next"),
    send = root.querySelector(".id-ios-send"),
    result = root.querySelector(".id-ios-result"),
    error = root.querySelector(".id-ios-error");
  let step = 0;
  let accepted;
  let protection;
  let verification;
  if (process.env.NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY && location.hostname === "inceptives-homepage-review.vercel.app") {
    verification = document.createElement("div");
    verification.dataset.contactVerification = "true";
    verification.dataset.sitekey = process.env.NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY;
    verification.dataset.theme = "dark";
    verification.style.cssText = "width:100%;min-height:72px;margin:16px 0";
    steps[4].append(verification);
    protection = createTurnstileProtection(form);
  }
  const questions = {
    platform: [
      "What platforms are you launching first?",
      [
        "iPhone only",
        "iPhone first, Android later",
        "iOS and Android simultaneously",
      ],
    ],
    hardware: [
      "Does your app require Apple-specific hardware?",
      [
        "Yes (ARKit, LiDAR, HealthKit, Apple Intelligence)",
        "Maybe one or two standard device features",
        "No, standard cloud features only",
      ],
    ],
    performance: [
      "What are your core performance demands?",
      [
        "High performance",
        "Standard consumer UX with smooth scrolling",
        "Content-driven forms or business dashboards",
      ],
    ],
    timeline: [
      "What is your target market launch timeline?",
      ["6+ months", "3 to 6 months", "Under 3 months"],
    ],
  };
  const logoURL = "/wp-content/uploads/2026/10/ID-logo.jpg";
  function setStep(n) {
    step = n;
    steps.forEach((el, i) => (el.hidden = i !== n));
    prev.hidden = n === 0;
    next.hidden = n === 4;
    send.hidden = n !== 4;
    root.querySelector(".id-ios-count").textContent =
      "STEP " + (n + 1) + " OF 5";
    root.querySelector(".id-ios-progress").style.width = (n + 1) * 20 + "%";
    error.textContent = "";
  }
  next.addEventListener(
    "click",
    () => {
      const checked = steps[step].querySelector("input:checked");
      if (!checked) {
        error.textContent = "Please select an answer to continue.";
        return;
      }
      setStep(step + 1);
    },
    { signal: controller.signal },
  );
  prev.addEventListener(
    "click",
    () => {
      if (step > 0) setStep(step - 1);
    },
    { signal: controller.signal },
  );
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  root.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      if (isGhlReplay(form)) return;
      e.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const signature = JSON.stringify([...data.entries()].filter(([key]) => key !== "cf-turnstile-response"));
      if (protection && !data.get("cf-turnstile-response")) {
        protection.ensure(form);
        error.textContent = "Please complete the security verification.";
        return;
      }
      for (const key of ["platform", "hardware", "performance", "timeline"])
        if (!data.get(key)) {
          error.textContent = "Please complete all questions.";
          return;
        }
      send.disabled = true;
      send.textContent = "Sending...";
      error.textContent = "";
      try {
        let out = accepted?.signature === signature ? accepted.out : undefined;
        if (!out) {
          const response = await fetch("/api/ios-assessment", {
            method: "POST",
            body: data,
            signal: controller.signal,
          });
          out = await response.json();
          if (!out.success)
            throw Error(out.data?.message || "Submission failed.");
          accepted = { signature, out };
        }
        await recordGhlSubmission(form);
        await captureCallRailSubmission(form);
        await recordConfirmedLead(form);
        accepted = undefined;
        show(out.data);
      } catch (err) {
        error.textContent = err.message || "Submission failed. Please retry.";
        send.disabled = false;
        send.textContent = "Send & View Result";
      } finally {
        protection?.reset(form);
      }
    },
    { signal: controller.signal, capture: true },
  );
  function show(data) {
    const r = {
      ...data.result,
      native: Math.max(0, Math.min(99, Number(data.result.native) || 0)),
      cross: Math.max(0, Math.min(99, Number(data.result.cross) || 0)),
    };
    form.hidden = true;
    root.querySelector(".id-ios-top").firstElementChild.textContent =
      "YOUR RECOMMENDATION";
    root.querySelector(".id-ios-count").textContent = "COMPLETE";
    result.hidden = false;
    const li = r.reasons.map((t) => "<li>" + esc(t) + "</li>").join("");
    result.innerHTML =
      '<div class="id-ios-eyebrow">Assessment submitted successfully</div><h2>' +
      esc(r.title) +
      "</h2><p>" +
      esc(r.body) +
      '</p><div class="id-ios-metrics">' +
      [
        ["Native iOS", r.native],
        ["Cross-platform", r.cross],
      ]
        .map(
          (x) =>
            '<div class="id-ios-metric"><span>' +
            esc(x[0]) +
            "</span><strong>" +
            x[1] +
            '</strong><div class="id-ios-track"><div class="id-ios-progress" style="width:' +
            x[1] +
            '%"></div></div></div>',
        )
        .join("") +
      '</div><div class="id-ios-summary"><h3>Your submitted answers</h3><ul>' +
      li +
      '</ul></div><div class="id-ios-result-actions"><button type="button" class="id-ios-download">Download Complete PDF</button><a href="tel:(469)-788-8527" target="_blank" rel="noopener">Talk to an iOS architect</a></div><p class="id-ios-footnote">Scores are indicative rule-based fit values, not probabilities. Confirm the technical approach during discovery.</p>';
    result
      .querySelector(".id-ios-download")
      .addEventListener("click", () => downloadPDF(data), {
        signal: controller.signal,
      });
    const notice = document.createElement("p");
    notice.className = "id-ios-redirect-note";
    notice.setAttribute("role", "status");
    result.append(notice);
    const destination = "/thank-you";
    let remaining = 5;
    const updateNotice = () => {
      notice.textContent =
        "Redirecting to our thank-you page in " +
        remaining +
        " second" +
        (remaining === 1 ? "" : "s") +
        ". Download your PDF before leaving, if needed.";
    };
    updateNotice();
    redirectTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(redirectTimer);
        window.location.assign(destination);
      } else updateNotice();
    }, 1000);
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function downloadPDF(data) {
    const button = result.querySelector(".id-ios-download"),
      original = button.textContent;
    button.disabled = true;
    button.textContent = "Preparing branded PDF...";
    try {
      const r = data.result,
        a = data.answers,
        c = data.contact;
      const clean = (v) =>
        String(v == null ? "" : v)
          .normalize("NFKD")
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u2013\u2014]/g, "-")
          .replace(/[^\x20-\x7e]/g, "");
      const pdfEsc = (v) =>
        clean(v)
          .replace(/\\/g, "\\\\")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)");
      const date = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date());
      let jpg = null;
      if (logoURL) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = logoURL;
          await new Promise((ok, fail) => {
            img.onload = ok;
            img.onerror = fail;
            if (img.complete && img.naturalWidth) ok();
          });
          const canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
          const scale = Math.min(
            1,
            500 / img.naturalWidth,
            500 / img.naturalHeight,
          );
          const width = Math.max(1, Math.round(img.naturalWidth * scale));
          const height = Math.max(1, Math.round(img.naturalHeight * scale));
          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const encoded = canvas.toDataURL("image/jpeg", 0.87).split(",")[1];
          const binary = atob(encoded),
            bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++)
            bytes[i] = binary.charCodeAt(i);
          jpg = { bytes, width, height };
        } catch (err) {
          console.warn("Site logo not available for PDF; using wordmark", err);
        }
      }
      const enc = new TextEncoder(),
        parts = [],
        offsets = [0];
      let byteLength = 0;
      const push = (x) => {
        const bytes = typeof x === "string" ? enc.encode(x) : x;
        parts.push(bytes);
        byteLength += bytes.length;
      };
      let objNum = 0;
      const entries = [];
      const alloc = () => {
        entries.push(null);
        return ++objNum;
      };
      const put = (id, content) => {
        entries[id - 1] = content;
      };
      const rootId = alloc(),
        pagesId = alloc(),
        regular = alloc(),
        bold = alloc();
      let imageId = null;
      if (jpg) {
        imageId = alloc();
        put(imageId, [
          "<< /Type /XObject /Subtype /Image /Width " +
            jpg.width +
            " /Height " +
            jpg.height +
            " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " +
            jpg.bytes.length +
            " >>\nstream\n",
          jpg.bytes,
          "\nendstream",
        ]);
      }
      put(regular, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
      put(bold, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
      const W = 595,
        H = 842,
        LM = 42,
        RIGHT = 553,
        TABLE = 511;
      const pages = [];
      let page;
      const addText = (
        str,
        x,
        y,
        size = 10,
        boldFlag = false,
        color = "#222222",
      ) => {
        const col = rgb(color);
        page.ops.push(
          col.join(" ") +
            " rg BT /" +
            (boldFlag ? "F2" : "F1") +
            " " +
            size +
            " Tf " +
            x +
            " " +
            y +
            " Td (" +
            pdfEsc(str) +
            ") Tj ET",
        );
      };
      const rgb = (hex) => {
        hex = hex.replace("#", "");
        return [0, 2, 4].map((i) =>
          (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3),
        );
      };
      const rect = (x, y, w, h, fill, stroke) => {
        page.ops.push(
          rgb(fill).join(" ") +
            " rg " +
            x +
            " " +
            y +
            " " +
            w +
            " " +
            h +
            " re f",
        );
        if (stroke)
          page.ops.push(
            rgb(stroke).join(" ") +
              " RG 0.6 w " +
              x +
              " " +
              y +
              " " +
              w +
              " " +
              h +
              " re S",
          );
      };
      const line = (x1, y1, x2, y2, color = "#dddddd") =>
        page.ops.push(
          rgb(color).join(" ") +
            " RG 0.7 w " +
            x1 +
            " " +
            y1 +
            " m " +
            x2 +
            " " +
            y2 +
            " l S",
        );
      const startPage = () => {
        page = { ops: [], annotations: [] };
        pages.push(page);
        rect(0, 0, W, H, "#ffffff");
        if (imageId) {
          const maxLogoW = 150;
          const maxLogoH = 48;
          const scale = Math.min(maxLogoW / jpg.width, maxLogoH / jpg.height);
          const logoW = jpg.width * scale;
          const logoH = jpg.height * scale;
          const logoX = 43;
          const logoTop = H - 30;
          const logoY = logoTop - logoH;
          page.ops.push(
            "q " +
              logoW +
              " 0 0 " +
              logoH +
              " " +
              logoX +
              " " +
              logoY +
              " cm /Logo Do Q",
          );
        } else {
          addText("INCEPTIVES DIGITAL", LM, 782, 17, true, "#202020");
        }
        addText("iOS APP DEVELOPMENT", LM, 735, 12, true, "#202020");
        addText("Generated: " + date, RIGHT - 175, 742, 9, false, "#555555");
        line(LM, 733, RIGHT, 733, "#d8d8d8");
        line(LM, 52, RIGHT, 52, "#d6d6d6");
        addText(
          "(c) " +
            new Date().getFullYear() +
            " Inceptives Digital. All rights reserved.",
          LM,
          37,
          8,
          false,
          "#606060",
        );
        const priv = "Privacy Policy: inceptivesdigital.com/privacy-policy";
        addText(priv, LM, 23, 8, false, "#333333");
        const ann = alloc();
        page.annotations.push(ann);
        put(
          ann,
          "<< /Type /Annot /Subtype /Link /Rect [42 18 300 35] /Border [0 0 0] /A << /S /URI /URI (https://inceptivesdigital.com/privacy-policy) >> >>",
        );
        addText("Page " + pages.length, 515, 37, 8, false, "#606060");
        page.y = 700;
      };
      const ensure = (height) => {
        if (page.y - height < 75) startPage();
      };
      const wrap = (value, limit = 60) => {
        const words = clean(value).split(/\s+/);
        const lines = [];
        let line = "";
        for (const word of words) {
          if (!word) continue;
          if ((line + " " + word).trim().length > limit && line) {
            lines.push(line);
            line = word;
          } else line = (line + " " + word).trim();
        }
        lines.push(line);
        return lines;
      };
      const section = (title) => {
        ensure(49);
        addText(title.toUpperCase(), LM, page.y, 12, true, "#252525");
        page.y -= 12;
        line(LM, page.y, RIGHT, page.y);
        page.y -= 16;
      };
      const row = (key, value) => {
        const left = wrap(key, 24),
          right = wrap(value, 61);
        const count = Math.max(left.length, right.length);
        const height = Math.max(34, 14 + count * 13);
        ensure(height + 5);
        rect(LM, page.y - height, 155, height, "#f3f3f3", "#dadada");
        rect(
          LM + 155,
          page.y - height,
          TABLE - 155,
          height,
          "#ffffff",
          "#dadada",
        );
        left.forEach((v, i) =>
          addText(v, LM + 10, page.y - 17 - i * 13, 9, true),
        );
        right.forEach((v, i) =>
          addText(v, LM + 165, page.y - 17 - i * 13, 9, false),
        );
        page.y -= height;
      };
      startPage();
      section("Contact Details");
      row("Full Name", c.name);
      row("Email", c.email);
      row("Company", c.company || "Not provided");
      page.y -= 18;
      section("Assessment Questions & Answers");
      Object.keys(questions).forEach((key, i) =>
        row(i + 1 + ". " + questions[key][0], a[key] || ""),
      );
      page.y -= 18;
      section("Architecture Recommendation");
      row("Recommended approach", r.title);
      row("Explanation", r.body);
      row("Native iOS fit", r.native + " / 99 (indicative)");
      row("Cross-platform fit", r.cross + " / 99 (indicative)");
      page.y -= 18;
      section("Assessment Summary");
      (r.reasons || []).forEach((reason, i) =>
        row("Factor " + (i + 1), reason),
      );
      ensure(45);
      page.y -= 15;
      wrap(
        "Scores are rule-based indicators, not probabilities. Confirm final architecture during technical discovery.",
        95,
      ).forEach((lineText) => {
        addText(lineText, LM, page.y, 9, false, "#666666");
        page.y -= 13;
      });
      const kids = [];
      pages.forEach((p) => {
        const stream = p.ops.join("\n") + "\n";
        const contentsId = alloc(),
          pageId = alloc();
        put(
          contentsId,
          "<< /Length " +
            enc.encode(stream).length +
            " >>\nstream\n" +
            stream +
            "endstream",
        );
        const resources =
          "<< /Font << /F1 " +
          regular +
          " 0 R /F2 " +
          bold +
          " 0 R >>" +
          (imageId ? " /XObject << /Logo " + imageId + " 0 R >>" : "") +
          " >>";
        put(
          pageId,
          "<< /Type /Page /Parent " +
            pagesId +
            " 0 R /MediaBox [0 0 595 842] /Resources " +
            resources +
            " /Annots [" +
            p.annotations.map((id) => id + " 0 R").join(" ") +
            "] /Contents " +
            contentsId +
            " 0 R >>",
        );
        kids.push(pageId + " 0 R");
      });
      put(
        pagesId,
        "<< /Type /Pages /Count " +
          kids.length +
          " /Kids [" +
          kids.join(" ") +
          "] >>",
      );
      put(rootId, "<< /Type /Catalog /Pages " + pagesId + " 0 R >>");
      push("%PDF-1.4\n%INCEPTIVES\n");
      entries.forEach((value, i) => {
        offsets.push(byteLength);
        push(i + 1 + " 0 obj\n");
        if (Array.isArray(value)) value.forEach(push);
        else push(value);
        push("\nendobj\n");
      });
      const xref = byteLength;
      push("xref\n0 " + (entries.length + 1) + "\n0000000000 65535 f \n");
      offsets
        .slice(1)
        .forEach((n) => push(String(n).padStart(10, "0") + " 00000 n \n"));
      push(
        "trailer\n<< /Size " +
          (entries.length + 1) +
          " /Root " +
          rootId +
          " 0 R >>\nstartxref\n" +
          xref +
          "\n%%EOF",
      );
      const blob = new Blob(parts, { type: "application/pdf" });
      const url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = "Inceptives-iOS-Architecture-Assessment.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      const old = result.querySelector(".id-ios-pdf-error");
      if (old) old.remove();
    } catch (err) {
      console.error("PDF generation failed", err);
      const old = result.querySelector(".id-ios-pdf-error");
      if (old) old.remove();
      const message = document.createElement("p");
      message.className = "id-ios-pdf-error";
      message.setAttribute("role", "alert");
      message.textContent =
        "PDF download failed: " + (err.message || "Please retry.");
      result.append(message);
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }
  setStep(0);
  root.dataset.iosReady = "true";
  return () => {
    protection?.dispose();
    verification?.remove();
    delete root.dataset.iosReady;
    controller.abort();
    clearInterval(redirectTimer);
  };
}
