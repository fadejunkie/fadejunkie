// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const O="#e8541a",O2="#ff6b2b",EMBER="#ff4500",GREEN="#22c55e";

/* ── spark canvas ── */
function SparkCanvas(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext("2d");let sp=[];let raf;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight};resize();
    window.addEventListener("resize",resize);
    const spawn=()=>{if(sp.length>35)return;sp.push({x:Math.random()*c.width,y:0,vx:(Math.random()-0.5)*2,vy:Math.random()*2+1,life:1,decay:Math.random()*0.015+0.005,size:Math.random()*2+0.5})};
    const loop=()=>{ctx.clearRect(0,0,c.width,c.height);if(Math.random()<0.3)spawn();sp.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.vy+=0.02;s.life-=s.decay;if(s.life>0){ctx.globalAlpha=s.life*0.6;ctx.fillStyle=s.life>0.5?O2:O;ctx.shadowColor=O;ctx.shadowBlur=s.size*4;ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}});ctx.globalAlpha=1;sp=sp.filter(s=>s.life>0&&s.y<c.height);raf=requestAnimationFrame(loop)};
    loop();return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize)};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.5}}/>;
}

/* ── phases data ── */
const phases=[
  {id:1,name:"FOUNDATION",subtitle:"Domain Acquisition + Trademark Filing",week:"WEEK 1",fee:"$400",short:"DOMAIN · TM",icon:"\⚡",
    milestones:[
      {title:"SECURE THE NAME",clientDesc:"Lock down the domain and begin trademark protection.",
        tasks:[{label:"Research arqueroco.com and arquero.co — availability, pricing, and registrar options"},{label:"Purchase selected domain — configure DNS, domain lock, WHOIS privacy"},{label:"Send registration confirmation + credentials to client"}]},
      {title:"TRADEMARK SEARCH",clientDesc:"Verify no existing trademarks conflict with Arquero.",
        tasks:[{label:"Run comprehensive TESS database search for 'Arquero' conflicts"},{label:"Check Class 025 (Clothing) and Class 009 (Protective equipment/welding gear)"},{label:"Document findings — flag any potential conflicts for client review"}]},
      {title:"FILE TRADEMARK",clientDesc:"Submit USPTO application to protect the Arquero Co. name.",
        tasks:[{label:"Prepare goods/services description using USPTO ID Manual language"},{label:"File electronic application — Class 025 minimum (add Class 009 if applicable)"},{label:"Deliver filing receipt + serial number to client"},{label:"Queue logo trademark filing for after Phase 2 brand delivery"}]},
    ]},
  {id:2,name:"IDENTITY",subtitle:"Brand Discovery + Visual System",week:"WEEKS 1–2",fee:"$550",short:"BRAND · KIT",icon:"🎨",
    milestones:[
      {title:"DISCOVERY SESSION",clientDesc:"Define what Arquero stands for — positioning, audience, and brand voice for the welding lifestyle market.",
        tasks:[{label:"Client intake call — brand story, values, target customer profile"},{label:"Define brand positioning: where does Arquero sit in the welding lifestyle space?"},{label:"Identify tone: rugged craftsmanship? modern industrial? streetwear-meets-trade?"},{label:"Competitor audit — 5 comparable welding/trade lifestyle brands"}]},
      {title:"MOOD + DIRECTION",clientDesc:"Visual direction deck before any design work begins.",
        tasks:[{label:"Build mood board — textures, typography, color feel, photography style"},{label:"Present 2 direction options (e.g. raw industrial vs. refined craft)"},{label:"Get client approval on direction before moving to logo design",blocker:true}]},
      {title:"LOGO DESIGN",clientDesc:"Three concepts refined into a final mark — primary logo, icon, and wordmark.",
        tasks:[{label:"Generate 3 distinct logo concepts (AI-assisted + manual vector refinement)"},{label:"Present concepts with mockups — apparel tags, embroidery, social, packaging"},{label:"Revision round 1 on selected direction"},{label:"Revision round 2 — final polish and lockup variations"},{label:"Export final files: PNG (transparent), SVG (vector), PDF (print-ready)"},{label:"Create icon-only and wordmark-only variants"}]},
      {title:"BRAND SYSTEM",clientDesc:"Complete brand kit — colors, fonts, usage rules.",
        tasks:[{label:"Define primary palette — dark/steel tones + signature accent (welding orange/amber)"},{label:"Define secondary palette + neutrals with hex codes"},{label:"Select typography — display font (heavy/industrial) + body font (clean/readable)"},{label:"Build brand guidelines PDF: logo usage, minimum sizes, clear space, do's/don'ts"},{label:"Include application examples — tags, labels, packaging mockups, social templates"},{label:"Deliver complete brand kit to client"}]},
    ]},
  {id:3,name:"BUILD",subtitle:"Shopify Ecommerce Storefront",week:"WEEKS 2–3",fee:"$1,300",short:"SHOPIFY · STORE",icon:"\⚙️",
    milestones:[
      {title:"STORE FOUNDATION",clientDesc:"Shopify account live, theme installed, and branded.",
        tasks:[{label:"Create Shopify account — Basic plan ($39/mo, client-paid)"},{label:"Evaluate and select theme that fits industrial/lifestyle aesthetic"},{label:"Customize theme — colors, typography, logo placement per brand guidelines"},{label:"Configure store settings — currency, units, tax, checkout branding"},{label:"Connect arquero.co domain to Shopify"}]},
      {title:"CORE PAGES",clientDesc:"All essential storefront pages built, styled, and populated.",
        tasks:[{label:"Homepage — hero section, brand story, featured collections, lifestyle imagery"},{label:"About page — Arquero origin story, mission, the welding lifestyle ethos"},{label:"Contact page — form, email, social links"},{label:"FAQ page — shipping, returns, sizing, materials, care instructions"},{label:"Shipping & Returns policy page"},{label:"Privacy Policy + Terms of Service pages"}]},
      {title:"PRODUCTS + COLLECTIONS",clientDesc:"All launch products uploaded and ready to sell.",
        tasks:[{label:"Receive product images, descriptions, sizing, and pricing from client",blocker:true},{label:"Create product listings — up to 20 SKUs with images, descriptions, variants"},{label:"Write compelling product copy — speak to the welder/craftsman customer"},{label:"Build collection pages — by category (tees, hoodies, hats, accessories, etc.)"},{label:"Configure size charts specific to workwear/lifestyle fit"},{label:"Set up inventory tracking per variant"}]},
      {title:"CHECKOUT + SHIPPING",clientDesc:"Payment and shipping fully configured.",
        tasks:[{label:"Set up Shopify Payments (or client's preferred gateway)"},{label:"Configure shipping zones — domestic US, evaluate international"},{label:"Set shipping rates — flat rate vs. calculated vs. free threshold"},{label:"Configure order confirmation + shipping notification emails with branding"},{label:"End-to-end checkout test with live payment method"}]},
      {title:"SEO FOUNDATION",clientDesc:"Search optimization baked into every page from day one.",
        tasks:[{label:"Keyword research — welding apparel, welder lifestyle, trade clothing terms"},{label:"Write title tags + meta descriptions for all pages and collections"},{label:"Add descriptive alt text to all product and lifestyle images"},{label:"Configure URL structure — clean, keyword-aware slugs"},{label:"Submit XML sitemap to Google Search Console"}]},
    ]},
  {id:4,name:"LAUNCH",subtitle:"QA, Go-Live + Client Handoff",week:"WEEK 3",fee:"$250",short:"QA · HANDOFF",icon:"🚀",
    milestones:[
      {title:"QUALITY ASSURANCE",clientDesc:"Every page and feature tested across devices.",
        tasks:[{label:"Cross-browser testing — Chrome, Safari, Firefox, Edge"},{label:"Mobile responsive QA — iOS Safari, Android Chrome, tablet"},{label:"Test all links, navigation, forms, and interactive elements"},{label:"Full checkout flow test — add to cart → payment → confirmation"},{label:"Page speed audit — optimize images and assets if needed"}]},
      {title:"GO LIVE",clientDesc:"DNS pointed, SSL verified — arquero.co is live.",
        tasks:[{label:"Final DNS cutover — point arquero.co to Shopify"},{label:"Verify SSL certificate is active and forcing HTTPS"},{label:"Confirm all canonical URLs resolve correctly"},{label:"Remove storefront password lock"},{label:"Verify live site loads correctly on arquero.co"}]},
      {title:"ANALYTICS + TRACKING",clientDesc:"Google Analytics and Search Console connected.",
        tasks:[{label:"Create and configure Google Analytics 4 property"},{label:"Install GA4 tracking on Shopify"},{label:"Set up Google Search Console — verify domain ownership"},{label:"Verify ecommerce event tracking — purchases, add-to-cart, checkout"}]},
      {title:"CLIENT HANDOFF",clientDesc:"Full training, asset delivery, and documentation.",
        tasks:[{label:"Live training session — managing products, fulfilling orders, editing pages"},{label:"Deliver all brand assets: logo files, guidelines PDF, font files"},{label:"Deliver credentials doc — Shopify admin, domain registrar, GA4, GSC"},{label:"Provide quick-reference cheat sheet for common Shopify tasks"},{label:"48-hour post-launch check-in — fix any issues, answer questions"}]},
    ]},
];

/* ── helpers ── */
function phaseProgress(p,ts){let t=0,d=0;p.milestones.forEach(m=>m.tasks.forEach((_,ti)=>{t++;if(ts[`${p.id}-${m.title}-${ti}`])d++}));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}
function overall(ts){let t=0,d=0;phases.forEach(p=>p.milestones.forEach(m=>m.tasks.forEach((_,ti)=>{t++;if(ts[`${p.id}-${m.title}-${ti}`])d++})));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}

const Bar=({pct,h=6,glow=false,colors})=>{
  const {EMBER,O2,O,GREEN,STEEL}=colors;
  return(
    <div style={{background:STEEL,borderRadius:2,height:h,width:"100%",overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",borderRadius:2,transition:"width 0.5s cubic-bezier(.4,0,.2,1)",background:pct===100?GREEN:`linear-gradient(90deg,${EMBER},${O2})`,boxShadow:glow&&pct>0&&pct<100?`0 0 12px ${O}66`:"none"}}/>
    </div>
  );
};

const Grain=()=>(
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.03,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
);

/* ═══════════════════════════════════════
   SCOPE OF WORK PAGE
   ═══════════════════════════════════════ */
function ScopePage({colors}){
  const {O,O2,EMBER,DARK,STEEL,PLATE,WELD,RIVET,ASH,SMOKE,LIGHT,GREEN}=colors;
  const Section=({title,children})=>(
    <div style={{marginBottom:28}}>
      <div style={{fontSize:13,fontWeight:800,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${RIVET}`}}>{title}</div>
      {children}
    </div>
  );
  const Row=({label,value,sub})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"10px 16px",background:PLATE,borderRadius:6,border:`1px solid ${RIVET}`,marginBottom:6}}>
      <div><div style={{fontSize:13,fontWeight:700,color:LIGHT,letterSpacing:0.5}}>{label}</div>{sub&&<div style={{fontSize:10,color:SMOKE,marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>{sub}</div>}</div>
      <div style={{fontSize:14,fontWeight:800,color:O,fontFamily:"'IBM Plex Mono',monospace"}}>{value}</div>
    </div>
  );
  return(
    <div className="pg-pad" style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:11,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
        <div style={{fontSize:28,fontWeight:900,color:LIGHT,letterSpacing:2}}>SCOPE OF WORK</div>
        <div style={{fontSize:13,color:SMOKE,marginTop:4}}>Arquero Co. — Welding Lifestyle Brand — Brand Build + Ecommerce Launch</div>
      </div>

      <Section title="PROJECT OVERVIEW">
        <div style={{fontSize:13,color:LIGHT,lineHeight:1.7,fontFamily:"'IBM Plex Mono',monospace",padding:"0 4px"}}>
          Arquero Co. is a welding lifestyle apparel brand launching from a blank slate. This engagement covers the full brand-to-launch pipeline: domain acquisition, USPTO trademark filing, brand identity design, and a production-ready Shopify ecommerce storefront. The goal is to deliver a cohesive, launch-ready brand and online store within 3 weeks.
        </div>
        <div className="ovv-grid">
          {[{l:"CLIENT",v:"Arquero Co."},{l:"DOMAIN",v:"arquero.co"},{l:"PLATFORM",v:"Shopify"},{l:"PRODUCTS",v:"Apparel — Under 20 SKUs"}].map(i=>(
            <div key={i.l} style={{background:PLATE,border:`1px solid ${RIVET}`,borderRadius:4,padding:"8px 12px"}}>
              <div style={{fontSize:9,color:ASH,letterSpacing:2,fontFamily:"'IBM Plex Mono',monospace"}}>{i.l}</div>
              <div style={{fontSize:12,color:LIGHT,fontWeight:600,marginTop:2}}>{i.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="MILESTONE PRICING">
        <Row label="Phase 1 — Domain Acquisition + Trademark" value="$400" sub="Purchase & secure arquero.co • USPTO trademark filing for name + logo"/>
        <Row label="Phase 2 — Brand Identity" value="$550" sub="Logo design • Color palette • Typography • Brand guidelines PDF"/>
        <Row label="Phase 3 — Ecommerce Website Build" value="$1,300" sub="Shopify storefront • Product pages (up to 20) • Collections • Checkout config"/>
        <Row label="Phase 4 — Launch + Handoff" value="$250" sub="QA • DNS cutover • GA4 + GSC setup • Client training • Asset handoff"/>
        <div style={{background:WELD,borderRadius:6,padding:"14px 16px",marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${O}33`}}>
          <div style={{fontSize:14,fontWeight:800,color:LIGHT,letterSpacing:1}}>TOTAL PROJECT FEE</div>
          <div style={{fontSize:22,fontWeight:900,color:O,fontFamily:"'IBM Plex Mono',monospace"}}>$2,500</div>
        </div>
        <div style={{fontSize:11,color:SMOKE,fontStyle:"italic",textAlign:"center",marginTop:8,fontFamily:"'IBM Plex Mono',monospace"}}>
          One-time upfront payment option: $2,250 (save $250)
        </div>
      </Section>

      <Section title="ESTIMATED TIMELINE">
        {[{p:"Phase 1",n:"Domain + Trademark",t:"Phase 1"},{p:"Phase 2",n:"Brand Identity",t:"Phase 2"},{p:"Phase 3",n:"Ecommerce Build",t:"Phase 3"},{p:"Phase 4",n:"Launch + Handoff",t:"Phase 4"}].map(i=>(
          <div key={i.p} style={{display:"flex",justifyContent:"space-between",padding:"8px 16px",borderBottom:`1px solid ${RIVET}`}}>
            <div><span style={{fontSize:11,color:O,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",marginRight:10}}>{i.p}</span><span style={{fontSize:13,color:LIGHT}}>{i.n}</span></div>
            <span style={{fontSize:11,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>{i.t}</span>
          </div>
        ))}
      </Section>

      <Section title="ESTIMATED THIRD-PARTY COSTS (PAID BY CLIENT)">
        <div style={{fontSize:11,color:SMOKE,marginBottom:12,fontFamily:"'IBM Plex Mono',monospace"}}>Not included in project fee. Paid directly to provider or passed through at cost.</div>
        <Row label="USPTO Trademark Filing" value="$350/class" sub="Base electronic filing fee per class of goods/services"/>
        <Row label="USPTO Free-Form Text Surcharge" value="$200/class" sub="If custom description used instead of ID Manual"/>
        <Row label="Shopify Basic Plan" value="$39/mo" sub="Recommended — full storefront, checkout, shipping, analytics"/>
        <div style={{background:WELD,borderRadius:6,padding:"12px 16px",marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${RIVET}`}}>
          <div style={{fontSize:12,fontWeight:700,color:LIGHT}}>EST. FIRST-YEAR THIRD-PARTY TOTAL</div>
          <div style={{fontSize:16,fontWeight:800,color:O,fontFamily:"'IBM Plex Mono',monospace"}}>$818 – $1,018+</div>
        </div>
      </Section>

      <Section title="PHASE DELIVERABLE DETAILS">
        {phases.map(p=>(
          <div key={p.id} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:800,color:LIGHT,letterSpacing:1,marginBottom:8}}>
              <span style={{color:O,marginRight:8}}>PHASE {p.id}</span>{p.name} — {p.subtitle}
            </div>
            {p.milestones.map(m=>(
              <div key={m.title} style={{marginBottom:8,paddingLeft:16}}>
                <div style={{fontSize:11,fontWeight:700,color:LIGHT,marginBottom:4}}>{m.title}</div>
                {m.tasks.map((t,i)=>(
                  <div key={i} style={{fontSize:11,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",paddingLeft:12,lineHeight:1.8}}>
                    • {t.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Section>

      <Section title="TERMS + CONDITIONS">
        {[
          {l:"Payment",b:"Each phase is invoiced at milestone start. Work begins upon payment. One-time upfront option of $2,250 is due in full before Phase 1 begins."},
          {l:"Revisions",b:"Revision rounds are included as noted per phase. Additional revisions billed at $75/hr."},
          {l:"Client Responsibilities",b:"Client is responsible for providing product images, copy, and content as needed. Delays may extend delivery."},
          {l:"Pass-Through Costs",b:"USPTO filing fees (est. $350–$550+ per class) and Shopify subscription ($39/mo) are paid by client and not included."},
          {l:"Ownership",b:"Client retains full ownership of all deliverables upon receipt of payment."},
          {l:"Cancellation",b:"Either party may cancel with written notice. Client pays for completed phases. No refunds on completed work."},
        ].map(t=>(
          <div key={t.l} style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:O,letterSpacing:1,marginBottom:2}}>{t.l}</div>
            <div style={{fontSize:11,color:LIGHT,lineHeight:1.6,fontFamily:"'IBM Plex Mono',monospace",paddingLeft:8}}>{t.b}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE (SIGNABLE)
   ═══════════════════════════════════════ */

const INVOICE_MAP = {
  "one-time": {
    number:"CAPLYORH-0010",
    label:"Full Project — One-Time Upfront Payment (All 4 Phases)",
    amount:"$2,250",
    ref:"ARQCO-2026-UPFRONT",
    url:"https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VQkFOSjByZVdjN3dzSGlMR2U1MnBjNjFPaTVvclBnLDE2NDQ5NjIxOA020035G7bme6?s=ap",
  },
  "monthly": {
    number:"CAPLYORH-0006",
    label:"Phase 1 — Domain Acquisition + Trademark",
    amount:"$400",
    ref:"ARQCO-2026-P1",
    url:"https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VQkFONXlpNTk4SzhMZnU0YUpaOHp6RWZpOThwb2dJLDE2NDQ5NjIwMw0200KanlRWLa?s=ap",
  },
} as const;

const DEV_MODE=new URLSearchParams(window.location.search).has("dev");

function AgreementPage({colors}){
  const {O,O2,EMBER,DARK,STEEL,PLATE,WELD,RIVET,ASH,SMOKE,LIGHT,GREEN}=colors;
  const canvasRef=useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [signed,setSigned]=useState(DEV_MODE);
  const [signedDate,setSignedDate]=useState<string|null>(DEV_MODE?new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):null);
  const [sigData,setSigData]=useState<string|null>(DEV_MODE?"data:image/png;base64,DEV":null);
  const [payType,setPayType]=useState<"one-time"|"monthly">("one-time");
  const [saving,setSaving]=useState(false);
  const [payStatus,setPayStatus]=useState<"idle"|"checking"|"paid">(DEV_MODE?"paid":"idle");
  const [receiptUrl,setReceiptUrl]=useState<string|null>(DEV_MODE?"https://pay.stripe.com/receipts/invoices/test-receipt-dev":null);
  const [lastChecked,setLastChecked]=useState<Date|null>(null);

  const saveAgreementMutation=useMutation(api.arqueroTasks.saveAgreement);
  const updatePaymentMutation=useMutation(api.arqueroTasks.updateAgreementPayment);
  const checkStatusAction=useAction(api.arqueroTasks.checkInvoiceStatus);
  const existingAgreement=useQuery(api.arqueroTasks.getAgreement,{projectId:"arquero-co"});

  // Restore from Convex on load (skip in dev mode)
  useEffect(()=>{
    if(DEV_MODE)return;
    if(existingAgreement&&!signed){
      setSigned(true);
      setSigData(existingAgreement.sigData);
      setSignedDate(existingAgreement.signedDate);
      setPayType((existingAgreement.agreementType as "one-time"|"monthly")||"one-time");
      if(existingAgreement.paymentStatus==="paid"){
        setPayStatus("paid");
        setReceiptUrl(existingAgreement.receiptUrl??null);
      }
    }
  },[existingAgreement]);

  const startDraw=(e)=>{
    const c=canvasRef.current;if(!c)return;
    setDrawing(true);const ctx=c.getContext("2d");
    const rect=c.getBoundingClientRect();
    ctx.beginPath();ctx.moveTo((e.touches?e.touches[0].clientX:e.clientX)-rect.left,(e.touches?e.touches[0].clientY:e.clientY)-rect.top);
  };
  const draw=(e)=>{
    if(!drawing)return;const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");const rect=c.getBoundingClientRect();
    ctx.strokeStyle=LIGHT;ctx.lineWidth=2;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.lineTo((e.touches?e.touches[0].clientX:e.clientX)-rect.left,(e.touches?e.touches[0].clientY:e.clientY)-rect.top);
    ctx.stroke();
  };
  const endDraw=()=>{setDrawing(false)};
  const clearSig=()=>{
    const c=canvasRef.current;if(!c)return;
    c.getContext("2d").clearRect(0,0,c.width,c.height);
    setSigned(false);setSigData(null);setSignedDate(null);
  };
  const confirmSig=async()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const d=ctx.getImageData(0,0,c.width,c.height).data;
    let hasContent=false;
    for(let i=3;i<d.length;i+=4){if(d[i]>0){hasContent=true;break}}
    if(!hasContent)return;
    const data=c.toDataURL();
    const date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    setSigData(data);setSigned(true);setSignedDate(date);
    if(!DEV_MODE){
      setSaving(true);
      try{
        const inv=INVOICE_MAP[payType];
        await saveAgreementMutation({projectId:"arquero-co",agreementType:payType,sigData:data,signedDate:date,signedAt:Date.now(),invoiceNumber:inv.number});
      }finally{setSaving(false);}
    }
  };

  const checkPayment=async()=>{
    if(DEV_MODE){setPayStatus("paid");setReceiptUrl("https://pay.stripe.com/receipts/invoices/test-receipt-dev");return;}
    if(payStatus==="checking")return;
    setPayStatus("checking");
    try{
      const inv=INVOICE_MAP[payType];
      const result=await checkStatusAction({invoiceNumber:inv.number});
      setLastChecked(new Date());
      if(result.status==="paid"){
        setPayStatus("paid");
        setReceiptUrl(result.receiptUrl??null);
        await updatePaymentMutation({projectId:"arquero-co",paymentStatus:"paid",receiptUrl:result.receiptUrl??undefined,paidAt:result.paidAt??undefined});
      }else{
        setPayStatus("idle");
      }
    }catch{setPayStatus("idle");}
  };

  const downloadDoc=(title:string,htmlContent:string)=>{
    const w=window.open("","_blank","width=900,height=1200");
    if(!w)return;
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Barlow Condensed','Arial Narrow',sans-serif;background:#fff;color:#1a1510;padding:40px;max-width:720px;margin:0 auto}@media print{body{padding:20px}}</style>
</head><body>${htmlContent}</body></html>`);
    w.document.close();w.focus();setTimeout(()=>{w.print();},400);
  };

  const downloadAgreementPdf=()=>{
    const el=document.getElementById("agreement-printable");
    if(el)downloadDoc("Service Agreement — Arquero Co.",el.innerHTML);
  };
  const downloadReceiptPdf=()=>{
    if(receiptUrl)window.open(receiptUrl,"_blank");
  };

  const Term=({label,text})=>(
    <div style={{marginBottom:10}}>
      <div style={{fontSize:11,fontWeight:700,color:O,letterSpacing:1,marginBottom:2}}>{label}</div>
      <div style={{fontSize:11,color:LIGHT,lineHeight:1.6,fontFamily:"'IBM Plex Mono',monospace",paddingLeft:8}}>{text}</div>
    </div>
  );

  const today=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const isMonthly=payType==="monthly";
  const invoice=INVOICE_MAP[payType];

  const paymentTerm=isMonthly
    ?"Each phase is invoiced individually when work on that phase begins. Payment is due within 5 business days of invoice. No bulk upfront payment required."
    :"Each phase is invoiced at milestone start. Work begins upon payment. One-time upfront option of $2,250 is due in full before Phase 1 begins.";

  const scopePhases=[
    {p:"Phase 1",n:"Domain Acquisition + Trademark",price:"$400",when:"Invoiced at project start",desc:"Purchase and secure arquero.co domain. File USPTO trademark application for name and logo. Filing fees passed through at cost."},
    {p:"Phase 2",n:"Brand Identity",price:"$550",when:"Invoiced when Phase 1 is complete",desc:"Logo design (3 concepts, 2 revision rounds), color palette, typography selection, and brand guidelines PDF."},
    {p:"Phase 3",n:"Ecommerce Website Build",price:"$1,300",when:"Invoiced when Phase 2 is complete",desc:"Shopify store setup and customization. Product pages for up to 20 SKUs. Collection pages, checkout config, mobile QA, and basic on-page SEO."},
    {p:"Phase 4",n:"Launch + Handoff",price:"$250",when:"Invoiced when Phase 3 is complete",desc:"Full QA, DNS cutover, GA4 + GSC setup, client training session, and full asset handoff."},
  ];

  return(
    <div className="pg-pad" style={{maxWidth:720,margin:"0 auto"}}>

      {/* ── Payment type toggle (hidden once paid) ── */}
      {payStatus!=="paid"&&<div style={{marginBottom:28}}>
        <div style={{fontSize:10,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:8}}>PAYMENT STRUCTURE</div>
        <div style={{display:"flex",background:STEEL,borderRadius:6,border:`1px solid ${RIVET}`,overflow:"hidden"}}>
          {([["one-time","ONE-TIME","$2,500 total · $2,250 upfront option"],["monthly","MONTH BY MONTH","Per-phase · pay as each phase starts"]] as const).map(([val,label,sub])=>(
            <button key={val} onClick={()=>{if(!signed)setPayType(val)}} style={{
              flex:1,padding:"12px 16px",border:"none",cursor:signed?"default":"pointer",
              background:payType===val?O:"transparent",
              borderRight:val==="one-time"?`1px solid ${RIVET}`:"none",
              transition:"all 0.2s",
            }}>
              <div style={{fontSize:12,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",color:payType===val?"#fff":ASH}}>{label}</div>
              <div style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:payType===val?"#ffffff99":SMOKE,marginTop:3}}>{sub}</div>
            </button>
          ))}
        </div>
      </div>}

      {/* ── PAID STATE: show success card at top, hide agreement ── */}
      {payStatus==="paid"&&(
        <div style={{background:GREEN+"12",border:`1.5px solid ${GREEN}44`,borderRadius:10,padding:"28px 24px",textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:8}}>✓</div>
          <div style={{fontSize:20,fontWeight:900,color:GREEN,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif"}}>PAYMENT RECEIVED</div>
          <div style={{fontSize:11,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",marginTop:6}}>{invoice.label}</div>
          <div style={{fontSize:24,fontWeight:800,color:GREEN,fontFamily:"'IBM Plex Mono',monospace",marginTop:4}}>{invoice.amount}</div>
          <div style={{borderTop:`1px solid ${GREEN}22`,marginTop:20,paddingTop:20,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={downloadAgreementPdf} style={{padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"'Barlow Condensed',sans-serif",background:PLATE,color:LIGHT,border:`1px solid ${RIVET}`,borderRadius:4,cursor:"pointer"}}>
              ↓ AGREEMENT PDF
            </button>
            {receiptUrl&&(
              <button onClick={downloadReceiptPdf} style={{padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"'Barlow Condensed',sans-serif",background:GREEN,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>
                ↓ RECEIPT PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Printable agreement (grays + locks after signing; hidden when paid) ── */}
      {payStatus!=="paid"&&<div style={{position:"relative",borderRadius:8,overflow:"hidden"}}>
        {/* Locked overlay */}
        {signed&&(
          <div style={{position:"absolute",inset:0,background:DARK+"cc",zIndex:10,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:"16px",pointerEvents:"none"}}>
            <div style={{fontSize:10,fontWeight:700,color:GREEN,background:GREEN+"18",border:`1px solid ${GREEN}44`,padding:"4px 12px",borderRadius:3,letterSpacing:2,fontFamily:"'IBM Plex Mono',monospace"}}>
              🔒 LOCKED
            </div>
          </div>
        )}

        <div id="agreement-printable" style={{opacity:signed?0.45:1,transition:"opacity 0.4s",pointerEvents:signed?"none":"auto"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:11,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
            <div style={{fontSize:28,fontWeight:900,color:LIGHT,letterSpacing:2}}>SERVICE AGREEMENT</div>
            <div style={{fontSize:13,color:SMOKE,marginTop:4}}>
              Arquero Co. — Brand Build + Ecommerce Launch
              <span style={{marginLeft:8,fontSize:10,fontWeight:700,color:O,background:O+"18",padding:"2px 8px",borderRadius:3,letterSpacing:1.5,verticalAlign:"middle"}}>
                {isMonthly?"MONTH BY MONTH":"ONE-TIME"}
              </span>
            </div>
          </div>

          <div style={{background:PLATE,borderRadius:8,border:`1px solid ${RIVET}`,padding:"20px 24px",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12}}>PARTIES</div>
            {[{l:"Service Provider",v:"Anthony Tatis (Anthony's Brand Builder)"},{l:"Client",v:"Arquero Co."},{l:"Date",v:today}].map(r=>(
              <div key={r.l} style={{display:"flex",gap:16,marginBottom:6}}>
                <span style={{fontSize:11,color:ASH,fontFamily:"'IBM Plex Mono',monospace",width:120,flexShrink:0}}>{r.l}</span>
                <span style={{fontSize:12,color:LIGHT,fontWeight:500}}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${RIVET}`}}>SCOPE OF WORK</div>
            {scopePhases.map(s=>(
              <div key={s.p} style={{padding:"10px 0",borderBottom:`1px solid ${RIVET}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <div><span style={{fontSize:10,color:O,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",marginRight:8}}>{s.p}</span><span style={{fontSize:12,fontWeight:700,color:LIGHT}}>{s.n}</span></div>
                  <span style={{fontSize:12,fontWeight:700,color:LIGHT,fontFamily:"'IBM Plex Mono',monospace"}}>{s.price}</span>
                </div>
                {isMonthly&&<div style={{fontSize:9,color:O,fontFamily:"'IBM Plex Mono',monospace",marginTop:3,paddingLeft:4}}>{s.when}</div>}
                <div style={{fontSize:10,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",marginTop:4,paddingLeft:4}}>{s.desc}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",marginTop:4}}>
              <span style={{fontSize:13,fontWeight:800,color:LIGHT}}>{isMonthly?"TOTAL (4 Per-Phase Invoices)":"TOTAL (Milestone Invoicing)"}</span>
              <span style={{fontSize:18,fontWeight:900,color:O,fontFamily:"'IBM Plex Mono',monospace"}}>$2,500</span>
            </div>
            {!isMonthly&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:SMOKE}}>TOTAL (One-Time Upfront — save $250)</span>
                <span style={{fontSize:14,fontWeight:700,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>$2,250</span>
              </div>
            )}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${RIVET}`}}>TIMELINE</div>
            {[{p:"Phase 1",n:"Domain + Trademark",t:"Phase 1"},{p:"Phase 2",n:"Brand Identity",t:"Phase 2"},{p:"Phase 3",n:"Ecommerce Build",t:"Phase 3"},{p:"Phase 4",n:"Launch + Handoff",t:"Phase 4"}].map(i=>(
              <div key={i.p} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${RIVET}`}}>
                <div><span style={{fontSize:10,color:O,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",marginRight:8}}>{i.p}</span><span style={{fontSize:12,color:LIGHT}}>{i.n}</span></div>
                <span style={{fontSize:10,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>{i.t}</span>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${RIVET}`}}>ESTIMATED THIRD-PARTY COSTS (PAID BY CLIENT)</div>
            <div style={{fontSize:10,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",marginBottom:10}}>Not included in project fee. Paid directly to provider or passed through at cost.</div>
            {[{l:"USPTO Trademark Filing (per class)",v:"$350"},{l:"USPTO Free-Form Text Surcharge (per class)",v:"$200"},{l:"Shopify Basic Plan (monthly)",v:"$39/mo"},{l:"Domain (if via Shopify)",v:"$14–$20/yr"}].map(c=>(
              <div key={c.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${RIVET}`}}>
                <span style={{fontSize:11,color:LIGHT}}>{c.l}</span>
                <span style={{fontSize:11,fontWeight:700,color:LIGHT,fontFamily:"'IBM Plex Mono',monospace"}}>{c.v}</span>
              </div>
            ))}
            <div style={{fontSize:10,color:SMOKE,fontStyle:"italic",marginTop:8,fontFamily:"'IBM Plex Mono',monospace"}}>Estimated first-year: $818–$1,018+</div>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${RIVET}`}}>TERMS</div>
            <Term label="Payment" text={paymentTerm}/>
            <Term label="Revisions" text="Revision rounds are included as noted per phase. Additional revisions beyond included rounds billed at $75/hr."/>
            <Term label="Client Responsibilities" text="Client is responsible for providing product images, copy, and content as needed. Delays in client feedback may extend delivery."/>
            <Term label="Pass-Through Costs" text="USPTO filing fees (est. $350–$550+ per class) and Shopify subscription ($39/mo for Basic) are paid by client and not included."/>
            <Term label="Ownership" text="Client retains full ownership of all deliverables — brand assets, website, content, and documentation — upon receipt of payment."/>
            <Term label="Cancellation" text="Either party may cancel with written notice. Client is responsible for payment of any completed phases. No refunds on completed work."/>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${RIVET}`}}>ACKNOWLEDGEMENT</div>
            <div style={{fontSize:11,color:SMOKE,lineHeight:1.7,fontFamily:"'IBM Plex Mono',monospace"}}>
              By signing below, both parties confirm they have read and agree to the terms outlined in this agreement. This document serves as a binding service agreement between Anthony Tatis and Arquero Co.
            </div>
          </div>

          {/* Signature blocks */}
          <div className="sig-grid">
            <div>
              <div style={{fontSize:10,color:ASH,letterSpacing:2,fontFamily:"'IBM Plex Mono',monospace",marginBottom:8}}>SERVICE PROVIDER</div>
              <div style={{background:PLATE,border:`1px solid ${GREEN}44`,borderRadius:8,padding:"16px 20px"}}>
                <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:300,fontStyle:"italic",color:LIGHT,marginBottom:8}}>Anthony Tatis</div>
                <div style={{borderTop:`1px solid ${RIVET}`,paddingTop:8}}>
                  <div style={{fontSize:11,fontWeight:600,color:LIGHT}}>Anthony Tatis</div>
                  <div style={{fontSize:10,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>Anthony's Brand Builder</div>
                  <div style={{fontSize:10,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>{today}</div>
                </div>
                <div style={{display:"inline-block",marginTop:8,fontSize:9,fontWeight:700,color:GREEN,background:GREEN+"18",padding:"3px 10px",borderRadius:3,letterSpacing:1.5}}>SIGNED</div>
              </div>
            </div>
            <div>
              <div style={{fontSize:10,color:ASH,letterSpacing:2,fontFamily:"'IBM Plex Mono',monospace",marginBottom:8}}>CLIENT</div>
              <div style={{background:PLATE,border:`1px solid ${signed?GREEN+"44":O+"44"}`,borderRadius:8,padding:"16px 20px"}}>
                {signed?(
                  <>
                    <img src={sigData} alt="signature" style={{height:50,marginBottom:8,filter:"brightness(1.2)"}}/>
                    <div style={{borderTop:`1px solid ${RIVET}`,paddingTop:8}}>
                      <div style={{fontSize:11,fontWeight:600,color:LIGHT}}>Arquero Co.</div>
                      <div style={{fontSize:10,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>{signedDate}</div>
                    </div>
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:9,fontWeight:700,color:GREEN,background:GREEN+"18",padding:"3px 10px",borderRadius:3,letterSpacing:1.5,display:"inline-block"}}>SIGNED</div>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{fontSize:11,color:SMOKE,marginBottom:8,fontFamily:"'IBM Plex Mono',monospace"}}>Sign below to accept</div>
                    <canvas
                      ref={canvasRef} width={280} height={80}
                      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                      onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                      style={{width:"100%",height:80,background:WELD,borderRadius:4,border:`1px dashed ${RIVET}`,cursor:"crosshair",touchAction:"none"}}
                    />
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={confirmSig} disabled={saving} style={{flex:1,padding:"8px 0",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",opacity:saving?0.7:1}}>
                        {saving?"SAVING…":"CONFIRM SIGNATURE"}
                      </button>
                      <button onClick={clearSig} style={{padding:"8px 14px",fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Mono',monospace",background:"transparent",color:ASH,border:`1px solid ${RIVET}`,borderRadius:4,cursor:"pointer",letterSpacing:1}}>CLEAR</button>
                    </div>
                    <div style={{borderTop:`1px solid ${RIVET}`,paddingTop:8,marginTop:10}}>
                      <div style={{fontSize:11,fontWeight:600,color:SMOKE}}>Arquero Co.</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{textAlign:"center",marginTop:32,fontSize:10,color:ASH,fontFamily:"'IBM Plex Mono',monospace"}}>
            Anthony's Brand Builder · Anthony Tatis · tatis.anthony@gmail.com
          </div>
        </div>{/* end #agreement-printable */}
      </div>}{/* end locked wrapper (hidden when paid) */}

      {/* ── Invoice card (pending payment only) ── */}
      {signed&&payStatus!=="paid"&&(
        <div style={{marginTop:32}}>
          {(
            /* ── INVOICE CARD (pending payment) ── */
            <div style={{background:PLATE,border:`1.5px solid ${O}44`,borderRadius:10,padding:"24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontSize:9,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}>STRIPE INVOICE · {invoice.ref}</div>
                  <div style={{fontSize:14,fontWeight:700,color:LIGHT,letterSpacing:0.5}}>{invoice.label}</div>
                  <div style={{fontSize:11,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",marginTop:3}}>Due: March 26, 2026</div>
                </div>
                <div style={{fontSize:28,fontWeight:900,color:O,fontFamily:"'IBM Plex Mono',monospace",flexShrink:0}}>{invoice.amount}</div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <a href={invoice.url} target="_blank" rel="noopener noreferrer" style={{
                  display:"inline-block",padding:"10px 24px",fontSize:12,fontWeight:700,letterSpacing:2,
                  fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",
                  border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none",transition:"all 0.2s",
                }}>
                  OPEN INVOICE TO PAY →
                </a>
                <button onClick={checkPayment} disabled={payStatus==="checking"} style={{
                  padding:"10px 20px",fontSize:11,fontWeight:600,letterSpacing:1,
                  fontFamily:"'IBM Plex Mono',monospace",background:"transparent",color:ASH,
                  border:`1px solid ${RIVET}`,borderRadius:4,cursor:"pointer",opacity:payStatus==="checking"?0.6:1,
                }}>
                  {payStatus==="checking"?"CHECKING…":"CHECK PAYMENT STATUS"}
                </button>
              </div>
              {lastChecked&&(
                <div style={{fontSize:9,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",marginTop:10}}>
                  Last checked: {lastChecked.toLocaleTimeString()} — payment not yet received
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   WORKFLOW PAGE
   ═══════════════════════════════════════ */
function WorkflowPage({view,tasks,onToggle,colors}:{view:string,tasks:Record<string,boolean>,onToggle:(key:string)=>void,colors:any}){
  const {O,O2,EMBER,DARK,STEEL,PLATE,WELD,RIVET,ASH,SMOKE,LIGHT,GREEN}=colors;
  const [activePhase,setActivePhase]=useState(1);
  const [expanded,setExpanded]=useState({});
  useEffect(()=>{const a={};phases.forEach(p=>p.milestones.forEach(m=>{a[`${p.id}-${m.title}`]=true}));setExpanded(a)},[]);
  const toggle=(key:string)=>{if(view==="internal")onToggle(key)};
  const toggleM=(key)=>setExpanded(p=>({...p,[key]:!p[key]}));
  const ov=overall(tasks);
  const phase=phases.find(p=>p.id===activePhase);

  return(
    <div>
      {/* Overall */}
      <div className="wf-pad-top">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:700,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace"}}>PROJECT COMPLETION</span>
          <span style={{fontFamily:"'IBM Plex Mono',monospace"}}>
            <span style={{fontSize:28,fontWeight:700,color:ov.pct===100?GREEN:O}}>{ov.pct}%</span>
            <span style={{fontSize:11,color:ASH,marginLeft:8}}>{ov.done}/{ov.total}</span>
          </span>
        </div>
        <Bar pct={ov.pct} h={10} glow colors={colors}/>
      </div>

      {/* Phase tabs */}
      <div className="wf-pad-phase" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
        {phases.map(p=>{
          const prog=phaseProgress(p,tasks);const active=activePhase===p.id;const done=prog.pct===100;
          return(
            <button key={p.id} className="phase-tab" onClick={()=>setActivePhase(p.id)} style={{
              padding:"14px 16px",textAlign:"left",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              background:active?PLATE:STEEL,borderRadius:6,border:`1.5px solid ${active?O:done?GREEN+"44":RIVET}`,position:"relative",overflow:"hidden",
            }}>
              {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:O}}/>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:20}}>{p.icon}</span>
                <span style={{fontSize:11,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:done?GREEN:active?O:ASH}}>{prog.pct}%</span>
              </div>
              <div style={{fontSize:13,fontWeight:800,color:active?LIGHT:ASH,letterSpacing:1.5,marginTop:6}}>{p.name}</div>
              <div style={{fontSize:10,color:ASH,marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>PHASE {p.id} — {p.short}</div>
              <div style={{marginTop:8}}><Bar pct={prog.pct} h={3} colors={colors}/></div>
            </button>
          );
        })}
      </div>

      {/* Phase detail */}
      {phase&&(
        <div className="wf-pad-detail">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,paddingBottom:16,borderBottom:`1px solid ${RIVET}`,marginBottom:20}}>
            <div>
              <span style={{fontSize:11,fontWeight:600,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace"}}>PHASE {phase.id}</span>
              <span style={{fontSize:24,fontWeight:900,color:LIGHT,letterSpacing:1,marginLeft:12}}>{phase.name}</span>
              <div style={{fontSize:13,color:SMOKE,marginTop:2,letterSpacing:0.5}}>{phase.subtitle}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:ASH,fontFamily:"'IBM Plex Mono',monospace"}}>PHASE {phase.id}</div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {phase.milestones.map((m,mi)=>{
              const mDone=m.tasks.filter((_,ti)=>tasks[`${phase.id}-${m.title}-${ti}`]).length;
              const mPct=m.tasks.length?Math.round(mDone/m.tasks.length*100):0;
              const complete=mPct===100;
              const hasBlocker=m.tasks.some((t,ti)=>t.blocker&&!tasks[`${phase.id}-${m.title}-${ti}`]);
              const exp=expanded[`${phase.id}-${m.title}`];
              return(
                <div key={m.title} className={`mc s${mi+1}`} style={{background:PLATE,borderRadius:8,overflow:"hidden",border:`1px solid ${complete?GREEN+"33":hasBlocker?EMBER+"33":RIVET}`}}>
                  <div onClick={()=>toggleM(`${phase.id}-${m.title}`)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:complete?GREEN+"08":"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <div style={{width:28,height:28,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",background:complete?GREEN+"20":WELD,border:`1px solid ${complete?GREEN+"44":RIVET}`,fontSize:12,fontWeight:700,color:complete?GREEN:O,fontFamily:"'IBM Plex Mono',monospace",flexShrink:0}}>
                        {complete?"✓":`${mi+1}`}
                      </div>
                      <div>
                        <div style={{fontSize:15,fontWeight:800,color:complete?GREEN:LIGHT,letterSpacing:1.5}}>
                          {m.title}
                          {hasBlocker&&<span style={{fontSize:8,fontWeight:700,color:EMBER,background:EMBER+"18",padding:"2px 8px",borderRadius:3,marginLeft:10,letterSpacing:1.5,verticalAlign:"middle"}}>HAS BLOCKER</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0,marginLeft:12}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:14,fontWeight:700,color:complete?GREEN:O,fontFamily:"'IBM Plex Mono',monospace"}}>{mPct}%</div>
                        <div style={{fontSize:9,color:ASH,fontFamily:"'IBM Plex Mono',monospace"}}>{mDone}/{m.tasks.length}</div>
                      </div>
                      <div style={{fontSize:14,color:ASH,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0deg)"}}>▾</div>
                    </div>
                  </div>
                  <div style={{padding:"0 20px 2px"}}><Bar pct={mPct} h={3} colors={colors}/></div>
                  {exp&&(
                    <div style={{padding:"8px 20px 16px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:2}}>
                        {m.tasks.map((t,ti)=>{
                          const key=`${phase.id}-${m.title}-${ti}`;const checked=!!tasks[key];const isOps=view==="internal";
                          return(
                            <div key={ti} className="task-row" onClick={()=>{if(isOps)toggle(key)}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 10px",borderRadius:4,cursor:isOps?"pointer":"default",background:checked?GREEN+"08":"transparent",animation:`slideIn 0.2s ease both`,animationDelay:`${ti*0.03}s`}}>
                              <div style={{width:16,height:16,borderRadius:3,flexShrink:0,marginTop:1,border:`1.5px solid ${checked?GREEN:RIVET}`,background:checked?GREEN:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                                {checked&&<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span style={{fontSize:12,fontFamily:"'IBM Plex Mono',monospace",fontWeight:400,color:checked?GREEN:LIGHT,textDecoration:checked?"line-through":"none",opacity:checked?0.65:1,lineHeight:1.4}}>
                                {t.label}
                                {t.blocker&&!checked&&<span style={{fontSize:8,fontWeight:700,color:EMBER,background:EMBER+"15",padding:"1px 7px",borderRadius:3,marginLeft:8,letterSpacing:1.5,animation:"pulse 2s ease infinite"}}>BLOCKER</span>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   WEBSITE MOCKUP PAGE
   ═══════════════════════════════════════ */
function WebsitePage({colors}){
  const {O,STEEL,PLATE,WELD,RIVET,ASH,SMOKE,LIGHT,GREEN}=colors;
  const [sitePage,setSitePage]=useState("home");
  const [activeCat,setActiveCat]=useState<string|null>(null);
  const [cartItems,setCartItems]=useState<{id:number,name:string,price:number,qty:number}[]>([]);
  const [added,setAdded]=useState<number|null>(null);
  const [contactForm,setContactForm]=useState({name:"",email:"",message:""});
  const [contactSent,setContactSent]=useState(false);
  const scrollRef=useRef<HTMLDivElement>(null);

  const S={bg:"#080808",nav:"#0e0e0e",card:"#141414",border:"#222",text:"#e8e6e2",muted:"#777"};

  const products=[
    {id:1,name:"ARQUERO WORK TEE",price:38,cat:"tees",desc:"100% heavyweight cotton. Built for the floor.",tag:"BESTSELLER",badge:"NEW",img:"/work-tee.png"},
    {id:2,name:"FORGE HOODIE",price:75,cat:"hoodies",desc:"Midweight fleece. Double-stitched. Ready for anything.",tag:"OUTERWEAR",img:"/forged-hoodie.png"},
    {id:3,name:"TRADE HAT",price:32,cat:"hats",desc:"Structured 6-panel. Embroidered logo.",tag:"ACCESSORIES",img:"/trade-hat.png"},
    {id:4,name:"SPARK OVERSHIRT",price:95,cat:"outerwear",desc:"Heavy canvas. Two chest pockets. Trade-cut.",tag:"OUTERWEAR",img:"/overshirt.png"},
    {id:5,name:"GRIND CREWNECK",price:65,cat:"tees",desc:"French terry, 380gsm. Relaxed fit.",tag:"NEW",img:"/crewneck.png"},
    {id:6,name:"WELD STICKER SET",price:12,cat:"accessories",desc:"5-pack vinyl die cuts. Waterproof.",tag:"ACCESSORIES",img:"/welsing sticker pack.png"},
    {id:7,name:"FORGE TEE V2",price:42,cat:"tees",desc:"Premium ring-spun cotton, garment-dyed.",tag:"TEES",img:"/work-tee.png"},
    {id:8,name:"IRON SNAPBACK",price:28,cat:"hats",desc:"Structured snapback, embroidered arc logo.",tag:"HATS",img:"/trade-hat.png"},
  ];

  const nav=(page,cat=null)=>{setSitePage(page);setActiveCat(cat);if(scrollRef.current)scrollRef.current.scrollTop=0;};
  const addToCart=(p)=>{
    setCartItems(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{id:p.id,name:p.name,price:p.price,qty:1}]});
    setAdded(p.id);setTimeout(()=>setAdded(null),1400);
  };
  const cartCount=cartItems.reduce((s,i)=>s+i.qty,0);
  const cartTotal=cartItems.reduce((s,i)=>s+i.price*i.qty,0);

  const PCard=({p})=>(
    <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:4,overflow:"hidden"}}>
      <div style={{height:190,background:"#111",position:"relative",overflow:"hidden"}}>
        <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
        {p.badge&&<div style={{position:"absolute",top:8,left:8,fontSize:8,fontWeight:700,color:O,background:"#000000cc",border:`1px solid ${O}66`,padding:"2px 7px",borderRadius:2,letterSpacing:2,fontFamily:"'IBM Plex Mono',monospace"}}>{p.badge}</div>}
        <div style={{position:"absolute",bottom:8,right:8,fontSize:8,color:"#ccc",background:"#00000099",padding:"2px 7px",borderRadius:2,letterSpacing:1.5,fontFamily:"'IBM Plex Mono',monospace"}}>{p.tag}</div>
      </div>
      <div style={{padding:"13px 13px 16px"}}>
        <div style={{fontSize:12,fontWeight:800,color:S.text,letterSpacing:2,marginBottom:3}}>{p.name}</div>
        <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.5,marginBottom:10}}>{p.desc}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:15,fontWeight:900,color:S.text,fontFamily:"'IBM Plex Mono',monospace"}}>${p.price}</span>
          <button onClick={()=>addToCart(p)} style={{padding:"6px 12px",fontSize:9,fontWeight:700,letterSpacing:1.5,fontFamily:"'Barlow Condensed',sans-serif",background:added===p.id?GREEN:O,color:"#fff",border:"none",borderRadius:2,cursor:"pointer",transition:"background 0.2s"}}>
            {added===p.id?"✓ ADDED":"ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );

  const SiteNav=()=>(
    <div style={{background:S.nav,borderBottom:`1px solid ${S.border}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",gap:20,alignItems:"center"}}>
        <div onClick={()=>nav("home")} style={{fontSize:18,fontWeight:900,color:S.text,letterSpacing:3,cursor:"pointer",flexShrink:0}}>ARQUERO<span style={{color:O}}>.</span>CO</div>
        <div className="aq-nav-links">
          {[{l:"SHOP",p:"shop"},{l:"COLLECTIONS",p:"collections"},{l:"ABOUT",p:"about"},{l:"CONTACT",p:"contact"}].map(n=>(
            <span key={n.l} onClick={()=>nav(n.p)} style={{fontSize:10,fontWeight:700,color:sitePage===n.p?O:S.muted,letterSpacing:2,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",transition:"color 0.15s"}}>{n.l}</span>
          ))}
        </div>
      </div>
      <div onClick={()=>nav("cart")} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",position:"relative"}}>
        <span style={{fontSize:16}}>🛒</span>
        {cartCount>0&&<div style={{position:"absolute",top:-6,right:-6,width:16,height:16,borderRadius:"50%",background:O,fontSize:8,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</div>}
      </div>
    </div>
  );

  const SiteFooter=()=>(
    <div style={{background:"#060606",padding:"28px 24px",borderTop:`1px solid ${S.border}`}}>
      <div className="aq-footer-cols">
        <div>
          <div style={{fontSize:16,fontWeight:900,color:S.text,letterSpacing:3,marginBottom:5}}>ARQUERO<span style={{color:O}}>.</span>CO</div>
          <div style={{fontSize:9,color:S.muted,fontFamily:"'IBM Plex Mono',monospace"}}>WELDING LIFESTYLE APPAREL</div>
        </div>
        <div style={{display:"flex",gap:36}}>
          {[
            {t:"SHOP",l:[{label:"All Products",fn:()=>nav("shop")},{label:"Tees",fn:()=>nav("shop","tees")},{label:"Hoodies",fn:()=>nav("shop","hoodies")},{label:"Hats",fn:()=>nav("shop","hats")},{label:"Accessories",fn:()=>nav("shop","accessories")}]},
            {t:"INFO",l:[{label:"About",fn:()=>nav("about")},{label:"FAQ",fn:()=>nav("faq")},{label:"Shipping",fn:()=>nav("shipping")},{label:"Contact",fn:()=>nav("contact")}]},
          ].map(col=>(
            <div key={col.t}>
              <div style={{fontSize:9,fontWeight:700,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:10}}>{col.t}</div>
              {col.l.map(l=><div key={l.label} onClick={l.fn} style={{fontSize:11,color:S.muted,marginBottom:7,cursor:"pointer"}}>{l.label}</div>)}
            </div>
          ))}
        </div>
      </div>
      <div style={{borderTop:`1px solid ${S.border}`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:10,color:"#444",fontFamily:"'IBM Plex Mono',monospace"}}>© 2026 Arquero Co. All rights reserved.</div>
        <div style={{fontSize:10,color:"#333",fontFamily:"'IBM Plex Mono',monospace"}}>Built by Anthony's Brand Builder</div>
      </div>
    </div>
  );

  /* ── PAGES ── */
  const renderHome=()=>(
    <>
      <div style={{position:"relative",height:440,background:"#060606",overflow:"hidden",display:"flex",alignItems:"center"}}>
        <video autoPlay muted loop playsInline style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}>
          <source src="/Arquero VIdeo.mp4" type="video/mp4"/>
        </video>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.3) 60%,rgba(0,0,0,0.08) 100%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${O},transparent)`}}/>
        <div className="aq-hero-inner" style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:10,fontWeight:700,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12}}>WELDING LIFESTYLE APPAREL</div>
          <div className="aq-hero-title">FORGED<br/><span style={{color:O}}>IN THE</span><br/>TRADE.</div>
          <div className="aq-hero-sub" style={{color:"#888",fontFamily:"'IBM Plex Mono',monospace"}}>Built for welders, by welders. Apparel that moves with you — on the floor and off it.</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button onClick={()=>nav("shop")} style={{padding:"12px 28px",fontSize:12,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",border:"none",borderRadius:2,cursor:"pointer"}}>SHOP THE DROP →</button>
            <button onClick={()=>nav("about")} style={{padding:"12px 28px",fontSize:12,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:"transparent",color:S.text,border:`1px solid #444`,borderRadius:2,cursor:"pointer"}}>OUR STORY</button>
          </div>
        </div>
      </div>
      <div style={{padding:"36px 24px 0"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:14,marginBottom:20}}>
          <div style={{fontSize:24,fontWeight:900,color:S.text,letterSpacing:2}}>THE DROP</div>
          <div style={{fontSize:9,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:2}}>SS '26 COLLECTION</div>
          <span onClick={()=>nav("shop")} style={{marginLeft:"auto",fontSize:9,color:O,fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer",letterSpacing:1}}>VIEW ALL →</span>
        </div>
        <div className="aq-products-grid">{products.slice(0,6).map(p=><PCard key={p.id} p={p}/>)}</div>
      </div>
      <div style={{background:"#0c0c0c",borderTop:`1px solid ${S.border}`,borderBottom:`1px solid ${S.border}`,padding:"48px 24px"}}>
        <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12}}>THE ARQUERO STORY</div>
          <div style={{fontSize:34,fontWeight:900,color:S.text,lineHeight:1.05,letterSpacing:1,marginBottom:16}}>BUILT FOR THE ONES WHO BUILD</div>
          <div style={{fontSize:11,color:"#888",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8,marginBottom:22}}>Arquero was born in the shop. We make apparel for the welder who takes pride in their craft — gear that respects the work without sacrificing the look.</div>
          <button onClick={()=>nav("about")} style={{padding:"11px 28px",fontSize:12,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:"transparent",color:O,border:`1px solid ${O}44`,borderRadius:2,cursor:"pointer"}}>READ OUR STORY →</button>
        </div>
      </div>
    </>
  );

  const renderShop=()=>{
    const cats=[null,"tees","hoodies","hats","accessories","outerwear"];
    const labels={null:"ALL",tees:"TEES",hoodies:"HOODIES",hats:"HATS",accessories:"ACCESSORIES",outerwear:"OUTERWEAR"};
    const filtered=activeCat?products.filter(p=>p.cat===activeCat):products;
    return(
      <div style={{padding:"32px 24px 48px"}}>
        <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>SHOP</div>
        <div style={{fontSize:26,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:16}}>ALL PRODUCTS</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {cats.map(c=>(
            <button key={c??"all"} onClick={()=>setActiveCat(c)} style={{padding:"5px 14px",fontSize:10,fontWeight:700,letterSpacing:1.5,fontFamily:"'Barlow Condensed',sans-serif",background:activeCat===c?O:"transparent",color:activeCat===c?"#fff":S.muted,border:`1px solid ${activeCat===c?O:S.border}`,borderRadius:2,cursor:"pointer",transition:"all 0.15s"}}>
              {labels[c]}
            </button>
          ))}
        </div>
        <div className="aq-products-grid">{filtered.map(p=><PCard key={p.id} p={p}/>)}</div>
      </div>
    );
  };

  const renderCollections=()=>(
    <div style={{padding:"32px 24px 48px"}}>
      <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>BROWSE</div>
      <div style={{fontSize:26,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:24}}>COLLECTIONS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
        {[{name:"TEES",cat:"tees",n:3,img:"/crewneck.png"},{name:"HOODIES",cat:"hoodies",n:1,img:"/forged-hoodie.png"},{name:"HATS",cat:"hats",n:2,img:"/trade-hat.png"},{name:"ACCESSORIES",cat:"accessories",n:1,img:"/welsing sticker pack.png"},{name:"OUTERWEAR",cat:"outerwear",n:1,img:"/overshirt.png"},{name:"NEW ARRIVALS",cat:null,n:8,img:"/work-tee.png"}].map(col=>(
          <div key={col.name} onClick={()=>nav("shop",col.cat)} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:4,overflow:"hidden",cursor:"pointer"}}>
            <div style={{height:150,background:"#111",position:"relative",overflow:"hidden"}}>
              <img src={col.img} alt={col.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 55%)"}}/>
              <div style={{position:"absolute",bottom:8,left:10,fontSize:8,color:"#ddd",fontFamily:"'IBM Plex Mono',monospace"}}>{col.n} ITEMS</div>
            </div>
            <div style={{padding:"12px 12px 16px"}}>
              <div style={{fontSize:13,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:8}}>{col.name}</div>
              <div style={{fontSize:9,color:O,fontWeight:700,letterSpacing:1.5,fontFamily:"'IBM Plex Mono',monospace"}}>SHOP NOW →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout=()=>(
    <div>
      <div style={{background:"#0c0c0c",padding:"52px 24px",borderBottom:`1px solid ${S.border}`,textAlign:"center"}}>
        <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:10}}>THE ARQUERO STORY</div>
        <div style={{fontSize:38,fontWeight:900,color:S.text,lineHeight:1,letterSpacing:1,maxWidth:520,margin:"0 auto 18px"}}>BUILT FOR THE ONES WHO BUILD</div>
        <div style={{fontSize:11,color:"#888",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.9,maxWidth:500,margin:"0 auto"}}>Arquero was born in the shop. Not in a boardroom, not in a focus group — in the shop, where sparks fly and hands get burned.</div>
      </div>
      <div style={{padding:"40px 24px"}}>
        {[{t:"THE NAME",b:"Arquero means archer in Spanish. We chose it because the welder is like the archer — precise, focused, committed to the shot. Every bead laid is a mark of that precision."},
          {t:"THE APPAREL",b:"We're not making costumes. We're making clothes for welders who want to look as sharp off the clock as they do on it. Heavyweight fabrics, trade-ready construction, and a brand identity that actually represents the culture."},
          {t:"THE MISSION",b:"The welding trade deserves its own lifestyle brand — not a workwear catalog dressed up in marketing, but a real brand built from inside the culture. That's what Arquero is."},
        ].map(s=>(
          <div key={s.t} style={{maxWidth:580,margin:"0 auto 32px"}}>
            <div style={{fontSize:10,color:O,letterSpacing:4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:8}}>{s.t}</div>
            <div style={{fontSize:12,color:S.text,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.9}}>{s.b}</div>
          </div>
        ))}
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={()=>nav("shop")} style={{padding:"13px 36px",fontSize:13,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",border:"none",borderRadius:2,cursor:"pointer"}}>SHOP THE COLLECTION →</button>
        </div>
      </div>
    </div>
  );

  const renderContact=()=>(
    <div style={{padding:"40px 24px 48px",maxWidth:520,margin:"0 auto"}}>
      <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>GET IN TOUCH</div>
      <div style={{fontSize:26,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:6}}>CONTACT</div>
      <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginBottom:28}}>Questions about orders, sizing, wholesale, or collabs.</div>
      {contactSent?(
        <div style={{background:GREEN+"12",border:`1px solid ${GREEN}33`,borderRadius:6,padding:"32px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:8}}>✓</div>
          <div style={{fontSize:16,fontWeight:900,color:GREEN,letterSpacing:2,marginBottom:6}}>MESSAGE SENT</div>
          <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace"}}>We'll get back within 24–48 hours.</div>
          <button onClick={()=>setContactSent(false)} style={{marginTop:18,padding:"9px 22px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"'Barlow Condensed',sans-serif",background:"transparent",color:S.muted,border:`1px solid ${S.border}`,borderRadius:2,cursor:"pointer"}}>SEND ANOTHER</button>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{l:"NAME",k:"name",t:"text",ph:"Your name"},{l:"EMAIL",k:"email",t:"email",ph:"your@email.com"}].map(f=>(
            <div key={f.k}>
              <div style={{fontSize:8,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>{f.l}</div>
              <input type={f.t} placeholder={f.ph} value={contactForm[f.k]} onChange={e=>setContactForm(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",padding:"9px 12px",background:S.card,border:`1px solid ${S.border}`,borderRadius:3,color:S.text,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",outline:"none"}}/>
            </div>
          ))}
          <div>
            <div style={{fontSize:8,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>MESSAGE</div>
            <textarea placeholder="What's on your mind?" value={contactForm.message} onChange={e=>setContactForm(p=>({...p,message:e.target.value}))} rows={5} style={{width:"100%",padding:"9px 12px",background:S.card,border:`1px solid ${S.border}`,borderRadius:3,color:S.text,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",outline:"none",resize:"vertical"}}/>
          </div>
          <button onClick={()=>{if(contactForm.name&&contactForm.email&&contactForm.message)setContactSent(true)}} style={{padding:"12px",fontSize:12,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",border:"none",borderRadius:2,cursor:"pointer"}}>SEND MESSAGE →</button>
        </div>
      )}
      <div style={{marginTop:40,paddingTop:28,borderTop:`1px solid ${S.border}`,display:"flex",gap:28,flexWrap:"wrap"}}>
        {[{l:"EMAIL",v:"hello@arquero.co"},{l:"INSTAGRAM",v:"@arquero.co"},{l:"LOCATION",v:"USA"}].map(i=>(
          <div key={i.l}>
            <div style={{fontSize:8,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:3}}>{i.l}</div>
            <div style={{fontSize:11,color:S.text}}>{i.v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFaq=()=>(
    <div style={{padding:"40px 24px 48px",maxWidth:580,margin:"0 auto"}}>
      <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>HELP</div>
      <div style={{fontSize:26,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:28}}>FAQ</div>
      {[{q:"How does sizing run?",a:"Our tees and hoodies run true to size with a relaxed fit. Size down for a more fitted look."},
        {q:"What's your return policy?",a:"Unworn, unwashed items within 30 days of delivery. Sale items are final sale."},
        {q:"Do you ship internationally?",a:"US domestic only for now. International shipping planned for Q3 2026."},
        {q:"How long does shipping take?",a:"Standard 5–7 business days. Expedited 2–3 business days available at checkout."},
        {q:"Can I change or cancel my order?",a:"Orders can be changed or cancelled within 2 hours of placing."},
        {q:"Do you do wholesale or collabs?",a:"Yes — reach out via the Contact page with your shop name and what you have in mind."},
      ].map((f,i)=>(
        <div key={i} style={{borderBottom:`1px solid ${S.border}`,padding:"18px 0"}}>
          <div style={{fontSize:13,fontWeight:800,color:S.text,letterSpacing:1,marginBottom:6}}>{f.q}</div>
          <div style={{fontSize:11,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8}}>{f.a}</div>
        </div>
      ))}
    </div>
  );

  const renderShipping=()=>(
    <div style={{padding:"40px 24px 48px",maxWidth:580,margin:"0 auto"}}>
      <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>POLICIES</div>
      <div style={{fontSize:26,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:28}}>SHIPPING & RETURNS</div>
      {[{title:"SHIPPING",items:["Standard: 5–7 business days — FREE over $75, else $6.99","Expedited: 2–3 business days — $14.99","Orders processed within 1–2 business days","Tracking sent via email when order ships","US domestic only — international coming Q3 2026"]},
        {title:"RETURNS",items:["30-day return window from delivery date","Items must be unworn, unwashed, with original tags","Sale items are final sale","Start a return: returns@arquero.co","Refunds in 5–7 business days after receipt"]},
        {title:"EXCHANGES",items:["Exchange for a different size within 30 days","Use the same return process — note the size you want","Exchanges ship standard at no cost"]},
      ].map(s=>(
        <div key={s.title} style={{marginBottom:28}}>
          <div style={{fontSize:9,fontWeight:700,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12,paddingBottom:6,borderBottom:`1px solid ${S.border}`}}>{s.title}</div>
          {s.items.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
              <span style={{color:O,flexShrink:0}}>→</span>
              <span style={{fontSize:11,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.7}}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderCart=()=>(
    <div style={{padding:"36px 24px 48px"}}>
      <div style={{fontSize:9,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:5}}>YOUR BAG</div>
      <div style={{fontSize:26,fontWeight:900,color:S.text,letterSpacing:2,marginBottom:24}}>CART{cartCount>0?` (${cartCount})`:""}</div>
      {cartItems.length===0?(
        <div style={{textAlign:"center",padding:"48px 0"}}>
          <div style={{fontSize:40,marginBottom:14,opacity:0.25}}>🛒</div>
          <div style={{fontSize:12,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginBottom:22}}>Your cart is empty.</div>
          <button onClick={()=>nav("shop")} style={{padding:"12px 28px",fontSize:12,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",border:"none",borderRadius:2,cursor:"pointer"}}>SHOP THE DROP →</button>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:20,alignItems:"start"}}>
          <div>
            {cartItems.map(item=>(
              <div key={item.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${S.border}`,alignItems:"center"}}>
                <div style={{width:56,height:56,background:"linear-gradient(135deg,#1a1a1a,#0e0e0e)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:18,opacity:0.12}}>⚡</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:800,color:S.text,letterSpacing:1.5,marginBottom:2}}>{item.name}</div>
                  <div style={{fontSize:9,color:S.muted,fontFamily:"'IBM Plex Mono',monospace"}}>Qty: {item.qty}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:900,color:S.text,fontFamily:"'IBM Plex Mono',monospace",marginBottom:3}}>${item.price*item.qty}</div>
                  <button onClick={()=>setCartItems(p=>p.filter(i=>i.id!==item.id))} style={{fontSize:8,color:S.muted,background:"transparent",border:"none",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",padding:0,letterSpacing:1}}>REMOVE</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:4,padding:"18px",minWidth:180}}>
            <div style={{fontSize:8,color:O,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12}}>ORDER SUMMARY</div>
            {[{l:"Subtotal",v:`$${cartTotal}`},{l:"Shipping",v:cartTotal>=75?"FREE":"$6.99"}].map(r=>(
              <div key={r.l} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <span style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace"}}>{r.l}</span>
                <span style={{fontSize:10,color:r.v==="FREE"?GREEN:S.text,fontFamily:"'IBM Plex Mono',monospace"}}>{r.v}</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${S.border}`,margin:"10px 0",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
              <span style={{fontSize:11,fontWeight:700,color:S.text}}>TOTAL</span>
              <span style={{fontSize:15,fontWeight:900,color:O,fontFamily:"'IBM Plex Mono',monospace"}}>${cartTotal>=75?cartTotal:(cartTotal+6.99).toFixed(2)}</span>
            </div>
            {cartTotal<75&&<div style={{fontSize:8,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginBottom:10}}>Add ${75-cartTotal} more for free shipping</div>}
            <button style={{width:"100%",padding:"11px",fontSize:11,fontWeight:800,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",background:O,color:"#fff",border:"none",borderRadius:2,cursor:"pointer",marginBottom:7}}>CHECKOUT →</button>
            <button onClick={()=>nav("shop")} style={{width:"100%",padding:"9px",fontSize:10,fontWeight:600,letterSpacing:1,fontFamily:"'Barlow Condensed',sans-serif",background:"transparent",color:S.muted,border:`1px solid ${S.border}`,borderRadius:2,cursor:"pointer"}}>CONTINUE SHOPPING</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPage=()=>{
    switch(sitePage){
      case"shop":return renderShop();
      case"collections":return renderCollections();
      case"about":return renderAbout();
      case"contact":return renderContact();
      case"faq":return renderFaq();
      case"shipping":return renderShipping();
      case"cart":return renderCart();
      default:return renderHome();
    }
  };

  return(
    <div style={{padding:"24px 32px 48px"}}>
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <div style={{fontSize:10,color:ASH,letterSpacing:3,fontFamily:"'IBM Plex Mono',monospace"}}>WEBSITE MOCKUP</div>
        <div style={{height:1,flex:1,background:RIVET}}/>
        <div style={{fontSize:9,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace"}}>arquero.co — launch preview · {sitePage}</div>
      </div>
      <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${RIVET}`,boxShadow:"0 24px 48px #00000066"}}>
        {/* Browser chrome */}
        <div style={{background:STEEL,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${RIVET}`}}>
          <div style={{display:"flex",gap:5}}>
            {["#ff5f57","#ffbd2e","#28ca41"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
          </div>
          <div style={{flex:1,background:WELD,borderRadius:5,padding:"5px 14px",fontSize:11,color:SMOKE,fontFamily:"'IBM Plex Mono',monospace",display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:GREEN,fontSize:10}}>🔒</span> arquero.co{sitePage!=="home"?`/${sitePage}`:""}
          </div>
          <div style={{fontSize:9,color:ASH,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:1}}>LAUNCH PREVIEW</div>
        </div>
        {/* Website */}
        <div ref={scrollRef} style={{background:S.bg,color:S.text,fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif",maxHeight:680,overflowY:"auto"}}>
          <style>{`
            .aq-nav-links{display:flex;gap:20px;align-items:center}
            .aq-hero-title{font-size:clamp(30px,5vw,68px);font-weight:900;line-height:0.9;letter-spacing:-1px;margin-bottom:16px}
            .aq-hero-sub{font-size:clamp(10px,1.2vw,12px);line-height:1.6;margin-bottom:22px;max-width:400px;color:#888;font-family:'IBM Plex Mono',monospace}
            .aq-hero-inner{padding:0 clamp(18px,4vw,52px);max-width:660px}
            .aq-products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin-bottom:40px}
            .aq-footer-cols{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:18px}
            @media(max-width:600px){
              .aq-nav-links{display:none}
              .aq-products-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
              .aq-hero-inner{padding:0 14px}
            }
          `}</style>
          <SiteNav/>
          {renderPage()}
          <SiteFooter/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function ArqueroHub({ defaultView = "internal", opsMode = true }: { defaultView?: "internal" | "client"; opsMode?: boolean }){
  const [page,setPage]=useState("workflow");
  const [view,setView]=useState<"internal"|"client">(defaultView);
  const tasks = useQuery(api.arqueroTasks.getTasks, { projectId: "arquero-co" }) ?? {};
  const setTaskMutation = useMutation(api.arqueroTasks.setTask);
  const ov=overall(tasks);

  const [theme,setTheme]=useState<"dark"|"light">(() => {
    try { return (localStorage.getItem("arquero-theme") as "dark"|"light") || "dark"; } catch { return "dark"; }
  });
  const toggleTheme = () => setTheme(t => {
    const next = t === "dark" ? "light" : "dark";
    try { localStorage.setItem("arquero-theme", next); } catch {}
    return next;
  });
  const lm = theme === "light";

  // Theme-resolved palette
  const DARK  = lm ? "#fdf8f2" : "#0c0c0e";
  const STEEL = lm ? "#f5f0ea" : "#161618";
  const PLATE = lm ? "#ede8e0" : "#1c1c20";
  const WELD  = lm ? "#e4ddd4" : "#242428";
  const RIVET = lm ? "#cec8be" : "#2e2e33";
  const ASH   = lm ? "#8a7e70" : "#666";
  const SMOKE = lm ? "#6b5f52" : "#999";
  const LIGHT = lm ? "#1a1510" : "#d4d4d4";

  const colors = {O,O2,EMBER,DARK,STEEL,PLATE,WELD,RIVET,ASH,SMOKE,LIGHT,GREEN};

  const css=`
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
    .phase-tab{transition:all 0.2s ease}.phase-tab:hover{border-color:${O}88!important;background:${PLATE}!important}
    .task-row{transition:background 0.15s ease}.task-row:hover{background:#ffffff05}
    .mc{animation:fadeUp 0.3s ease both}
    .s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}.s4{animation-delay:.2s}.s5{animation-delay:.25s}
    *{box-sizing:border-box}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${DARK}}::-webkit-scrollbar-thumb{background:${RIVET};border-radius:3px}
    .nav-btn{transition:all 0.2s ease;position:relative;flex-shrink:0}
    .nav-btn:hover{color:${LIGHT}!important}
    .nav-btn.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:${O};box-shadow:0 0 8px ${O}88}
    .hdr-pad{padding:28px 32px 0}
    .hdr-title{font-size:38px}
    .pg-pad{padding:32px 32px 48px}
    .wf-pad-top{padding:24px 32px 0}
    .wf-pad-phase{padding:20px 32px 0}
    .wf-pad-detail{padding:24px 32px 48px}
    .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .ovv-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
    .row-flex{display:flex;justify-content:space-between;align-items:baseline;padding:10px 16px}
    @media(max-width:768px){
      .hdr-pad{padding:16px 16px 0!important}
      .hdr-title{font-size:26px!important;letter-spacing:1px!important}
      .pg-pad{padding:20px 16px 32px!important}
      .wf-pad-top{padding:16px 16px 0!important}
      .wf-pad-phase{padding:12px 16px 0!important}
      .wf-pad-detail{padding:16px 16px 32px!important}
      .sig-grid{grid-template-columns:1fr!important;gap:16px!important}
    }
    @media(max-width:480px){
      .hdr-title{font-size:20px!important;letter-spacing:0px!important}
      .nav-btn{padding:10px 14px!important;font-size:10px!important;letter-spacing:1px!important}
      .nav-label{display:none}
      .ovv-grid{grid-template-columns:1fr!important}
      .pg-pad{padding:14px 12px 24px!important}
      .wf-pad-top{padding:12px 12px 0!important}
      .wf-pad-phase{padding:10px 12px 0!important}
      .wf-pad-detail{padding:12px 12px 24px!important}
      .row-flex{flex-wrap:wrap!important;gap:4px!important}
    }
  `;

  return(
    <div style={{background:DARK,minHeight:"100vh",color:LIGHT,fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif",position:"relative"}}>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
      <Grain/>

      {/* ═══ HEADER ═══ */}
      <div style={{position:"relative",overflow:"hidden",borderBottom:`2px solid ${O}`,background:`linear-gradient(180deg,${STEEL} 0%,${DARK} 100%)`}}>
        <SparkCanvas/>
        <div className="hdr-pad" style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:O,letterSpacing:5,fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
              <div className="hdr-title" style={{fontWeight:900,color:LIGHT,letterSpacing:2,lineHeight:1}}>ARQUERO CO<span style={{color:O}}>.</span></div>
              <div style={{fontSize:13,fontWeight:400,color:SMOKE,marginTop:4,letterSpacing:1}}>WELDING LIFESTYLE BRAND — PROJECT HUB</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {/* theme toggle — always visible */}
              <button
                onClick={toggleTheme}
                style={{
                  padding:"10px 14px",
                  fontSize:13,
                  fontWeight:700,
                  fontFamily:"'IBM Plex Mono',monospace",
                  background:PLATE,
                  color:LIGHT,
                  border:`1px solid ${RIVET}`,
                  borderRadius:4,
                  cursor:"pointer",
                  letterSpacing:1,
                  transition:"all 0.2s",
                }}
              >
                {lm ? "◐ DARK" : "◑ LIGHT"}
              </button>
              {/* OPS/CLIENT toggle */}
              {page==="workflow"&&opsMode&&(
                <div style={{display:"flex",background:PLATE,borderRadius:4,border:`1px solid ${RIVET}`,overflow:"hidden"}}>
                  {["internal","client"].map(v=>(
                    <button key={v} onClick={()=>setView(v)} style={{padding:"10px 20px",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",border:"none",cursor:"pointer",background:view===v?O:"transparent",color:view===v?"#fff":ASH,transition:"all 0.2s"}}>
                      {v==="internal"?"⚡ OPS":"🪒 CLIENT"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation tabs */}
          <div style={{display:"flex",gap:0,marginTop:20,paddingBottom:0,overflowX:"auto",msOverflowStyle:"none",scrollbarWidth:"none"}}>
            {[
              {key:"workflow",label:"WORKFLOW",icon:"\⚙️"},
              {key:"scope",label:"SCOPE OF WORK",icon:"📋"},
              {key:"agreement",label:"AGREEMENT",icon:"\✍️"},
              {key:"website",label:"ARQUERO.CO",icon:"🌐"},
            ].map(tab=>{
              const active=page===tab.key;
              return(
                <button key={tab.key} className={`nav-btn ${active?"active":""}`} onClick={()=>setPage(tab.key)} style={{
                  padding:"12px 24px",fontSize:12,fontWeight:active?900:500,letterSpacing:active?2:1.5,
                  fontFamily:"'Barlow Condensed',sans-serif",border:"none",cursor:"pointer",
                  background:active?PLATE:"transparent",
                  color:active?O:ASH,
                  borderBottom:"none",
                  borderRadius:active?"6px 6px 0 0":0,
                  opacity:active?1:0.6,
                  transition:"all 0.2s",
                }}>
                  <span className="nav-icon">{tab.icon}</span><span className="nav-label"> {tab.label}</span>
                </button>
              );
            })}
            {page==="workflow"&&(
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,paddingRight:4}}>
                <span style={{fontSize:10,color:ASH,fontFamily:"'IBM Plex Mono',monospace"}}>PROGRESS</span>
                <span style={{fontSize:16,fontWeight:800,color:ov.pct===100?GREEN:O,fontFamily:"'IBM Plex Mono',monospace"}}>{ov.pct}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      {page==="workflow"&&<WorkflowPage view={view} tasks={tasks} onToggle={(key: string)=>setTaskMutation({projectId:"arquero-co",key,value:!tasks[key]})} colors={colors}/>}
      {page==="scope"&&<ScopePage colors={colors}/>}
      {page==="agreement"&&<AgreementPage colors={colors}/>}
      {page==="website"&&<WebsitePage colors={colors}/>}
    </div>
  );
}
