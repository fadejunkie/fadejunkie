// @ts-nocheck
import { useState, useEffect, Component } from "react";
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
        <button onClick={()=>window.location.reload()} style={{marginTop:16,padding:"8px 20px",fontSize:12,background:"#0d9488",color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>Reload</button>
      </div>
    }
    return this.props.children;
  }
}

/* ── color system ── */
const TEAL="#0d9488",TEAL2="#14b8a6",TEAL_DARK="#0f766e",GREEN="#22c55e",EMBER="#ef4444";

const darkColors={
  TEAL,TEAL2,TEAL_DARK,GREEN,EMBER,
  BG:"#0a0f0f",CARD:"#111a1a",DEEP:"#172020",INPUT:"#1e2c2c",
  EDGE:"#264040",SLATE:"#6b8a8a",STONE:"#9bb8b8",INK:"#e8f5f5",
};
const lightColors={
  TEAL,TEAL2,TEAL_DARK,GREEN,EMBER,
  BG:"#f0fdfd",CARD:"#ffffff",DEEP:"#ccfbf1",INPUT:"#99f6e4",
  EDGE:"#99d6d0",SLATE:"#4f8080",STONE:"#2c6060",INK:"#0f2020",
};

/* ── monthly phases data ── */
const months=[
  {id:1,name:"FOUNDATION",subtitle:"Technical Audit + GSC Setup",status:"complete",short:"AUDIT · BASELINE",icon:"🔍",
    milestones:[
      {title:"SEO AUDIT",clientDesc:"Full technical and content audit of the existing site.",
        tasks:[{label:"Crawl full site — identify broken links, redirect chains, missing tags"},{label:"Core Web Vitals assessment — LCP, CLS, FID baseline"},{label:"Content inventory — all pages scored on keyword relevance and quality"},{label:"Competitive gap analysis — top 5 competing realtors in San Antonio"}]},
      {title:"TECHNICAL FIXES",clientDesc:"Core Web Vitals, page speed, mobile improvements.",
        tasks:[{label:"Implement priority technical fixes from audit — speed, mobile, schema"},{label:"Fix broken internal links and redirect chains"},{label:"Optimize images above fold for LCP improvement"},{label:"Verify all pages indexed correctly in Search Console"}]},
      {title:"CONTENT AUDIT",clientDesc:"Existing pages scored and prioritized for optimization.",
        tasks:[{label:"Score all existing pages: title tag quality, content depth, keyword targeting"},{label:"Identify top 10 pages by traffic potential — prioritize for Month 2 optimization"},{label:"Flag thin content pages (under 400 words) for expansion"},{label:"Deliver content audit report with prioritized action list"}]},
      {title:"GSC + ANALYTICS SETUP",clientDesc:"Baselines established in Google Search Console and GA4.",
        tasks:[{label:"Verify Google Search Console ownership and submit sitemap"},{label:"Connect GA4 — configure events: contact form, phone click, listing view"},{label:"Document baseline rankings for 20 target keywords"},{label:"Set up rank tracking dashboard"}]},
      {title:"MONTH 1 REPORT",clientDesc:"Delivered — see deliverables.",
        tasks:[{label:"Compile Month 1 findings, baseline metrics, and Month 2 plan"},{label:"Deliver report to client"}]},
    ]},
  {id:2,name:"CONTENT",subtitle:"Content Goes Live",status:"active",short:"PAGES · CTR",icon:"📝",
    milestones:[
      {title:"KEYWORD LANDING PAGES",clientDesc:"3 location-based service pages targeting high-intent searches.",
        tasks:[{label:"Keyword research — identify 3 best location/service combinations for SA market"},{label:"Write Page 1: [Primary Service] in [Neighborhood] (1,000+ words, optimized)"},{label:"Write Page 2: [Secondary Service] in [Neighborhood] (1,000+ words, optimized)"},{label:"Write Page 3: [Tertiary Service] in [Neighborhood] (1,000+ words, optimized)"},{label:"Submit pages to Search Console for indexing"}]},
      {title:"NEIGHBORHOOD CONTENT",clientDesc:"Local area pages for target zip codes and communities.",
        tasks:[{label:"Identify 4 top neighborhoods for hyperlocal content strategy"},{label:"Write neighborhood guide for Stone Oak / North SA"},{label:"Write neighborhood guide for Alamo Heights / Central SA"},{label:"Add internal links from neighborhood pages to service pages"}]},
      {title:"CTR OPTIMIZATION",clientDesc:"Title and meta updates on top pages to improve click-through rate.",
        tasks:[{label:"Pull GSC click data — identify high-impression / low-CTR pages"},{label:"Rewrite title tags for top 10 pages (power word + number + local modifier formula)"},{label:"Rewrite meta descriptions — add clear CTAs and value props"},{label:"Monitor CTR changes week-over-week"}]},
      {title:"INTERNAL LINKING AUDIT",clientDesc:"Connect new pages to existing content for crawl equity flow.",
        tasks:[{label:"Map internal linking structure — identify orphan pages"},{label:"Add contextual links from existing pages to new landing pages"},{label:"Add links from new pages to highest-authority existing pages"},{label:"Verify all new pages have at least 3 internal links pointing to them"}]},
      {title:"MONTH 2 REPORT",clientDesc:"Rankings movement, traffic trends, content performance.",
        tasks:[{label:"Compile content performance data — impressions, clicks, avg position"},{label:"Document ranking improvements from Month 1 technical fixes"},{label:"Deliver Month 2 report with Month 3 strategy preview"}]},
    ]},
  {id:3,name:"AUTHORITY",subtitle:"Backlinks + Schema + Reputation",status:"upcoming",short:"LINKS · SCHEMA",icon:"🏆",
    milestones:[
      {title:"BACKLINK CAMPAIGN",clientDesc:"Local directory submissions and partner outreach.",
        tasks:[{label:"Audit current backlink profile — identify gaps vs. competitors"},{label:"Submit to 20 local/real estate directories (NAP consistency check)"},{label:"Identify 5 local partner websites for link exchange or guest content"},{label:"Reach out to SA neighborhood blogs / community sites for mentions"}]},
      {title:"CONTENT EXPANSION",clientDesc:"2 blog posts or resource pages to build topical authority.",
        tasks:[{label:"Write Resource 1: First-Time Homebuyer Guide — San Antonio (1,500+ words)"},{label:"Write Resource 2: San Antonio Neighborhoods Guide — 2026 Edition (1,500+ words)"},{label:"Optimize both pages for featured snippet targeting"},{label:"Internal link resource pages from service and neighborhood pages"}]},
      {title:"SCHEMA MARKUP",clientDesc:"LocalBusiness + Service structured data for rich results.",
        tasks:[{label:"Implement LocalBusiness schema — NAP, hours, service area, geo coordinates"},{label:"Add RealEstateAgent schema to agent bio pages"},{label:"Add FAQ schema to top 5 pages (target People Also Ask boxes)"},{label:"Verify schema with Google Rich Results Test"}]},
      {title:"REPUTATION MANAGEMENT",clientDesc:"Google Business Profile optimization and review strategy.",
        tasks:[{label:"Audit and update Google Business Profile — photos, services, Q&A, posts"},{label:"Identify review gap vs. top competitors — set monthly review targets"},{label:"Create review request email/text template for post-closing follow-up"},{label:"Set up Google Business Profile posting schedule (2x/month minimum)"}]},
      {title:"MONTH 3 REPORT",clientDesc:"Full 3-month performance review.",
        tasks:[{label:"Compile 3-month performance: traffic growth, ranking improvements, leads"},{label:"Document ROI — estimated value of organic traffic vs. retainer cost"},{label:"Deliver Month 3 report with ongoing retainer recommendation"}]},
    ]},
];

/* ── helpers ── */
function monthProgress(m,ts){let t=0,d=0;m.milestones.forEach(ms=>ms.tasks.forEach((_,ti)=>{t++;if(ts[`${m.id}-${ms.title}-${ti}`])d++}));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}
function overall(ts){let t=0,d=0;months.forEach(m=>m.milestones.forEach(ms=>ms.tasks.forEach((_,ti)=>{t++;if(ts[`${m.id}-${ms.title}-${ti}`])d++})));return{total:t,done:d,pct:t?Math.round(d/t*100):0}}

const Bar=({pct,h=6,glow=false,c})=>(
  <div style={{background:c.EDGE,borderRadius:2,height:h,width:"100%",overflow:"hidden"}}>
    <div style={{width:`${pct}%`,height:"100%",borderRadius:2,transition:"width 0.5s cubic-bezier(.4,0,.2,1)",background:pct===100?c.GREEN:`linear-gradient(90deg,${c.TEAL_DARK},${c.TEAL2})`,boxShadow:glow&&pct>0&&pct<100?`0 0 12px ${c.TEAL}66`:"none"}}/>
  </div>
);

const Grain=()=>(
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
);

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
    .doc-prose h1{font-family:'Inter',sans-serif;font-size:24px;font-weight:800;color:${c.INK};margin:0 0 16px;letter-spacing:-0.5px;border-bottom:2px solid ${c.TEAL}22;padding-bottom:10px;}
    .doc-prose h2{font-family:'Inter',sans-serif;font-size:18px;font-weight:700;color:${c.INK};margin:28px 0 10px;}
    .doc-prose h3{font-family:'Inter',sans-serif;font-size:12px;font-weight:700;color:${c.TEAL};text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;}
    .doc-prose p{margin:0 0 14px;}
    .doc-prose strong{font-weight:700;color:${c.INK};}
    .doc-prose em{font-style:italic;color:${c.STONE};}
    .doc-prose ul,.doc-prose ol{margin:0 0 14px;padding-left:22px;}
    .doc-prose li{margin-bottom:5px;}
    .doc-prose a{color:${c.TEAL};text-decoration:underline;}
    .doc-prose blockquote{border-left:3px solid ${c.TEAL};margin:0 0 14px;padding:10px 16px;background:${c.TEAL}08;color:${c.STONE};font-style:italic;border-radius:0 6px 6px 0;}
    .doc-prose code{font-family:'Courier New',monospace;font-size:12px;background:${c.DEEP};padding:2px 6px;border-radius:3px;color:${c.TEAL_DARK};}
    .doc-prose pre{background:${c.DEEP};border:1px solid ${c.EDGE};border-radius:6px;padding:14px 16px;overflow-x:auto;margin:0 0 14px;}
    .doc-prose pre code{background:none;padding:0;}
    .doc-prose table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:13px;}
    .doc-prose th{background:${c.TEAL}10;color:${c.TEAL_DARK};font-weight:700;text-align:left;padding:8px 12px;border-bottom:2px solid ${c.TEAL}33;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;}
    .doc-prose td{padding:8px 12px;border-bottom:1px solid ${c.EDGE};vertical-align:top;}
    .doc-prose tr:last-child td{border-bottom:none;}
    .doc-prose img{max-width:100%;border-radius:8px;margin:8px 0;}
    .doc-prose hr{border:none;border-top:1px solid ${c.EDGE};margin:24px 0;}
    .slide-prose{display:flex;flex-direction:column;justify-content:center;min-height:340px;padding:32px 40px;}
    .slide-prose h1{font-family:'Inter',sans-serif;font-size:30px;font-weight:800;color:${c.INK};margin:0 0 20px;text-align:center;letter-spacing:-0.5px;}
    .slide-prose h2{font-family:'Inter',sans-serif;font-size:20px;font-weight:700;color:${c.INK};margin:0 0 14px;}
    .slide-prose h3{font-size:11px;font-weight:700;color:${c.TEAL};text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;}
    .slide-prose p{font-size:15px;line-height:1.7;margin:0 0 12px;color:${c.INK};}
    .slide-prose ul,.slide-prose ol{padding-left:20px;margin:0 0 12px;}
    .slide-prose li{font-size:14px;line-height:1.6;margin-bottom:6px;}
    .slide-prose strong{font-weight:700;}
    .slide-prose table{width:100%;border-collapse:collapse;font-size:13px;margin:0 0 12px;}
    .slide-prose th{background:${c.TEAL}10;color:${c.TEAL_DARK};font-weight:700;padding:7px 10px;border-bottom:2px solid ${c.TEAL}33;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
    .slide-prose td{padding:7px 10px;border-bottom:1px solid ${c.EDGE};}
    .slide-prose blockquote{border-left:3px solid ${c.TEAL};padding:10px 16px;background:${c.TEAL}08;color:${c.STONE};font-style:italic;border-radius:0 6px 6px 0;margin:0 0 12px;}
  `;

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{proseStyles}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:c.BG,borderRadius:12,width:"100%",maxWidth:820,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${c.EDGE}`,boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${c.EDGE}`,display:"flex",alignItems:"center",gap:12,flexShrink:0,background:c.CARD}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:15,fontFamily:"'Inter',sans-serif",color:c.INK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
            <div style={{fontSize:9,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:1,letterSpacing:1}}>
              {isContent?"DOCUMENT":isPdf(d.url)?"PDF":isImg(d.url)?"IMAGE":"LINK"} · {new Date(d.addedAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>
          {isContent&&isSlides&&(
            <div style={{display:"flex",background:c.DEEP,borderRadius:4,overflow:"hidden",border:`1px solid ${c.EDGE}`,flexShrink:0}}>
              {[["doc","Document"],["slides","Slides"]].map(([v,l])=>(
                <button key={v} onClick={()=>{setViewMode(v);setSlide(0)}} style={{padding:"4px 12px",fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",background:viewMode===v?c.TEAL:"transparent",color:viewMode===v?"#fff":c.SLATE,border:"none",cursor:"pointer"}}>{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          {isContent&&(
            <button onClick={downloadMd} style={{fontSize:10,fontWeight:700,letterSpacing:0.5,fontFamily:"Inter,sans-serif",padding:"5px 12px",background:c.TEAL+"0c",color:c.TEAL,border:`1px solid ${c.TEAL}33`,borderRadius:4,cursor:"pointer",flexShrink:0}}>↓ .md</button>
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
                  <button key={i} onClick={()=>setSlide(i)} style={{width:i===slide?20:7,height:7,borderRadius:4,background:i===slide?c.TEAL:c.EDGE,border:"none",cursor:"pointer",transition:"all 0.2s",padding:0}}/>
                ))}
              </div>
              <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} disabled={slide===slides.length-1} style={{fontSize:18,background:"none",border:`1px solid ${c.EDGE}`,borderRadius:6,color:slide===slides.length-1?c.EDGE:c.SLATE,cursor:slide===slides.length-1?"default":"pointer",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </div>
          </div>
        )}

        {!isContent&&isImg(d.url)&&(
          <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",alignItems:"center",padding:24,gap:16,background:c.DEEP}}>
            <img src={d.url} alt={d.label} style={{maxWidth:"100%",maxHeight:"60vh",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",objectFit:"contain"}}/>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 18px",background:c.TEAL,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none"}}>↗ OPEN FULL SIZE</a>
          </div>
        )}

        {!isContent&&!isImg(d.url)&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:40}}>
            <div style={{fontSize:40}}>{isPdf(d.url)?"📄":"🔗"}</div>
            <div style={{fontSize:14,fontWeight:600,color:c.INK,fontFamily:"Inter,sans-serif",textAlign:"center"}}>{d.label}</div>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"8px 24px",background:c.TEAL,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",textDecoration:"none"}}>↗ OPEN {isPdf(d.url)?"PDF":"LINK"}</a>
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

  const btnSm=(active)=>({fontSize:10,fontWeight:600,fontFamily:"Inter,sans-serif",padding:"3px 8px",borderRadius:3,cursor:"pointer",border:`1px solid ${active?c.TEAL+"44":c.EDGE}`,background:active?c.TEAL+"0c":"transparent",color:active?c.TEAL:c.SLATE});

  return(
    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${c.EDGE}44`}}>
      {viewing&&<DocViewer d={viewing} c={c} onClose={()=>setViewing(null)}/>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{fontSize:9,fontWeight:700,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif"}}>DELIVERABLES</div>
        {isOps&&!adding&&(
          <button onClick={()=>setAdding(true)} style={{fontSize:10,fontWeight:600,color:c.TEAL,background:c.TEAL+"0c",border:`1px solid ${c.TEAL}22`,borderRadius:4,padding:"3px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:0.5}}>+ ADD</button>
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
        const typeBg=isContent?c.TEAL_DARK+"14":isImgUrl?c.GREEN+"14":isPdfUrl?c.EMBER+"14":c.TEAL+"14";
        const typeColor=isContent?c.TEAL_DARK:isImgUrl?c.GREEN:isPdfUrl?c.EMBER:c.TEAL;
        return(
          <div key={d._id} onClick={()=>setViewing(d)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:c.CARD,borderRadius:8,marginBottom:6,border:`1px solid ${c.EDGE}`,cursor:"pointer",transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=c.TEAL+"44"}
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
        <div style={{background:c.DEEP,borderRadius:6,padding:"12px 14px",border:`1px solid ${c.TEAL}22`,marginTop:4}}>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <button onClick={()=>setAddMode("url")} style={btnSm(addMode==="url")}>URL / File</button>
            <button onClick={()=>setAddMode("content")} style={btnSm(addMode==="content")}>Paste Content</button>
          </div>
          {addMode==="url"&&(
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {[{v:"screenshot",l:"Screenshot"},{v:"pdf",l:"PDF"},{v:"link",l:"Link"}].map(o=>(
                <button key={o.v} onClick={()=>setType(o.v)} style={{fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"4px 10px",borderRadius:3,cursor:"pointer",border:`1px solid ${type===o.v?c.TEAL+"44":c.EDGE}`,background:type===o.v?c.TEAL+"0c":"transparent",color:type===o.v?c.TEAL:c.SLATE}}>{o.l}</button>
              ))}
            </div>
          )}
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. Keyword Landing Page — Stone Oak)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:6}}/>
          {addMode==="url"?(
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL (paste link to page, screenshot, or PDF)" style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:12,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
          ):(
            <textarea value={mdContent} onChange={e=>setMdContent(e.target.value)} placeholder="Paste markdown content here…" rows={8} style={{width:"100%",padding:"7px 10px",background:c.CARD,border:`1px solid ${c.EDGE}`,borderRadius:4,color:c.INK,fontSize:11,fontFamily:"'Courier New',monospace",outline:"none",boxSizing:"border-box",marginBottom:8,resize:"vertical",lineHeight:1.6}}/>
          )}
          <div style={{display:"flex",gap:6}}>
            <button onClick={submit} style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:"Inter,sans-serif",padding:"6px 16px",background:c.TEAL,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}}>SAVE</button>
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
  const [activeMonth,setActiveMonth]=useState(2);
  const [expanded,setExpanded]=useState({});
  useEffect(()=>{const a={};months.forEach(m=>m.milestones.forEach(ms=>{a[`${m.id}-${ms.title}`]=true}));setExpanded(a)},[]);
  const toggle=(key)=>{if(view==="internal")onToggle(key)};
  const toggleM=(key)=>setExpanded(p=>({...p,[key]:!p[key]}));
  const ov=overall(tasks);
  const month=months.find(m=>m.id===activeMonth);

  return(
    <div>
      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:700,color:c.SLATE,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>RETAINER COMPLETION</span>
          <span style={{fontFamily:"Inter,sans-serif"}}>
            <span style={{fontSize:28,fontWeight:700,color:ov.pct===100?c.GREEN:c.TEAL}}>{ov.pct}%</span>
            <span style={{fontSize:11,color:c.SLATE,marginLeft:8}}>{ov.done}/{ov.total}</span>
          </span>
        </div>
        <Bar pct={ov.pct} h={10} glow c={c}/>
      </div>

      <div style={{padding:"20px 24px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {months.map(m=>{
          const prog=monthProgress(m,tasks);const active=activeMonth===m.id;const done=prog.pct===100;
          const statusColor=m.status==="complete"?c.GREEN:m.status==="active"?c.TEAL:c.SLATE;
          return(
            <button key={m.id} onClick={()=>setActiveMonth(m.id)} style={{
              padding:"14px 16px",textAlign:"left",cursor:"pointer",fontFamily:"Inter,sans-serif",
              background:active?c.CARD:c.BG,borderRadius:8,border:`1.5px solid ${active?c.TEAL:done?c.GREEN+"44":c.EDGE}`,position:"relative",overflow:"hidden",
            }}>
              {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c.TEAL}}/>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:20}}>{m.icon}</span>
                <span style={{fontSize:9,fontWeight:700,fontFamily:"Inter,sans-serif",padding:"2px 7px",borderRadius:10,background:statusColor+"18",color:statusColor,letterSpacing:0.5}}>
                  {m.status==="complete"?"DONE":m.status==="active"?"ACTIVE":"UPCOMING"}
                </span>
              </div>
              <div style={{fontSize:11,fontWeight:800,color:active?c.INK:c.SLATE,letterSpacing:1.5,marginTop:6}}>MONTH {m.id}</div>
              <div style={{fontSize:12,fontWeight:700,color:active?c.TEAL:c.SLATE,marginTop:2,letterSpacing:0.5}}>{m.name}</div>
              <div style={{fontSize:9,color:c.SLATE,marginTop:2,fontFamily:"Inter,sans-serif"}}>{m.short}</div>
              <div style={{marginTop:8}}><Bar pct={prog.pct} h={3} c={c}/></div>
              <div style={{fontSize:9,color:c.SLATE,marginTop:4,fontFamily:"Inter,sans-serif"}}>{prog.pct}% · {prog.done}/{prog.total} tasks</div>
            </button>
          );
        })}
      </div>

      {month&&(
        <div style={{padding:"0 24px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,paddingBottom:16,borderBottom:`1px solid ${c.EDGE}`,marginBottom:20}}>
            <div>
              <span style={{fontSize:11,fontWeight:600,color:c.TEAL,letterSpacing:3,fontFamily:"Inter,sans-serif"}}>MONTH {month.id}</span>
              <span style={{fontSize:24,fontWeight:900,color:c.INK,letterSpacing:1,marginLeft:12,fontFamily:"'Inter',sans-serif"}}>{month.name}</span>
              <div style={{fontSize:13,color:c.SLATE,marginTop:2,letterSpacing:0.5}}>{month.subtitle}</div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {month.milestones.map((m)=>{
              const mDone=m.tasks.filter((_,ti)=>tasks[`${month.id}-${m.title}-${ti}`]).length;
              const mPct=m.tasks.length?Math.round(mDone/m.tasks.length*100):0;
              const complete=mPct===100;
              const exp=expanded[`${month.id}-${m.title}`];
              return(
                <div key={m.title} style={{background:c.CARD,borderRadius:8,overflow:"hidden",border:`1px solid ${complete?c.GREEN+"33":c.EDGE}`}}>
                  <div onClick={()=>toggleM(`${month.id}-${m.title}`)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:complete?c.GREEN+"06":"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <div style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:complete?c.GREEN+"14":c.DEEP,border:`1px solid ${complete?c.GREEN+"33":c.EDGE}`,fontSize:12,fontWeight:700,color:complete?c.GREEN:c.TEAL,fontFamily:"Inter,sans-serif",flexShrink:0}}>
                        {complete?"✓":mDone}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:c.INK,letterSpacing:0.5}}>{m.title}</div>
                        <div style={{fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",marginTop:2}}>{m.clientDesc}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:complete?c.GREEN:c.TEAL,fontFamily:"Inter,sans-serif"}}>{mPct}%</span>
                      <span style={{fontSize:14,color:c.SLATE,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
                    </div>
                  </div>

                  <div style={{padding:"0 20px 2px"}}><Bar pct={mPct} h={3} c={c}/></div>

                  {exp&&(
                    <div style={{padding:"8px 20px 16px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:2}}>
                        {m.tasks.map((t,ti)=>{
                          const key=`${month.id}-${m.title}-${ti}`;
                          const done=tasks[key];
                          return(
                            <div key={ti} onClick={()=>toggle(key)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",borderRadius:4,cursor:view==="internal"?"pointer":"default",background:done?c.GREEN+"06":"transparent",transition:"background 0.15s"}}>
                              <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${done?c.GREEN:c.EDGE}`,background:done?c.GREEN:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.15s"}}>
                                {done&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                              </div>
                              <span style={{fontSize:12,color:done?c.SLATE:c.INK,fontFamily:"Inter,sans-serif",lineHeight:1.5,textDecoration:done?"line-through":"none",opacity:done?0.7:1}}>{t.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <MilestoneDeliverables
                        milestoneKey={`${month.id}-${m.title}`}
                        c={c}
                        isOps={view==="internal"}
                        deliverables={deliverables??[]}
                        onAdd={onAddDeliverable??(()=>{})}
                        onRemove={onRemoveDeliverable??(()=>{})}
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
   SCOPE PAGE
   ═══════════════════════════════════════ */
function ScopePage({c}){
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px 48px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:11,color:c.TEAL,letterSpacing:5,fontFamily:"Inter,sans-serif",marginBottom:6}}>ANTHONY'S BRAND BUILDER</div>
        <div style={{fontSize:28,fontWeight:800,color:c.INK,letterSpacing:1}}>SCOPE OF WORK</div>
        <div style={{fontSize:13,color:c.SLATE,marginTop:4,fontFamily:"Inter,sans-serif"}}>Weichert Realtors — Corwin & Associates · Monthly SEO Retainer</div>
      </div>

      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:700,color:c.TEAL,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>PROJECT OVERVIEW</div>
        <div style={{fontSize:13,color:c.INK,lineHeight:1.7,fontFamily:"Inter,sans-serif",marginBottom:16}}>
          Monthly SEO retainer for Weichert Realtors — Corwin & Associates in San Antonio. Covers technical SEO, content production, authority building, and ongoing rank tracking to grow organic search visibility and qualified lead generation.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[{l:"CLIENT",v:"Weichert Realtors — Corwin & Associates"},{l:"MARKET",v:"San Antonio, TX"},{l:"RETAINER",v:"$950/month"},{l:"TERM",v:"Month-to-month"}].map(i=>(
            <div key={i.l} style={{background:c.DEEP,border:`1px solid ${c.EDGE}`,borderRadius:6,padding:"10px 14px"}}>
              <div style={{fontSize:9,color:c.SLATE,letterSpacing:2,fontFamily:"Inter,sans-serif",marginBottom:2}}>{i.l}</div>
              <div style={{fontSize:12,color:c.INK,fontWeight:600,fontFamily:"Inter,sans-serif"}}>{i.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:700,color:c.TEAL,letterSpacing:3,fontFamily:"Inter,sans-serif",marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${c.EDGE}`}}>MONTHLY DELIVERABLES</div>
        {[
          {m:"Month 1 — Foundation",d:["Full technical SEO audit","Core Web Vitals improvements","Content inventory & scoring","GSC + GA4 baseline setup","Month 1 report"]},
          {m:"Month 2 — Content",d:["3 keyword-targeted landing pages","4 neighborhood content pages","Title/meta CTR optimization","Internal linking audit","Month 2 report"]},
          {m:"Month 3 — Authority",d:["20 directory submissions + partner outreach","2 long-form resource pages","LocalBusiness + FAQ schema markup","Google Business Profile optimization","Month 3 report"]},
        ].map(item=>(
          <div key={item.m} style={{marginBottom:16,paddingLeft:0}}>
            <div style={{fontSize:12,fontWeight:700,color:c.TEAL,marginBottom:8,fontFamily:"Inter,sans-serif"}}>{item.m}</div>
            {item.d.map((d,i)=>(
              <div key={i} style={{fontSize:12,color:c.INK,fontFamily:"Inter,sans-serif",paddingLeft:12,lineHeight:1.9}}>• {d}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={{background:c.DEEP,borderRadius:8,padding:"20px 24px",border:`1px solid ${c.TEAL}22`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:14,fontWeight:700,color:c.INK,fontFamily:"Inter,sans-serif"}}>MONTHLY RETAINER FEE</div>
        <div style={{fontSize:24,fontWeight:900,color:c.TEAL,fontFamily:"Inter,sans-serif"}}>$950<span style={{fontSize:13,color:c.SLATE}}>/mo</span></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN HUB
   ═══════════════════════════════════════ */
export default function WcorwinHub({defaultView="client",opsMode=false}){
  const [view,setView]=useState(defaultView);
  const [page,setPage]=useState("workflow");
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem("wcorwin-dark")==="true"}catch{return false}});
  const c=dark?darkColors:lightColors;

  useEffect(()=>{try{localStorage.setItem("wcorwin-dark",String(dark))}catch{}},[dark]);

  const tasks=useQuery(api.wcorwinTasks.getTasks,{projectId:"wcorwin"})??{};
  const setTaskMutation=useMutation(api.wcorwinTasks.setTask);
  const deliverables=useQuery(api.wcorwinTasks.getDeliverables,{projectId:"wcorwin"})??[];
  const addDeliverableMutation=useMutation(api.wcorwinTasks.addDeliverable);
  const removeDeliverableMutation=useMutation(api.wcorwinTasks.removeDeliverable);

  const onToggle=(key)=>{setTaskMutation({projectId:"wcorwin",key,value:!tasks[key]})};
  const onAddDeliverable=({milestoneKey,label,url,type,markdownContent})=>{
    addDeliverableMutation({projectId:"wcorwin",milestoneKey,label,url:url||"",type,addedAt:Date.now(),...(markdownContent?{markdownContent}:{})});
  };
  const onRemoveDeliverable=(id)=>{removeDeliverableMutation({id})};

  const pages=[
    {key:"workflow",label:"Workflow"},
    {key:"scope",label:"Scope"},
  ];

  const css=`
    *{box-sizing:border-box}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${c.BG}}::-webkit-scrollbar-thumb{background:${c.EDGE};border-radius:3px}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  `;

  return(
    <ErrorBoundary>
      <style>{css}</style>
      <Grain/>
      <div style={{minHeight:"100vh",background:c.BG,color:c.INK,fontFamily:"Inter,sans-serif",transition:"background 0.3s,color 0.3s"}}>
        {/* Header */}
        <header style={{padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${c.EDGE}`,background:c.CARD,position:"sticky",top:0,zIndex:200}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:1,color:c.INK,fontFamily:"Inter,sans-serif"}}>
              Weichert Realtors<span style={{color:c.TEAL}}>.</span>
            </div>
            <div style={{fontSize:9,color:c.TEAL,letterSpacing:3,fontFamily:"Inter,sans-serif",marginTop:2}}>SEO RETAINER · PROJECT HUB</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {opsMode&&(
              <button onClick={()=>setView(v=>v==="internal"?"client":"internal")} style={{fontSize:10,fontWeight:700,letterSpacing:1.5,fontFamily:"Inter,sans-serif",padding:"6px 14px",borderRadius:4,cursor:"pointer",border:`1px solid ${c.TEAL}44`,background:view==="internal"?c.TEAL+"14":"transparent",color:view==="internal"?c.TEAL:c.SLATE}}>
                {view==="internal"?"OPS":"CLIENT"}
              </button>
            )}
            <button onClick={()=>setDark(d=>!d)} style={{fontSize:15,background:"transparent",border:`1px solid ${c.EDGE}`,borderRadius:4,padding:"4px 10px",cursor:"pointer",color:c.SLATE}}>
              {dark?"☀":"☾"}
            </button>
          </div>
        </header>

        {/* Nav */}
        <nav style={{display:"flex",gap:0,borderBottom:`1px solid ${c.EDGE}`,background:c.CARD}}>
          {pages.map(p=>(
            <button key={p.key} onClick={()=>setPage(p.key)} style={{
              padding:"12px 24px",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"Inter,sans-serif",
              background:"transparent",border:"none",borderBottom:page===p.key?`2px solid ${c.TEAL}`:"2px solid transparent",
              color:page===p.key?c.TEAL:c.SLATE,cursor:"pointer",transition:"all 0.15s",
            }}>{p.label.toUpperCase()}</button>
          ))}
        </nav>

        {/* Content */}
        <main style={{maxWidth:960,margin:"0 auto"}}>
          {page==="workflow"&&<WorkflowPage view={view} tasks={tasks} onToggle={onToggle} c={c} deliverables={deliverables} onAddDeliverable={onAddDeliverable} onRemoveDeliverable={onRemoveDeliverable}/>}
          {page==="scope"&&<ScopePage c={c}/>}
        </main>

        <footer style={{textAlign:"center",padding:"32px 24px",fontSize:10,color:c.SLATE,fontFamily:"Inter,sans-serif",borderTop:`1px solid ${c.EDGE}`,marginTop:40}}>
          Anthony's Brand Builder · {new Date().getFullYear()} · Built for Weichert Realtors — Corwin & Associates
        </footer>
      </div>
    </ErrorBoundary>
  );
}
