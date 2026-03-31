// @ts-nocheck
import { useState, useEffect, useRef, Component } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { marked } from "marked";

class ErrorBoundary extends Component{
  state={hasError:false,error:null};
  static getDerivedStateFromError(error){return{hasError:true,error}}
  render(){
    if(this.state.hasError){
      return <div style={{padding:40,fontFamily:"Inter,sans-serif",maxWidth:600,margin:"0 auto"}}>
        <div style={{fontSize:18,fontWeight:700,color:"#ef4444",marginBottom:12}}>Something went wrong</div>
        <pre style={{fontSize:11,color:"#64748b",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{String(this.state.error)}</pre>
        <button onClick={()=>window.location.reload()} style={{marginTop:16,padding:"8px 20px",fontSize:12,background:"#2563eb",color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>Reload</button>
      </div>
    }
    return this.props.children;
  }
}

/* ── color system ── */
const BLUE="#2563eb",BLUE2="#3b82f6",NAVY="#1e3a5f",GREEN="#22c55e",EMBER="#ef4444";

const lightColors={
  BLUE,BLUE2,NAVY,GREEN,EMBER,
  BG:"#ffffff",CARD:"#f8fafc",DEEP:"#f1f5f9",INPUT:"#e2e8f0",
  EDGE:"#cbd5e1",SLATE:"#64748b",STONE:"#475569",INK:"#0f172a",
};
const darkColors={
  BLUE,BLUE2,NAVY,GREEN,EMBER,
  BG:"#0f172a",CARD:"#1e293b",DEEP:"#334155",INPUT:"#475569",
  EDGE:"#475569",SLATE:"#94a3b8",STONE:"#cbd5e1",INK:"#f1f5f9",
};

/* ── phases data ── */
const phases=[
  {id:1,name:"BRAND",subtitle:"Brand Discovery + Visual System",week:"WEEKS 1–2",short:"BRAND · KIT",icon:"🎨",
    milestones:[
      {title:"DISCOVERY SESSION",clientDesc:"Define Sydney Spillman & Associates' brand positioning, audience, and visual direction.",
        tasks:[{label:"Complete the Discovery Questionnaire",blocker:true,link:"/discovery"},{label:"Client intake — brand story, values, target audience profile"},{label:"Define brand positioning: where does Sydney Spillman sit in the San Antonio real estate market?"},{label:"Identify tone: professional warmth? modern luxury? community-focused?"},{label:"Competitor audit — 5 comparable San Antonio real estate agents/teams"}]},
      {title:"MOOD + DIRECTION",clientDesc:"Visual direction deck before any design work begins.",
        tasks:[{label:"Build mood board — photography style, color feel, typography direction"},{label:"Present 2 direction options (e.g. modern minimal vs. warm editorial)"},{label:"Get client approval on direction before moving to logo design",blocker:true}]},
      {title:"LOGO DESIGN",clientDesc:"Three concepts refined into a final mark — primary logo, icon, and wordmark.",
        tasks:[{label:"Generate 3 distinct logo concepts (AI-assisted + manual vector refinement)"},{label:"Present concepts with mockups — business cards, signage, social, yard signs"},{label:"Revision round 1 on selected direction"},{label:"Revision round 2 — final polish and lockup variations"},{label:"Export final files: PNG (transparent), SVG (vector), PDF (print-ready)"},{label:"Create icon-only and wordmark-only variants"},{label:"Client approval on final logo package",blocker:true}]},
      {title:"BRAND SYSTEM",clientDesc:"Complete brand kit — colors, fonts, usage rules.",
        tasks:[{label:"Define primary palette — white base + blue accents + warm neutrals"},{label:"Define secondary palette + neutrals with hex codes"},{label:"Select typography — display font (elegant serif) + body font (clean sans)"},{label:"Build brand guidelines PDF: logo usage, minimum sizes, clear space, do's/don'ts"},{label:"Include application examples — business cards, yard signs, social templates, email signatures"},{label:"Deliver complete brand kit to client"},{label:"Client approval on brand system",blocker:true}]},
    ]},
  {id:2,name:"BUILD",subtitle:"Website Development",week:"WEEKS 2–3",short:"DOMAIN · SITE",icon:"⚙️",
    milestones:[
      {title:"DOMAIN SETUP",clientDesc:"Secure the domain and configure DNS for launch.",
        tasks:[{label:"Configure sydneyspillman.com DNS — nameservers, SSL, WHOIS privacy"},{label:"Set up hosting environment and deployment pipeline"},{label:"Send domain confirmation + credentials to client"}]},
      {title:"SITE FOUNDATION",clientDesc:"Platform configured, theme installed, and branded.",
        tasks:[{label:"Set up site platform and development environment"},{label:"Install and configure theme matching brand direction"},{label:"Apply brand colors, typography, and logo placement per guidelines"},{label:"Configure site settings — contact info, social links, metadata"}]},
      {title:"CORE PAGES",clientDesc:"All essential pages built, styled, and populated.",
        tasks:[{label:"Homepage — hero with tagline, featured listings, testimonials preview, about snippet"},{label:"About page — Sydney's bio, experience, mission statement, credentials"},{label:"Listings page — property grid with placeholder listings, beds/baths/sqft/price"},{label:"Contact page — form (name, email, phone, message), office info, phone, email"},{label:"Testimonials page — client reviews (4-5 placeholder testimonials)"}]},
      {title:"PROPERTY FEATURES",clientDesc:"Listing display and search features configured.",
        tasks:[{label:"Receive property images and listing details from client",blocker:true},{label:"Create property listing cards — photo, address, price, beds/baths/sqft"},{label:"Build listing detail page template — gallery, description, features, agent contact"},{label:"Set up listing categories — For Sale, Sold, Coming Soon"},{label:"Configure listing search/filter by price range, beds, area"}]},
      {title:"SEO FOUNDATION",clientDesc:"Search optimization baked into every page from day one.",
        tasks:[{label:"Keyword research — San Antonio real estate, homes for sale, real estate agent terms"},{label:"Write title tags + meta descriptions for all pages"},{label:"Add descriptive alt text to all property and lifestyle images"},{label:"Configure URL structure — clean, keyword-aware slugs"},{label:"Submit XML sitemap to Google Search Console"}]},
    ]},
  {id:3,name:"LAUNCH",subtitle:"QA, Go-Live + Handoff",week:"WEEK 3",short:"QA · HANDOFF",icon:"🚀",
    milestones:[
      {title:"QUALITY ASSURANCE",clientDesc:"Every page and feature tested across devices.",
        tasks:[{label:"Cross-browser testing — Chrome, Safari, Firefox, Edge"},{label:"Mobile responsive QA — iOS Safari, Android Chrome, tablet"},{label:"Test all links, navigation, forms, and interactive elements"},{label:"Page speed audit — optimize images and assets if needed"}]},
      {title:"GO LIVE",clientDesc:"DNS pointed, SSL verified — sydneyspillman.com is live.",
        tasks:[{label:"Final DNS cutover — point sydneyspillman.com to hosting"},{label:"Verify SSL certificate is active and forcing HTTPS"},{label:"Confirm all canonical URLs resolve correctly"},{label:"Verify live site loads correctly on sydneyspillman.com"}]},
      {title:"ANALYTICS + TRACKING",clientDesc:"Google Analytics and Search Console connected.",
        tasks:[{label:"Create and configure Google Analytics 4 property"},{label:"Install GA4 tracking on site"},{label:"Set up Google Search Console — verify domain ownership"},{label:"Verify lead form tracking and conversion events"}]},
      {title:"CLIENT HANDOFF",clientDesc:"Full training, asset delivery, and documentation.",
        tasks:[{label:"Live training session — managing listings, editing pages, updating content"},{label:"Deliver all brand assets: logo files, guidelines PDF, font files"},{label:"Deliver credentials doc — hosting, domain registrar, GA4, GSC"},{label:"Provide quick-reference guide for common site updates"},{label:"48-hour post-launch check-in — fix any issues, answer questions"}]},
    ]},
];

/* ── helpers ── */
function phaseProgress(p,ts){let t=0,d=0;p.milestones.forEach(m=>m.tasks.forEach((_,ti)=>{t++;if(ts[`${p.id}-${m.title}-${ti}`])d++}));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}
function overall(ts){let t=0,d=0;phases.forEach(p=>p.milestones.forEach(m=>m.tasks.forEach((_,ti)=>{t++;if(ts[`${p.id}-${m.title}-${ti}`])d++})));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}

const Bar=({pct,h=6,glow=false,c})=>(
  <div style={{background:c.EDGE+"44",borderRadius:3,height:h,width:"100%",overflow:"hidden"}}>
    <div style={{width:`${pct}%`,height:"100%",borderRadius:3,transition:"width 0.5s cubic-bezier(.4,0,.2,1)",background:pct===100?c.GREEN:`linear-gradient(90deg,${c.BLUE},${c.BLUE2})`,boxShadow:glow&&pct>0&&pct<100?`0 0 12px ${c.BLUE}44`:"none"}}/>
  </div>
);

const Grain=()=>(
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
);

/* ═══════════════════════════════════════
   SCOPE OF WORK PAGE
   ═══════════════════════════════════════ */
function ScopePage({c}){
  const Section=({title,children})=>(
    <div style={{marginBottom:28}}>
      <div style={{fontSize:13,fontWeight:700,color:c.BLUE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>{title}</div>
      {children}
    </div>
  );
  const Row=({label,value,sub})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"10px 16px",background:c.CARD,borderRadius:6,border:`1px solid ${c.EDGE}`,marginBottom:6}}>
      <div><div style={{fontSize:13,fontWeight:700,color:c.INK,letterSpacing:0.5}}>{label}</div>{sub&&<div style={{fontSize:10,color:c.SLATE,marginTop:2,fontFamily:"Inter,sans-serif"}}>{sub}</div>}</div>
      <div style={{fontSize:14,fontWeight:800,color:c.BLUE,fontFamily:"Inter,sans-serif"}}>{value}</div>
    </div>
  );
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:11,color:c.BLUE,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
        <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Scope of Work</div>
        <div style={{fontSize:13,color:c.SLATE,marginTop:4}}>Sydney Spillman & Associates — Real Estate Brand + Website Launch</div>
      </div>

      <Section title="PROJECT OVERVIEW">
        <div style={{fontSize:13,color:c.INK,lineHeight:1.7,fontFamily:"Inter,sans-serif",padding:"0 4px"}}>
          Sydney Spillman & Associates is a real estate brand launching in San Antonio. This engagement covers the full brand-to-launch pipeline: brand identity design, website development, and a production-ready real estate website with property listings. The goal is to deliver a cohesive, launch-ready brand and online presence within 3 weeks.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginTop:14}}>
          {[{l:"CLIENT",v:"Sydney Spillman"},{l:"DOMAIN",v:"sydneyspillman.com"},{l:"TYPE",v:"Real Estate"},{l:"MARKET",v:"San Antonio, TX"}].map(i=>(
            <div key={i.l} style={{background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,padding:"8px 12px"}}>
              <div style={{fontSize:9,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>{i.l}</div>
              <div style={{fontSize:12,color:c.INK,fontWeight:600,marginTop:2}}>{i.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ENGAGEMENT TYPE">
        <div style={{background:c.BLUE+"0c",border:`1px solid ${c.BLUE}22`,borderRadius:8,padding:"16px 20px"}}>
          <div style={{fontSize:14,fontWeight:700,color:c.INK,marginBottom:4}}>Pro Bono / In-House</div>
          <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",lineHeight:1.6}}>
            This project is an in-house engagement — no client invoicing. Full brand + website deliverables provided at no cost.
          </div>
        </div>
      </Section>

      <Section title="PHASE DELIVERABLES">
        {phases.map(p=>(
          <div key={p.id} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:800,color:c.INK,letterSpacing:1,marginBottom:8}}>
              <span style={{color:c.BLUE,marginRight:8}}>PHASE {p.id}</span>{p.name} — {p.subtitle}
            </div>
            {p.milestones.map(m=>(
              <div key={m.title} style={{marginBottom:8,paddingLeft:16}}>
                <div style={{fontSize:11,fontWeight:700,color:c.INK,marginBottom:4}}>{m.title}</div>
                {m.tasks.map((t,i)=>(
                  <div key={i} style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",paddingLeft:12,lineHeight:1.8}}>
                    • {t.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Section>

      <Section title="ESTIMATED TIMELINE">
        {[{p:"Phase 1",n:"Brand Discovery + Visual System",t:"Weeks 1–2"},{p:"Phase 2",n:"Website Development",t:"Weeks 2–3"},{p:"Phase 3",n:"QA, Go-Live + Handoff",t:"Week 3"}].map(i=>(
          <div key={i.p} style={{display:"flex",justifyContent:"space-between",padding:"8px 16px",borderBottom:`1px solid ${c.EDGE}`}}>
            <div><span style={{fontSize:11,color:c.BLUE,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:10}}>{i.p}</span><span style={{fontSize:13,color:c.INK}}>{i.n}</span></div>
            <span style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{i.t}</span>
          </div>
        ))}
      </Section>

      <Section title="TERMS">
        {[
          {l:"Engagement",b:"This is a pro bono / in-house project. No payment is required. Deliverables are provided as a courtesy."},
          {l:"Revisions",b:"Revision rounds are included as noted per phase. Additional revisions accommodated within reason."},
          {l:"Client Responsibilities",b:"Client is responsible for providing property photos, bio content, testimonials, and review feedback. Delays in client input may extend delivery."},
          {l:"Ownership",b:"Client retains full ownership of all deliverables — brand assets, website, content, and documentation."},
          {l:"Third-Party Costs",b:"Domain registration and hosting costs (if any) are paid by client. Estimated: $12–$20/yr for domain."},
        ].map(t=>(
          <div key={t.l} style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:c.BLUE,letterSpacing:1,marginBottom:2}}>{t.l}</div>
            <div style={{fontSize:11,color:c.INK,lineHeight:1.6,fontFamily:"Inter,sans-serif",paddingLeft:8}}>{t.b}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE (SIGNABLE — SIMPLIFIED)
   ═══════════════════════════════════════ */
const DEV_MODE=new URLSearchParams(window.location.search).has("dev");

function AgreementPage({c}){
  const canvasRef=useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [signed,setSigned]=useState(DEV_MODE);
  const [signedDate,setSignedDate]=useState<string|null>(DEV_MODE?new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):null);
  const [sigData,setSigData]=useState<string|null>(DEV_MODE?"data:image/png;base64,DEV":null);
  const [saving,setSaving]=useState(false);

  const saveAgreementMutation=useMutation(api.sydneyTasks.saveAgreement);
  const existingAgreement=useQuery(api.sydneyTasks.getAgreement,{projectId:"sydney-spillman"});

  useEffect(()=>{
    if(DEV_MODE||!existingAgreement)return;
    setSigned(true);
    setSigData(existingAgreement.sigData);
    setSignedDate(existingAgreement.signedDate);
  },[existingAgreement]);

  const startDraw=(e)=>{
    const cv=canvasRef.current;if(!cv)return;
    setDrawing(true);const ctx=cv.getContext("2d");
    const rect=cv.getBoundingClientRect();
    ctx.beginPath();ctx.moveTo((e.touches?e.touches[0].clientX:e.clientX)-rect.left,(e.touches?e.touches[0].clientY:e.clientY)-rect.top);
  };
  const draw=(e)=>{
    if(!drawing)return;const cv=canvasRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");const rect=cv.getBoundingClientRect();
    ctx.strokeStyle=c.INK;ctx.lineWidth=2;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.lineTo((e.touches?e.touches[0].clientX:e.clientX)-rect.left,(e.touches?e.touches[0].clientY:e.clientY)-rect.top);
    ctx.stroke();
  };
  const endDraw=()=>{setDrawing(false)};
  const clearSig=()=>{
    const cv=canvasRef.current;if(!cv)return;
    cv.getContext("2d").clearRect(0,0,cv.width,cv.height);
    setSigned(false);setSigData(null);setSignedDate(null);
  };
  const confirmSig=async()=>{
    const cv=canvasRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");
    const d=ctx.getImageData(0,0,cv.width,cv.height).data;
    let hasContent=false;
    for(let i=3;i<d.length;i+=4){if(d[i]>0){hasContent=true;break}}
    if(!hasContent)return;
    const data=cv.toDataURL();
    const date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    setSigData(data);setSigned(true);setSignedDate(date);
    if(!DEV_MODE){
      setSaving(true);
      try{
        await saveAgreementMutation({projectId:"sydney-spillman",sigData:data,signedDate:date,signedAt:Date.now()});
      }finally{setSaving(false);}
    }
  };

  const downloadDoc=(title,htmlContent)=>{
    const w=window.open("","_blank","width=900,height=1200");
    if(!w)return;
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,'Segoe UI',sans-serif;background:#fff;color:#0f172a;padding:40px;max-width:720px;margin:0 auto}@media print{body{padding:20px}}</style>
</head><body>${htmlContent}</body></html>`);
    w.document.close();w.focus();setTimeout(()=>{w.print();},400);
  };
  const downloadAgreementPdf=()=>{
    const el=document.getElementById("agreement-printable");
    if(el)downloadDoc("Service Agreement — Sydney Spillman & Associates",el.innerHTML);
  };

  const today=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  const scopePhases=[
    {p:"Phase 1",n:"Brand Discovery + Visual System",when:"Weeks 1–2",desc:"Logo design (3 concepts, 2 revision rounds), color palette, typography selection, and brand guidelines PDF."},
    {p:"Phase 2",n:"Website Development",when:"Weeks 2–3",desc:"Domain configuration. Website setup and customization. Core pages (Home, About, Listings, Contact, Testimonials). Property listing features, search/filter, and on-page SEO."},
    {p:"Phase 3",n:"QA, Go-Live + Handoff",when:"Week 3",desc:"Full QA, DNS cutover, GA4 + GSC setup, client training session, and full asset handoff."},
  ];

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>

      {/* ── SIGNED STATE: success banner + download ── */}
      {signed&&(
        <div style={{background:c.GREEN+"0c",border:`1.5px solid ${c.GREEN}33`,borderRadius:10,padding:"28px 24px",textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:32,marginBottom:8}}>✓</div>
          <div style={{fontSize:20,fontWeight:900,color:c.GREEN,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Agreement Signed</div>
          <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:6}}>Service agreement confirmed — {signedDate}</div>
          <div style={{marginTop:20}}>
            <button onClick={downloadAgreementPdf} style={{padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:c.BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>
              ↓ DOWNLOAD AGREEMENT PDF
            </button>
          </div>
        </div>
      )}

      {/* ── Printable agreement ── */}
      <div style={{position:"relative",borderRadius:8,overflow:"hidden"}}>
        {signed&&(
          <div style={{position:"absolute",inset:0,background:c.BG+"88",zIndex:10,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:"16px",pointerEvents:"none"}}>
            <div style={{fontSize:10,fontWeight:700,color:c.GREEN,background:c.GREEN+"14",border:`1px solid ${c.GREEN}33`,padding:"4px 12px",borderRadius:3,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>
              SIGNED
            </div>
          </div>
        )}

        <div id="agreement-printable" style={{opacity:signed?0.5:1,transition:"opacity 0.4s",pointerEvents:signed?"none":"auto"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:11,color:c.BLUE,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
            <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Service Agreement</div>
            <div style={{fontSize:13,color:c.SLATE,marginTop:4}}>
              Sydney Spillman & Associates — Real Estate Brand + Website Launch
              <span style={{marginLeft:8,fontSize:10,fontWeight:700,color:c.BLUE,background:c.BLUE+"12",padding:"2px 8px",borderRadius:3,letterSpacing:1.5,verticalAlign:"middle"}}>
                PRO BONO
              </span>
            </div>
          </div>

          <div style={{background:c.CARD,borderRadius:8,border:`1px solid ${c.EDGE}`,padding:"20px 24px",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12}}>PARTIES</div>
            {[{l:"Service Provider",v:"Anthony Tatis (Anthony's Brand Builder)"},{l:"Client",v:"Sydney Spillman & Associates"},{l:"Date",v:today}].map(r=>(
              <div key={r.l} style={{display:"flex",gap:16,marginBottom:6}}>
                <span style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",width:120,flexShrink:0}}>{r.l}</span>
                <span style={{fontSize:12,color:c.INK,fontWeight:500}}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>SCOPE OF WORK</div>
            {scopePhases.map(s=>(
              <div key={s.p} style={{padding:"10px 0",borderBottom:`1px solid ${c.EDGE}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <div><span style={{fontSize:10,color:c.BLUE,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:8}}>{s.p}</span><span style={{fontSize:12,fontWeight:700,color:c.INK}}>{s.n}</span></div>
                  <span style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{s.when}</span>
                </div>
                <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:4,paddingLeft:4}}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>ENGAGEMENT TYPE</div>
            <div style={{fontSize:11,color:c.INK,lineHeight:1.7,fontFamily:"Inter,sans-serif",paddingLeft:4}}>
              This is a pro bono / in-house engagement. No payment is required. All brand and website deliverables are provided at no cost. The client retains full ownership of all assets upon completion.
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>TIMELINE</div>
            {[{p:"Phase 1",n:"Brand Discovery + Visual System",t:"Weeks 1–2"},{p:"Phase 2",n:"Website Development",t:"Weeks 2–3"},{p:"Phase 3",n:"QA, Go-Live + Handoff",t:"Week 3"}].map(i=>(
              <div key={i.p} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${c.EDGE}`}}>
                <div><span style={{fontSize:10,color:c.BLUE,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:8}}>{i.p}</span><span style={{fontSize:12,color:c.INK}}>{i.n}</span></div>
                <span style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{i.t}</span>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>TERMS</div>
            {[
              {l:"Engagement",b:"This is a pro bono / in-house project. No payment is required."},
              {l:"Revisions",b:"Revision rounds are included as noted per phase. Additional revisions accommodated within reason."},
              {l:"Client Responsibilities",b:"Client is responsible for providing property photos, bio content, testimonials, and review feedback. Delays may extend delivery."},
              {l:"Ownership",b:"Client retains full ownership of all deliverables — brand assets, website, content, and documentation."},
              {l:"Cancellation",b:"Either party may cancel with written notice. No financial obligations."},
            ].map(t=>(
              <div key={t.l} style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:c.BLUE,letterSpacing:1,marginBottom:2}}>{t.l}</div>
                <div style={{fontSize:11,color:c.INK,lineHeight:1.6,fontFamily:"Inter,sans-serif",paddingLeft:8}}>{t.b}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>ACKNOWLEDGEMENT</div>
            <div style={{fontSize:11,color:c.SLATE,lineHeight:1.7,fontFamily:"Inter,sans-serif"}}>
              By signing below, both parties confirm they have read and agree to the terms outlined in this agreement. This document serves as a binding service agreement between Anthony Tatis and Sydney Spillman & Associates.
            </div>
          </div>

          {/* Signature blocks */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div>
              <div style={{fontSize:10,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif",marginBottom:8}}>SERVICE PROVIDER</div>
              <div style={{background:c.CARD,border:`1px solid ${c.GREEN}33`,borderRadius:8,padding:"16px 20px"}}>
                <div style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:400,fontStyle:"italic",color:c.INK,marginBottom:8}}>Anthony Tatis</div>
                <div style={{borderTop:`1px solid ${c.EDGE}`,paddingTop:8}}>
                  <div style={{fontSize:11,fontWeight:600,color:c.INK}}>Anthony Tatis</div>
                  <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>Anthony's Brand Builder</div>
                  <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{today}</div>
                </div>
                <div style={{display:"inline-block",marginTop:8,fontSize:9,fontWeight:700,color:c.GREEN,background:c.GREEN+"14",padding:"3px 10px",borderRadius:3,letterSpacing:1.5}}>SIGNED</div>
              </div>
            </div>
            <div>
              <div style={{fontSize:10,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif",marginBottom:8}}>CLIENT</div>
              <div style={{background:c.CARD,border:`1px solid ${signed?c.GREEN+"33":c.BLUE+"33"}`,borderRadius:8,padding:"16px 20px"}}>
                {signed?(
                  <>
                    {sigData&&sigData.startsWith("data:image")?(
                      <img src={sigData} alt="signature" style={{height:50,marginBottom:8}}/>
                    ):(
                      <div style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:400,fontStyle:"italic",color:c.INK,marginBottom:8}}>Sydney Spillman</div>
                    )}
                    <div style={{borderTop:`1px solid ${c.EDGE}`,paddingTop:8}}>
                      <div style={{fontSize:11,fontWeight:600,color:c.INK}}>Sydney Spillman</div>
                      <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{signedDate}</div>
                    </div>
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:9,fontWeight:700,color:c.GREEN,background:c.GREEN+"14",padding:"3px 10px",borderRadius:3,letterSpacing:1.5,display:"inline-block"}}>SIGNED</div>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{fontSize:11,color:c.SLATE,marginBottom:8,fontFamily:"Inter,sans-serif"}}>Sign below to accept</div>
                    <canvas
                      ref={canvasRef} width={280} height={80}
                      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                      onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                      style={{width:"100%",height:80,background:c.DEEP,borderRadius:4,border:`1px dashed ${c.EDGE}`,cursor:"crosshair",touchAction:"none"}}
                    />
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={confirmSig} disabled={saving} style={{flex:1,padding:"8px 0",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",background:c.BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",opacity:saving?0.7:1}}>
                        {saving?"SAVING…":"CONFIRM SIGNATURE"}
                      </button>
                      <button onClick={clearSig} style={{padding:"8px 14px",fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",background:"transparent",color:c.SLATE,border:`1px solid ${c.EDGE}`,borderRadius:4,cursor:"pointer",letterSpacing:1}}>CLEAR</button>
                    </div>
                    <div style={{borderTop:`1px solid ${c.EDGE}`,paddingTop:8,marginTop:10}}>
                      <div style={{fontSize:11,fontWeight:600,color:c.SLATE}}>Sydney Spillman</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{textAlign:"center",marginTop:32,fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>
            Anthony's Brand Builder · Anthony Tatis · tatis.anthony@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MILESTONE DELIVERABLES
   ═══════════════════════════════════════ */
/* ─── Doc Viewer Modal ─────────────────────────────────────────────────────── */
function DocViewer({d,c,onClose}){
  const slides=d.markdownContent?(d.markdownContent.split(/\n---\n/).filter(s=>s.trim())):null;
  const isSlides=slides&&slides.length>1;
  const [slide,setSlide]=useState(0);
  const [viewMode,setViewMode]=useState(isSlides?"slides":"doc"); // "doc"|"slides"

  const renderHtml=(md)=>{
    marked.setOptions({breaks:true,gfm:true});
    return marked.parse(md||"");
  };

  const downloadMd=()=>{
    const blob=new Blob([d.markdownContent],{type:"text/markdown"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=d.label.replace(/[^a-z0-9]+/gi,"-").toLowerCase()+".md";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const isPdf=(u)=>u&&u.toLowerCase().endsWith(".pdf");
  const isImg=(u)=>u&&(/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(u)||u.includes("screenshot")||u.includes("imgur")||u.includes("cloudinary"));
  const isContent=!!(d.markdownContent&&d.markdownContent.length>0);

  // Markdown prose styles injected via a style tag rendered inside the viewer
  const proseStyles=`
    .doc-prose{font-family:'Inter',sans-serif;font-size:14px;line-height:1.8;color:${c.INK};}
    .doc-prose h1{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:${c.INK};margin:0 0 16px;letter-spacing:-0.3px;border-bottom:2px solid ${c.BLUE}22;padding-bottom:10px;}
    .doc-prose h2{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:${c.INK};margin:28px 0 10px;letter-spacing:-0.2px;}
    .doc-prose h3{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;color:${c.BLUE};text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;}
    .doc-prose p{margin:0 0 14px;}
    .doc-prose strong{font-weight:700;color:${c.INK};}
    .doc-prose em{font-style:italic;color:${c.STONE};}
    .doc-prose ul,.doc-prose ol{margin:0 0 14px;padding-left:22px;}
    .doc-prose li{margin-bottom:5px;}
    .doc-prose a{color:${c.BLUE};text-decoration:underline;}
    .doc-prose blockquote{border-left:3px solid ${c.BLUE};margin:0 0 14px;padding:10px 16px;background:${c.BLUE}08;color:${c.STONE};font-style:italic;border-radius:0 6px 6px 0;}
    .doc-prose code{font-family:'Courier New',monospace;font-size:12px;background:${c.DEEP};padding:2px 6px;border-radius:3px;color:${c.NAVY};}
    .doc-prose pre{background:${c.DEEP};border:1px solid ${c.EDGE};border-radius:6px;padding:14px 16px;overflow-x:auto;margin:0 0 14px;}
    .doc-prose pre code{background:none;padding:0;}
    .doc-prose table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:13px;}
    .doc-prose th{background:${c.BLUE}10;color:${c.NAVY};font-weight:700;text-align:left;padding:8px 12px;border-bottom:2px solid ${c.BLUE}33;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;}
    .doc-prose td{padding:8px 12px;border-bottom:1px solid ${c.EDGE};vertical-align:top;}
    .doc-prose tr:last-child td{border-bottom:none;}
    .doc-prose img{max-width:100%;border-radius:8px;margin:8px 0;}
    .doc-prose hr{border:none;border-top:1px solid ${c.EDGE};margin:24px 0;}
    .slide-prose{display:flex;flex-direction:column;justify-content:center;min-height:340px;padding:32px 40px;}
    .slide-prose h1{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:${c.INK};margin:0 0 20px;text-align:center;}
    .slide-prose h2{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:${c.INK};margin:0 0 14px;}
    .slide-prose h3{font-size:11px;font-weight:700;color:${c.BLUE};text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;}
    .slide-prose p{font-size:15px;line-height:1.7;margin:0 0 12px;color:${c.INK};}
    .slide-prose ul,.slide-prose ol{padding-left:20px;margin:0 0 12px;}
    .slide-prose li{font-size:14px;line-height:1.6;margin-bottom:6px;}
    .slide-prose strong{font-weight:700;}
    .slide-prose table{width:100%;border-collapse:collapse;font-size:13px;margin:0 0 12px;}
    .slide-prose th{background:${c.BLUE}10;color:${c.NAVY};font-weight:700;padding:7px 10px;border-bottom:2px solid ${c.BLUE}33;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
    .slide-prose td{padding:7px 10px;border-bottom:1px solid ${c.EDGE};}
    .slide-prose blockquote{border-left:3px solid ${c.BLUE};padding:10px 16px;background:${c.BLUE}08;color:${c.STONE};font-style:italic;border-radius:0 6px 6px 0;margin:0 0 12px;}
  `;

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{proseStyles}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:c.BG,borderRadius:14,width:"100%",maxWidth:820,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${c.EDGE}`,boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>

        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${c.EDGE}`,display:"flex",alignItems:"center",gap:12,flexShrink:0,background:c.CARD}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:15,fontFamily:"'Playfair Display',serif",color:c.INK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
            <div style={{fontSize:9,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:1,letterSpacing:1}}>
              {isContent?"DOCUMENT":isPdf(d.url)?"PDF":isImg(d.url)?"IMAGE":"LINK"} · {new Date(d.addedAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>
          {isContent&&isSlides&&(
            <div style={{display:"flex",background:c.DEEP,borderRadius:4,overflow:"hidden",border:`1px solid ${c.EDGE}`,flexShrink:0}}>
              {[["doc","Document"],["slides","Slides"]].map(([v,l])=>(
                <button key={v} onClick={()=>{setViewMode(v);setSlide(0)}} style={{padding:"4px 12px",fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",background:viewMode===v?c.BLUE:"transparent",color:viewMode===v?"#fff":c.SLATE,border:"none",cursor:"pointer"}}>{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          {isContent&&(
            <button onClick={downloadMd} style={{fontSize:10,fontWeight:700,letterSpacing:0.5,fontFamily:"Inter,sans-serif",padding:"5px 12px",background:c.BLUE+"0c",color:c.BLUE,border:`1px solid ${c.BLUE}33`,borderRadius:4,cursor:"pointer",flexShrink:0}}>↓ .md</button>
          )}
          <button onClick={onClose} style={{fontSize:18,color:c.SLATE,background:"none",border:"none",cursor:"pointer",lineHeight:1,padding:"0 4px",flexShrink:0}}>×</button>
        </div>

        {/* Body */}
        {isContent&&viewMode==="doc"&&(
          <div style={{overflowY:"auto",flex:1,padding:"28px 36px"}}>
            <div className="doc-prose" dangerouslySetInnerHTML={{__html:renderHtml(d.markdownContent)}}/>
          </div>
        )}

        {isContent&&viewMode==="slides"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Slide area */}
            <div style={{flex:1,overflowY:"auto",background:c.BG}}>
              <div className="doc-prose slide-prose" dangerouslySetInnerHTML={{__html:renderHtml(slides[slide])}}/>
            </div>
            {/* Slide nav */}
            <div style={{borderTop:`1px solid ${c.EDGE}`,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:c.CARD,flexShrink:0}}>
              <button onClick={()=>setSlide(s=>Math.max(0,s-1))} disabled={slide===0} style={{fontSize:18,background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,color:slide===0?c.EDGE:c.SLATE,cursor:slide===0?"default":"pointer",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {slides.map((_,i)=>(
                  <button key={i} onClick={()=>setSlide(i)} style={{width:i===slide?20:7,height:7,borderRadius:4,background:i===slide?c.BLUE:c.EDGE,border:"none",cursor:"pointer",transition:"all 0.2s",padding:0}}/>
                ))}
              </div>
              <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} disabled={slide===slides.length-1} style={{fontSize:18,background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,color:slide===slides.length-1?c.EDGE:c.SLATE,cursor:slide===slides.length-1?"default":"pointer",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </div>
          </div>
        )}

        {/* Image viewer */}
        {!isContent&&isImg(d.url)&&(
          <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",alignItems:"center",padding:24,gap:16,background:c.DEEP}}>
            <img src={d.url} alt={d.label} style={{maxWidth:"100%",maxHeight:"60vh",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",objectFit:"contain"}}/>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 18px",background:c.BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none"}}>↗ OPEN FULL SIZE</a>
          </div>
        )}

        {/* PDF / link viewer */}
        {!isContent&&!isImg(d.url)&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:40}}>
            <div style={{fontSize:40}}>{isPdf(d.url)?"📄":"🔗"}</div>
            <div style={{fontSize:14,fontWeight:600,color:c.INK,fontFamily:"Inter,sans-serif",textAlign:"center"}}>{d.label}</div>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"8px 24px",background:c.BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none"}}>↗ OPEN {isPdf(d.url)?"PDF":"LINK"}</a>
          </div>
        )}

      </div>
    </div>
  );
}

function MilestoneDeliverables({milestoneKey,c,isOps,deliverables,onAdd,onRemove}){
  const [adding,setAdding]=useState(false);
  const [addMode,setAddMode]=useState("url");
  const [label,setLabel]=useState("");
  const [url,setUrl]=useState("");
  const [type,setType]=useState("screenshot");
  const [mdContent,setMdContent]=useState("");
  const [viewing,setViewing]=useState(null);

  const items=(deliverables||[]).filter(d=>d.milestoneKey===milestoneKey);

  const submit=()=>{
    if(!label.trim())return;
    if(addMode==="url"){
      if(!url.trim())return;
      onAdd({milestoneKey,label:label.trim(),url:url.trim(),type});
    } else {
      if(!mdContent.trim())return;
      onAdd({milestoneKey,label:label.trim(),url:"",type:"md",markdownContent:mdContent.trim()});
    }
    setLabel("");setUrl("");setType("screenshot");setMdContent("");setAdding(false);
  };

  const isPdf=(u)=>u&&u.toLowerCase().endsWith(".pdf");
  const isImg=(u)=>u&&(/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(u)||u.includes("screenshot")||u.includes("imgur")||u.includes("cloudinary"));

  const btnSm=(active)=>({fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",padding:"3px 8px",borderRadius:3,cursor:"pointer",border:`1px solid ${active?c.BLUE+"44":c.EDGE}`,background:active?c.BLUE+"0c":"transparent",color:active?c.BLUE:c.SLATE});

  return(
    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${c.EDGE}44`}}>
      {/* Viewer modal */}
      {viewing&&<DocViewer d={viewing} c={c} onClose={()=>setViewing(null)}/>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{fontSize:9,fontWeight:700,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>DELIVERABLES</div>
        {isOps&&!adding&&(
          <button onClick={()=>setAdding(true)} style={{fontSize:10,fontWeight:600,color:c.BLUE,background:c.BLUE+"0c",border:`1px solid ${c.BLUE}22`,borderRadius:4,padding:"3px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:0.5}}>+ ADD</button>
        )}
      </div>

      {items.length===0&&!adding&&(
        <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",fontStyle:"italic",padding:"4px 0"}}>No deliverables yet</div>
      )}

      {items.map(d=>{
        const isContent=!!(d.markdownContent&&d.markdownContent.length>0);
        const isImgUrl=!isContent&&isImg(d.url);
        const isPdfUrl=!isContent&&isPdf(d.url);
        const typeLabel=isContent?"DOC":isImgUrl?"IMG":isPdfUrl?"PDF":"URL";
        const typeBg=isContent?c.NAVY+"14":isImgUrl?c.GREEN+"14":isPdfUrl?c.EMBER+"14":c.BLUE+"14";
        const typeColor=isContent?c.NAVY:isImgUrl?c.GREEN:isPdfUrl?c.EMBER:c.BLUE;
        return(
          <div key={d._id} onClick={()=>setViewing(d)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:c.CARD,borderRadius:8,marginBottom:6,border:`1px solid ${c.EDGE}`,cursor:"pointer",transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=c.BLUE+"44"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=c.EDGE}>
            {/* Type badge */}
            <div style={{width:36,height:36,borderRadius:6,background:typeBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${typeColor}22`}}>
              <span style={{fontSize:9,fontWeight:800,color:typeColor,fontFamily:"Inter,sans-serif",letterSpacing:0.5}}>{typeLabel}</span>
            </div>
            {/* Info */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:c.INK,fontFamily:"Inter,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
              <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:2}}>
                {isContent?"Agent document · Click to read":isImgUrl?"Image · Click to view":isPdfUrl?"PDF Document · Click to open":"External link · Click to open"}
                {" · "}{new Date(d.addedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
              </div>
            </div>
            {/* Arrow */}
            <div style={{fontSize:14,color:c.SLATE,flexShrink:0}}>›</div>
            {isOps&&(
              <button onClick={e=>{e.stopPropagation();onRemove(d._id)}} style={{fontSize:14,color:c.SLATE,background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:3,lineHeight:1,flexShrink:0}} title="Remove">×</button>
            )}
          </div>
        );
      })}

      {adding&&(
        <div style={{background:c.DEEP,borderRadius:6,padding:"12px 14px",border:`1px solid ${c.BLUE}22`,marginTop:4}}>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <button onClick={()=>setAddMode("url")} style={btnSm(addMode==="url")}>URL / File</button>
            <button onClick={()=>setAddMode("content")} style={btnSm(addMode==="content")}>Paste Content</button>
          </div>
          {addMode==="url"&&(
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {[{v:"screenshot",l:"Screenshot"},{v:"pdf",l:"PDF"},{v:"link",l:"Link"}].map(o=>(
                <button key={o.v} onClick={()=>setType(o.v)} style={{fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"4px 10px",borderRadius:3,cursor:"pointer",border:`1px solid ${type===o.v?c.BLUE+"44":c.EDGE}`,background:type===o.v?c.BLUE+"0c":"transparent",color:type===o.v?c.BLUE:c.SLATE}}>{o.l}</button>
              ))}
            </div>
          )}
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. Competitor Audit)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:6}}/>
          {addMode==="url"?(
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL (paste link to image, PDF, or page)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
          ):(
            <textarea value={mdContent} onChange={e=>setMdContent(e.target.value)} placeholder="Paste markdown content here…" rows={8} style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:11,fontFamily:"'Courier New',monospace",outline:"none",boxSizing:"border-box",marginBottom:8,resize:"vertical",lineHeight:1.6}}/>
          )}
          <div style={{display:"flex",gap:6}}>
            <button onClick={submit} style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 16px",background:c.BLUE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>SAVE</button>
            <button onClick={()=>{setAdding(false);setLabel("");setUrl("");setMdContent("");}} style={{fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",padding:"6px 12px",background:"transparent",color:c.SLATE,border:`1px solid ${c.EDGE}`,borderRadius:4,cursor:"pointer"}}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   WORKFLOW PAGE
   ═══════════════════════════════════════ */
function WorkflowPage({view,tasks,onToggle,c,deliverables,onAddDeliverable,onRemoveDeliverable}){
  const [activePhase,setActivePhase]=useState(1);
  const [expanded,setExpanded]=useState({});
  useEffect(()=>{const a={};phases.forEach(p=>p.milestones.forEach(m=>{a[`${p.id}-${m.title}`]=true}));setExpanded(a)},[]);
  const toggle=(key)=>{if(view==="internal")onToggle(key)};
  const toggleM=(key)=>setExpanded(p=>({...p,[key]:!p[key]}));
  const ov=overall(tasks);
  const phase=phases.find(p=>p.id===activePhase);

  return(
    <div>
      {/* Overall */}
      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:700,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>PROJECT COMPLETION</span>
          <span style={{fontFamily:"Inter,sans-serif"}}>
            <span style={{fontSize:28,fontWeight:700,color:ov.pct===100?c.GREEN:c.BLUE}}>{ov.pct}%</span>
            <span style={{fontSize:11,color:c.SLATE,marginLeft:8}}>{ov.done}/{ov.total}</span>
          </span>
        </div>
        <Bar pct={ov.pct} h={10} glow c={c}/>
      </div>

      {/* Phase tabs */}
      <div style={{padding:"20px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
        {phases.map(p=>{
          const prog=phaseProgress(p,tasks);const active=activePhase===p.id;const done=prog.pct===100;
          return(
            <button key={p.id} onClick={()=>setActivePhase(p.id)} style={{
              padding:"14px 16px",textAlign:"left",cursor:"pointer",fontFamily:"Inter,sans-serif",
              background:active?c.CARD:c.BG,borderRadius:8,border:`1.5px solid ${active?c.BLUE:done?c.GREEN+"44":c.EDGE}`,position:"relative",overflow:"hidden",
            }}>
              {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c.BLUE}}/>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:20}}>{p.icon}</span>
                <span style={{fontSize:11,fontWeight:700,fontFamily:"Inter,sans-serif",color:done?c.GREEN:active?c.BLUE:c.SLATE}}>{prog.pct}%</span>
              </div>
              <div style={{fontSize:13,fontWeight:800,color:active?c.INK:c.SLATE,letterSpacing:1.5,marginTop:6}}>{p.name}</div>
              <div style={{fontSize:10,color:c.SLATE,marginTop:2,fontFamily:"Inter,sans-serif"}}>PHASE {p.id} — {p.short}</div>
              <div style={{marginTop:8}}><Bar pct={prog.pct} h={3} c={c}/></div>
            </button>
          );
        })}
      </div>

      {/* Phase detail */}
      {phase&&(
        <div style={{padding:"0 24px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,paddingBottom:16,borderBottom:`1px solid ${c.EDGE}`,marginBottom:20}}>
            <div>
              <span style={{fontSize:11,fontWeight:600,color:c.BLUE,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>PHASE {phase.id}</span>
              <span style={{fontSize:24,fontWeight:900,color:c.INK,letterSpacing:1,marginLeft:12,fontFamily:"'Playfair Display',serif"}}>{phase.name}</span>
              <div style={{fontSize:13,color:c.SLATE,marginTop:2,letterSpacing:0.5}}>{phase.subtitle}</div>
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
                <div key={m.title} style={{background:c.CARD,borderRadius:8,overflow:"hidden",border:`1px solid ${complete?c.GREEN+"33":hasBlocker?c.EMBER+"33":c.EDGE}`}}>
                  <div onClick={()=>toggleM(`${phase.id}-${m.title}`)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:complete?c.GREEN+"06":"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <div style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:complete?c.GREEN+"14":c.DEEP,border:`1px solid ${complete?c.GREEN+"33":c.EDGE}`,fontSize:12,fontWeight:700,color:complete?c.GREEN:c.BLUE,fontFamily:"Inter,sans-serif",flexShrink:0}}>
                        {complete?"✓":`${mi+1}`}
                      </div>
                      <div>
                        <div style={{fontSize:15,fontWeight:800,color:complete?c.GREEN:c.INK,letterSpacing:1.5}}>
                          {m.title}
                          {hasBlocker&&<span style={{fontSize:8,fontWeight:700,color:c.EMBER,background:c.EMBER+"14",padding:"2px 8px",borderRadius:3,marginLeft:10,letterSpacing:1.5,verticalAlign:"middle"}}>HAS BLOCKER</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0,marginLeft:12}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:14,fontWeight:700,color:complete?c.GREEN:c.BLUE,fontFamily:"Inter,sans-serif"}}>{mPct}%</div>
                        <div style={{fontSize:9,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{mDone}/{m.tasks.length}</div>
                      </div>
                      <div style={{fontSize:14,color:c.SLATE,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0deg)"}}>▾</div>
                    </div>
                  </div>
                  <div style={{padding:"0 20px 2px"}}><Bar pct={mPct} h={3} c={c}/></div>
                  {exp&&(
                    <div style={{padding:"8px 20px 16px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:2}}>
                        {m.tasks.map((t,ti)=>{
                          const key=`${phase.id}-${m.title}-${ti}`;const checked=!!tasks[key];const isOps=view==="internal";
                          return(
                            <div key={ti} onClick={()=>{if(isOps)toggle(key)}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 10px",borderRadius:4,cursor:isOps?"pointer":"default",background:checked?c.GREEN+"06":"transparent"}}>
                              <div style={{width:16,height:16,borderRadius:3,flexShrink:0,marginTop:1,border:`1.5px solid ${checked?c.GREEN:c.EDGE}`,background:checked?c.GREEN:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                                {checked&&<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span style={{fontSize:12,fontFamily:"Inter,sans-serif",fontWeight:400,color:checked?c.GREEN:c.INK,textDecoration:checked?"line-through":"none",opacity:checked?0.65:1,lineHeight:1.4}}>
                                {t.link?(
                                  <a href={t.link} style={{color:checked?c.GREEN:c.BLUE,textDecoration:"underline",fontWeight:500}} onClick={e=>e.stopPropagation()}>{t.label}</a>
                                ):t.label}
                                {t.blocker&&!checked&&<span style={{fontSize:8,fontWeight:700,color:c.EMBER,background:c.EMBER+"12",padding:"1px 7px",borderRadius:3,marginLeft:8,letterSpacing:1.5}}>BLOCKER</span>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <MilestoneDeliverables milestoneKey={`${phase.id}-${m.title}`} c={c} isOps={view==="internal"} deliverables={deliverables} onAdd={onAddDeliverable} onRemove={onRemoveDeliverable}/>
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
   WEBSITE MOCKUP PAGE (REAL ESTATE)
   ═══════════════════════════════════════ */
function WebsitePage({c}){
  const [sitePage,setSitePage]=useState("home");
  const [contactForm,setContactForm]=useState({name:"",email:"",phone:"",message:""});
  const [contactSent,setContactSent]=useState(false);
  const scrollRef=useRef<HTMLDivElement>(null);

  const S={bg:"#fafbfc",nav:"#ffffff",card:"#ffffff",border:"#e2e8f0",text:"#0f172a",muted:"#64748b",accent:BLUE};

  const listings=[
    {id:1,addr:"4821 Elm Creek Dr",city:"San Antonio, TX 78249",price:385000,beds:4,baths:3,sqft:2450,status:"For Sale",img:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"},
    {id:2,addr:"1203 Stone Oak Pkwy",city:"San Antonio, TX 78258",price:520000,beds:5,baths:4,sqft:3200,status:"For Sale",img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"},
    {id:3,addr:"7890 Alamo Ranch Blvd",city:"San Antonio, TX 78253",price:299000,beds:3,baths:2,sqft:1850,status:"Coming Soon",img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"},
    {id:4,addr:"562 Riverwalk Ln",city:"San Antonio, TX 78205",price:675000,beds:4,baths:3,sqft:2800,status:"For Sale",img:"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop"},
    {id:5,addr:"3344 Helotes Hill Rd",city:"San Antonio, TX 78023",price:445000,beds:4,baths:3,sqft:2650,status:"Sold",img:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop"},
    {id:6,addr:"901 Pearl Brewery St",city:"San Antonio, TX 78215",price:350000,beds:2,baths:2,sqft:1600,status:"For Sale",img:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=400&h=300&fit=crop"},
  ];

  const testimonials=[
    {name:"Maria & Carlos R.",text:"Sydney made our first home purchase feel effortless. She was patient, knowledgeable, and always had our best interests at heart. We couldn't have done it without her."},
    {name:"James T.",text:"I've bought and sold three properties with Sydney. Her market knowledge in San Antonio is unmatched. She consistently gets top dollar for my listings."},
    {name:"The Johnson Family",text:"Moving to San Antonio was a big decision. Sydney took the time to understand what we needed and found us the perfect neighborhood. Our kids love it here."},
    {name:"Rachel & David K.",text:"Sydney sold our home in 8 days — above asking price. Her staging advice and marketing strategy were incredible. Highly recommend."},
    {name:"Tom P.",text:"As a first-time investor, I needed someone who understood the numbers. Sydney broke everything down and helped me find a property that's already cash-flow positive."},
  ];

  const nav=(page)=>{setSitePage(page);if(scrollRef.current)scrollRef.current.scrollTop=0;};

  const SiteNav=()=>(
    <div style={{background:S.nav,borderBottom:`1px solid ${S.border}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",gap:20,alignItems:"center"}}>
        <div onClick={()=>nav("home")} style={{fontSize:16,fontWeight:800,color:S.text,letterSpacing:1,cursor:"pointer",flexShrink:0,fontFamily:"'Playfair Display',serif"}}>
          Sydney Spillman<span style={{color:S.accent}}>.</span>
        </div>
        <div style={{display:"flex",gap:18,alignItems:"center"}}>
          {[{l:"Home",p:"home"},{l:"About",p:"about"},{l:"Listings",p:"listings"},{l:"Testimonials",p:"testimonials"},{l:"Contact",p:"contact"}].map(n=>(
            <span key={n.l} onClick={()=>nav(n.p)} style={{fontSize:11,fontWeight:600,color:sitePage===n.p?S.accent:S.muted,letterSpacing:1,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"color 0.15s"}}>{n.l.toUpperCase()}</span>
          ))}
        </div>
      </div>
      <a href="tel:2103468614" style={{fontSize:11,fontWeight:600,color:S.accent,fontFamily:"Inter,sans-serif",textDecoration:"none",letterSpacing:0.5}}>210-346-8614</a>
    </div>
  );

  const SiteFooter=()=>(
    <div style={{background:"#0f172a",padding:"32px 24px",color:"#94a3b8"}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:24,marginBottom:24}}>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:"#f1f5f9",letterSpacing:1,marginBottom:5,fontFamily:"'Playfair Display',serif"}}>Sydney Spillman<span style={{color:BLUE}}>.</span></div>
          <div style={{fontSize:9,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>REAL ESTATE · SAN ANTONIO</div>
        </div>
        <div style={{display:"flex",gap:32}}>
          {[
            {t:"NAVIGATE",l:[{label:"Home",fn:()=>nav("home")},{label:"About",fn:()=>nav("about")},{label:"Listings",fn:()=>nav("listings")},{label:"Testimonials",fn:()=>nav("testimonials")}]},
            {t:"CONTACT",l:[{label:"210-346-8614",fn:()=>{}},{label:"sydneyspillmanre@gmail.com",fn:()=>{}},{label:"San Antonio, TX",fn:()=>{}}]},
          ].map(col=>(
            <div key={col.t}>
              <div style={{fontSize:9,fontWeight:700,color:BLUE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:10}}>{col.t}</div>
              {col.l.map(l=><div key={l.label} onClick={l.fn} style={{fontSize:11,color:"#94a3b8",marginBottom:7,cursor:"pointer"}}>{l.label}</div>)}
            </div>
          ))}
        </div>
      </div>
      <div style={{borderTop:"1px solid #1e293b",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:10,fontFamily:"Inter,sans-serif"}}>© 2026 Sydney Spillman & Associates. All rights reserved.</div>
        <div style={{fontSize:10,color:"#475569",fontFamily:"Inter,sans-serif"}}>Built by Anthony's Brand Builder</div>
      </div>
    </div>
  );

  const ListingCard=({l})=>(
    <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:8,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{height:180,background:"#e2e8f0",position:"relative",overflow:"hidden"}}>
        <img src={l.img} alt={l.addr} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        <div style={{position:"absolute",top:10,left:10,fontSize:9,fontWeight:700,color:"#fff",background:l.status==="Sold"?"#22c55e":l.status==="Coming Soon"?"#f59e0b":BLUE,padding:"3px 10px",borderRadius:4,letterSpacing:1,fontFamily:"Inter,sans-serif"}}>{l.status.toUpperCase()}</div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{fontSize:20,fontWeight:800,color:S.text,fontFamily:"Inter,sans-serif",marginBottom:2}}>${l.price.toLocaleString()}</div>
        <div style={{fontSize:13,fontWeight:600,color:S.text,marginBottom:2}}>{l.addr}</div>
        <div style={{fontSize:11,color:S.muted,marginBottom:10}}>{l.city}</div>
        <div style={{display:"flex",gap:16}}>
          {[{v:l.beds,l:"Beds"},{v:l.baths,l:"Baths"},{v:l.sqft.toLocaleString(),l:"Sqft"}].map(s=>(
            <div key={s.l}>
              <span style={{fontSize:13,fontWeight:700,color:S.text,fontFamily:"Inter,sans-serif"}}>{s.v}</span>
              <span style={{fontSize:10,color:S.muted,marginLeft:3}}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── PAGES ── */
  const renderHome=()=>(
    <>
      {/* Hero */}
      <div style={{position:"relative",height:420,background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#2563eb 100%)",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.15) 0%, transparent 60%)"}}/>
        <div style={{position:"relative",zIndex:1,padding:"0 40px",maxWidth:600}}>
          <div style={{fontSize:10,fontWeight:700,color:BLUE2,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:14}}>SAN ANTONIO REAL ESTATE</div>
          <div style={{fontSize:44,fontWeight:900,color:"#f1f5f9",lineHeight:1.05,letterSpacing:-0.5,fontFamily:"'Playfair Display',serif",marginBottom:16}}>
            Find Your<br/><span style={{color:BLUE2}}>Perfect</span> Home.
          </div>
          <div style={{fontSize:13,color:"#94a3b8",fontFamily:"Inter,sans-serif",lineHeight:1.7,marginBottom:24,maxWidth:440}}>
            Dedicated to helping families find their dream home in San Antonio. Expert guidance, local knowledge, and a personal touch every step of the way.
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button onClick={()=>nav("listings")} style={{padding:"12px 28px",fontSize:12,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:BLUE,color:"#fff",border:"none",borderRadius:6,cursor:"pointer"}}>VIEW LISTINGS</button>
            <button onClick={()=>nav("contact")} style={{padding:"12px 28px",fontSize:12,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:"transparent",color:"#f1f5f9",border:"1px solid #475569",borderRadius:6,cursor:"pointer"}}>GET IN TOUCH</button>
          </div>
        </div>
      </div>

      {/* Featured listings */}
      <div style={{padding:"40px 24px"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:14,marginBottom:24}}>
          <div style={{fontSize:28,fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif"}}>Featured Listings</div>
          <span onClick={()=>nav("listings")} style={{marginLeft:"auto",fontSize:11,color:S.accent,fontFamily:"Inter,sans-serif",cursor:"pointer",fontWeight:600}}>View All →</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {listings.filter(l=>l.status==="For Sale").slice(0,3).map(l=><ListingCard key={l.id} l={l}/>)}
        </div>
      </div>

      {/* Testimonials preview */}
      <div style={{background:"#f8fafc",borderTop:`1px solid ${S.border}`,borderBottom:`1px solid ${S.border}`,padding:"40px 24px"}}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto"}}>
          <div style={{fontSize:10,color:S.accent,letterSpacing:4,fontFamily:"Inter,sans-serif",marginBottom:8,fontWeight:700}}>TESTIMONIALS</div>
          <div style={{fontSize:28,fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif",marginBottom:20}}>What Clients Say</div>
          <div style={{fontSize:13,color:S.muted,fontFamily:"Inter,sans-serif",lineHeight:1.8,fontStyle:"italic",marginBottom:8}}>
            "{testimonials[0].text}"
          </div>
          <div style={{fontSize:12,fontWeight:700,color:S.text}}>— {testimonials[0].name}</div>
          <button onClick={()=>nav("testimonials")} style={{marginTop:20,padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:"transparent",color:S.accent,border:`1px solid ${S.accent}33`,borderRadius:6,cursor:"pointer"}}>READ MORE REVIEWS</button>
        </div>
      </div>

      {/* About snippet */}
      <div style={{padding:"40px 24px",maxWidth:600,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:10,color:S.accent,letterSpacing:4,fontFamily:"Inter,sans-serif",marginBottom:8,fontWeight:700}}>ABOUT SYDNEY</div>
        <div style={{fontSize:28,fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif",marginBottom:16}}>Your San Antonio Expert</div>
        <div style={{fontSize:13,color:S.muted,fontFamily:"Inter,sans-serif",lineHeight:1.8,marginBottom:20}}>
          With deep roots in San Antonio and a passion for helping families find their perfect home, Sydney Spillman brings expertise, dedication, and a personal touch to every transaction.
        </div>
        <button onClick={()=>nav("about")} style={{padding:"10px 28px",fontSize:12,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:BLUE,color:"#fff",border:"none",borderRadius:6,cursor:"pointer"}}>LEARN MORE</button>
      </div>
    </>
  );

  const renderAbout=()=>(
    <div>
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",padding:"52px 24px",textAlign:"center"}}>
        <div style={{fontSize:10,color:BLUE2,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:10}}>ABOUT</div>
        <div style={{fontSize:38,fontWeight:900,color:"#f1f5f9",lineHeight:1.05,fontFamily:"'Playfair Display',serif",maxWidth:520,margin:"0 auto 18px"}}>Sydney Spillman</div>
        <div style={{fontSize:12,color:"#94a3b8",fontFamily:"Inter,sans-serif",lineHeight:1.9,maxWidth:500,margin:"0 auto"}}>Real Estate Agent · San Antonio, TX</div>
      </div>
      <div style={{padding:"40px 24px",maxWidth:600,margin:"0 auto"}}>
        {[
          {t:"MY STORY",b:"Real estate isn't just my career — it's my passion. I grew up in San Antonio and I know every neighborhood, every school district, and every hidden gem this city has to offer. When you work with me, you're working with someone who genuinely knows and loves this community."},
          {t:"MY APPROACH",b:"I believe buying or selling a home should feel exciting, not stressful. I take the time to understand what you're looking for, guide you through every step, and make sure you feel confident in every decision. Your goals are my goals."},
          {t:"CREDENTIALS",b:"Licensed Real Estate Agent in Texas. Member of the San Antonio Board of Realtors. Specializing in residential real estate — first-time buyers, growing families, investment properties, and luxury homes."},
          {t:"MY MISSION",b:"To help every client find not just a house, but a home. A place where memories are made, families grow, and life happens. That's what drives me every single day."},
        ].map(s=>(
          <div key={s.t} style={{marginBottom:32}}>
            <div style={{fontSize:10,color:S.accent,letterSpacing:4,fontFamily:"Inter,sans-serif",marginBottom:8,fontWeight:700}}>{s.t}</div>
            <div style={{fontSize:13,color:S.text,fontFamily:"Inter,sans-serif",lineHeight:1.9}}>{s.b}</div>
          </div>
        ))}
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={()=>nav("contact")} style={{padding:"12px 36px",fontSize:12,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:BLUE,color:"#fff",border:"none",borderRadius:6,cursor:"pointer"}}>GET IN TOUCH</button>
        </div>
      </div>
    </div>
  );

  const renderListings=()=>(
    <div style={{padding:"32px 24px 48px"}}>
      <div style={{fontSize:10,color:S.accent,letterSpacing:4,fontFamily:"Inter,sans-serif",marginBottom:5,fontWeight:700}}>BROWSE</div>
      <div style={{fontSize:28,fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif",marginBottom:24}}>Property Listings</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {listings.map(l=><ListingCard key={l.id} l={l}/>)}
      </div>
    </div>
  );

  const renderTestimonials=()=>(
    <div style={{padding:"32px 24px 48px",maxWidth:640,margin:"0 auto"}}>
      <div style={{fontSize:10,color:S.accent,letterSpacing:4,fontFamily:"Inter,sans-serif",marginBottom:5,fontWeight:700}}>REVIEWS</div>
      <div style={{fontSize:28,fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif",marginBottom:28}}>Client Testimonials</div>
      {testimonials.map((t,i)=>(
        <div key={i} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:8,padding:"24px",marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:24,color:BLUE,marginBottom:8,lineHeight:1}}>"</div>
          <div style={{fontSize:13,color:S.text,fontFamily:"Inter,sans-serif",lineHeight:1.8,fontStyle:"italic",marginBottom:12}}>{t.text}</div>
          <div style={{fontSize:12,fontWeight:700,color:S.text}}>— {t.name}</div>
        </div>
      ))}
    </div>
  );

  const renderContact=()=>(
    <div style={{padding:"40px 24px 48px",maxWidth:520,margin:"0 auto"}}>
      <div style={{fontSize:10,color:S.accent,letterSpacing:4,fontFamily:"Inter,sans-serif",marginBottom:5,fontWeight:700}}>GET IN TOUCH</div>
      <div style={{fontSize:28,fontWeight:900,color:S.text,fontFamily:"'Playfair Display',serif",marginBottom:6}}>Contact Sydney</div>
      <div style={{fontSize:12,color:S.muted,fontFamily:"Inter,sans-serif",marginBottom:28}}>Ready to buy or sell? Have questions? Let's talk.</div>
      {contactSent?(
        <div style={{background:GREEN+"0c",border:`1px solid ${GREEN}33`,borderRadius:8,padding:"32px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:8}}>✓</div>
          <div style={{fontSize:16,fontWeight:900,color:GREEN,letterSpacing:1,marginBottom:6,fontFamily:"'Playfair Display',serif"}}>Message Sent</div>
          <div style={{fontSize:11,color:S.muted,fontFamily:"Inter,sans-serif"}}>Sydney will get back to you within 24 hours.</div>
          <button onClick={()=>setContactSent(false)} style={{marginTop:18,padding:"9px 22px",fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",background:"transparent",color:S.muted,border:`1px solid ${S.border}`,borderRadius:4,cursor:"pointer"}}>SEND ANOTHER</button>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{l:"NAME",k:"name",t:"text",ph:"Your name"},{l:"EMAIL",k:"email",t:"email",ph:"your@email.com"},{l:"PHONE",k:"phone",t:"tel",ph:"(210) 555-0000"}].map(f=>(
            <div key={f.k}>
              <div style={{fontSize:9,color:S.accent,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:5,fontWeight:700}}>{f.l}</div>
              <input type={f.t} placeholder={f.ph} value={contactForm[f.k]} onChange={e=>setContactForm(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",padding:"10px 14px",background:S.card,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
          <div>
            <div style={{fontSize:9,color:S.accent,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:5,fontWeight:700}}>MESSAGE</div>
            <textarea placeholder="Tell me about what you're looking for..." value={contactForm.message} onChange={e=>setContactForm(p=>({...p,message:e.target.value}))} rows={5} style={{width:"100%",padding:"10px 14px",background:S.card,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
          </div>
          <button onClick={()=>{if(contactForm.name&&contactForm.email&&contactForm.message)setContactSent(true)}} style={{padding:"12px",fontSize:12,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:BLUE,color:"#fff",border:"none",borderRadius:6,cursor:"pointer"}}>SEND MESSAGE</button>
        </div>
      )}
      <div style={{marginTop:40,paddingTop:28,borderTop:`1px solid ${S.border}`,display:"flex",gap:28,flexWrap:"wrap"}}>
        {[{l:"PHONE",v:"210-346-8614"},{l:"EMAIL",v:"sydneyspillmanre@gmail.com"},{l:"LOCATION",v:"San Antonio, TX"}].map(i=>(
          <div key={i.l}>
            <div style={{fontSize:9,color:S.accent,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:3,fontWeight:700}}>{i.l}</div>
            <div style={{fontSize:12,color:S.text}}>{i.v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return(
    <div ref={scrollRef} style={{background:S.bg,minHeight:"100%",overflow:"auto"}}>
      <SiteNav/>
      {sitePage==="home"&&renderHome()}
      {sitePage==="about"&&renderAbout()}
      {sitePage==="listings"&&renderListings()}
      {sitePage==="testimonials"&&renderTestimonials()}
      {sitePage==="contact"&&renderContact()}
      <SiteFooter/>
    </div>
  );
}

/* ═══════════════════════════════════════
   DISCOVERY QUESTIONNAIRE PAGE
   ═══════════════════════════════════════ */
const discoveryQuestions=[
  {id:"brand_story",section:"ABOUT YOU",label:"What inspired you to get into real estate?",type:"textarea",placeholder:"Tell us your story — what drew you to this career and keeps you going..."},
  {id:"core_values",section:"ABOUT YOU",label:"What are your core values as an agent?",type:"textarea",placeholder:"e.g. Honesty, community, going the extra mile..."},
  {id:"differentiator",section:"ABOUT YOU",label:"What makes you different from other agents in San Antonio?",type:"textarea",placeholder:"What do you bring that others don't?"},
  {id:"ideal_client",section:"YOUR AUDIENCE",label:"Who is your ideal client?",type:"textarea",placeholder:"e.g. First-time buyers, military families relocating, luxury buyers..."},
  {id:"neighborhoods",section:"YOUR AUDIENCE",label:"What neighborhoods or areas do you primarily work in?",type:"text",placeholder:"e.g. Stone Oak, Alamo Heights, Boerne, New Braunfels..."},
  {id:"property_types",section:"YOUR AUDIENCE",label:"What types of properties do you specialize in?",type:"text",placeholder:"e.g. Single-family homes, condos, investment properties, luxury..."},
  {id:"brand_feeling",section:"BRAND FEEL",label:"Pick 3-5 words that describe how you want clients to feel when they interact with your brand.",type:"text",placeholder:"e.g. Confident, cared for, excited, at ease, empowered..."},
  {id:"style_direction",section:"BRAND FEEL",label:"Which style resonates most with you?",type:"select",options:["Modern & Minimal — clean lines, lots of white space","Warm & Approachable — friendly, community-focused, inviting","Luxury & Polished — elegant, high-end, refined","Bold & Confident — strong presence, makes a statement"]},
  {id:"inspiration",section:"BRAND FEEL",label:"Are there any agents, brands, or websites you admire? What do you like about them?",type:"textarea",placeholder:"Share links or names — we'll use these as reference points..."},
  {id:"existing_branding",section:"CURRENT ASSETS",label:"Do you have any existing branding (logo, colors, business cards)?",type:"select",options:["No — starting completely fresh","Yes — but I want to rebrand","Yes — and I'd like to keep/evolve what I have"]},
  {id:"headshots",section:"CURRENT ASSETS",label:"Do you have professional headshots or brand photos?",type:"select",options:["Yes — ready to use","Not yet — planning to get them soon","No — need guidance on this"]},
  {id:"color_preferences",section:"CURRENT ASSETS",label:"Any colors or fonts you love? Any you want to avoid?",type:"textarea",placeholder:"e.g. Love blues and whites, hate pink. Love clean modern fonts..."},
  {id:"business_goals",section:"VISION",label:"Where do you see your business in 1 year?",type:"textarea",placeholder:"e.g. Team of 3, top producer in Stone Oak, recognized brand in SA..."},
  {id:"anything_else",section:"VISION",label:"Anything else we should know?",type:"textarea",placeholder:"Any thoughts, ideas, must-haves, or deal-breakers..."},
];

export function DiscoveryPage(){
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem("sydney-theme")==="dark"}catch{return false}});
  const c=dark?darkColors:lightColors;
  const [form,setForm]=useState<Record<string,string>>(()=>{
    const init:Record<string,string>={};
    discoveryQuestions.forEach(q=>{init[q.id]=""});
    return init;
  });
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);

  const saveDiscoveryMutation=useMutation(api.sydneyTasks.saveDiscovery);
  const existing=useQuery(api.sydneyTasks.getDiscovery,{projectId:"sydney-spillman"});

  useEffect(()=>{
    if(existing===undefined)return;
    if(existing&&!submitted){
      try{
        const parsed=JSON.parse(existing.responses);
        setForm(parsed);
        setSubmitted(true);
      }catch{}
    }
  },[existing]);

  const update=(id:string,val:string)=>setForm(p=>({...p,[id]:val}));

  const handleSubmit=async()=>{
    const required=discoveryQuestions.filter(q=>q.type!=="select").slice(0,3);
    const missing=required.some(q=>!form[q.id]?.trim());
    if(missing){return}
    setSaving(true);
    try{
      await saveDiscoveryMutation({projectId:"sydney-spillman",responses:JSON.stringify(form),submittedAt:Date.now()});
      setSubmitted(true);
    }finally{setSaving(false)}
  };

  const sections=[...new Set(discoveryQuestions.map(q=>q.section))];

  const toggleTheme=()=>{const next=!dark;setDark(next);try{localStorage.setItem("sydney-theme",next?"dark":"light")}catch{}};

  return(
    <ErrorBoundary>
    <div style={{minHeight:"100vh",background:c.BG,color:c.INK,fontFamily:"Inter,sans-serif",transition:"background 0.3s,color 0.3s"}}>
      <Grain/>
      {/* Header */}
      <div style={{background:c.BG,borderBottom:`1px solid ${c.EDGE}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:200,backdropFilter:"blur(12px)"}}>
        <a href="/" style={{fontSize:18,fontWeight:900,letterSpacing:1,fontFamily:"'Playfair Display',serif",color:c.INK,textDecoration:"none"}}>
          Sydney Spillman<span style={{color:c.BLUE}}>.</span>
        </a>
        <button onClick={toggleTheme} style={{background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:13,color:c.SLATE}}>
          {dark?"☀️":"🌙"}
        </button>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"40px 24px 60px"}}>
        {submitted?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:c.GREEN+"14",border:`2px solid ${c.GREEN}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28}}>✓</div>
            <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:1,fontFamily:"'Playfair Display',serif",marginBottom:8}}>Thank You, Sydney!</div>
            <div style={{fontSize:14,color:c.SLATE,lineHeight:1.8,maxWidth:440,margin:"0 auto 8px"}}>
              Your discovery questionnaire has been submitted successfully. We have everything we need to start building your brand.
            </div>
            <div style={{fontSize:12,color:c.SLATE,lineHeight:1.8,maxWidth:440,margin:"0 auto 28px"}}>
              Next up: we'll put together mood boards and visual direction options for your review.
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/" style={{padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:c.BLUE,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",textDecoration:"none"}}>BACK TO PROJECT HUB</a>
            </div>
          </div>
        ):(
          <>
            <div style={{textAlign:"center",marginBottom:36}}>
              <div style={{fontSize:11,color:c.BLUE,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:8}}>PHASE 1 · BRAND DISCOVERY</div>
              <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:1,fontFamily:"'Playfair Display',serif",marginBottom:8}}>Discovery Questionnaire</div>
              <div style={{fontSize:13,color:c.SLATE,lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>
                Help us understand your vision, style, and goals. Your answers will shape every brand decision — from logo to website. Take your time.
              </div>
            </div>

            {sections.map(section=>(
              <div key={section} style={{marginBottom:32}}>
                <div style={{fontSize:11,fontWeight:700,color:c.BLUE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>{section}</div>
                <div style={{display:"flex",flexDirection:"column",gap:20}}>
                  {discoveryQuestions.filter(q=>q.section===section).map(q=>(
                    <div key={q.id}>
                      <label style={{display:"block",fontSize:13,fontWeight:600,color:c.INK,marginBottom:6,lineHeight:1.5}}>{q.label}</label>
                      {q.type==="textarea"?(
                        <textarea value={form[q.id]} onChange={e=>update(q.id,e.target.value)} placeholder={q.placeholder} rows={3} style={{width:"100%",padding:"10px 14px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:6,color:c.INK,fontSize:13,fontFamily:"Inter,sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,transition:"border-color 0.15s"}} onFocus={e=>e.target.style.borderColor=c.BLUE} onBlur={e=>e.target.style.borderColor=c.EDGE}/>
                      ):q.type==="select"?(
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {q.options.map(opt=>(
                            <label key={opt} onClick={()=>update(q.id,opt)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:form[q.id]===opt?c.BLUE+"0c":c.CARD,border:`1px solid ${form[q.id]===opt?c.BLUE+"44":c.EDGE}`,borderRadius:6,cursor:"pointer",transition:"all 0.15s"}}>
                              <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${form[q.id]===opt?c.BLUE:c.EDGE}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"border-color 0.15s"}}>
                                {form[q.id]===opt&&<div style={{width:8,height:8,borderRadius:"50%",background:c.BLUE}}/>}
                              </div>
                              <span style={{fontSize:12,color:c.INK,fontFamily:"Inter,sans-serif"}}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ):(
                        <input type="text" value={form[q.id]} onChange={e=>update(q.id,e.target.value)} placeholder={q.placeholder} style={{width:"100%",padding:"10px 14px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:6,color:c.INK,fontSize:13,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s"}} onFocus={e=>e.target.style.borderColor=c.BLUE} onBlur={e=>e.target.style.borderColor=c.EDGE}/>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{borderTop:`1px solid ${c.EDGE}`,paddingTop:24,marginTop:8}}>
              <button onClick={handleSubmit} disabled={saving} style={{width:"100%",padding:"14px",fontSize:13,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",background:c.BLUE,color:"#fff",border:"none",borderRadius:6,cursor:saving?"wait":"pointer",opacity:saving?0.7:1,transition:"opacity 0.15s"}}>
                {saving?"SUBMITTING...":"SUBMIT QUESTIONNAIRE"}
              </button>
              <div style={{fontSize:10,color:c.SLATE,textAlign:"center",marginTop:10}}>Your answers are saved securely and only visible to your project team.</div>
            </div>
          </>
        )}
      </div>

      <div style={{borderTop:`1px solid ${c.EDGE}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>© 2026 Sydney Spillman & Associates</div>
        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>Built by Anthony's Brand Builder</div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

/* ═══════════════════════════════════════
   MAIN HUB SHELL
   ═══════════════════════════════════════ */
export default function SydneyHub({defaultView,opsMode}:{defaultView:string,opsMode:boolean}){
  const [view,setView]=useState(defaultView);
  const [tab,setTab]=useState("workflow");
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem("sydney-theme")==="dark"}catch{return false}});
  const c=dark?darkColors:lightColors;

  const toggleTheme=()=>{const next=!dark;setDark(next);try{localStorage.setItem("sydney-theme",next?"dark":"light")}catch{}};

  const tasks=useQuery(api.sydneyTasks.getTasks,{projectId:"sydney-spillman"})??{};
  const setTaskMutation=useMutation(api.sydneyTasks.setTask);
  const onToggle=(key)=>{
    const newVal=!tasks[key];
    setTaskMutation({projectId:"sydney-spillman",key,value:newVal});
  };

  const deliverables=useQuery(api.sydneyTasks.getDeliverables,{projectId:"sydney-spillman"})??[];
  const addDeliverableMutation=useMutation(api.sydneyTasks.addDeliverable);
  const removeDeliverableMutation=useMutation(api.sydneyTasks.removeDeliverable);
  const onAddDeliverable=({milestoneKey,label,url,type,markdownContent})=>{
    addDeliverableMutation({projectId:"sydney-spillman",milestoneKey,label,url:url||"",type,addedAt:Date.now(),...(markdownContent?{markdownContent}:{})});
  };
  const onRemoveDeliverable=(id)=>{removeDeliverableMutation({id})};

  const tabs=[
    {id:"workflow",label:"Workflow"},
    {id:"scope",label:"Scope"},
    {id:"agreement",label:"Agreement"},
    {id:"website",label:"Website Preview"},
  ];

  return(
    <div style={{minHeight:"100vh",background:c.BG,color:c.INK,fontFamily:"Inter,sans-serif",transition:"background 0.3s,color 0.3s"}}>
      <Grain/>

      {/* Header */}
      <div style={{background:c.BG,borderBottom:`1px solid ${c.EDGE}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:200,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:1,fontFamily:"'Playfair Display',serif",color:c.INK}}>
            Sydney Spillman<span style={{color:c.BLUE}}>.</span>
          </div>
          {opsMode&&(
            <div style={{display:"flex",background:c.DEEP,borderRadius:4,overflow:"hidden",border:`1px solid ${c.EDGE}`}}>
              {[["internal","OPS"],["client","CLIENT"]].map(([v,l])=>(
                <button key={v} onClick={()=>setView(v)} style={{padding:"4px 12px",fontSize:9,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:view===v?c.BLUE:"transparent",color:view===v?"#fff":c.SLATE,border:"none",cursor:"pointer"}}>{l}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={toggleTheme} style={{background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:13,color:c.SLATE}}>
          {dark?"☀️":"🌙"}
        </button>
      </div>

      {/* Tab bar */}
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${c.EDGE}`,background:c.BG,position:"sticky",top:56,zIndex:190,padding:"0 24px"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"12px 20px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",
            background:"transparent",border:"none",cursor:"pointer",
            color:tab===t.id?c.BLUE:c.SLATE,
            borderBottom:tab===t.id?`2px solid ${c.BLUE}`:"2px solid transparent",
            transition:"all 0.15s",
          }}>{t.label.toUpperCase()}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{minHeight:"calc(100vh - 120px)"}}>
        {tab==="workflow"&&<WorkflowPage view={view} tasks={tasks} onToggle={onToggle} c={c} deliverables={deliverables} onAddDeliverable={onAddDeliverable} onRemoveDeliverable={onRemoveDeliverable}/>}
        {tab==="scope"&&<ScopePage c={c}/>}
        {tab==="agreement"&&<AgreementPage c={c}/>}
        {tab==="website"&&<WebsitePage c={c}/>}
      </div>

      {/* Footer */}
      <div style={{borderTop:`1px solid ${c.EDGE}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>© 2026 Sydney Spillman & Associates · Project Hub</div>
        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>Built by Anthony's Brand Builder</div>
      </div>
    </div>
  );
}
