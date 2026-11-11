// Original calculator rules from the saved WordPress page dated 2026-11-10.
// Preserve the quoted planning bands, modifiers, rounding and delivery text.
const base = {
  chatbot: {
    starter: [8000, 20000, 4, 8, "Focused conversational build"],
    business: [20000, 35000, 7, 12, "Connected business chatbot"],
    advanced: [35000, 50000, 10, 16, "Advanced conversational system"],
  },
  agent: {
    starter: [30000, 60000, 8, 14, "Focused workflow agent"],
    business: [60000, 110000, 12, 20, "Connected operational agent"],
    advanced: [110000, 180000, 18, 30, "Advanced multi-system agent"],
  },
  app: {
    starter: [25000, 50000, 10, 16, "Focused AI-powered product"],
    business: [50000, 100000, 16, 24, "Production AI application"],
    advanced: [100000, 150000, 22, 36, "Enterprise-style AI product"],
  },
} as const;
const modifiers = { integration: .15, data: .12, compliance: .18, platform: .20 };
type Project = keyof typeof base;
type Complexity = keyof typeof base.chatbot;
type AddOn = keyof typeof modifiers;
export function estimateAIProject(type: Project, complexity: Complexity, selected: AddOn[]) {
  const band = base[type][complexity];
  const multiplier = 1 + selected.reduce((sum, key) => sum + modifiers[key], 0);
  const round = (value: number) => Math.round(value / 1000) * 1000;
  return { lower: round(band[0] * multiplier), upper: round(band[1] * multiplier),
    minWeeks: band[2] + selected.length, maxWeeks: band[3] + selected.length * 2, profile: band[4] };
}

export function initializeAIEstimator(root: HTMLElement) {
  const card = root.querySelector<HTMLElement>(".estimator-card");
  const project = card?.querySelector<HTMLSelectElement>("#project-type");
  if (!card || !project) return () => {};
  let complexity: Complexity = "starter";
  const choices = [...card.querySelectorAll<HTMLButtonElement>(".choice[data-complexity]")];
  const calculate = () => {
    if (!(project.value in base)) return;
    const selected = [...card.querySelectorAll<HTMLInputElement>(".add-on:checked")]
      .map(input => input.value).filter((value): value is AddOn => value in modifiers);
    const result = estimateAIProject(project.value as Project, complexity, selected);
    const money = (value: number) => "$" + Math.round(value / 1000).toLocaleString() + "k";
    const value = card.querySelector("#result-value"), timeline = card.querySelector("#result-timeline"), profile = card.querySelector("#result-profile");
    if (value) value.textContent = money(result.lower) + " – " + money(result.upper);
    if (timeline) timeline.textContent = `Indicative delivery: ${result.minWeeks}–${result.maxWeeks} weeks`;
    if (profile) profile.textContent = result.profile;
    choices.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.complexity === complexity)));
  };
  const faqs = [...root.querySelectorAll<HTMLElement>("main .faq")];
  const setFAQ = (item: HTMLElement, open: boolean) => {
    item.classList.toggle("open", open);
    item.querySelector<HTMLElement>(".answer")?.style.setProperty("display", open ? "block" : "none", "important");
    const plus = item.querySelector(".plus");
    if (plus) plus.textContent = open ? "−" : "+";
    item.querySelector("button")?.setAttribute("aria-expanded", String(open));
  };
  const click = (event: MouseEvent) => {
    const target = event.target as Element;
    const choice = target.closest<HTMLButtonElement>(".choice[data-complexity]");
    if (choice && card.contains(choice) && choice.dataset.complexity! in base.chatbot) {
      complexity = choice.dataset.complexity as Complexity;
      choices.forEach(button => button.classList.toggle("active", button === choice));
      calculate();
    }
    const button = target.closest(".faq button,.faq .faq-btn"), item = button?.closest<HTMLElement>(".faq");
    if (item && faqs.includes(item)) {
      const wasOpen = item.classList.contains("open");
      faqs.forEach(faq => setFAQ(faq, faq === item && !wasOpen));
    }
  };
  const change = (event: Event) => {
    const target = event.target as Element;
    if (target === project || (card.contains(target) && target.matches(".add-on"))) calculate();
  };
  faqs.forEach(item => setFAQ(item, item.classList.contains("open")));
  calculate();
  root.addEventListener("click", click);
  root.addEventListener("change", change);
  return () => { root.removeEventListener("click", click); root.removeEventListener("change", change); };
}
