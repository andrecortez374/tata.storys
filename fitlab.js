"use strict";

const CFG = window.TATA_CONFIG || { whatsapp: "5579998092301" };
const ASSETS = {
  editorial: "assets/images/thamires-editorial-original.jpeg",
  corrida: "assets/images/thamires-corrida-original.jpeg",
  cinta: "assets/images/cinta-28-barbatanas-original.jpeg"
};

// Preencha somente com a tabela oficial da Tata Storys.
const SIZE_GUIDE = {
  P:  { minWaist:null, maxWaist:null, minHip:null, maxHip:null },
  M:  { minWaist:null, maxWaist:null, minHip:null, maxHip:null },
  G:  { minWaist:null, maxWaist:null, minHip:null, maxHip:null },
  GG: { minWaist:null, maxWaist:null, minHip:null, maxHip:null }
};

const $f = (s, r=document) => r?.querySelector?.(s) || null;
const $$f = (s, r=document) => r ? [...r.querySelectorAll(s)] : [];

function waUrl(message){
  const phone = String(CFG.whatsapp || "5579998092301").replace(/\D/g,"");
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : "";
}

function loadFitStyles(){
  if(document.querySelector('link[data-fitlab]')) return;
  const link=document.createElement("link");
  link.rel="stylesheet";
  link.href="fitlab.css";
  link.dataset.fitlab="true";
  document.head.appendChild(link);
}

function loadImage(src, {alt="", className="", width=722, height=1600, loading="lazy", priority="auto"}={}){
  return new Promise(resolve=>{
    const img=new Image();
    img.alt=alt;
    img.className=className;
    img.width=width;
    img.height=height;
    img.decoding="async";
    img.loading=loading;
    if(priority!=="auto") img.fetchPriority=priority;
    img.onload=()=>resolve(img);
    img.onerror=()=>resolve(null);
    img.src=src;
  });
}

function makeFallback(title, text){
  const wrap=document.createElement("div");
  wrap.className="media-fallback";
  const inner=document.createElement("div");
  const small=document.createElement("small");
  const strong=document.createElement("strong");
  const p=document.createElement("p");
  small.textContent="IMAGEM NÃO CARREGADA";
  strong.textContent=title;
  p.textContent=text;
  inner.append(small,strong,p);
  wrap.appendChild(inner);
  return wrap;
}

async function replaceOriginalImages(){
  const editorial=$f(".editorial-frame");
  if(editorial){
    const img=await loadImage(ASSETS.editorial,{alt:"Thamires Santos em fotografia de apresentação",className:"tata-original editorial-original",loading:"eager",priority:"high"});
    if(img){
      const label=document.createElement("span");
      label.className="editorial-original__label";
      label.textContent="THAMIRES SANTOS / TATA STORYS";
      editorial.replaceChildren(img,label);
      editorial.classList.add("media-loaded");
    }
  }

  const slots=$$f(".portfolio-slot");
  const items=[
    [ASSETS.corrida,"Thamires Santos durante corrida","MOVIMENTO / TATA STORYS"],
    [ASSETS.editorial,"Thamires Santos em ensaio fotográfico","EDITORIAL / TATA STORYS"],
    [ASSETS.cinta,"Cinta modeladora apresentada pela Tata Storys","PRODUTO / CINTAS"]
  ];

  items.forEach(async([src,alt,labelText],i)=>{
    const slot=slots[i];
    if(!slot) return;
    const img=await loadImage(src,{alt,className:"tata-original"});
    if(!img) return;
    const label=document.createElement("span");
    label.className="real-photo-label";
    label.textContent=labelText;
    slot.replaceChildren(img,label);
    slot.classList.add("has-real-photo");
  });
}

function mannequinLayer(z){
  const d=document.createElement("div");
  d.className="mannequin-layer";
  d.style.setProperty("--z",`${z}px`);
  d.innerHTML='<svg viewBox="0 0 320 540" aria-hidden="true"><path d="M160 27C131 27 113 45 108 72C105 91 111 110 98 132C85 154 67 183 70 226C73 264 95 284 91 322C87 359 69 391 79 443C88 492 116 514 160 514C204 514 232 492 241 443C251 391 233 359 229 322C225 284 247 264 250 226C253 183 235 154 222 132C209 110 215 91 212 72C207 45 189 27 160 27Z"/></svg>';
  return d;
}

function buildFitLab(){
  if($f("#tamanho")) return;
  const section=document.createElement("section");
  section.id="tamanho";
  section.className="fit-lab";
  section.setAttribute("aria-labelledby","fitTitle");
  section.innerHTML=`
    <div class="fit-wrap">
      <header class="fit-head">
        <span class="section-index">03</span>
        <p class="kicker">GUIA VISUAL / TAMANHO / 360°</p>
        <h2 id="fitTitle">Meça primeiro. <span>Escolha com contexto.</span></h2>
        <p>Use o manequim para entender onde medir cintura e quadril. P, M, G e GG ficam disponíveis para consulta, mas o site só sugere automaticamente quando a tabela oficial for cadastrada.</p>
      </header>

      <div class="fit-grid">
        <article class="fit-card">
          <div class="fit-copy"><small>PRODUTO REAL</small><h3>Cinta em destaque</h3><p>Imagem original, quando disponível no repositório. Modelo e tamanho devem ser confirmados no atendimento.</p></div>
          <figure class="corset-real" id="corsetMedia"><figcaption>Produto Tata Storys</figcaption></figure>
        </article>

        <article class="fit-card">
          <div class="fit-copy"><small>MODELO 360° / ILUSTRATIVO</small><h3>Gire e veja onde medir</h3><p>Arraste para os lados. O manequim é somente um guia visual.</p></div>
          <div class="model-stage" id="modelStage">
            <div class="model3d" id="model3d" role="img" aria-label="Manequim tridimensional ilustrativo mostrando cintura e quadril">
              <div id="modelLayers"></div>
              <div class="measure-ring waist"><span>CINTURA</span></div>
              <div class="measure-ring hip"><span>QUADRIL</span></div>
            </div>
            <div class="model-controls"><span>↔ arraste para girar</span><div><button type="button" id="rotL">−45°</button><button type="button" id="rot0">Frente</button><button type="button" id="rotR">+45°</button></div></div>
          </div>
        </article>

        <article class="fit-card fit-card--guide">
          <div class="fit-copy"><small>P / M / G / GG</small><h3>Guia de tamanho</h3><p>Selecione uma referência ou envie suas medidas para confirmação. Nenhuma faixa em centímetros é inventada.</p></div>
          <div class="size-layout">
            <div>
              <div class="sizes" id="sizes">${["P","M","G","GG"].map(s=>`<button type="button" data-size="${s}">${s}</button>`).join("")}</div>
              <div class="size-status" id="sizeStatus"><strong>Tabela oficial aguardando cadastro.</strong><br>Por segurança, ainda não há indicação automática.</div>
              <div class="measure-how">
                <p><b>1</b><span><strong>Cintura:</strong> passe a fita ao redor da cintura sem apertar.</span></p>
                <p><b>2</b><span><strong>Quadril:</strong> meça a parte de maior circunferência.</span></p>
                <p><b>3</b><span>Mantenha a fita paralela ao chão e anote os centímetros.</span></p>
              </div>
            </div>
            <form id="measureForm" class="measure-form">
              <div class="measure-fields">
                <label>Cintura (cm)<input id="waistCm" name="waist" type="number" min="30" max="200" step=".5" inputmode="decimal" placeholder="Ex.: 78"></label>
                <label>Quadril (cm)<input id="hipCm" name="hip" type="number" min="40" max="220" step=".5" inputmode="decimal" placeholder="Ex.: 104"></label>
              </div>
              <div class="measure-buttons"><button class="btn btn--primary" type="submit">Analisar medidas</button><button class="btn btn--text" id="sendMeasures" type="button">Enviar no WhatsApp</button></div>
              <div class="measure-result" id="measureResult" aria-live="polite">Digite suas medidas. A indicação P/M/G/GG só aparece quando houver tabela oficial.</div>
              <small class="fit-note">Guia comercial e visual. Não realiza avaliação médica ou fisiológica.</small>
            </form>
          </div>
        </article>
      </div>
    </div>`;

  const quiz=$f("#quiz");
  quiz?.parentNode?.insertBefore(section,quiz);

  const nav=$f("#mainNav");
  if(nav && !nav.querySelector('a[href="#tamanho"]')){
    const a=document.createElement("a");
    a.href="#tamanho";
    a.textContent="Tamanho";
    nav.insertBefore(a,nav.querySelector('a[href="#quiz"]'));
  }

  const layers=$f("#modelLayers");
  [-14,-10,-6,-2,2,6,10,14].forEach(z=>layers?.appendChild(mannequinLayer(z)));
}

async function hydrateCorsetImage(){
  const host=$f("#corsetMedia");
  if(!host) return;
  const figcaption=host.querySelector("figcaption");
  const img=await loadImage(ASSETS.cinta,{alt:"Cinta modeladora em imagem original enviada para Tata Storys",className:"tata-original"});
  if(img){
    host.prepend(img);
    if(figcaption) figcaption.textContent="Imagem original • Tata Storys";
    return;
  }
  const fallback=makeFallback("Imagem do produto ainda não publicada", "O layout continua funcional. Envie o arquivo para assets/images/ com o nome esperado para ativar a foto.");
  host.prepend(fallback);
  if(figcaption) figcaption.textContent="Produto • imagem aguardando upload";
}

function initRotation(){
  const stage=$f("#modelStage"), model=$f("#model3d");
  if(!stage||!model) return;
  let angle=0,drag=false,startX=0,startA=0;
  const draw=()=>model.style.setProperty("--ry",`${angle}deg`);
  stage.addEventListener("pointerdown",e=>{drag=true;startX=e.clientX;startA=angle;stage.setPointerCapture?.(e.pointerId)});
  stage.addEventListener("pointermove",e=>{if(!drag)return;angle=startA+(e.clientX-startX)*.65;draw()});
  const end=e=>{drag=false;stage.releasePointerCapture?.(e.pointerId)};
  stage.addEventListener("pointerup",end);
  stage.addEventListener("pointercancel",end);
  $f("#rotL")?.addEventListener("click",()=>{angle-=45;draw()});
  $f("#rotR")?.addEventListener("click",()=>{angle+=45;draw()});
  $f("#rot0")?.addEventListener("click",()=>{angle=0;draw()});
  draw();
}

function configured(){
  return Object.values(SIZE_GUIDE).some(v=>Number.isFinite(v.minWaist)&&Number.isFinite(v.maxWaist));
}
function sizeText(size){
  const v=SIZE_GUIDE[size];
  if(!v||!Number.isFinite(v.minWaist)||!Number.isFinite(v.maxWaist)) return `<strong>${size}</strong> — medidas oficiais ainda não cadastradas.`;
  const h=Number.isFinite(v.minHip)&&Number.isFinite(v.maxHip)?` • quadril ${v.minHip}–${v.maxHip} cm`:"";
  return `<strong>${size}</strong> — cintura ${v.minWaist}–${v.maxWaist} cm${h}.`;
}
function suggest(waist,hip){
  if(!configured()) return null;
  return Object.entries(SIZE_GUIDE).find(([,v])=>{
    const w=waist>=v.minWaist&&waist<=v.maxWaist;
    const h=Number.isFinite(v.minHip)&&Number.isFinite(v.maxHip)&&Number.isFinite(hip)?hip>=v.minHip&&hip<=v.maxHip:true;
    return w&&h;
  })?.[0]||null;
}

function initSizes(){
  const status=$f("#sizeStatus"),result=$f("#measureResult"),form=$f("#measureForm");
  $$f("#sizes button").forEach(b=>b.addEventListener("click",()=>{
    $$f("#sizes button").forEach(x=>x.classList.toggle("active",x===b));
    if(status) status.innerHTML=sizeText(b.dataset.size);
  }));

  const values=()=>({waist:Number($f("#waistCm")?.value),hip:$f("#hipCm")?.value?Number($f("#hipCm").value):NaN});
  form?.addEventListener("submit",e=>{
    e.preventDefault();
    const {waist,hip}=values();
    if(!Number.isFinite(waist)){if(result)result.textContent="Informe pelo menos a cintura.";return}
    const s=suggest(waist,hip);
    if(!configured()){
      if(result)result.innerHTML=`<strong>Medidas registradas:</strong> cintura ${waist} cm${Number.isFinite(hip)?` • quadril ${hip} cm`:""}. A tabela oficial ainda não foi cadastrada; por segurança, não indicamos um tamanho.`;
      return;
    }
    if(result)result.innerHTML=s?`<strong>Faixa encontrada: ${s}.</strong> Confirme ajuste e disponibilidade com a Tata Storys.`:`<strong>Sem faixa exata.</strong> Envie as medidas para confirmação.`;
  });

  $f("#sendMeasures")?.addEventListener("click",()=>{
    const {waist,hip}=values();
    const s=Number.isFinite(waist)?suggest(waist,hip):null;
    const msg=["Olá, Tata Storys.","","Usei o guia de medidas do site e gostaria de confirmar meu tamanho.","",`Cintura: ${Number.isFinite(waist)?`${waist} cm`:"não informada"}`,`Quadril: ${Number.isFinite(hip)?`${hip} cm`:"não informado"}`,`Indicação automática: ${s||"não indicada — preciso de confirmação"}`,"","Pode me orientar entre P, M, G ou GG?"].join("\n");
    const url=waUrl(msg);
    if(url) window.open(url,"_blank","noopener,noreferrer");
  });
}

function initFitLab(){
  loadFitStyles();
  buildFitLab();
  replaceOriginalImages();
  hydrateCorsetImage();
  initRotation();
  initSizes();
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initFitLab);
else initFitLab();
