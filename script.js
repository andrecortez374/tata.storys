"use strict";

const TATA_CONFIG = {
  brand: "Tata Storys",
  owner: "Thamires Santos",
  whatsapp: "5579998092301",
  instagram: "",
  tiktok: ""
};
window.TATA_CONFIG = TATA_CONFIG;

// Cadastre somente produtos reais aqui.
const PRODUCTS = [];
const CALCULATOR_CONFIG = { enabled:false, mode:"CONFIGURAR_CALCULADORA" };
const QUIZ_KEY = "tataStorys:lastQuiz";

const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>r?[...r.querySelectorAll(s)]:[];
const safe=v=>String(v??"").trim();

function waURL(message){
  const phone=safe(TATA_CONFIG.whatsapp).replace(/\D/g,"");
  return phone?`https://wa.me/${phone}?text=${encodeURIComponent(message)}`:"";
}
function openWA(message){
  const url=waURL(message);
  if(!url)return toast("WhatsApp ainda não cadastrado.");
  window.open(url,"_blank","noopener,noreferrer");
}
function toast(message){
  const el=$("#toast"); if(!el)return;
  el.textContent=message; el.classList.add("is-visible");
  clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove("is-visible"),2400);
}

function initHeader(){
  const h=$("#siteHeader"),t=$("#menuToggle"),n=$("#mainNav");
  if(!h||!t||!n)return;
  const close=()=>{t.classList.remove("is-open");n.classList.remove("is-open");t.setAttribute("aria-expanded","false");document.body.classList.remove("menu-open")};
  t.addEventListener("click",()=>{const o=t.getAttribute("aria-expanded")!=="true";t.classList.toggle("is-open",o);n.classList.toggle("is-open",o);t.setAttribute("aria-expanded",String(o));document.body.classList.toggle("menu-open",o)});
  $$("a[href^=\"#\"]",n).forEach(a=>a.addEventListener("click",close));
  const update=()=>h.classList.toggle("is-scrolled",scrollY>24);
  update();addEventListener("scroll",update,{passive:true});addEventListener("resize",()=>{if(innerWidth>=980)close()});
}

function initCatalog(){
  const filters=$("#catalogFilters"),thumbs=$("#catalogThumbs"),stage=$("#productStageContent");
  if(!filters||!thumbs||!stage)return;
  if(!PRODUCTS.length){filters.replaceChildren();thumbs.replaceChildren();return}

  const categories=["Todos",...new Set(PRODUCTS.map(p=>safe(p.category)).filter(Boolean))];
  let cat="Todos",active=PRODUCTS[0]?.id||"";

  const msg=p=>`Olá, Tata Storys. Vi este produto no site e gostaria de saber mais.\n\nProduto: ${safe(p.name)}${p.category?`\nCategoria: ${safe(p.category)}`:""}`;
  function renderStage(p){
    stage.replaceChildren();
    const label=document.createElement("span");label.textContent=safe(p.category)||"TATA STORYS / PRODUTO";
    const title=document.createElement("h3");title.textContent=safe(p.name)||"Produto";
    const detail=document.createElement("p");detail.textContent=Array.isArray(p.details)&&p.details.filter(Boolean).length?p.details.filter(Boolean).join(" • "):"Detalhes oficiais serão exibidos aqui quando cadastrados.";
    const btn=document.createElement("button");btn.type="button";btn.className="btn btn--outline";btn.textContent="Quero saber mais";btn.addEventListener("click",()=>openWA(msg(p)));
    stage.append(label,title,detail,btn);
  }
  function renderThumbs(){
    thumbs.replaceChildren();
    PRODUCTS.filter(p=>cat==="Todos"||p.category===cat).forEach(p=>{
      const b=document.createElement("button");b.type="button";b.className="product-thumb";b.setAttribute("aria-pressed",String(p.id===active));
      const s=document.createElement("strong");s.textContent=safe(p.name)||"Produto";
      const c=document.createElement("small");c.textContent=safe(p.category)||"Categoria não definida";
      b.append(s,c);b.addEventListener("click",()=>{active=p.id;renderStage(p);renderThumbs()});thumbs.appendChild(b);
    });
  }
  filters.replaceChildren();
  categories.forEach(name=>{
    const b=document.createElement("button");b.type="button";b.className=`catalog-filter${name===cat?" is-active":""}`;b.textContent=name;
    b.addEventListener("click",()=>{cat=name;const vis=PRODUCTS.filter(p=>cat==="Todos"||p.category===cat);active=vis[0]?.id||"";$$('.catalog-filter',filters).forEach(x=>x.classList.toggle("is-active",x.textContent===name));if(vis[0])renderStage(vis[0]);renderThumbs()});
    filters.appendChild(b);
  });
  renderStage(PRODUCTS[0]);renderThumbs();
}

function quizData(form){
  const d=new FormData(form),all=n=>d.getAll(n).map(safe).filter(Boolean);
  return{pieceType:safe(d.get("pieceType")),pieceTypeCustom:safe(d.get("pieceTypeCustom")),useContext:all("useContext"),useContextCustom:safe(d.get("useContextCustom")),priority:all("priority"),priorityCustom:safe(d.get("priorityCustom")),notes:safe(d.get("notes"))};
}
function quizMessage(d){return[
  "Olá, Tata Storys.","","Respondi o quiz no site e gostaria de conversar sobre uma opção de cinta.","",
  `Tipo de peça: ${d.pieceTypeCustom||d.pieceType||"Não defini"}`,
  `Onde pretendo usar: ${[...d.useContext,d.useContextCustom].filter(Boolean).join(", ")||"Não defini"}`,
  `O que mais importa para mim: ${[...d.priority,d.priorityCustom].filter(Boolean).join(", ")||"Não defini"}`,
  `Observações: ${d.notes||"Nenhuma observação adicional"}`
].join("\n")}

function initQuiz(){
  const f=$("#choiceQuiz");if(!f)return;
  const steps=$$(".quiz__step",f),back=$("#quizBack"),next=$("#quizNext"),bar=$("#quizProgress"),label=$("#quizStepLabel"),pct=$("#quizPercent");
  if(!steps.length||!back||!next||!bar||!label||!pct)return;
  let i=0;
  const render=()=>{steps.forEach((s,n)=>{s.hidden=n!==i;s.classList.toggle("is-active",n===i)});const p=Math.round((i+1)/steps.length*100);bar.style.width=`${p}%`;label.textContent=`ETAPA ${i+1} DE ${steps.length}`;pct.textContent=`${p}%`;back.disabled=i===0;next.textContent=i===steps.length-1?"Levar para a conversa ↗":"Continuar →"};
  back.addEventListener("click",()=>{if(i>0){i--;render()}});
  next.addEventListener("click",()=>{if(i<steps.length-1){i++;render();steps[i].scrollIntoView({behavior:"smooth",block:"center"});return}const d=quizData(f);try{localStorage.setItem(QUIZ_KEY,JSON.stringify(d))}catch{}openWA(quizMessage(d))});
  render();
}

function initCompare(){
  const range=$("#compareRange"),after=$(".compare-pane--after"),div=$("#compareDivider");
  if(!range||!after||!div)return;
  const draw=()=>{const v=Number(range.value);after.style.clipPath=`inset(0 0 0 ${v}%)`;div.style.left=`${v}%`};
  range.addEventListener("input",draw);draw();
}
function initContact(){
  const btn=$("#whatsappCTA"),info=$("#contactAvailability"),links=$("#socialLinks");if(!btn||!info||!links)return;
  const message="Olá, Tata Storys. Vi o site e gostaria de conhecer melhor as opções de cintas.";
  if(waURL(message)){info.textContent="Leve sua dúvida ou suas respostas do quiz para uma conversa com a Tata Storys.";btn.removeAttribute("aria-disabled");btn.addEventListener("click",()=>openWA(message))}
  else{btn.setAttribute("aria-disabled","true");btn.addEventListener("click",()=>toast("WhatsApp ainda não cadastrado."))}
  links.replaceChildren();
  [["Instagram",TATA_CONFIG.instagram],["TikTok",TATA_CONFIG.tiktok]].filter(([,u])=>safe(u)).forEach(([name,u])=>{const a=document.createElement("a");a.href=u;a.target="_blank";a.rel="noopener noreferrer";a.textContent=name;links.appendChild(a)});
}
function initReveal(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver"in window))return;
  const targets=$$("section:not(.hero)");targets.forEach(s=>s.classList.add("reveal-section"));
  const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{threshold:.08,rootMargin:"0px 0px -8% 0px"});
  targets.forEach(t=>ob.observe(t));
  const st=document.createElement("style");st.textContent=".reveal-section{opacity:.001;transform:translateY(28px);transition:opacity .75s ease,transform .75s ease}.reveal-section.is-visible{opacity:1;transform:none}";document.head.appendChild(st);
}
function initYear(){const y=$("#currentYear");if(y)y.textContent=new Date().getFullYear()}
function init(){initHeader();initCatalog();initQuiz();initCompare();initContact();initReveal();initYear()}
document.addEventListener("DOMContentLoaded",init);

// Camada adicional: fotos originais, manequim 360° e guia de tamanho.
import("./fitlab.js").catch(()=>{});
