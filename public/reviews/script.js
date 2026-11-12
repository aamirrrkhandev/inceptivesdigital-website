(() => {
  "use strict";

  const platforms = [
    { id: "google", number: "01", name: "Google", icon: "./assets/platform-icons/google.png", description: "Share your experience with Inceptives Digital on Google.", url: "https://g.page/r/CeFaDcc70YbEEBM/review", featured: true },
    { id: "clutch", number: "02", name: "Clutch", icon: "./assets/platform-icons/clutch.jpg", description: "Share detailed feedback about your project and experience working with our team.", url: "https://review.clutch.co/review?provider_id=1a12f7f9-1160-4b18-9e52-3dd5f270724e", featured: true },
    { id: "trustpilot", number: "03", name: "Trustpilot", icon: "./assets/platform-icons/trustpilot.png", description: "Tell others about your experience working with Inceptives Digital.", url: "https://trstp.lt/cufPduPcsl" },
    { id: "goodfirms", number: "04", name: "GoodFirms", icon: "./assets/platform-icons/goodfirms.jpg", description: "Share your experience with our software and development services.", url: "https://myaccount.goodfirms.co/review/company/add/187005" },
    { id: "designrush", number: "05", name: "DesignRush", icon: "./assets/platform-icons/designrush.png", description: "Share your experience with Inceptives Digital on DesignRush.", url: "https://www.designrush.com/agency/profile/inceptives-digital#reviews" },
    { id: "techbehemoths", number: "06", name: "TechBehemoths", icon: "./assets/platform-icons/techbehemoths.png", description: "Share your project experience with the TechBehemoths community.", url: "https://techbehemoths.com/company/review/submit/inceptives-digital" }
  ];
  const uploadServiceUrl = "https://inceptives-drive-upload.orange-sun-6bc9.workers.dev";
  const storageKey = "inceptives-review-progress-v1";
  const maxFileSize = 95 * 1024 * 1024;
  let states = Object.fromEntries(platforms.map((platform) => [platform.id, "idle"]));
  let stream = null;
  let recorder = null;
  let chunks = [];
  let selectedFile = null;
  let previewUrl = "";
  let timer = null;
  let elapsed = 0;

  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const track = (event, data = {}) => { if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...data }); };

  try { states = { ...states, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch (_) {}

  function saveStates() {
    try { localStorage.setItem(storageKey, JSON.stringify(states)); } catch (_) {}
  }

  function render() {
    const completed = platforms.filter((platform) => states[platform.id] === "completed").length;
    const percentage = Math.round((completed / platforms.length) * 100);
    $("#completed-count").textContent = completed;
    $("#progress-percent").textContent = `${percentage}%`;
    $("#progress-bar").style.width = `${percentage}%`;
    $("#progress-items").innerHTML = platforms.map((platform) => {
      const done = states[platform.id] === "completed";
      return `<span class="${done ? "done" : ""}"><i aria-hidden="true">${done ? "✓" : platform.number}</i>${escapeHtml(platform.name)}</span>`;
    }).join("");
    $("#completion-section").classList.toggle("is-hidden", completed !== platforms.length);

    $("#platform-grid").innerHTML = platforms.map((platform) => {
      const state = states[platform.id] || "idle";
      const completedState = state === "completed";
      return `<article class="platform-card ${platform.featured ? "featured" : ""} ${completedState ? "completed" : ""}" data-platform="${platform.id}">
        <div class="card-topline"><span class="platform-mark mark-${platform.id}" aria-hidden="true"><img src="${platform.icon}" alt=""></span><span class="card-number">${platform.number}</span></div>
        <h3>${escapeHtml(platform.name)}</h3><p>${escapeHtml(platform.description)}</p>
        ${state === "opened" ? `<div class="opened-note" role="status"><strong>Review page opened</strong><span>Come back here after submitting your review.</span></div>` : ""}
        ${completedState ? `<div class="completed-message" role="status"><span aria-hidden="true">✓</span> ${escapeHtml(platform.name)} review completed</div>` : `
          <a class="platform-link" href="${platform.url}" target="_blank" rel="noopener noreferrer" aria-label="Review Inceptives Digital on ${escapeHtml(platform.name)} (opens in a new tab)">Review us on ${escapeHtml(platform.name)}<span class="link-arrow" aria-hidden="true">↗</span></a>
          ${state === "opened" ? `<button class="complete-button" type="button"><span aria-hidden="true">✓</span> Mark ${escapeHtml(platform.name)} review as completed</button>` : ""}`}
      </article>`;
    }).join("");

    document.querySelectorAll(".platform-link").forEach((link) => link.addEventListener("click", () => {
      const id = link.closest("[data-platform]").dataset.platform;
      states[id] = "opened";
      saveStates();
      track("review_platform_click", { platform: id });
      window.setTimeout(render, 50);
    }));
    document.querySelectorAll(".complete-button").forEach((button) => button.addEventListener("click", () => {
      const id = button.closest("[data-platform]").dataset.platform;
      states[id] = "completed";
      saveStates();
      track("review_marked_complete", { platform: id });
      render();
    }));
  }

  $("#reset-progress").addEventListener("click", () => {
    states = Object.fromEntries(platforms.map((platform) => [platform.id, "idle"]));
    try { localStorage.removeItem(storageKey); } catch (_) {}
    render();
  });

  function showError(message) {
    const error = $("#video-error");
    error.textContent = message;
    error.classList.toggle("is-hidden", !message);
  }

  function setPreview(file) {
    selectedFile = file;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    const video = $("#video-preview");
    video.srcObject = null;
    video.src = previewUrl;
    video.muted = false;
    video.controls = true;
    $("#camera-placeholder").classList.add("is-hidden");
    $("#recorder-title").textContent = "Preview your testimonial";
    $("#clear-video").classList.remove("is-hidden");
    $("#testimonial-form").classList.remove("is-hidden");
  }

  function validateFile(file) {
    if (!file) return "Choose a video file.";
    if (!/\.(mp4|mov|webm)$/i.test(file.name) || !["video/mp4", "video/quicktime", "video/webm"].includes(file.type)) return "Choose an MP4, MOV, or WebM video file.";
    if (file.size > maxFileSize) return "Your video must be smaller than 95 MB.";
    return "";
  }

  async function requestCamera() {
    $("#recorder-panel").classList.remove("is-hidden");
    showError("");
    track("video_testimonial_start");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      showError("Video recording is not supported in this browser. Upload an existing video instead.");
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      const video = $("#video-preview");
      video.src = "";
      video.srcObject = stream;
      video.muted = true;
      video.controls = false;
      $("#camera-placeholder").classList.add("is-hidden");
      $("#start-recording").classList.remove("is-hidden");
    } catch (_) {
      showError("We couldn’t access your camera and microphone. Check browser permissions or upload an existing video instead.");
    }
  }

  $("#record-launch").addEventListener("click", requestCamera);
  $("#close-panel").addEventListener("click", () => {
    if (recorder?.state === "recording") recorder.stop();
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    $("#recorder-panel").classList.add("is-hidden");
  });

  $("#start-recording").addEventListener("click", () => {
    chunks = [];
    elapsed = 0;
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm";
    recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      if (blob.size > maxFileSize) return showError("This recording is larger than 95 MB. Record a shorter video.");
      setPreview(new File([blob], `testimonial-${Date.now()}.webm`, { type: "video/webm" }));
      track("video_testimonial_recorded");
    };
    recorder.start(1000);
    $("#start-recording").classList.add("is-hidden");
    $("#stop-recording").classList.remove("is-hidden");
    $("#recording-status").classList.remove("is-hidden");
    timer = window.setInterval(() => {
      elapsed += 1;
      $("#recording-time").textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
    }, 1000);
  });

  $("#stop-recording").addEventListener("click", () => {
    recorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    clearInterval(timer);
    $("#stop-recording").classList.add("is-hidden");
    $("#recording-status").classList.add("is-hidden");
  });

  $("#video-file").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    const error = validateFile(file);
    $("#recorder-panel").classList.remove("is-hidden");
    if (error) return showError(error);
    showError("");
    setPreview(file);
    track("video_testimonial_upload_start");
  });

  $("#clear-video").addEventListener("click", () => {
    selectedFile = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
    const video = $("#video-preview");
    video.removeAttribute("src");
    video.load();
    $("#camera-placeholder").classList.remove("is-hidden");
    $("#testimonial-form").classList.add("is-hidden");
    $("#clear-video").classList.add("is-hidden");
  });

  function resetTurnstile() {
    if (window.turnstile && typeof window.turnstile.reset === "function") window.turnstile.reset();
  }

  function uploadToGoogleDrive(uploadToken, file) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("PUT", `${uploadServiceUrl}/upload/file?token=${encodeURIComponent(uploadToken)}`);
      request.setRequestHeader("Content-Type", file.type);
      request.upload.onprogress = (uploadEvent) => {
        if (!uploadEvent.lengthComputable) return;
        const percent = Math.round((uploadEvent.loaded / uploadEvent.total) * 100);
        $("#upload-percent").textContent = `${percent}%`;
        $("#upload-progress progress").value = percent;
      };
      request.onerror = () => reject(new Error("The upload was interrupted. Check your connection and try again."));
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) return resolve();
        let message = "Google Drive could not complete the upload. Please try again.";
        try { message = JSON.parse(request.responseText).message || message; } catch (_) {}
        reject(new Error(message));
      };
      request.send(file);
    });
  }

  $("#testimonial-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");
    const fileError = validateFile(selectedFile);
    if (fileError) return showError(fileError);
    const form = event.currentTarget;
    const submitButton = form.querySelector(".submit-video");
    submitButton.disabled = true;
    submitButton.textContent = "Preparing upload…";
    track("video_testimonial_submit");
    try {
      const data = new FormData(form);
      const turnstileToken = String(data.get("cf-turnstile-response") || "");
      if (!turnstileToken) throw new Error("Please complete the security check before submitting.");
      const sessionResponse = await fetch(`${uploadServiceUrl}/upload/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          website: data.get("website"),
          consent: data.get("consent") === "yes",
          filename: selectedFile.name,
          contentType: selectedFile.type,
          size: selectedFile.size,
          turnstileToken
        })
      });
      const session = await sessionResponse.json().catch(() => ({}));
      if (!sessionResponse.ok || !session.uploadToken) throw new Error(session.message || "Unable to start a secure upload session.");

      submitButton.textContent = "Uploading video…";
      $("#upload-progress").classList.remove("is-hidden");
      await uploadToGoogleDrive(session.uploadToken, selectedFile);
      $("#video-content").classList.add("is-hidden");
      $("#video-success").classList.remove("is-hidden");
      track("video_testimonial_success");
    } catch (error) {
      showError(error.message || "Unable to start the secure upload.");
      resetTurnstile();
      track("video_testimonial_error", { reason: "upload" });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit my video testimonial";
    }
  });

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }
  window.setTimeout(() => {
    loadScriptOnce("trustpilot-widget-script", "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js");
    loadScriptOnce("designrush-widget-script", "https://www.designrush.com/topbest/js/widgets/agency-reviews.js");
  }, 1200);

  render();
  track("review_page_view");
})();
