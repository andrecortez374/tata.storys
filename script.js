"use strict";

const TATA_CONFIG = {
  brand: "Tata Storys",
  owner: "Thamires Santos",
  whatsapp: "",
  instagram: "",
  tiktok: ""
};

// Cadastre produtos reais aqui. Não invente preço, tamanho, material, estoque ou benefício.
// Exemplo de estrutura técnica:
// { id:"produto-1", name:"Nome real", category:"Categoria real", price:null, image:"assets/images/produto.webp", details:[] }
const PRODUCTS = [];

// A calculadora permanece desativada enquanto não houver regra comercial real.
const CALCULATOR_CONFIG = {
  enabled: false,
  mode: "CONFIGURAR_CALCULADORA"
};

const FAVORITES_KEY = "tataStorys:favorites";
const QUIZ_KEY = "tataStorys:lastQuiz";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function safeText(value) {
  return String(value ?? "").trim();
}

function buildWhatsAppURL(message) {
  const phone = safeText(TATA_CONFIG.whatsapp).replace(/\D/g, "");
  if (!phone) return "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function initHeader() {
  const header = $("#siteHeader");
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  $$('a[href^="#"]', nav).forEach(link => link.addEventListener("click", closeMenu));

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => { if (window.innerWidth >= 980) closeMenu(); });
}

function initCatalog() {
  const filters = $("#catalogFilters");
  const thumbs = $("#catalogThumbs");
  const stage = $("#productStageContent");
  if (!filters || !thumbs || !stage) return;

  if (!PRODUCTS.length) {
    filters.replaceChildren();
    thumbs.replaceChildren();
    return;
  }

  const categories = ["Todos", ...new Set(PRODUCTS.map(p => safeText(p.category)).filter(Boolean))];
  let activeCategory = "Todos";
  let activeProductId = PRODUCTS[0]?.id || "";

  function productMessage(product) {
    return `Olá, Tata Storys. Vi este produto no site e gostaria de saber mais.\n\nProduto: ${safeText(product.name)}${product.category ? `\nCategoria: ${safeText(product.category)}` : ""}`;
  }

  function renderStage(product) {
    stage.replaceChildren();
    const label = document.createElement("span");
    label.textContent = safeText(product.category) || "TATA STORYS / PRODUTO";
    const title = document.createElement("h3");
    title.textContent = safeText(product.name) || "Produto";
    const detail = document.createElement("p");
    const details = Array.isArray(product.details) ? product.details.filter(Boolean).join(" • ") : "";
    detail.textContent = details || "Detalhes oficiais serão exibidos aqui quando cadastrados.";
    const action = document.createElement("button");
    action.type = "button";
    action.className = "btn btn--outline";
    action.textContent = "Quero saber mais";
    action.addEventListener("click", () => {
      const url = buildWhatsAppURL(productMessage(product));
      if (!url) return showToast("Cadastre o WhatsApp oficial da Tata Storys para ativar este botão.");
      window.open(url, "_blank", "noopener,noreferrer");
    });
    stage.append(label, title, detail, action);
  }

  function renderThumbs() {
    thumbs.replaceChildren();
    const visible = PRODUCTS.filter(p => activeCategory === "Todos" || p.category === activeCategory);
    visible.forEach(product => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-thumb";
      button.setAttribute("aria-pressed", String(product.id === activeProductId));
      const name = document.createElement("strong");
      name.textContent = safeText(product.name) || "Produto";
      const cat = document.createElement("small");
      cat.textContent = safeText(product.category) || "Categoria não definida";
      button.append(name, cat);
      button.addEventListener("click", () => {
        activeProductId = product.id;
        renderStage(product);
        renderThumbs();
      });
      thumbs.appendChild(button);
    });
  }

  filters.replaceChildren();
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `catalog-filter${category === activeCategory ? " is-active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      const visible = PRODUCTS.filter(p => activeCategory === "Todos" || p.category === activeCategory);
      activeProductId = visible[0]?.id || "";
      $$(".catalog-filter", filters).forEach(b => b.classList.toggle("is-active", b.textContent === category));
      if (visible[0]) renderStage(visible[0]);
      renderThumbs();
    });
    filters.appendChild(button);
  });

  renderStage(PRODUCTS[0]);
  renderThumbs();
}

function collectQuizData(form) {
  const data = new FormData(form);
  const collect = name => data.getAll(name).map(safeText).filter(Boolean);
  return {
    pieceType: safeText(data.get("pieceType")),
    pieceTypeCustom: safeText(data.get("pieceTypeCustom")),
    useContext: collect("useContext"),
    useContextCustom: safeText(data.get("useContextCustom")),
    priority: collect("priority"),
    priorityCustom: safeText(data.get("priorityCustom")),
    notes: safeText(data.get("notes"))
  };
}

function buildQuizMessage(data) {
  const lines = [
    "Olá, Tata Storys.",
    "",
    "Respondi o quiz no site e gostaria de conversar sobre uma opção de cinta.",
    "",
    `Tipo de peça: ${data.pieceTypeCustom || data.pieceType || "Não defini"}`,
    `Onde pretendo usar: ${[...data.useContext, data.useContextCustom].filter(Boolean).join(", ") || "Não defini"}`,
    `O que mais importa para mim: ${[...data.priority, data.priorityCustom].filter(Boolean).join(", ") || "Não defini"}`,
    `Observações: ${data.notes || "Nenhuma observação adicional"}`
  ];
  return lines.join("\n");
}

function initQuiz() {
  const form = $("#choiceQuiz");
  const steps = $$(".quiz__step", form);
  const back = $("#quizBack");
  const next = $("#quizNext");
  const progress = $("#quizProgress");
  const label = $("#quizStepLabel");
  const percent = $("#quizPercent");
  if (!form || !steps.length || !back || !next || !progress || !label || !percent) return;

  let current = 0;

  function render() {
    steps.forEach((step, index) => {
      const active = index === current;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });
    const pct = Math.round(((current + 1) / steps.length) * 100);
    progress.style.width = `${pct}%`;
    label.textContent = `ETAPA ${current + 1} DE ${steps.length}`;
    percent.textContent = `${pct}%`;
    back.disabled = current === 0;
    next.textContent = current === steps.length - 1 ? "Levar para a conversa ↗" : "Continuar →";
  }

  back.addEventListener("click", () => {
    if (current > 0) { current -= 1; render(); }
  });

  next.addEventListener("click", () => {
    if (current < steps.length - 1) {
      current += 1;
      render();
      steps[current].scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const quizData = collectQuizData(form);
    try { localStorage.setItem(QUIZ_KEY, JSON.stringify(quizData)); } catch {}
    const message = buildQuizMessage(quizData);
    const url = buildWhatsAppURL(message);
    if (!url) {
      showToast("Quiz concluído. Cadastre o WhatsApp oficial da Tata Storys para ativar o envio.");
      $("#decidir")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  });

  render();
}

function initCompare() {
  const range = $("#compareRange");
  const after = $(".compare-pane--after");
  const divider = $("#compareDivider");
  if (!range || !after || !divider) return;
  const update = () => {
    const value = Number(range.value);
    after.style.clipPath = `inset(0 0 0 ${value}%)`;
    divider.style.left = `${value}%`;
  };
  range.addEventListener("input", update);
  update();
}

function initContact() {
  const button = $("#whatsappCTA");
  const info = $("#contactAvailability");
  const socialLinks = $("#socialLinks");
  if (!button || !info || !socialLinks) return;

  const message = "Olá, Tata Storys. Vi o site e gostaria de conhecer melhor as opções de cintas.";
  const url = buildWhatsAppURL(message);

  if (url) {
    info.textContent = "Leve sua dúvida ou suas respostas do quiz para uma conversa com a Tata Storys.";
    button.addEventListener("click", () => window.open(url, "_blank", "noopener,noreferrer"));
  } else {
    button.setAttribute("aria-disabled", "true");
    button.addEventListener("click", () => showToast("Cadastre o WhatsApp oficial em TATA_CONFIG para ativar este contato."));
  }

  const socials = [
    ["Instagram", TATA_CONFIG.instagram],
    ["TikTok", TATA_CONFIG.tiktok]
  ].filter(([,href]) => safeText(href));

  socialLinks.replaceChildren();
  socials.forEach(([labelText, href]) => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = labelText;
    socialLinks.appendChild(link);
  });
}

function initScrollStory() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  const targets = $$('section:not(.hero)');
  targets.forEach(section => section.classList.add("reveal-section"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: "0px 0px -8% 0px" });
  targets.forEach(target => observer.observe(target));

  const style = document.createElement("style");
  style.textContent = `.reveal-section{opacity:.001;transform:translateY(28px);transition:opacity .75s ease,transform .75s ease}.reveal-section.is-visible{opacity:1;transform:none}`;
  document.head.appendChild(style);
}

function initYear() {
  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();
}

function init() {
  initHeader();
  initCatalog();
  initQuiz();
  initCompare();
  initContact();
  initScrollStory();
  initYear();
}

document.addEventListener("DOMContentLoaded", init);
