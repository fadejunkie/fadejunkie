// @ts-nocheck
import { useState, useEffect, useRef, Component } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

class ErrorBoundary extends Component{
  state={hasError:false,error:null};
  static getDerivedStateFromError(error){return{hasError:true,error}}
  render(){
    if(this.state.hasError){
      return <div style={{padding:40,fontFamily:"Inter,sans-serif",maxWidth:600,margin:"0 auto"}}>
        <div style={{fontSize:18,fontWeight:700,color:"#ef4444",marginBottom:12}}>Something went wrong</div>
        <pre style={{fontSize:11,color:"#94a3b8",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{String(this.state.error)}</pre>
        <button onClick={()=>window.location.reload()} style={{marginTop:16,padding:"8px 20px",fontSize:12,background:"#8b5cf6",color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>Reload</button>
      </div>
    }
    return this.props.children;
  }
}

/* ── color system ── */
const VIOLET="#8b5cf6",VIOLET2="#a78bfa",DEEP_V="#6d28d9",GREEN="#22c55e",EMBER="#ef4444";

const darkColors={
  VIOLET,VIOLET2,DEEP_V,GREEN,EMBER,
  BG:"#0a0a0f",CARD:"#141420",DEEP:"#1e1e2e",INPUT:"#2a2a3e",
  EDGE:"#333350",SLATE:"#8888aa",STONE:"#bbbbdd",INK:"#f0f0f8",
};
const lightColors={
  VIOLET,VIOLET2,DEEP_V,GREEN,EMBER,
  BG:"#fafafa",CARD:"#ffffff",DEEP:"#f3f0ff",INPUT:"#e8e4f0",
  EDGE:"#d4d0e0",SLATE:"#6b6880",STONE:"#444455",INK:"#111118",
};

/* ── phases data ── */
const phases=[
  {id:1,name:"DISCOVER",subtitle:"Discovery & System Design",week:"WEEK 1",short:"INTAKE · DESIGN",icon:"\u{1F50D}",fee:"$400",
    milestones:[
      {title:"CLIENT INTAKE",clientDesc:"Understand Wizardry Ink's workflow, brand, and booking pain points.",
        tasks:[{label:"Kickoff call — business goals, brand audit, current workflow"},{label:"Map current DM → booking flow (pain points, manual steps)"},{label:"Document artist roster, specialties, and availability patterns"},{label:"Identify integration points (Instagram DM, website, phone)"}]},
      {title:"SYSTEM ARCHITECTURE",clientDesc:"Design the AI booking pipeline and owner dashboard.",
        tasks:[{label:"Design AI booking pipeline: intake → quote → schedule → notify → confirm"},{label:"Define quote engine logic (size, style, placement, color → price range)"},{label:"Map artist workflow: notification → end time edit → overlap prevention"},{label:"Design owner dashboard: swipe-to-approve, pipeline view, calendar"}]},
      {title:"TECH STACK",clientDesc:"Lock in technology decisions and integration requirements.",
        tasks:[{label:"Select and document tech stack decisions"},{label:"Define API/integration requirements (Instagram, calendar, notifications)"},{label:"Create system architecture diagram"}]},
    ]},
  {id:2,name:"WEBSITE",subtitle:"Website Redesign",week:"WEEKS 2–3",short:"SITE · PAGES",icon:"\u{1F3A8}",fee:"$1,200",
    milestones:[
      {title:"SITE ARCHITECTURE",clientDesc:"Blueprint for the new site — pages, layout, mobile-first.",
        tasks:[{label:"Wireframe homepage, artist pages, booking flow"},{label:"Define page structure: Home, Artists, About, Gallery, Booking, FAQ, Contact, Events"},{label:"Mobile-first responsive design plan"}]},
      {title:"HOMEPAGE",clientDesc:"First impression — studio identity, artist showcase, book-now CTA.",
        tasks:[{label:"Hero section — studio identity, book now CTA"},{label:"Artist showcase — portfolio previews with links"},{label:"Gallery section — recent work highlights"},{label:"Testimonials + studio values section"}]},
      {title:"ARTIST PAGES",clientDesc:"Individual portfolio pages for each artist.",
        tasks:[{label:"Individual artist portfolio pages (Daisy, Lee, Al)"},{label:"Artist bio, specialties, availability status"},{label:"Portfolio gallery with style categories"}]},
      {title:"CORE PAGES",clientDesc:"About, Gallery, FAQ, Contact, and Events pages.",
        tasks:[{label:"About — studio story, mission, values, inclusive identity"},{label:"Gallery — filterable portfolio grid"},{label:"FAQ — pricing, process, aftercare, policies"},{label:"Contact + Events pages"}]},
      {title:"SEO FOUNDATION",clientDesc:"Search optimization baked into every page.",
        tasks:[{label:"Keyword research — San Antonio tattoo terms"},{label:"Title tags + meta descriptions for all pages"},{label:"Image alt text for all portfolio/gallery images"},{label:"Submit XML sitemap to GSC"}]},
    ]},
  {id:3,name:"AI SYSTEM",subtitle:"AI Booking System + Dashboard",week:"WEEKS 3–4",short:"AI · DASHBOARD",icon:"\u{1F916}",fee:"$1,800",
    milestones:[
      {title:"AI INTAKE ENGINE",clientDesc:"AI processes inbound inquiries into structured quote-ready data.",
        tasks:[{label:"Build inbound inquiry processor (DM/web form → structured data)"},{label:"Train quote model: size, style, placement, color, complexity → price range"},{label:"Auto-assign artist based on style match + availability"},{label:"Generate quote card with all details for owner review"}]},
      {title:"CALENDAR & SCHEDULING",clientDesc:"Artist calendars, booking slots, and overlap prevention.",
        tasks:[{label:"Build artist availability calendar (per-artist time slots)"},{label:"Implement booking slot selection for clients"},{label:"Artist end time editing interface"},{label:"Overlap prevention logic (validate against existing bookings)"}]},
      {title:"NOTIFICATION SYSTEM",clientDesc:"Automated alerts for artists, clients, and internal tracking.",
        tasks:[{label:"Artist notification on new booking assignment"},{label:"Client confirmation notification (quote + scheduled time)"},{label:"Internal status updates (booked → confirmed → completed)"}]},
      {title:"OWNER DASHBOARD",clientDesc:"Daisy's control center — swipe to approve, manage bookings.",
        tasks:[{label:"Build Tinder-style swipe card interface for new quotes"},{label:"Swipe right = approve + confirm, left = edit/reassign"},{label:"Booking pipeline view (Inquiry → Quoted → Scheduled → Confirmed → Completed)"},{label:"Artist calendar overview (who's booked, gaps, conflicts)"},{label:"Manual override controls (edit quotes, reassign, adjust times)"}]},
    ]},
  {id:4,name:"LAUNCH",subtitle:"Integration, QA & Launch",week:"WEEK 5",short:"QA · HANDOFF",icon:"\u{1F680}",fee:"$400",
    milestones:[
      {title:"SYSTEM INTEGRATION",clientDesc:"Booking system embedded in website, end-to-end connected.",
        tasks:[{label:"Embed AI booking system into website"},{label:"Connect DM intake to website inquiry form"},{label:"End-to-end flow test: inquiry → quote → schedule → confirm"}]},
      {title:"QUALITY ASSURANCE",clientDesc:"Every page and feature tested across devices.",
        tasks:[{label:"Cross-browser testing — Chrome, Safari, Firefox, Edge"},{label:"Mobile responsive QA — iOS Safari, Android Chrome, tablet"},{label:"Test booking flow end-to-end with real scenarios"},{label:"Page speed audit + performance optimization"}]},
      {title:"GO LIVE",clientDesc:"DNS pointed, SSL verified — site and booking system live.",
        tasks:[{label:"DNS cutover — point domain to hosting"},{label:"Verify SSL certificate"},{label:"Confirm all URLs resolve correctly"},{label:"Verify live site + booking system operational"}]},
      {title:"ANALYTICS & HANDOFF",clientDesc:"Analytics connected, Daisy trained, support confirmed.",
        tasks:[{label:"Create and configure GA4 property"},{label:"Set up Google Search Console"},{label:"Live training — dashboard, booking management, website editing"},{label:"48-hour post-launch check-in"}]},
    ]},
];

/* ── helpers ── */
function phaseProgress(p,ts){let t=0,d=0;p.milestones.forEach(m=>m.tasks.forEach((_,ti)=>{t++;if(ts[`${p.id}-${m.title}-${ti}`])d++}));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}
function overall(ts){let t=0,d=0;phases.forEach(p=>p.milestones.forEach(m=>m.tasks.forEach((_,ti)=>{t++;if(ts[`${p.id}-${m.title}-${ti}`])d++})));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}

const Bar=({pct,h=6,glow=false,c})=>(
  <div style={{background:c.EDGE+"44",borderRadius:3,height:h,width:"100%",overflow:"hidden"}}>
    <div style={{width:`${pct}%`,height:"100%",borderRadius:3,transition:"width 0.5s cubic-bezier(.4,0,.2,1)",background:pct===100?c.GREEN:`linear-gradient(90deg,${c.VIOLET},${c.VIOLET2})`,boxShadow:glow&&pct>0&&pct<100?`0 0 12px ${c.VIOLET}44`:"none"}}/>
  </div>
);

const Grain=()=>(
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.02,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
);

/* ═══════════════════════════════════════
   SCOPE OF WORK PAGE
   ═══════════════════════════════════════ */
function ScopePage({c}){
  const Section=({title,children})=>(
    <div style={{marginBottom:28}}>
      <div style={{fontSize:13,fontWeight:700,color:c.VIOLET,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>{title}</div>
      {children}
    </div>
  );
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:11,color:c.VIOLET,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
        <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Scope of Work</div>
        <div style={{fontSize:13,color:c.SLATE,marginTop:4}}>Wizardry Ink Tattoo Studio — Website Redesign + AI Booking System</div>
      </div>

      <Section title="PROJECT OVERVIEW">
        <div style={{fontSize:13,color:c.INK,lineHeight:1.7,fontFamily:"Inter,sans-serif",padding:"0 4px"}}>
          Wizardry Ink is a woman-owned, queer-run tattoo studio in San Antonio. This engagement covers a full website redesign (migrating off Squarespace), an AI-powered booking system that handles inbound inquiries through to confirmed appointments, and a swipe-based owner dashboard for managing quotes and artist assignments. The goal is to give Daisy a system that converts visitors into booked clients — automatically.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginTop:14}}>
          {[{l:"CLIENT",v:"Daisy"},{l:"STUDIO",v:"Wizardry Ink"},{l:"TYPE",v:"Tattoo Studio"},{l:"MARKET",v:"San Antonio, TX"}].map(i=>(
            <div key={i.l} style={{background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,padding:"8px 12px"}}>
              <div style={{fontSize:9,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>{i.l}</div>
              <div style={{fontSize:12,color:c.INK,fontWeight:600,marginTop:2}}>{i.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ENGAGEMENT TYPE">
        <div style={{background:c.VIOLET+"0c",border:`1px solid ${c.VIOLET}22`,borderRadius:8,padding:"16px 20px"}}>
          <div style={{fontSize:14,fontWeight:700,color:c.INK,marginBottom:4}}>Tattoo Trade</div>
          <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",lineHeight:1.6}}>
            This project is a tattoo trade engagement valued at $3,800. Full website redesign + AI booking system deliverables provided in exchange for tattoo work.
          </div>
        </div>
      </Section>

      <Section title="MILESTONE PRICING">
        {phases.map(p=>(
          <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"10px 16px",background:c.CARD,borderRadius:6,border:`1px solid ${c.EDGE}`,marginBottom:6}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:c.INK,letterSpacing:0.5}}>Phase {p.id} — {p.name}</div>
              <div style={{fontSize:10,color:c.SLATE,marginTop:2,fontFamily:"Inter,sans-serif"}}>{p.subtitle}</div>
            </div>
            <div style={{fontSize:14,fontWeight:800,color:c.VIOLET,fontFamily:"Inter,sans-serif"}}>{p.fee}</div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"12px 16px",background:c.VIOLET+"0c",borderRadius:6,border:`1px solid ${c.VIOLET}33`,marginTop:4}}>
          <div style={{fontSize:14,fontWeight:800,color:c.INK,letterSpacing:1}}>TOTAL PROJECT VALUE</div>
          <div style={{fontSize:18,fontWeight:900,color:c.VIOLET,fontFamily:"Inter,sans-serif"}}>$3,800</div>
        </div>
      </Section>

      <Section title="PHASE DELIVERABLES">
        {phases.map(p=>(
          <div key={p.id} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:800,color:c.INK,letterSpacing:1,marginBottom:8}}>
              <span style={{color:c.VIOLET,marginRight:8}}>PHASE {p.id}</span>{p.name} — {p.subtitle}
            </div>
            {p.milestones.map(m=>(
              <div key={m.title} style={{marginBottom:8,paddingLeft:16}}>
                <div style={{fontSize:11,fontWeight:700,color:c.INK,marginBottom:4}}>{m.title}</div>
                {m.tasks.map((t,i)=>(
                  <div key={i} style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",paddingLeft:12,lineHeight:1.8}}>
                    {"\u2022"} {t.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Section>

      <Section title="ESTIMATED TIMELINE">
        {phases.map(p=>(
          <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 16px",borderBottom:`1px solid ${c.EDGE}`}}>
            <div><span style={{fontSize:11,color:c.VIOLET,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:10}}>Phase {p.id}</span><span style={{fontSize:13,color:c.INK}}>{p.subtitle}</span></div>
            <span style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{p.week}</span>
          </div>
        ))}
      </Section>

      <Section title="TERMS">
        {[
          {l:"Payment",b:"This is a tattoo trade engagement valued at $3,800. No monetary payment is required. Deliverables are exchanged for tattoo work of equivalent value."},
          {l:"Revisions",b:"Revision rounds are included as noted per phase. Additional revisions accommodated within reason."},
          {l:"Client Responsibilities",b:"Client is responsible for providing portfolio images, artist bios, pricing guidelines, scheduling preferences, and review feedback. Delays in client input may extend delivery."},
          {l:"Ownership",b:"Client retains full ownership of all deliverables — website, booking system, brand assets, and documentation."},
          {l:"Third-Party Costs",b:"Domain hosting and any third-party API costs (notifications, calendar integrations) are paid by client. Estimated: varies by integration choices."},
        ].map(t=>(
          <div key={t.l} style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:c.VIOLET,letterSpacing:1,marginBottom:2}}>{t.l}</div>
            <div style={{fontSize:11,color:c.INK,lineHeight:1.6,fontFamily:"Inter,sans-serif",paddingLeft:8}}>{t.b}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE (SIGNABLE — NO INVOICES)
   ═══════════════════════════════════════ */
const DEV_MODE=new URLSearchParams(window.location.search).has("dev");

function AgreementPage({c}){
  const canvasRef=useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [signed,setSigned]=useState(DEV_MODE);
  const [signedDate,setSignedDate]=useState<string|null>(DEV_MODE?new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):null);
  const [sigData,setSigData]=useState<string|null>(DEV_MODE?"data:image/png;base64,DEV":null);
  const [saving,setSaving]=useState(false);

  const saveAgreementMutation=useMutation(api.wizardryTasks.saveAgreement);
  const existingAgreement=useQuery(api.wizardryTasks.getAgreement,{projectId:"wizardry-ink"});

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
        await saveAgreementMutation({projectId:"wizardry-ink",sigData:data,signedDate:date,signedAt:Date.now()});
      }finally{setSaving(false);}
    }
  };

  const downloadDoc=(title,htmlContent)=>{
    const w=window.open("","_blank","width=900,height=1200");
    if(!w)return;
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,'Segoe UI',sans-serif;background:#fff;color:#111;padding:40px;max-width:720px;margin:0 auto}@media print{body{padding:20px}}</style>
</head><body>${htmlContent}</body></html>`);
    w.document.close();w.focus();setTimeout(()=>{w.print();},400);
  };
  const downloadAgreementPdf=()=>{
    const el=document.getElementById("agreement-printable");
    if(el)downloadDoc("Service Agreement — Wizardry Ink Tattoo Studio",el.innerHTML);
  };

  const today=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  const scopePhases=[
    {p:"Phase 1",n:"Discovery & System Design",when:"Week 1",fee:"$400",desc:"Client intake, current workflow mapping, AI booking pipeline architecture, tech stack decisions."},
    {p:"Phase 2",n:"Website Redesign",when:"Weeks 2–3",fee:"$1,200",desc:"Full site redesign — homepage, artist portfolio pages, gallery, about, FAQ, contact, events. Mobile-first, SEO foundation."},
    {p:"Phase 3",n:"AI Booking System + Dashboard",when:"Weeks 3–4",fee:"$1,800",desc:"AI quote engine, calendar scheduling, artist notifications, overlap prevention, Tinder-style owner dashboard with swipe-to-approve."},
    {p:"Phase 4",n:"Integration, QA & Launch",when:"Week 5",fee:"$400",desc:"System integration, cross-browser/mobile QA, go-live, GA4 + GSC, training session, post-launch support."},
  ];

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>

      {signed&&(
        <div style={{background:c.GREEN+"0c",border:`1.5px solid ${c.GREEN}33`,borderRadius:10,padding:"28px 24px",textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:32,marginBottom:8}}>{"\u2713"}</div>
          <div style={{fontSize:20,fontWeight:900,color:c.GREEN,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Agreement Signed</div>
          <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:6}}>Service agreement confirmed — {signedDate}</div>
          <div style={{marginTop:20}}>
            <button onClick={downloadAgreementPdf} style={{padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:c.VIOLET,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>
              {"\u2193"} DOWNLOAD AGREEMENT PDF
            </button>
          </div>
        </div>
      )}

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
            <div style={{fontSize:11,color:c.VIOLET,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
            <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Service Agreement</div>
            <div style={{fontSize:13,color:c.SLATE,marginTop:4}}>
              Wizardry Ink Tattoo Studio — Website Redesign + AI Booking System
              <span style={{marginLeft:8,fontSize:10,fontWeight:700,color:c.VIOLET,background:c.VIOLET+"12",padding:"2px 8px",borderRadius:3,letterSpacing:1.5,verticalAlign:"middle"}}>
                TATTOO TRADE
              </span>
            </div>
          </div>

          <div style={{background:c.CARD,borderRadius:8,border:`1px solid ${c.EDGE}`,padding:"20px 24px",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12}}>PARTIES</div>
            {[{l:"Service Provider",v:"Anthony Tatis (Anthony's Brand Builder)"},{l:"Client",v:"Daisy — Wizardry Ink Tattoo Studio"},{l:"Date",v:today}].map(r=>(
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
                  <div><span style={{fontSize:10,color:c.VIOLET,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:8}}>{s.p}</span><span style={{fontSize:12,fontWeight:700,color:c.INK}}>{s.n}</span></div>
                  <div style={{display:"flex",gap:12,alignItems:"baseline"}}>
                    <span style={{fontSize:12,fontWeight:700,color:c.VIOLET,fontFamily:"Inter,sans-serif"}}>{s.fee}</span>
                    <span style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{s.when}</span>
                  </div>
                </div>
                <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:4,paddingLeft:4}}>{s.desc}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"12px 0",borderBottom:`2px solid ${c.VIOLET}44`}}>
              <span style={{fontSize:12,fontWeight:800,color:c.INK,letterSpacing:1}}>TOTAL PROJECT VALUE</span>
              <span style={{fontSize:16,fontWeight:900,color:c.VIOLET,fontFamily:"Inter,sans-serif"}}>$3,800</span>
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>ENGAGEMENT TYPE</div>
            <div style={{fontSize:11,color:c.INK,lineHeight:1.7,fontFamily:"Inter,sans-serif",paddingLeft:4}}>
              This is a tattoo trade engagement. The total project value of $3,800 is exchanged for tattoo work of equivalent value. No monetary payment is required. The client retains full ownership of all digital deliverables upon completion.
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>TIMELINE</div>
            {scopePhases.map(i=>(
              <div key={i.p} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${c.EDGE}`}}>
                <div><span style={{fontSize:10,color:c.VIOLET,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:8}}>{i.p}</span><span style={{fontSize:12,color:c.INK}}>{i.n}</span></div>
                <span style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{i.when}</span>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>TERMS</div>
            {[
              {l:"Payment",b:"This is a tattoo trade engagement valued at $3,800. No monetary payment is required. Deliverables are exchanged for tattoo work of equivalent value."},
              {l:"Revisions",b:"Revision rounds are included as noted per phase. Additional revisions accommodated within reason."},
              {l:"Client Responsibilities",b:"Client is responsible for providing portfolio images, artist bios, pricing guidelines, scheduling preferences, and review feedback. Delays may extend delivery."},
              {l:"Ownership",b:"Client retains full ownership of all deliverables — website, booking system, content, and documentation."},
              {l:"Cancellation",b:"Either party may cancel with written notice. Completed work remains property of the client. Outstanding tattoo trade obligations are settled between parties."},
            ].map(t=>(
              <div key={t.l} style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:c.VIOLET,letterSpacing:1,marginBottom:2}}>{t.l}</div>
                <div style={{fontSize:11,color:c.INK,lineHeight:1.6,fontFamily:"Inter,sans-serif",paddingLeft:8}}>{t.b}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>ACKNOWLEDGEMENT</div>
            <div style={{fontSize:11,color:c.SLATE,lineHeight:1.7,fontFamily:"Inter,sans-serif"}}>
              By signing below, both parties confirm they have read and agree to the terms outlined in this agreement. This document serves as a binding service agreement between Anthony Tatis and Wizardry Ink Tattoo Studio.
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
              <div style={{background:c.CARD,border:`1px solid ${signed?c.GREEN+"33":c.VIOLET+"33"}`,borderRadius:8,padding:"16px 20px"}}>
                {signed?(
                  <>
                    {sigData&&sigData.startsWith("data:image")?(
                      <img src={sigData} alt="signature" style={{height:50,marginBottom:8}}/>
                    ):(
                      <div style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:400,fontStyle:"italic",color:c.INK,marginBottom:8}}>Daisy</div>
                    )}
                    <div style={{borderTop:`1px solid ${c.EDGE}`,paddingTop:8}}>
                      <div style={{fontSize:11,fontWeight:600,color:c.INK}}>Daisy — Wizardry Ink Tattoo Studio</div>
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
                      <button onClick={confirmSig} disabled={saving} style={{flex:1,padding:"8px 0",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",background:c.VIOLET,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",opacity:saving?0.7:1}}>
                        {saving?"SAVING\u2026":"CONFIRM SIGNATURE"}
                      </button>
                      <button onClick={clearSig} style={{padding:"8px 14px",fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",background:"transparent",color:c.SLATE,border:`1px solid ${c.EDGE}`,borderRadius:4,cursor:"pointer",letterSpacing:1}}>CLEAR</button>
                    </div>
                    <div style={{borderTop:`1px solid ${c.EDGE}`,paddingTop:8,marginTop:10}}>
                      <div style={{fontSize:11,fontWeight:600,color:c.SLATE}}>Daisy — Wizardry Ink Tattoo Studio</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{textAlign:"center",marginTop:32,fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>
            Anthony's Brand Builder {"\u00B7"} Anthony Tatis {"\u00B7"} tatis.anthony@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MILESTONE DELIVERABLES
   ═══════════════════════════════════════ */
function MilestoneDeliverables({milestoneKey,c,isOps,deliverables,onAdd,onRemove}){
  const [adding,setAdding]=useState(false);
  const [label,setLabel]=useState("");
  const [url,setUrl]=useState("");
  const [type,setType]=useState("screenshot");

  const items=(deliverables||[]).filter(d=>d.milestoneKey===milestoneKey);

  const submit=()=>{
    if(!label.trim()||!url.trim())return;
    onAdd({milestoneKey,label:label.trim(),url:url.trim(),type});
    setLabel("");setUrl("");setType("screenshot");setAdding(false);
  };

  const isPdf=(u)=>u.toLowerCase().endsWith(".pdf");
  const isImg=(u)=>/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(u)||u.includes("screenshot")||u.includes("imgur")||u.includes("cloudinary");

  return(
    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${c.EDGE}44`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{fontSize:9,fontWeight:700,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>DELIVERABLES</div>
        {isOps&&!adding&&(
          <button onClick={()=>setAdding(true)} style={{fontSize:10,fontWeight:600,color:c.VIOLET,background:c.VIOLET+"0c",border:`1px solid ${c.VIOLET}22`,borderRadius:4,padding:"3px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:0.5}}>+ ADD</button>
        )}
      </div>

      {items.length===0&&!adding&&(
        <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",fontStyle:"italic",padding:"4px 0"}}>No deliverables uploaded yet</div>
      )}

      {items.map(d=>(
        <div key={d._id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:c.DEEP,borderRadius:6,marginBottom:4,border:`1px solid ${c.EDGE}44`}}>
          <div style={{width:24,height:24,borderRadius:4,background:isPdf(d.url)?c.EMBER+"14":c.VIOLET+"14",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:10,fontWeight:700,color:isPdf(d.url)?c.EMBER:c.VIOLET,fontFamily:"Inter,sans-serif"}}>{isPdf(d.url)?"PDF":isImg(d.url)?"IMG":"URL"}</span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:12,fontWeight:500,color:c.VIOLET,textDecoration:"underline",fontFamily:"Inter,sans-serif"}} onClick={e=>e.stopPropagation()}>{d.label}</a>
            <div style={{fontSize:9,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:1}}>
              {d.type==="screenshot"?"Screenshot":d.type==="pdf"?"PDF Document":"Link"} {"\u00B7"} {new Date(d.addedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
            </div>
          </div>
          {isOps&&(
            <button onClick={e=>{e.stopPropagation();onRemove(d._id)}} style={{fontSize:12,color:c.SLATE,background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:3,lineHeight:1}} title="Remove">{"\u00D7"}</button>
          )}
        </div>
      ))}

      {adding&&(
        <div style={{background:c.DEEP,borderRadius:6,padding:"12px 14px",border:`1px solid ${c.VIOLET}22`,marginTop:4}}>
          <div style={{display:"flex",gap:6,marginBottom:8}}>
            {[{v:"screenshot",l:"Screenshot"},{v:"pdf",l:"PDF"},{v:"link",l:"Link"}].map(o=>(
              <button key={o.v} onClick={()=>setType(o.v)} style={{fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"4px 10px",borderRadius:3,cursor:"pointer",border:`1px solid ${type===o.v?c.VIOLET+"44":c.EDGE}`,background:type===o.v?c.VIOLET+"0c":"transparent",color:type===o.v?c.VIOLET:c.SLATE}}>{o.l}</button>
            ))}
          </div>
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. Homepage wireframe)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:6}}/>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL (paste link to image, PDF, or page)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
          <div style={{display:"flex",gap:6}}>
            <button onClick={submit} style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 16px",background:c.VIOLET,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>SAVE</button>
            <button onClick={()=>{setAdding(false);setLabel("");setUrl("")}} style={{fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",padding:"6px 12px",background:"transparent",color:c.SLATE,border:`1px solid ${c.EDGE}`,borderRadius:4,cursor:"pointer"}}>CANCEL</button>
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
      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:700,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>PROJECT COMPLETION</span>
          <span style={{fontFamily:"Inter,sans-serif"}}>
            <span style={{fontSize:28,fontWeight:700,color:ov.pct===100?c.GREEN:c.VIOLET}}>{ov.pct}%</span>
            <span style={{fontSize:11,color:c.SLATE,marginLeft:8}}>{ov.done}/{ov.total}</span>
          </span>
        </div>
        <Bar pct={ov.pct} h={10} glow c={c}/>
      </div>

      <div style={{padding:"20px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
        {phases.map(p=>{
          const prog=phaseProgress(p,tasks);const active=activePhase===p.id;const done=prog.pct===100;
          return(
            <button key={p.id} onClick={()=>setActivePhase(p.id)} style={{
              padding:"14px 16px",textAlign:"left",cursor:"pointer",fontFamily:"Inter,sans-serif",
              background:active?c.CARD:c.BG,borderRadius:8,border:`1.5px solid ${active?c.VIOLET:done?c.GREEN+"44":c.EDGE}`,position:"relative",overflow:"hidden",
            }}>
              {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c.VIOLET}}/>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:20}}>{p.icon}</span>
                <span style={{fontSize:11,fontWeight:700,fontFamily:"Inter,sans-serif",color:done?c.GREEN:active?c.VIOLET:c.SLATE}}>{prog.pct}%</span>
              </div>
              <div style={{fontSize:12,fontWeight:800,color:active?c.INK:c.SLATE,letterSpacing:1.5,marginTop:6}}>{p.name}</div>
              <div style={{fontSize:9,color:c.SLATE,marginTop:2,fontFamily:"Inter,sans-serif"}}>PHASE {p.id} {"\u2014"} {p.short}</div>
              <div style={{marginTop:8}}><Bar pct={prog.pct} h={3} c={c}/></div>
            </button>
          );
        })}
      </div>

      {phase&&(
        <div style={{padding:"0 24px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,paddingBottom:16,borderBottom:`1px solid ${c.EDGE}`,marginBottom:20}}>
            <div>
              <span style={{fontSize:11,fontWeight:600,color:c.VIOLET,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>PHASE {phase.id}</span>
              <span style={{fontSize:24,fontWeight:900,color:c.INK,letterSpacing:1,marginLeft:12,fontFamily:"'Playfair Display',serif"}}>{phase.name}</span>
              <div style={{fontSize:13,color:c.SLATE,marginTop:2,letterSpacing:0.5}}>{phase.subtitle}</div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {phase.milestones.map((m)=>{
              const mDone=m.tasks.filter((_,ti)=>tasks[`${phase.id}-${m.title}-${ti}`]).length;
              const mPct=m.tasks.length?Math.round(mDone/m.tasks.length*100):0;
              const complete=mPct===100;
              const exp=expanded[`${phase.id}-${m.title}`];
              return(
                <div key={m.title} style={{background:c.CARD,borderRadius:8,overflow:"hidden",border:`1px solid ${complete?c.GREEN+"33":c.EDGE}`}}>
                  <div onClick={()=>toggleM(`${phase.id}-${m.title}`)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:complete?c.GREEN+"06":"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <div style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:complete?c.GREEN+"14":c.DEEP,border:`1px solid ${complete?c.GREEN+"33":c.EDGE}`,fontSize:12,fontWeight:700,color:complete?c.GREEN:c.VIOLET,fontFamily:"Inter,sans-serif",flexShrink:0}}>
                        {complete?"\u2713":mDone}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:c.INK,letterSpacing:0.5}}>{m.title}</div>
                        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:2}}>{m.clientDesc}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:complete?c.GREEN:c.VIOLET,fontFamily:"Inter,sans-serif"}}>{mPct}%</span>
                      <span style={{fontSize:14,color:c.SLATE,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0deg)"}}>{"\u25BC"}</span>
                    </div>
                  </div>

                  {exp&&(
                    <div style={{padding:"0 20px 16px"}}>
                      <div style={{marginTop:4}}><Bar pct={mPct} h={3} c={c}/></div>
                      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:2}}>
                        {m.tasks.map((t,ti)=>{
                          const key=`${phase.id}-${m.title}-${ti}`;
                          const done=tasks[key];
                          return(
                            <div key={ti} onClick={()=>toggle(key)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",borderRadius:4,cursor:view==="internal"?"pointer":"default",background:done?c.GREEN+"06":"transparent",transition:"background 0.15s"}}>
                              <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${done?c.GREEN:c.EDGE}`,background:done?c.GREEN:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.15s"}}>
                                {done&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>{"\u2713"}</span>}
                              </div>
                              <span style={{fontSize:12,color:done?c.SLATE:c.INK,fontFamily:"Inter,sans-serif",lineHeight:1.5,textDecoration:done?"line-through":"none",opacity:done?0.7:1}}>{t.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <MilestoneDeliverables
                        milestoneKey={`${phase.id}-${m.title}`}
                        c={c}
                        isOps={view==="internal"}
                        deliverables={deliverables}
                        onAdd={onAddDeliverable}
                        onRemove={onRemoveDeliverable}
                      />
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
   MAIN HUB
   ═══════════════════════════════════════ */
export default function WizardryHub({defaultView="client",opsMode=false}){
  const [view,setView]=useState(defaultView);
  const [page,setPage]=useState("workflow");
  const [dark,setDark]=useState(()=>{const s=localStorage.getItem("wizardry-dark");return s?s==="true":true;});
  const c=dark?darkColors:lightColors;

  useEffect(()=>{localStorage.setItem("wizardry-dark",String(dark))},[dark]);

  const tasks=useQuery(api.wizardryTasks.getTasks,{projectId:"wizardry-ink"})??{};
  const setTaskMutation=useMutation(api.wizardryTasks.setTask);
  const deliverables=useQuery(api.wizardryTasks.getDeliverables,{projectId:"wizardry-ink"})??[];
  const addDeliverableMutation=useMutation(api.wizardryTasks.addDeliverable);
  const removeDeliverableMutation=useMutation(api.wizardryTasks.removeDeliverable);

  const onToggle=(key)=>{
    setTaskMutation({projectId:"wizardry-ink",key,value:!tasks[key]});
  };
  const onAddDeliverable=(d)=>{
    addDeliverableMutation({projectId:"wizardry-ink",...d,addedAt:Date.now()});
  };
  const onRemoveDeliverable=(id)=>{
    removeDeliverableMutation({id});
  };

  const pages=[
    {key:"workflow",label:"Workflow"},
    {key:"scope",label:"Scope"},
    {key:"agreement",label:"Agreement"},
  ];

  return(
    <ErrorBoundary>
      <Grain/>
      <div style={{minHeight:"100vh",background:c.BG,color:c.INK,fontFamily:"Inter,sans-serif",transition:"background 0.3s,color 0.3s"}}>
        {/* Header */}
        <header style={{padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${c.EDGE}`,background:c.CARD}}>
          <div>
            <div style={{fontSize:20,fontWeight:900,letterSpacing:2,fontFamily:"'Playfair Display',serif",color:c.INK}}>WIZARDRY INK</div>
            <div style={{fontSize:10,color:c.VIOLET,letterSpacing:3,fontFamily:"Inter,sans-serif",marginTop:2}}>PROJECT HUB</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {opsMode&&(
              <button onClick={()=>setView(v=>v==="internal"?"client":"internal")} style={{fontSize:10,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",padding:"6px 14px",borderRadius:4,cursor:"pointer",border:`1px solid ${c.VIOLET}44`,background:view==="internal"?c.VIOLET+"14":"transparent",color:view==="internal"?c.VIOLET:c.SLATE}}>
                {view==="internal"?"OPS":"CLIENT"}
              </button>
            )}
            <button onClick={()=>setDark(d=>!d)} style={{fontSize:16,background:"transparent",border:`1px solid ${c.EDGE}`,borderRadius:4,padding:"4px 10px",cursor:"pointer",color:c.SLATE}}>
              {dark?"\u2600":"\u263E"}
            </button>
          </div>
        </header>

        {/* Nav */}
        <nav style={{display:"flex",gap:0,borderBottom:`1px solid ${c.EDGE}`,background:c.CARD}}>
          {pages.map(p=>(
            <button key={p.key} onClick={()=>setPage(p.key)} style={{
              padding:"12px 24px",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",
              background:"transparent",border:"none",borderBottom:page===p.key?`2px solid ${c.VIOLET}`:"2px solid transparent",
              color:page===p.key?c.VIOLET:c.SLATE,cursor:"pointer",transition:"all 0.15s",
            }}>{p.label.toUpperCase()}</button>
          ))}
        </nav>

        {/* Content */}
        <main style={{maxWidth:960,margin:"0 auto"}}>
          {page==="workflow"&&<WorkflowPage view={view} tasks={tasks} onToggle={onToggle} c={c} deliverables={deliverables} onAddDeliverable={onAddDeliverable} onRemoveDeliverable={onRemoveDeliverable}/>}
          {page==="scope"&&<ScopePage c={c}/>}
          {page==="agreement"&&<AgreementPage c={c}/>}
        </main>

        {/* Footer */}
        <footer style={{textAlign:"center",padding:"32px 24px",fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",borderTop:`1px solid ${c.EDGE}`,marginTop:40}}>
          Anthony's Brand Builder {"\u00B7"} {new Date().getFullYear()} {"\u00B7"} Built for Wizardry Ink Tattoo Studio
        </footer>
      </div>
    </ErrorBoundary>
  );
}
