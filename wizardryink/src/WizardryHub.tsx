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
        <pre style={{fontSize:11,color:"#94a3b8",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{String(this.state.error)}</pre>
        <button onClick={()=>window.location.reload()} style={{marginTop:16,padding:"8px 20px",fontSize:12,background:"#f97316",color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>Reload</button>
      </div>
    }
    return this.props.children;
  }
}

/* ── color system ── */
const ORANGE="#f97316",ORANGE2="#fb923c",DEEP_O="#ea580c",GREEN="#22c55e",EMBER="#ef4444";

const darkColors={
  ORANGE,ORANGE2,DEEP_O,GREEN,EMBER,
  BG:"#0f0a05",CARD:"#1a1005",DEEP:"#241808",INPUT:"#2e2010",
  EDGE:"#3d2c15",SLATE:"#a08060",STONE:"#d4b896",INK:"#f5ede0",
};
const lightColors={
  ORANGE,ORANGE2,DEEP_O,GREEN,EMBER,
  BG:"#fffbf5",CARD:"#ffffff",DEEP:"#fff3e0",INPUT:"#fde8cc",
  EDGE:"#f5cfa0",SLATE:"#8c6a45",STONE:"#4a3020",INK:"#1a0f05",
};

/* ── phases data ── */
const phases=[
  {id:1,name:"DISCOVER",subtitle:"Discovery & System Design",week:"WEEK 1",short:"INTAKE · DESIGN",icon:"\u{1F50D}",fee:"$400",
    milestones:[
      {title:"CLIENT INTAKE",clientDesc:"Understand Wizardry Ink's workflow, brand, and booking pain points.",
        tasks:[{label:"Complete the Studio Intake Questionnaire",blocker:true},{label:"Map current DM → booking flow (pain points, manual steps)"},{label:"Document artist roster, specialties, and availability patterns"},{label:"Identify integration points (Instagram DM, website, phone)"}]},
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
    <div style={{width:`${pct}%`,height:"100%",borderRadius:3,transition:"width 0.5s cubic-bezier(.4,0,.2,1)",background:pct===100?c.GREEN:`linear-gradient(90deg,${c.ORANGE},${c.ORANGE2})`,boxShadow:glow&&pct>0&&pct<100?`0 0 12px ${c.ORANGE}44`:"none"}}/>
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
      <div style={{fontSize:13,fontWeight:700,color:c.ORANGE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>{title}</div>
      {children}
    </div>
  );
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:11,color:c.ORANGE,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
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
        <div style={{background:c.ORANGE+"0c",border:`1px solid ${c.ORANGE}22`,borderRadius:8,padding:"16px 20px"}}>
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
            <div style={{fontSize:14,fontWeight:800,color:c.ORANGE,fontFamily:"Inter,sans-serif"}}>{p.fee}</div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"12px 16px",background:c.ORANGE+"0c",borderRadius:6,border:`1px solid ${c.ORANGE}33`,marginTop:4}}>
          <div style={{fontSize:14,fontWeight:800,color:c.INK,letterSpacing:1}}>TOTAL PROJECT VALUE</div>
          <div style={{fontSize:18,fontWeight:900,color:c.ORANGE,fontFamily:"Inter,sans-serif"}}>$3,800</div>
        </div>
      </Section>

      <Section title="PHASE DELIVERABLES">
        {phases.map(p=>(
          <div key={p.id} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:800,color:c.INK,letterSpacing:1,marginBottom:8}}>
              <span style={{color:c.ORANGE,marginRight:8}}>PHASE {p.id}</span>{p.name} — {p.subtitle}
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
            <div><span style={{fontSize:11,color:c.ORANGE,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:10}}>Phase {p.id}</span><span style={{fontSize:13,color:c.INK}}>{p.subtitle}</span></div>
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
            <div style={{fontSize:11,fontWeight:700,color:c.ORANGE,letterSpacing:1,marginBottom:2}}>{t.l}</div>
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
            <button onClick={downloadAgreementPdf} style={{padding:"10px 24px",fontSize:11,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:c.ORANGE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>
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
            <div style={{fontSize:11,color:c.ORANGE,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
            <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>Service Agreement</div>
            <div style={{fontSize:13,color:c.SLATE,marginTop:4}}>
              Wizardry Ink Tattoo Studio — Website Redesign + AI Booking System
              <span style={{marginLeft:8,fontSize:10,fontWeight:700,color:c.ORANGE,background:c.ORANGE+"12",padding:"2px 8px",borderRadius:3,letterSpacing:1.5,verticalAlign:"middle"}}>
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
                  <div><span style={{fontSize:10,color:c.ORANGE,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:8}}>{s.p}</span><span style={{fontSize:12,fontWeight:700,color:c.INK}}>{s.n}</span></div>
                  <div style={{display:"flex",gap:12,alignItems:"baseline"}}>
                    <span style={{fontSize:12,fontWeight:700,color:c.ORANGE,fontFamily:"Inter,sans-serif"}}>{s.fee}</span>
                    <span style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>{s.when}</span>
                  </div>
                </div>
                <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:4,paddingLeft:4}}>{s.desc}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"12px 0",borderBottom:`2px solid ${c.ORANGE}44`}}>
              <span style={{fontSize:12,fontWeight:800,color:c.INK,letterSpacing:1}}>TOTAL PROJECT VALUE</span>
              <span style={{fontSize:16,fontWeight:900,color:c.ORANGE,fontFamily:"Inter,sans-serif"}}>$3,800</span>
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
                <div><span style={{fontSize:10,color:c.ORANGE,fontWeight:700,fontFamily:"Inter,sans-serif",marginRight:8}}>{i.p}</span><span style={{fontSize:12,color:c.INK}}>{i.n}</span></div>
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
                <div style={{fontSize:11,fontWeight:700,color:c.ORANGE,letterSpacing:1,marginBottom:2}}>{t.l}</div>
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
              <div style={{background:c.CARD,border:`1px solid ${signed?c.GREEN+"33":c.ORANGE+"33"}`,borderRadius:8,padding:"16px 20px"}}>
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
                      <button onClick={confirmSig} disabled={saving} style={{flex:1,padding:"8px 0",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",background:c.ORANGE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",opacity:saving?0.7:1}}>
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
function DocViewer({d,c,onClose}){
  const slides=d.markdownContent?(d.markdownContent.split(/\n---\n/).filter(s=>s.trim())):null;
  const isSlides=slides&&slides.length>1;
  const [slide,setSlide]=useState(0);
  const [viewMode,setViewMode]=useState(isSlides?"slides":"doc");

  const renderHtml=(md)=>{marked.setOptions({breaks:true,gfm:true});return marked.parse(md||"")};

  const downloadMd=()=>{
    const blob=new Blob([d.markdownContent],{type:"text/markdown"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);
    a.download=d.label.replace(/[^a-z0-9]+/gi,"-").toLowerCase()+".md";a.click();URL.revokeObjectURL(a.href);
  };

  const isPdf=(u)=>u&&u.toLowerCase().endsWith(".pdf");
  const isImg=(u)=>u&&(/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(u)||u.includes("screenshot")||u.includes("imgur")||u.includes("cloudinary"));
  const isContent=!!(d.markdownContent&&d.markdownContent.length>0);

  const proseStyles=`
    .doc-prose{font-family:'Inter',sans-serif;font-size:14px;line-height:1.8;color:${c.INK};}
    .doc-prose h1{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:${c.INK};margin:0 0 16px;letter-spacing:-0.3px;border-bottom:2px solid ${c.ORANGE}22;padding-bottom:10px;}
    .doc-prose h2{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:${c.INK};margin:28px 0 10px;letter-spacing:-0.2px;}
    .doc-prose h3{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;color:${c.ORANGE};text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;}
    .doc-prose p{margin:0 0 14px;}
    .doc-prose strong{font-weight:700;color:${c.INK};}
    .doc-prose em{font-style:italic;color:${c.STONE};}
    .doc-prose ul,.doc-prose ol{margin:0 0 14px;padding-left:22px;}
    .doc-prose li{margin-bottom:5px;}
    .doc-prose a{color:${c.ORANGE};text-decoration:underline;}
    .doc-prose blockquote{border-left:3px solid ${c.ORANGE};margin:0 0 14px;padding:10px 16px;background:${c.ORANGE}08;color:${c.STONE};font-style:italic;border-radius:0 6px 6px 0;}
    .doc-prose code{font-family:'Courier New',monospace;font-size:12px;background:${c.DEEP};padding:2px 6px;border-radius:3px;color:${c.DEEP_O};}
    .doc-prose pre{background:${c.DEEP};border:1px solid ${c.EDGE};border-radius:6px;padding:14px 16px;overflow-x:auto;margin:0 0 14px;}
    .doc-prose pre code{background:none;padding:0;}
    .doc-prose table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:13px;}
    .doc-prose th{background:${c.ORANGE}10;color:${c.DEEP_O};font-weight:700;text-align:left;padding:8px 12px;border-bottom:2px solid ${c.ORANGE}33;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;}
    .doc-prose td{padding:8px 12px;border-bottom:1px solid ${c.EDGE};vertical-align:top;}
    .doc-prose tr:last-child td{border-bottom:none;}
    .doc-prose img{max-width:100%;border-radius:8px;margin:8px 0;}
    .doc-prose hr{border:none;border-top:1px solid ${c.EDGE};margin:24px 0;}
    .slide-prose{display:flex;flex-direction:column;justify-content:center;min-height:340px;padding:32px 40px;}
    .slide-prose h1{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:${c.INK};margin:0 0 20px;text-align:center;}
    .slide-prose h2{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:${c.INK};margin:0 0 14px;}
    .slide-prose h3{font-size:11px;font-weight:700;color:${c.ORANGE};text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;}
    .slide-prose p{font-size:15px;line-height:1.7;margin:0 0 12px;color:${c.INK};}
    .slide-prose ul,.slide-prose ol{padding-left:20px;margin:0 0 12px;}
    .slide-prose li{font-size:14px;line-height:1.6;margin-bottom:6px;}
    .slide-prose strong{font-weight:700;}
    .slide-prose table{width:100%;border-collapse:collapse;font-size:13px;margin:0 0 12px;}
    .slide-prose th{background:${c.ORANGE}10;color:${c.DEEP_O};font-weight:700;padding:7px 10px;border-bottom:2px solid ${c.ORANGE}33;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
    .slide-prose td{padding:7px 10px;border-bottom:1px solid ${c.EDGE};}
    .slide-prose blockquote{border-left:3px solid ${c.ORANGE};padding:10px 16px;background:${c.ORANGE}08;color:${c.STONE};font-style:italic;border-radius:0 6px 6px 0;margin:0 0 12px;}
  `;

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{proseStyles}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:c.BG,borderRadius:14,width:"100%",maxWidth:820,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${c.EDGE}`,boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>
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
                <button key={v} onClick={()=>{setViewMode(v);setSlide(0)}} style={{padding:"4px 12px",fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",background:viewMode===v?c.ORANGE:"transparent",color:viewMode===v?"#fff":c.SLATE,border:"none",cursor:"pointer"}}>{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          {isContent&&(
            <button onClick={downloadMd} style={{fontSize:10,fontWeight:700,letterSpacing:0.5,fontFamily:"Inter,sans-serif",padding:"5px 12px",background:c.ORANGE+"0c",color:c.ORANGE,border:`1px solid ${c.ORANGE}33`,borderRadius:4,cursor:"pointer",flexShrink:0}}>↓ .md</button>
          )}
          <button onClick={onClose} style={{fontSize:18,color:c.SLATE,background:"none",border:"none",cursor:"pointer",lineHeight:1,padding:"0 4px",flexShrink:0}}>×</button>
        </div>

        {isContent&&viewMode==="doc"&&(
          <div style={{overflowY:"auto",flex:1,padding:"28px 36px"}}>
            <div className="doc-prose" dangerouslySetInnerHTML={{__html:renderHtml(d.markdownContent)}}/>
          </div>
        )}

        {isContent&&viewMode==="slides"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{flex:1,overflowY:"auto",background:c.BG}}>
              <div className="doc-prose slide-prose" dangerouslySetInnerHTML={{__html:renderHtml(slides[slide])}}/>
            </div>
            <div style={{borderTop:`1px solid ${c.EDGE}`,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:c.CARD,flexShrink:0}}>
              <button onClick={()=>setSlide(s=>Math.max(0,s-1))} disabled={slide===0} style={{fontSize:18,background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,color:slide===0?c.EDGE:c.SLATE,cursor:slide===0?"default":"pointer",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {slides.map((_,i)=>(
                  <button key={i} onClick={()=>setSlide(i)} style={{width:i===slide?20:7,height:7,borderRadius:4,background:i===slide?c.ORANGE:c.EDGE,border:"none",cursor:"pointer",transition:"all 0.2s",padding:0}}/>
                ))}
              </div>
              <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} disabled={slide===slides.length-1} style={{fontSize:18,background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,color:slide===slides.length-1?c.EDGE:c.SLATE,cursor:slide===slides.length-1?"default":"pointer",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </div>
          </div>
        )}

        {!isContent&&isImg(d.url)&&(
          <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",alignItems:"center",padding:24,gap:16,background:c.DEEP}}>
            <img src={d.url} alt={d.label} style={{maxWidth:"100%",maxHeight:"60vh",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.3)",objectFit:"contain"}}/>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 18px",background:c.ORANGE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none"}}>↗ OPEN FULL SIZE</a>
          </div>
        )}

        {!isContent&&!isImg(d.url)&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:40}}>
            <div style={{fontSize:40}}>{isPdf(d.url)?"📄":"🔗"}</div>
            <div style={{fontSize:14,fontWeight:600,color:c.INK,fontFamily:"Inter,sans-serif",textAlign:"center"}}>{d.label}</div>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"8px 24px",background:c.ORANGE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none"}}>↗ OPEN {isPdf(d.url)?"PDF":"LINK"}</a>
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

  const btnSm=(active)=>({fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",padding:"3px 8px",borderRadius:3,cursor:"pointer",border:`1px solid ${active?c.ORANGE+"44":c.EDGE}`,background:active?c.ORANGE+"0c":"transparent",color:active?c.ORANGE:c.SLATE});

  return(
    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${c.EDGE}44`}}>
      {viewing&&<DocViewer d={viewing} c={c} onClose={()=>setViewing(null)}/>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{fontSize:9,fontWeight:700,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>DELIVERABLES</div>
        {isOps&&!adding&&(
          <button onClick={()=>setAdding(true)} style={{fontSize:10,fontWeight:600,color:c.ORANGE,background:c.ORANGE+"0c",border:`1px solid ${c.ORANGE}22`,borderRadius:4,padding:"3px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:0.5}}>+ ADD</button>
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
        const typeBg=isContent?c.DEEP_O+"14":isImgUrl?c.GREEN+"14":isPdfUrl?c.EMBER+"14":c.ORANGE+"14";
        const typeColor=isContent?c.DEEP_O:isImgUrl?c.GREEN:isPdfUrl?c.EMBER:c.ORANGE;
        return(
          <div key={d._id} onClick={()=>setViewing(d)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:c.CARD,borderRadius:8,marginBottom:6,border:`1px solid ${c.EDGE}`,cursor:"pointer",transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=c.ORANGE+"44"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=c.EDGE}>
            <div style={{width:36,height:36,borderRadius:6,background:typeBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${typeColor}22`}}>
              <span style={{fontSize:9,fontWeight:800,color:typeColor,fontFamily:"Inter,sans-serif",letterSpacing:0.5}}>{typeLabel}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:c.INK,fontFamily:"Inter,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
              <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:2}}>
                {isContent?"Agent document · Click to read":isImgUrl?"Image · Click to view":isPdfUrl?"PDF Document · Click to open":"External link · Click to open"}
                {" · "}{new Date(d.addedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
              </div>
            </div>
            <div style={{fontSize:14,color:c.SLATE,flexShrink:0}}>›</div>
            {isOps&&(
              <button onClick={e=>{e.stopPropagation();onRemove(d._id)}} style={{fontSize:14,color:c.SLATE,background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:3,lineHeight:1,flexShrink:0}} title="Remove">×</button>
            )}
          </div>
        );
      })}

      {adding&&(
        <div style={{background:c.DEEP,borderRadius:6,padding:"12px 14px",border:`1px solid ${c.ORANGE}22`,marginTop:4}}>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <button onClick={()=>setAddMode("url")} style={btnSm(addMode==="url")}>URL / File</button>
            <button onClick={()=>setAddMode("content")} style={btnSm(addMode==="content")}>Paste Content</button>
          </div>
          {addMode==="url"&&(
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {[{v:"screenshot",l:"Screenshot"},{v:"pdf",l:"PDF"},{v:"link",l:"Link"}].map(o=>(
                <button key={o.v} onClick={()=>setType(o.v)} style={{fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"4px 10px",borderRadius:3,cursor:"pointer",border:`1px solid ${type===o.v?c.ORANGE+"44":c.EDGE}`,background:type===o.v?c.ORANGE+"0c":"transparent",color:type===o.v?c.ORANGE:c.SLATE}}>{o.l}</button>
              ))}
            </div>
          )}
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. Brand Positioning Doc)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:6}}/>
          {addMode==="url"?(
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL (paste link to image, PDF, or page)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
          ):(
            <textarea value={mdContent} onChange={e=>setMdContent(e.target.value)} placeholder="Paste markdown content here…" rows={8} style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:11,fontFamily:"'Courier New',monospace",outline:"none",boxSizing:"border-box",marginBottom:8,resize:"vertical",lineHeight:1.6}}/>
          )}
          <div style={{display:"flex",gap:6}}>
            <button onClick={submit} style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 16px",background:c.ORANGE,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>SAVE</button>
            <button onClick={()=>{setAdding(false);setLabel("");setUrl("");setMdContent("");}} style={{fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",padding:"6px 12px",background:"transparent",color:c.SLATE,border:`1px solid ${c.EDGE}`,borderRadius:4,cursor:"pointer"}}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   USER FLOW ANIMATION PAGE
   ═══════════════════════════════════════ */
const flowSteps=[
  {id:"inquiry",icon:"\u{1F4F1}",label:"Client Inquiry",desc:"Client sends a DM on Instagram or submits a booking form on the website with tattoo details.",actor:"CLIENT",color:"#3b82f6"},
  {id:"ai-process",icon:"\u{1F916}",label:"AI Processes Inquiry",desc:"AI extracts tattoo details — size, style, placement, color, complexity — and structures the data.",actor:"SYSTEM",color:"#f97316"},
  {id:"quote",icon:"\u{1F4B0}",label:"Quote Generated",desc:"AI calculates a price range based on the tattoo parameters and suggests the best-matched artist.",actor:"SYSTEM",color:"#f97316"},
  {id:"swipe",icon:"\u{1F4A5}",label:"Daisy Reviews",desc:"Quote card appears on Daisy's dashboard. Swipe right to approve and confirm artist, swipe left to edit or reassign.",actor:"DAISY",color:"#f59e0b"},
  {id:"artist-notify",icon:"\u{1F514}",label:"Artist Notified",desc:"Assigned artist receives a push notification with booking details — client, style, date, and time slot.",actor:"ARTIST",color:"#22c55e"},
  {id:"end-time",icon:"\u{23F1}",label:"Artist Sets End Time",desc:"Artist reviews the appointment and sets the end time based on the tattoo's complexity and their pace.",actor:"ARTIST",color:"#22c55e"},
  {id:"overlap-check",icon:"\u{1F6E1}",label:"Overlap Prevention",desc:"System validates the booking against existing appointments. No conflicts? Proceed. Overlap detected? Flag it.",actor:"SYSTEM",color:"#f97316"},
  {id:"client-confirm",icon:"\u2709\uFE0F",label:"Client Confirmation",desc:"Client receives a confirmation notification with their quote, assigned artist, date, and time.",actor:"CLIENT",color:"#3b82f6"},
  {id:"booked",icon:"\u2705",label:"Appointment Booked",desc:"Booking is locked in. Daisy's calendar is updated. No overlaps. Everyone's aligned.",actor:"SYSTEM",color:"#22c55e"},
];

function UserFlowPage({c}){
  const [activeStep,setActiveStep]=useState(-1);
  const [playing,setPlaying]=useState(false);
  const [hasPlayed,setHasPlayed]=useState(false);
  const timerRef=useRef<any>(null);

  const play=()=>{
    setPlaying(true);setHasPlayed(true);setActiveStep(-1);
    let i=0;
    const tick=()=>{
      setActiveStep(i);
      i++;
      if(i<flowSteps.length){timerRef.current=setTimeout(tick,1800);}
      else{timerRef.current=setTimeout(()=>setPlaying(false),1200);}
    };
    timerRef.current=setTimeout(tick,600);
  };

  useEffect(()=>{
    const t=setTimeout(play,800);
    return()=>{clearTimeout(t);if(timerRef.current)clearTimeout(timerRef.current)};
  },[]);

  const replay=()=>{
    if(timerRef.current)clearTimeout(timerRef.current);
    setPlaying(false);
    setTimeout(play,100);
  };

  const actorColors={CLIENT:"#3b82f6",SYSTEM:c.ORANGE,DAISY:"#f59e0b",ARTIST:"#22c55e"};
  const actorLabels={CLIENT:"Client",SYSTEM:"System",DAISY:"Daisy (Owner)",ARTIST:"Artist"};

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:11,color:c.ORANGE,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>AI BOOKING PIPELINE</div>
        <div style={{fontSize:28,fontWeight:900,color:c.INK,letterSpacing:2,fontFamily:"'Playfair Display',serif"}}>User Flow</div>
        <div style={{fontSize:13,color:c.SLATE,marginTop:4}}>From first DM to confirmed appointment — fully automated</div>
      </div>

      {/* Legend */}
      <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:28,flexWrap:"wrap"}}>
        {Object.entries(actorLabels).map(([key,label])=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:actorColors[key]}}/>
            <span style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",letterSpacing:1,fontWeight:600}}>{label.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Flow */}
      <div style={{position:"relative",display:"flex",flexDirection:"column",gap:0}}>
        {flowSteps.map((step,i)=>{
          const isActive=activeStep>=i;
          const isCurrent=activeStep===i;
          const isLast=i===flowSteps.length-1;

          return(
            <div key={step.id} style={{position:"relative"}}>
              {/* Connector line */}
              {!isLast&&(
                <div style={{position:"absolute",left:27,top:56,width:2,height:40,background:activeStep>i?`linear-gradient(180deg,${step.color},${flowSteps[i+1].color})`:c.EDGE+"44",transition:"background 0.8s ease",zIndex:0}}>
                  {/* Pulse dot traveling down the line */}
                  {activeStep===i&&playing&&(
                    <div style={{
                      position:"absolute",top:0,left:-3,width:8,height:8,borderRadius:"50%",
                      background:step.color,boxShadow:`0 0 12px ${step.color}`,
                      animation:"flowPulse 1.8s ease-in-out infinite",
                    }}/>
                  )}
                </div>
              )}

              {/* Step card */}
              <div
                onClick={()=>{if(!playing)setActiveStep(i)}}
                style={{
                  display:"flex",gap:16,alignItems:"flex-start",padding:"16px 20px",
                  background:isCurrent?step.color+"10":isActive?c.CARD:"transparent",
                  borderRadius:12,border:`1.5px solid ${isCurrent?step.color+"55":isActive?c.EDGE:c.EDGE+"33"}`,
                  marginBottom:isLast?0:8,cursor:playing?"default":"pointer",
                  transform:isCurrent?"scale(1.02)":"scale(1)",
                  transition:"all 0.5s cubic-bezier(.4,0,.2,1)",
                  opacity:isActive?1:0.35,position:"relative",zIndex:1,
                }}
              >
                {/* Step number circle */}
                <div style={{
                  width:56,height:56,borderRadius:16,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
                  background:isCurrent?step.color+"1a":c.DEEP,
                  border:`2px solid ${isActive?step.color:c.EDGE+"44"}`,
                  boxShadow:isCurrent?`0 0 24px ${step.color}33`:"none",
                  transition:"all 0.5s ease",position:"relative",
                }}>
                  {step.icon}
                  {/* Ripple effect on current */}
                  {isCurrent&&playing&&(
                    <div style={{
                      position:"absolute",inset:-4,borderRadius:20,
                      border:`2px solid ${step.color}44`,
                      animation:"flowRipple 1.5s ease-out infinite",
                    }}/>
                  )}
                </div>

                {/* Content */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",padding:"2px 8px",borderRadius:3,background:actorColors[step.actor]+"18",color:actorColors[step.actor]}}>{step.actor}</span>
                    <span style={{fontSize:9,color:c.SLATE,fontFamily:"Inter,sans-serif"}}>STEP {i+1}</span>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:isActive?c.INK:c.SLATE,letterSpacing:0.5,transition:"color 0.5s"}}>{step.label}</div>
                  <div style={{
                    fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",lineHeight:1.6,marginTop:6,
                    maxHeight:isCurrent||(!playing&&isActive)?"100px":"0",overflow:"hidden",
                    opacity:isCurrent||(!playing&&isActive)?1:0,
                    transition:"all 0.5s ease",
                  }}>
                    {step.desc}
                  </div>
                </div>

                {/* Status indicator */}
                <div style={{
                  width:24,height:24,borderRadius:"50%",flexShrink:0,marginTop:4,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  background:isActive?step.color+"18":"transparent",
                  border:`1.5px solid ${isActive?step.color:c.EDGE+"44"}`,
                  transition:"all 0.5s ease",
                }}>
                  {isActive&&<span style={{fontSize:11,color:step.color,fontWeight:700}}>{"\u2713"}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Replay button */}
      <div style={{textAlign:"center",marginTop:32}}>
        <button onClick={replay} disabled={playing} style={{
          padding:"12px 32px",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",
          background:playing?"transparent":c.ORANGE,color:playing?c.SLATE:"#fff",
          border:playing?`1px solid ${c.EDGE}`:"none",borderRadius:6,cursor:playing?"default":"pointer",
          opacity:playing?0.5:1,transition:"all 0.3s",
        }}>
          {playing?"ANIMATING\u2026":"REPLAY FLOW"}
        </button>
      </div>

      {/* Summary stats */}
      {!playing&&hasPlayed&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:32,opacity:1,transition:"opacity 0.5s"}}>
          {[
            {label:"TOTAL STEPS",value:"9",sub:"Fully automated"},
            {label:"HUMAN TOUCHES",value:"2",sub:"Daisy swipe + Artist end time"},
            {label:"CLIENT EFFORT",value:"1",sub:"Submit inquiry — that's it"},
          ].map(s=>(
            <div key={s.label} style={{textAlign:"center",padding:"20px 12px",background:c.CARD,borderRadius:8,border:`1px solid ${c.EDGE}`}}>
              <div style={{fontSize:28,fontWeight:900,color:c.ORANGE,fontFamily:"Inter,sans-serif"}}>{s.value}</div>
              <div style={{fontSize:9,fontWeight:700,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif",marginTop:4}}>{s.label}</div>
              <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes flowRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes flowPulse {
          0% { top: 0; opacity: 1; }
          100% { top: 32px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   WORKFLOW PAGE
   ═══════════════════════════════════════ */
function WorkflowPage({view,tasks,onToggle,c,deliverables,onAddDeliverable,onRemoveDeliverable,discoveryData,onSubmitDiscovery}){
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
            <span style={{fontSize:28,fontWeight:700,color:ov.pct===100?c.GREEN:c.ORANGE}}>{ov.pct}%</span>
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
              background:active?c.CARD:c.BG,borderRadius:8,border:`1.5px solid ${active?c.ORANGE:done?c.GREEN+"44":c.EDGE}`,position:"relative",overflow:"hidden",
            }}>
              {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c.ORANGE}}/>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:20}}>{p.icon}</span>
                <span style={{fontSize:11,fontWeight:700,fontFamily:"Inter,sans-serif",color:done?c.GREEN:active?c.ORANGE:c.SLATE}}>{prog.pct}%</span>
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
              <span style={{fontSize:11,fontWeight:600,color:c.ORANGE,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>PHASE {phase.id}</span>
              <span style={{fontSize:24,fontWeight:900,color:c.INK,letterSpacing:1,marginLeft:12,fontFamily:"'Playfair Display',serif"}}>{phase.name}</span>
              <div style={{fontSize:13,color:c.SLATE,marginTop:2,letterSpacing:0.5}}>{phase.subtitle}</div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {phase.milestones.map((m)=>{
              const mDone=m.tasks.filter((_,ti)=>tasks[`${phase.id}-${m.title}-${ti}`]).length;
              const mPct=m.tasks.length?Math.round(mDone/m.tasks.length*100):0;
              const complete=mPct===100;
              const hasBlocker=m.tasks.some((t,ti)=>t.blocker&&!tasks[`${phase.id}-${m.title}-${ti}`]);
              const exp=expanded[`${phase.id}-${m.title}`];
              return(
                <div key={m.title} style={{background:c.CARD,borderRadius:8,overflow:"hidden",border:`1px solid ${complete?c.GREEN+"33":hasBlocker?c.EMBER+"33":c.EDGE}`}}>
                  <div onClick={()=>toggleM(`${phase.id}-${m.title}`)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:complete?c.GREEN+"06":"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <div style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:complete?c.GREEN+"14":c.DEEP,border:`1px solid ${complete?c.GREEN+"33":c.EDGE}`,fontSize:12,fontWeight:700,color:complete?c.GREEN:c.ORANGE,fontFamily:"Inter,sans-serif",flexShrink:0}}>
                        {complete?"\u2713":mDone}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:complete?c.GREEN:c.INK,letterSpacing:0.5}}>{m.title}{hasBlocker&&<span style={{fontSize:8,fontWeight:700,color:c.EMBER,background:c.EMBER+"14",padding:"2px 8px",borderRadius:3,marginLeft:8,letterSpacing:1.5,verticalAlign:"middle"}}>HAS BLOCKER</span>}</div>
                        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:2}}>{m.clientDesc}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:complete?c.GREEN:c.ORANGE,fontFamily:"Inter,sans-serif"}}>{mPct}%</span>
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
                              <span style={{fontSize:12,color:done?c.SLATE:c.INK,fontFamily:"Inter,sans-serif",lineHeight:1.5,textDecoration:done?"line-through":"none",opacity:done?0.7:1}}>{t.label}{t.blocker&&!done&&<span style={{fontSize:8,fontWeight:700,color:c.EMBER,background:c.EMBER+"14",padding:"1px 7px",borderRadius:3,marginLeft:8,letterSpacing:1.5}}>BLOCKER</span>}</span>
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
                      {phase.id===1&&m.title==="CLIENT INTAKE"&&(
                        <WizardryIntakeForm c={c} opsMode={view==="internal"} discoveryData={discoveryData} onSubmit={onSubmitDiscovery}/>
                      )}
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
   WIZARDRY INTAKE FORM (inline)
   ═══════════════════════════════════════ */
const wizardryQuestions=[
  {id:"studio_story",section:"YOUR STUDIO",label:"Tell us the Wizardry Ink story. How did the studio start?",type:"textarea",placeholder:"The origin — why tattoos, how it began, what makes this place yours..."},
  {id:"style_specialties",section:"YOUR STUDIO",label:"What tattoo styles does Wizardry Ink specialize in?",type:"textarea",placeholder:"e.g. fine line, blackwork, color realism, neo-trad, surrealism..."},
  {id:"artist_roster",section:"YOUR STUDIO",label:"Who are the artists currently at Wizardry Ink?",type:"text",placeholder:"List their names (e.g. Daisy, Lee, Al)"},
  {id:"target_client",section:"YOUR CLIENTS",label:"Who's your ideal client? What kind of person walks in and leaves raving?",type:"textarea",placeholder:"Demographics, vibe, what they're looking for, why they choose Wizardry..."},
  {id:"booking_volume",section:"YOUR CLIENTS",label:"How many appointments per week does the studio handle currently?",type:"text",placeholder:"e.g. 20–30 per week across all artists"},
  {id:"brand_vibe",section:"BRAND FEEL",label:"3–5 words that describe the Wizardry Ink vibe.",type:"text",placeholder:"e.g. Mystical, intimate, precise, bold, inclusive..."},
  {id:"style_direction",section:"BRAND FEEL",label:"Which aesthetic direction resonates most?",type:"select",options:["Mystical & Dark — gothic energy, occult aesthetic, dramatic","Clean & Fine — minimalist, fine line, upscale studio","Bold & Colorful — vibrant, expressive, festival energy","Gritty & Raw — traditional roots, ink-stained hands, authenticity"]},
  {id:"inspiration",section:"BRAND FEEL",label:"Any tattoo studios, artists, or brands whose look inspires you?",type:"textarea",placeholder:"Share names, Instagram handles, or describe the feeling..."},
  {id:"booking_pain",section:"CURRENT SITUATION",label:"What's the biggest pain with booking right now?",type:"textarea",placeholder:"What's manual, slow, or frustrating — what do you wish was just... handled?"},
  {id:"existing_site",section:"CURRENT SITUATION",label:"What's your current web presence?",type:"select",options:["No website — just Instagram","Have a website but it needs a full redesign","Have a website I mostly like but want improvements","Starting completely fresh"]},
];
function WizardryIntakeForm({c,opsMode,discoveryData,onSubmit}){
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);
  useEffect(()=>{if(discoveryData?.responses){try{setForm(JSON.parse(discoveryData.responses))}catch{}}},[discoveryData]);
  const submitted=!!(discoveryData?.submittedAt&&discoveryData.submittedAt>0);
  const update=(id,val)=>setForm(p=>({...p,[id]:val}));
  const fmt=(ts)=>new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  const handleSubmit=async()=>{
    const required=wizardryQuestions.filter(q=>q.type!=="select").slice(0,2);
    if(required.some(q=>!form[q.id]?.trim()))return;
    setSaving(true);try{await onSubmit(form);}finally{setSaving(false);}
  };
  const sections=[...new Set(wizardryQuestions.map(q=>q.section))];
  if(submitted){
    const summary=[{label:"Studio story",val:form.studio_story},{label:"Style specialties",val:form.style_specialties},{label:"Booking pain",val:form.booking_pain}].filter(s=>s.val);
    return(
      <div style={{borderTop:`1px solid ${c.EDGE}`,marginTop:16,paddingTop:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:c.GREEN+"06",border:`1px solid ${c.GREEN}22`,borderRadius:6,marginBottom:summary.length?12:0}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:c.GREEN+"20",border:`1.5px solid ${c.GREEN}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:c.GREEN,flexShrink:0,fontWeight:700}}>✓</div>
          <div style={{fontSize:12,fontWeight:700,color:c.GREEN,fontFamily:"Inter,sans-serif"}}>Studio Intake Submitted</div>
          {discoveryData?.submittedAt?<div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginLeft:"auto"}}>{fmt(discoveryData.submittedAt)}</div>:null}
          {opsMode&&<button onClick={async()=>{setSaving(true);try{await onSubmit(null)}finally{setSaving(false)}}} disabled={saving} style={{fontSize:10,color:c.SLATE,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:"Inter,sans-serif",padding:0,marginLeft:4,opacity:saving?0.5:1}}>{saving?"…":"Reset"}</button>}
        </div>
        {summary.length>0&&<div style={{display:"flex",flexDirection:"column",gap:6}}>{summary.slice(0,3).map(s=>(<div key={s.label} style={{padding:"8px 12px",background:c.CARD,borderRadius:5,border:`1px solid ${c.EDGE}`}}><div style={{fontSize:9,fontWeight:700,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif",marginBottom:2}}>{s.label.toUpperCase()}</div><div style={{fontSize:11,color:c.INK,fontFamily:"Inter,sans-serif",lineHeight:1.5}}>{s.val.length>120?s.val.slice(0,120)+"…":s.val}</div></div>))}</div>}
      </div>
    );
  }
  return(
    <div style={{borderTop:`1px solid ${c.EDGE}`,marginTop:16,paddingTop:16}}>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:9,fontWeight:700,color:c.ORANGE,letterSpacing:3,fontFamily:"Inter,sans-serif",textTransform:"uppercase",marginBottom:4}}>Studio Intake</div>
        <div style={{fontSize:11,color:c.SLATE,fontFamily:"Inter,sans-serif",lineHeight:1.5}}>Help us understand Wizardry Ink — your answers drive every design decision.</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:20,maxHeight:500,overflowY:"auto",paddingRight:4}}>
        {sections.map(section=>(
          <div key={section}>
            <div style={{fontSize:9,fontWeight:700,color:c.ORANGE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${c.EDGE}`}}>{section}</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {wizardryQuestions.filter(q=>q.section===section).map(q=>(
                <div key={q.id}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:c.INK,marginBottom:5,lineHeight:1.4}}>{q.label}</label>
                  {q.type==="textarea"?(<textarea value={form[q.id]||""} onChange={e=>update(q.id,e.target.value)} placeholder={q.placeholder} rows={2} style={{width:"100%",padding:"8px 10px",background:c.BG,border:`1px solid ${c.EDGE}`,borderRadius:5,color:c.INK,fontSize:11,fontFamily:"Inter,sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.5,transition:"border-color 0.15s"}} onFocus={e=>e.target.style.borderColor=c.ORANGE} onBlur={e=>e.target.style.borderColor=c.EDGE}/>
                  ):q.type==="select"?(<div style={{display:"flex",flexDirection:"column",gap:4}}>{q.options.map(opt=>(<label key={opt} onClick={()=>update(q.id,opt)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:form[q.id]===opt?c.ORANGE+"0c":c.BG,border:`1px solid ${form[q.id]===opt?c.ORANGE+"44":c.EDGE}`,borderRadius:5,cursor:"pointer",transition:"all 0.15s"}}><div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${form[q.id]===opt?c.ORANGE:c.EDGE}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{form[q.id]===opt&&<div style={{width:6,height:6,borderRadius:"50%",background:c.ORANGE}}/>}</div><span style={{fontSize:11,color:c.INK,fontFamily:"Inter,sans-serif"}}>{opt}</span></label>))}</div>
                  ):(<input type="text" value={form[q.id]||""} onChange={e=>update(q.id,e.target.value)} placeholder={q.placeholder} style={{width:"100%",padding:"8px 10px",background:c.BG,border:`1px solid ${c.EDGE}`,borderRadius:5,color:c.INK,fontSize:11,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s"}} onFocus={e=>e.target.style.borderColor=c.ORANGE} onBlur={e=>e.target.style.borderColor=c.EDGE}/>)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{paddingTop:14,marginTop:8,borderTop:`1px solid ${c.EDGE}`}}>
        <button onClick={handleSubmit} disabled={saving} style={{width:"100%",padding:"10px 0",fontSize:10,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",background:c.ORANGE,color:"#fff",border:"none",borderRadius:5,cursor:saving?"wait":"pointer",opacity:saving?0.7:1}}>{saving?"SUBMITTING…":"SUBMIT INTAKE"}</button>
      </div>
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

  const discoveryData=useQuery(api.wizardryTasks.getDiscovery,{projectId:"wizardry-ink"})??null;
  const saveDiscoveryMutation=useMutation(api.wizardryTasks.saveDiscovery);
  const onSubmitDiscovery=async(responses)=>{
    if(responses===null){
      await saveDiscoveryMutation({projectId:"wizardry-ink",responses:"{}",submittedAt:0});
      setTaskMutation({projectId:"wizardry-ink",key:"1-CLIENT INTAKE-0",value:false});
    }else{
      await saveDiscoveryMutation({projectId:"wizardry-ink",responses:JSON.stringify(responses),submittedAt:Date.now()});
      setTaskMutation({projectId:"wizardry-ink",key:"1-CLIENT INTAKE-0",value:true});
    }
  };
  const onAddDeliverable=(d)=>{
    addDeliverableMutation({projectId:"wizardry-ink",...d,addedAt:Date.now()});
  };
  const onRemoveDeliverable=(id)=>{
    removeDeliverableMutation({id});
  };

  const pages=[
    {key:"workflow",label:"Workflow"},
    {key:"userflow",label:"User Flow"},
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
            <div style={{fontSize:10,color:c.ORANGE,letterSpacing:3,fontFamily:"Inter,sans-serif",marginTop:2}}>PROJECT HUB</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {opsMode&&(
              <button onClick={()=>setView(v=>v==="internal"?"client":"internal")} style={{fontSize:10,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",padding:"6px 14px",borderRadius:4,cursor:"pointer",border:`1px solid ${c.ORANGE}44`,background:view==="internal"?c.ORANGE+"14":"transparent",color:view==="internal"?c.ORANGE:c.SLATE}}>
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
              background:"transparent",border:"none",borderBottom:page===p.key?`2px solid ${c.ORANGE}`:"2px solid transparent",
              color:page===p.key?c.ORANGE:c.SLATE,cursor:"pointer",transition:"all 0.15s",
            }}>{p.label.toUpperCase()}</button>
          ))}
        </nav>

        {/* Content */}
        <main style={{maxWidth:960,margin:"0 auto"}}>
          {page==="workflow"&&<WorkflowPage view={view} tasks={tasks} onToggle={onToggle} c={c} deliverables={deliverables} onAddDeliverable={onAddDeliverable} onRemoveDeliverable={onRemoveDeliverable} discoveryData={discoveryData} onSubmitDiscovery={onSubmitDiscovery}/>}
          {page==="userflow"&&<UserFlowPage c={c}/>}
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
