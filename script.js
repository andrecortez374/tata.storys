"use strict";

const CONFIG = {
  brand: "tata.storys",
  whatsapp: "5579998092301"
};

const PRODUCTS = [
  {name:"Calcinha Fio Dupla", category:"Calcinhas", av:55, card:65, c:0, r:0},
  {name:"Calcinha Composta", category:"Calcinhas", av:55, card:65, c:1, r:0},
  {name:"Empina BumBum", category:"Calcinhas", av:60, card:70, c:2, r:0},
  {name:"Short Modelador", category:"Modeladores", av:69.90, card:79.90, c:3, r:0},
  {name:"Cinta Pós Parto", category:"Cintas", av:70, card:80, c:0, r:1},
  {name:"Sutiã Base Dupla", category:"Sutiãs", av:55, card:65, c:1, r:1},
  {name:"Sutiã 8 Barbatanas", category:"Sutiãs", av:80, card:90, c:2, r:1},
  {name:"Sutiã Decote Profundo", category:"Sutiãs", av:60, card:70, c:3, r:1},
  {name:"Cinta Colete", category:"Coletes", av:160, card:180, c:0, r:2},
  {name:"Cinta Colete com bojo", category:"Coletes", av:200, card:220, c:1, r:2},
  {name:"Cinta Colete sem bojo", category:"Coletes", av:180, card:200, c:2, r:2},
  {name:"Colete Bunda Rica", category:"Coletes", av:180, card:200, c:3, r:2},
  {name:"Camiseta Masculino", category:"Modeladores", av:160, card:180, c:0, r:3},
  {name:"Cinta 16 Barbatanas", category:"Cintas", av:110, card:130, c:1, r:3},
  {name:"Cinta 20 Barbatanas", category:"Cintas", av:130, card:150, c:2, r:3},
  {name:"Cinta 28 Barbatanas", category:"Cintas", av:150, card:170, c:3, r:3}
];

const PRODUCT_ROWS = [
  "assets/images/products-row-0.webp",
  "assets/images/products-row-1.webp",
  "assets/images/products-row-2.webp",
  "assets/images/products-row-3.webp"
];

const SIZE_GUIDES = [
  {id:"faixa16",category:"Cinta faixa",title:"16 Barbatanas",rows:[["PP","36/38"],["P","38/40"],["M","40/42"],["G","44/46"],["GG","48/52"],["XG","52/54"]]},
  {id:"faixa20",category:"Cinta faixa",title:"20 Barbatanas",rows:[["PP","36"],["P","36"],["M","38"],["G","40"],["GG","42"],["XG","44"]]},
  {id:"faixa28",category:"Cinta faixa",title:"28 Barbatanas",rows:[["PP","36"],["P","36"],["M","38"],["G","40"],["GG","42"],["XG","44"]]},
  {id:"colete",category:"Cinta",title:"Colete",rows:[["P","38"],["M","40"],["G","42"],["GG","44"],["XG","46"]]},
  {id:"calcinha",category:"Calcinha",title:"com barbatanas",rows:[["P","40"],["M","42"],["G","44"],["GG","46"],["XG","48"]]}
];

const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>r?[...r.querySelectorAll(s)]:[];
const money=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const waUrl=message=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
const openWhatsApp=message=>window.open(waUrl(message),"_blank","noopener,noreferrer");

function initHeader(){
  const header=$("#topbar"),btn=$("#menuBtn"),nav=$("#mobileNav");
  if(!header||!btn||!nav)return;
  const close=()=>{btn.classList.remove("is-open");nav.classList.remove("is-open");btn.setAttribute("aria-expanded","false");document.body.classList.remove("menu-open")};
  btn.addEventListener("click",()=>{const open=btn.getAttribute("aria-expanded")!=="true";btn.classList.toggle("is-open",open);nav.classList.toggle("is-open",open);btn.setAttribute("aria-expanded",String(open));document.body.classList.toggle("menu-open",open)});
  $$("a",nav).forEach(a=>a.addEventListener("click",close));
  const update=()=>header.classList.toggle("is-scrolled",scrollY>20);
  update();addEventListener("scroll",update,{passive:true});
}

function productMessage(p){
  return ["Olá, Tata Storys.","",`Quero saber a disponibilidade de: ${p.name}.`,`Valor à vista: ${money(p.av)}`,`Valor no cartão: ${money(p.card)}`,"","Pode me orientar sobre tamanho e disponibilidade?"].join("\n");
}

function productPhoto(p){
  const photo=document.createElement("div");
  photo.className="product-photo";
  photo.setAttribute("role","img");
  photo.setAttribute("aria-label",p.name);
  photo.style.backgroundImage=`url("${PRODUCT_ROWS[p.r]}")`;
  photo.style.backgroundSize="400% 100%";
  photo.style.backgroundPosition=`${p.c*33.333}% 50%`;
  photo.style.backgroundRepeat="no-repeat";
  return photo;
}

function initCatalog(){
  const filters=$("#catalogFilters"),grid=$("#productGrid");
  if(!filters||!grid)return;
  const cats=["Todos",...new Set(PRODUCTS.map(p=>p.category))];
  let active="Todos";

  const renderFilters=()=>{
    filters.replaceChildren();
    cats.forEach(cat=>{
      const b=document.createElement("button");
      b.type="button";b.className=`filter-btn${cat===active?" is-active":""}`;b.textContent=cat;
      b.addEventListener("click",()=>{active=cat;renderFilters();renderProducts()});
      filters.appendChild(b);
    });
  };

  const renderProducts=()=>{
    const frag=document.createDocumentFragment();
    PRODUCTS.filter(p=>active==="Todos"||p.category===active).forEach(p=>{
      const card=document.createElement("article");card.className="product-card";
      const info=document.createElement("div");info.className="product-info";
      const cat=document.createElement("small");cat.textContent=p.category;
      const h=document.createElement("h3");h.textContent=p.name;
      const prices=document.createElement("div");prices.className="price-line";
      prices.innerHTML=`<div class="price-box"><span>à vista</span><strong>${money(p.av)}</strong></div><div class="price-box"><span>cartão</span><strong>${money(p.card)}</strong></div>`;
      const action=document.createElement("button");action.type="button";action.className="btn btn-primary";action.textContent="Quero este modelo ↗";action.addEventListener("click",()=>openWhatsApp(productMessage(p)));
      info.append(cat,h,prices,action);card.append(productPhoto(p),info);frag.appendChild(card);
    });
    grid.replaceChildren(frag);
  };

  renderFilters();renderProducts();
}

function parseRange(text){const nums=text.split("/").map(Number).filter(Number.isFinite);return nums.length===1?[nums[0],nums[0]]:[Math.min(...nums),Math.max(...nums)]}

function initSizes(){
  const models=$("#sizeModels"),table=$("#sizeTable"),category=$("#sizeCategory"),title=$("#sizeTitle"),select=$("#usualSize"),result=$("#sizeResult");
  if(!models||!table||!category||!title||!select||!result)return;
  let active=SIZE_GUIDES[0];
  const renderModels=()=>{models.replaceChildren();SIZE_GUIDES.forEach(g=>{const b=document.createElement("button");b.type="button";b.className=`size-model-btn${g.id===active.id?" is-active":""}`;b.textContent=g.title==="com barbatanas"?"Calcinha com barbatanas":g.title;b.addEventListener("click",()=>{active=g;select.value="";renderModels();renderTable()});models.appendChild(b)})};
  const renderTable=()=>{category.textContent=active.category;title.textContent=active.title;table.replaceChildren();const head=document.createElement("div");head.className="size-row head";head.innerHTML="<div>Tamanho</div><div>Numeração</div>";table.appendChild(head);active.rows.forEach(([size,measure])=>{const [min,max]=parseRange(measure);const row=document.createElement("div");row.className="size-row";row.dataset.min=min;row.dataset.max=max;row.innerHTML=`<div><strong>${size}</strong></div><div>${measure}</div>`;table.appendChild(row)});result.textContent="Selecione sua numeração habitual para destacar as faixas correspondentes."};
  select.addEventListener("change",()=>{const n=Number(select.value),matches=[];$$('.size-row:not(.head)',table).forEach(row=>{const hit=Number.isFinite(n)&&n>=Number(row.dataset.min)&&n<=Number(row.dataset.max);row.classList.toggle("is-match",hit);if(hit)matches.push(row.querySelector("strong")?.textContent||"")});result.textContent=!n?"Selecione sua numeração habitual para destacar as faixas correspondentes.":matches.length?`Na tabela de ${active.title}, a numeração ${n} aparece em: ${matches.join(" ou ")}. Confirme o ajuste no atendimento.`:`A numeração ${n} não aparece nesta tabela. Fale com a Tata Storys para confirmar.`});
  renderModels();renderTable();
  const figure=$("#sizeFigure"),visual=$(".size-visual");
  if(figure&&visual&&!matchMedia("(prefers-reduced-motion: reduce)").matches){let drag=false,start=0,angle=0,startAngle=0;const draw=()=>figure.style.transform=`rotateY(${angle}deg)`;visual.addEventListener("pointerdown",e=>{drag=true;start=e.clientX;startAngle=angle;visual.setPointerCapture?.(e.pointerId)});visual.addEventListener("pointermove",e=>{if(!drag)return;angle=startAngle+(e.clientX-start)*.7;draw()});visual.addEventListener("pointerup",()=>drag=false);visual.addEventListener("pointercancel",()=>drag=false)}
}

function initChoice(){
  const form=$("#choiceForm"),steps=$$(".choice-step"),back=$("#choiceBack"),next=$("#choiceNext"),progress=$("#choiceProgress");
  if(!form||!steps.length||!back||!next||!progress)return;
  let current=0;
  const render=()=>{steps.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle("is-active",i===current)});progress.style.width=`${((current+1)/steps.length)*100}%`;back.disabled=current===0;next.textContent=current===steps.length-1?"Levar para o WhatsApp ↗":"Continuar →"};
  back.addEventListener("click",()=>{if(current>0){current--;render()}});
  next.addEventListener("click",()=>{if(current<steps.length-1){current++;render();return}const data=new FormData(form),tipo=data.get("tipo")||"Ainda não definido",prios=data.getAll("prioridade"),numero=data.get("numeracao")||"não informada",obs=(data.get("observacao")||"").trim();openWhatsApp(["Olá, Tata Storys.","","Passei pelo guia do site e quero ajuda para escolher.",`Procuro: ${tipo}`,`Prioridades: ${prios.length?prios.join(", "):"não informadas"}`,`Numeração que costumo vestir: ${numero}`,obs?`Observação: ${obs}`:"","","Pode me indicar quais opções combinam melhor com o que informei?"].filter(Boolean).join("\n"))});
  render();
}

function initContact(){
  $("#mainWhatsapp")?.addEventListener("click",()=>openWhatsApp("Olá, Tata Storys. Vi o site e quero conhecer as opções disponíveis."));
  const y=$("#year");if(y)y.textContent=new Date().getFullYear();
}

function init(){initHeader();initCatalog();initSizes();initChoice();initContact()}
document.addEventListener("DOMContentLoaded",init);
