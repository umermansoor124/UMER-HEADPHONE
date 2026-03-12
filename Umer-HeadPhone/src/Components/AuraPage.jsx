import { useState, useEffect, useRef } from "react";
import AuraCanvas from "./AuraCanvas";

const TOTAL = 208;
const PX_PER_FRAME = 12;

const BEATS = [
  { from: 0,    to: 0.22, tag: "001 — INTRODUCING",  title: "UMER",               sub: "Beyond Silence.\nInto Power.",                        align: "left"  },
  { from: 0.25, to: 0.47, tag: "002 — THE CORE",     title: "40MM\nGRAPHENE",     sub: "Raw metallic precision.\nEvery frequency sculpted.",  align: "left"  },
  { from: 0.50, to: 0.72, tag: "003 — SMART ANC",    title: "SILENCE\nREINVENTED",sub: "AI circuitry adapts\nto your world in real-time.",    align: "right" },
  { from: 0.75, to: 0.97, tag: "004 — LIMITED RUN",  title: "EVOLVE\nYOUR SOUND", sub: "Umer Wireless Pro.\n499 units only.",                align: "left", cta: true },
];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  html { scroll-behavior: smooth; }
  body { background: #020305; color: #e8e0d0; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width:0; height:0; }
  * { scrollbar-width: none; }

  :root {
    --red:         #ff2d20;
    --red-dim:     rgba(255,45,32,0.18);
    --red-glow:    rgba(255,45,32,0.08);
    --white:       #f0ece4;
    --white-mid:   rgba(240,236,228,0.45);
    --white-dim:   rgba(240,236,228,0.18);
    --white-ghost: rgba(240,236,228,0.06);
    --ink:         #020305;
    --ink2:        #07090f;
    --ink3:        #0c0f18;
    --border-hot:  rgba(255,45,32,0.22);
    --border-cold: rgba(240,236,228,0.08);
    --font-display:'Bebas Neue', sans-serif;
    --font-ui:     'Rajdhani', sans-serif;
    --font-mono:   'Space Mono', monospace;
    --max-w:       min(1280px, 92vw);
    --section-pad: clamp(80px, 11vw, 150px);
  }

  @keyframes flicker {
    0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:.4; }
    94% { opacity:1; } 96% { opacity:.6; } 97% { opacity:1; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes scroll-drop {
    0%,100% { transform:translateX(-50%) translateY(0); opacity:.6; }
    50%     { transform:translateX(-50%) translateY(12px); opacity:.2; }
  }
  @keyframes noise {
    0%,100% { background-position: 0 0; }
    10%  { background-position:-5% -10%; } 30% { background-position: 3%  5%; }
    50%  { background-position:-8%  2%;  } 70% { background-position: 6% -4%; }
    90%  { background-position:-2%  8%; }
  }

  body::after {
    content:''; position: fixed; inset:0; z-index:9999; pointer-events:none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat; background-size: 180px; opacity: .028;
    animation: noise 1s steps(2) infinite;
  }

  .btn-kill {
    display: inline-flex; align-items:center; gap:10px;
    background: var(--red); border: none; color: #fff;
    padding: 14px 40px; font-family: var(--font-display);
    font-size: clamp(14px,1.6vw,18px); letter-spacing: 0.2em;
    text-transform:uppercase; cursor:pointer;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    transition: all .3s ease; position: relative; overflow:hidden;
  }
  .btn-kill::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%); transition: transform .5s ease;
  }
  .btn-kill:hover::before { transform: translateX(100%); }
  .btn-kill:hover { transform:translateY(-2px); box-shadow: 0 8px 30px rgba(255,45,32,0.4), 0 0 60px rgba(255,45,32,0.15); }

  .btn-ghost {
    display: inline-flex; align-items:center; gap:8px;
    background: transparent; border: 1px solid var(--border-cold);
    color: var(--white-mid); padding: 14px 36px;
    font-family: var(--font-mono); font-size: clamp(9px,1vw,11px);
    letter-spacing: 0.25em; text-transform:uppercase; cursor:pointer;
    transition: all .3s ease;
  }
  .btn-ghost:hover { border-color: rgba(240,236,228,0.3); color: var(--white); background: var(--white-ghost); }

  .sys-tag {
    display: inline-flex; align-items:center; gap:8px;
    font-family: var(--font-mono); font-size: clamp(8px,.85vw,10px);
    letter-spacing: 0.35em; text-transform:uppercase; color: var(--red); margin-bottom:20px;
  }
  .sys-tag::before {
    content:''; display:block; width:6px; height:6px; background: var(--red);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); flex-shrink:0;
  }

  .divider     { width:100%; height:1px; background: var(--border-cold); }
  .divider-red { width:100%; height:1px; background: linear-gradient(90deg,var(--red),transparent); opacity:.4; }

  .section-inner { max-width: var(--max-w); margin: 0 auto; padding: 0 clamp(20px,4vw,64px); width: 100%; }

  @media (max-width: 900px) {
    .comfort-grid { grid-template-columns:1fr !important; }
    .specs-grid   { grid-template-columns:repeat(2,1fr) !important; }
  }
  @media (max-width: 640px) {
    .stats-bar > div { flex:1 1 calc(50% - 1px) !important; }
    .stats-bar > div:nth-child(2) { border-right:none !important; }
    .stats-bar > div:nth-child(n+3) { border-top:1px solid var(--border-cold) !important; }
    .sound-grid    { grid-template-columns:1fr !important; }
    .comfort-cards { grid-template-columns:1fr 1fr !important; }
    .beat-text     { max-width:85vw !important; }
  }
  @media (max-width:400px) { .comfort-cards { grid-template-columns:1fr !important; } }
`;

function Nav({ progress }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"clamp(16px,2.5vh,24px) clamp(24px,4vw,56px)", background:"linear-gradient(to bottom,rgba(2,3,5,0.92) 0%,transparent 100%)", borderBottom:"1px solid rgba(255,45,32,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:3, height:28, background:"var(--red)" }} />
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(16px,2.2vw,22px)", letterSpacing:"0.25em", color:"var(--white)", lineHeight:1 }}>UMER</div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,.7vw,8px)", letterSpacing:"0.5em", color:"rgba(255,45,32,0.5)", marginTop:2 }}>WIRELESS PRO</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.8vw,9px)", color:"rgba(240,236,228,0.2)", letterSpacing:"0.3em" }}>
          {Math.round(progress * 100).toString().padStart(3,"0")}%
        </div>
        <div style={{ width:"clamp(60px,8vw,120px)", height:1, background:"rgba(240,236,228,0.08)", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${progress*100}%`, background:"var(--red)", transition:"width .05s linear", boxShadow:"0 0 8px var(--red)" }} />
        </div>
      </div>
    </nav>
  );
}

function BeatText({ beat }) {
  const [show, setShow] = useState(false);
  const prev = useRef(null);
  useEffect(() => {
    if (beat?.title !== prev.current) {
      setShow(false);
      const t = setTimeout(() => setShow(true), 60);
      prev.current = beat?.title;
      return () => clearTimeout(t);
    }
  }, [beat]);
  if (!beat) return null;
  const isRight = beat.align === "right";
  return (
    <div className="beat-text" style={{ position:"fixed", bottom:"9vh", left: isRight ? "auto" : "clamp(24px,5vw,72px)", right: isRight ? "clamp(24px,5vw,72px)" : "auto", zIndex:10, maxWidth:"min(520px,85vw)", pointerEvents: beat.cta ? "all" : "none", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(32px)", transition:"opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1)" }}>
      <div className="sys-tag">{beat.tag}</div>
      <div style={{ position:"relative", marginBottom:14 }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3.5rem,9vw,8rem)", letterSpacing:"0.02em", color:"transparent", WebkitTextStroke:"1px rgba(255,45,32,0.1)", lineHeight:0.88, whiteSpace:"pre-line", position:"absolute", top:4, left:4, pointerEvents:"none", userSelect:"none" }}>{beat.title}</div>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3.5rem,9vw,8rem)", letterSpacing:"0.02em", color:"var(--white)", lineHeight:0.88, whiteSpace:"pre-line", position:"relative", textShadow:"0 0 80px rgba(0,0,0,0.9), 0 2px 40px rgba(0,0,0,1)", animation: show ? "flicker 8s infinite" : "none" }}>{beat.title}</h2>
      </div>
      <div style={{ width: show ? "60px" : "0px", height:2, background:"var(--red)", marginBottom:14, transition:"width .8s cubic-bezier(.22,1,.36,1) .2s", boxShadow:"0 0 12px var(--red)" }} />
      <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(.85rem,1.4vw,1rem)", color:"var(--white-mid)", lineHeight:1.9, whiteSpace:"pre-line", letterSpacing:"0.03em", marginBottom: beat.cta ? 28 : 0 }}>{beat.sub}</p>
      {beat.cta && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button className="btn-kill">Order Now →</button>
          <button className="btn-ghost">// Learn More</button>
        </div>
      )}
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div style={{ position:"fixed", bottom:"4vh", left:"50%", zIndex:10, textAlign:"center", pointerEvents:"none", animation:"scroll-drop 2.4s ease-in-out infinite" }}>
      <div style={{ width:1, height:40, background:"linear-gradient(to bottom,transparent,var(--red))", margin:"0 auto 10px", opacity:.6 }} />
      <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,.8vw,8px)", letterSpacing:"0.6em", color:"rgba(255,45,32,0.35)" }}>SCROLL</p>
    </div>
  );
}

function HeroSection() {
  const stats = [
    { val:"40H",   label:"Battery Life" }, { val:"40MM",  label:"Driver Size"  },
    { val:"−40dB", label:"ANC Depth"    }, { val:"32Ω",   label:"Impedance"    },
  ];
  return (
    <section style={{ position:"relative", background:"var(--ink)", padding:"var(--section-pad) 0", overflow:"hidden", width:"100%" }}>
      <div style={{ position:"absolute", top:0, right:0, width:"40%", height:"100%", background:"linear-gradient(135deg, transparent 60%, rgba(255,45,32,0.03) 100%)", pointerEvents:"none" }} />
      <div className="divider-red" style={{ position:"absolute", top:0 }} />
      <div className="section-inner">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:32, marginBottom:"clamp(48px,8vw,96px)" }}>
          <div>
            <div className="sys-tag">Umer Wireless Collection — 2026</div>
            <div style={{ position:"relative" }}>
              <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(5rem,16vw,14rem)", letterSpacing:"0.01em", color:"var(--white)", lineHeight:0.85 }}>SOUND</h1>
              <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(5rem,16vw,14rem)", letterSpacing:"0.01em", color:"transparent", WebkitTextStroke:"1.5px rgba(255,45,32,0.35)", lineHeight:0.85 }}>EVOLVED</h1>
              <div style={{ position:"absolute", right:"-2%", top:"20%", width:4, height:"60%", background:"var(--red)", opacity:.4 }} />
            </div>
          </div>
          <div style={{ maxWidth:280, paddingTop:"clamp(20px,4vw,60px)" }}>
            <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(.85rem,1.3vw,1rem)", color:"var(--white-mid)", lineHeight:2, marginBottom:24 }}>
              40mm graphene drivers. Smart ANC. 40 hours. The headphone built for those who refuse to compromise.
            </p>
            <button className="btn-kill">Order — $299</button>
          </div>
        </div>
        <div className="stats-bar" style={{ display:"inline-flex", border:"1px solid var(--border-cold)", width:"min(720px,100%)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, width:50, height:2, background:"var(--red)" }} />
          <div style={{ position:"absolute", top:0, left:0, width:2, height:50, background:"var(--red)" }} />
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex:1, padding:"clamp(16px,2.5vw,28px) clamp(12px,2vw,24px)", textAlign:"center", borderRight: i < stats.length-1 ? "1px solid var(--border-cold)" : "none", transition:"background .3s ease" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,45,32,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <p style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3.5vw,2.4rem)", color:"var(--white)", letterSpacing:"0.04em", lineHeight:1 }}>{s.val}</p>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,.75vw,8px)", letterSpacing:"0.4em", color:"var(--white-dim)", textTransform:"uppercase", marginTop:8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="divider" style={{ position:"absolute", bottom:0 }} />
    </section>
  );
}

function SoundCard({ num, title, body }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "var(--ink2)" : "#0a0c0f", padding:"clamp(28px,3.5vw,48px) clamp(22px,3vw,36px)", transition:"all .35s cubic-bezier(.22,1,.36,1)", cursor:"default", borderTop: hov ? "2px solid var(--red)" : "2px solid transparent", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:-10, right:16, fontFamily:"var(--font-display)", fontSize:"clamp(80px,10vw,120px)", color: hov ? "rgba(255,45,32,0.07)" : "rgba(255,45,32,0.04)", lineHeight:1, pointerEvents:"none", userSelect:"none", transition:"color .35s ease" }}>{num}</div>
      <div style={{ position:"relative", zIndex:1 }}>
        <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.8vw,9px)", letterSpacing:"0.45em", color: hov ? "var(--red)" : "rgba(240,236,228,0.2)", textTransform:"uppercase", marginBottom:14, transition:"color .35s ease" }}>{num} / {title}</p>
        <p style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.3rem,2.5vw,1.8rem)", color:"var(--white)", letterSpacing:"0.04em", marginBottom:14, lineHeight:1.1 }}>{title}</p>
        <div style={{ width: hov ? "32px" : "0px", height:2, background:"var(--red)", marginBottom:14, transition:"width .4s cubic-bezier(.22,1,.36,1)", boxShadow: hov ? "0 0 8px var(--red)" : "none" }} />
        <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(11px,1.1vw,13px)", color:"var(--white-mid)", lineHeight:1.95 }}>{body}</p>
      </div>
    </div>
  );
}

function SoundSection() {
  const items = [
    { num:"01", title:"Graphene Diaphragm", body:"Ultra-thin graphene membrane — 200× stronger than steel, zero distortion at any volume. Pure signal, zero compromise." },
    { num:"02", title:"Neodymium Magnets",  body:"N52 neodymium magnets generate a field 3× stronger than standard drivers. More power. More precision." },
    { num:"03", title:"Acoustic Chamber",   body:"Mathematically tuned ear cup geometry. Every Hz reaches your ear exactly as engineered." },
    { num:"04", title:"Hybrid ANC Array",   body:"3 feedforward + 2 feedback mics. AI samples noise 48,000× per second. Your world, silenced." },
  ];
  return (
    <section style={{ background:"var(--ink2)", padding:"var(--section-pad) 0", width:"100%" }}>
      <div className="section-inner">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:24, marginBottom:"clamp(44px,6vw,80px)" }}>
          <div>
            <div className="sys-tag">Engineering</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,7vw,7rem)", letterSpacing:"0.02em", color:"var(--white)", lineHeight:0.88 }}>THE SCIENCE<br /><span style={{ color:"var(--red)" }}>OF SOUND</span></h2>
          </div>
          <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(.8rem,1.2vw,.9rem)", color:"var(--white-dim)", lineHeight:2, maxWidth:220 }}>Every component chosen to get out of the way of the music.</p>
        </div>
        <div className="sound-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:2, background:"rgba(255,255,255,0.03)" }}>
          {items.map(s => <SoundCard key={s.num} {...s} />)}
        </div>
      </div>
    </section>
  );
}

function ComfortCard({ icon, label, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "rgba(255,45,32,0.06)" : "var(--white-ghost)", border: `1px solid ${hov ? "var(--border-hot)" : "var(--border-cold)"}`, padding:"clamp(22px,3vw,36px) clamp(18px,2.5vw,28px)", transition:"all .35s cubic-bezier(.22,1,.36,1)", cursor:"default" }}>
      <p style={{ fontFamily:"var(--font-display)", fontSize:"clamp(20px,2.8vw,28px)", marginBottom:12, color: hov ? "var(--red)" : "rgba(240,236,228,0.3)", transition:"color .35s ease" }}>{icon}</p>
      <p style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:"clamp(11px,1.2vw,13px)", letterSpacing:"0.12em", color:"var(--white)", marginBottom:8, textTransform:"uppercase" }}>{label}</p>
      <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(10px,1.1vw,12px)", color:"var(--white-dim)", lineHeight:1.9 }}>{desc}</p>
    </div>
  );
}

function ComfortSection() {
  const features = [
    { icon:"◎", label:"Memory Foam",    desc:"3D-contoured protein leather cups. Slow-rebound memory foam. Zero pressure points." },
    { icon:"◈", label:"Adjustable Fit", desc:"360° rotating ear cups + 40-step headband. Built for every head." },
    { icon:"◇", label:"248g Weight",    desc:"Lighter than a can of soda. Wear all day, forget it's there." },
    { icon:"⬡", label:"Foldable",       desc:"Collapses flat in 2 seconds. Engineered for real life." },
  ];
  return (
    <section style={{ background:"var(--ink3)", padding:"var(--section-pad) 0", borderTop:"1px solid var(--border-cold)", width:"100%" }}>
      <div className="section-inner">
        <div className="comfort-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr", gap:"clamp(48px,8vw,100px)", alignItems:"center" }}>
          <div>
            <div className="sys-tag">Ergonomics</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,6vw,5.5rem)", letterSpacing:"0.02em", color:"var(--white)", lineHeight:0.9, marginBottom:24 }}>
              WEAR IT.<br />FORGET IT.<br /><span style={{ color:"var(--red)" }}>OWN IT.</span>
            </h2>
            <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(.85rem,1.3vw,.95rem)", color:"var(--white-dim)", lineHeight:2, maxWidth:320, marginBottom:36 }}>
              We obsessed over every gram, every curve, every material. The result disappears on your head.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:1, background:"var(--red)", opacity:.5 }} />
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.85vw,9px)", letterSpacing:"0.45em", color:"rgba(255,45,32,0.35)", textTransform:"uppercase" }}>248g / Crafted to perfection</span>
            </div>
          </div>
          <div className="comfort-cards" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {features.map(f => <ComfortCard key={f.label} {...f} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecsSection() {
  const specs = [
    { label:"Driver Size",  val:"40mm Graphene" }, { label:"Frequency",   val:"5Hz – 40kHz" },
    { label:"Impedance",    val:"32 Ω"          }, { label:"ANC Depth",   val:"−40 dB"       },
    { label:"Battery Life", val:"40 Hours"      }, { label:"Charge Time", val:"22 Min"       },
    { label:"Bluetooth",    val:"5.3 LE Audio"  }, { label:"Weight",      val:"248 g"        },
  ];
  return (
    <section style={{ background:"var(--ink)", borderTop:"1px solid var(--border-cold)", padding:"var(--section-pad) 0", width:"100%" }}>
      <div className="section-inner">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:"clamp(40px,5vw,64px)" }}>
          <div>
            <div className="sys-tag">Technical Data</div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.5rem,5.5vw,5rem)", letterSpacing:"0.02em", color:"var(--white)", lineHeight:0.9 }}>SPECS</h2>
          </div>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.85vw,9px)", letterSpacing:"0.4em", color:"var(--white-dim)", textTransform:"uppercase" }}>Wireless Pro — FW 2026</p>
        </div>
        <div className="specs-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", border:"1px solid var(--border-cold)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, width:50, height:2, background:"var(--red)" }} />
          <div style={{ position:"absolute", top:0, left:0, width:2, height:50, background:"var(--red)" }} />
          {specs.map((s, i) => (
            <div key={s.label}
              style={{ padding:"clamp(18px,2.5vw,30px) clamp(14px,2vw,24px)", borderRight: i%4<3 ? "1px solid var(--border-cold)" : "none", borderBottom: i<4 ? "1px solid var(--border-cold)" : "none", transition:"background .3s ease" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,45,32,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,.8vw,9px)", letterSpacing:"0.4em", color:"var(--white-dim)", textTransform:"uppercase", marginBottom:10 }}>{s.label}</p>
              <p style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.1rem,2.2vw,1.5rem)", color:"var(--white)", letterSpacing:"0.04em" }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section style={{ background:"#06070c", padding:"var(--section-pad) 0", position:"relative", overflow:"hidden", width:"100%", borderTop:"1px solid var(--border-cold)" }}>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-54%)", fontFamily:"var(--font-display)", fontSize:"clamp(200px,35vw,500px)", color:"rgba(255,45,32,0.03)", lineHeight:1, pointerEvents:"none", userSelect:"none" }}>"</div>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,rgba(255,45,32,0.15),transparent)", animation:"scanline 6s linear infinite", pointerEvents:"none" }} />
      <div className="section-inner" style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div className="sys-tag" style={{ justifyContent:"center" }}>Field Report</div>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.8rem,5vw,4.5rem)", letterSpacing:"0.02em", color:"var(--white)", lineHeight:1.1, maxWidth:"700px", margin:"0 auto 48px" }}>
          THE ONLY HEADPHONES THAT MADE ME FORGET I WAS WEARING HEADPHONES.
        </h2>
        <div style={{ width:40, height:2, background:"var(--red)", margin:"0 auto 20px", boxShadow:"0 0 12px var(--red)" }} />
        <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.9vw,10px)", letterSpacing:"0.45em", color:"var(--white-dim)", textTransform:"uppercase" }}>Marcus T. — Senior Audio Engineer</p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ background:"var(--ink)", padding:"var(--section-pad) 0", position:"relative", overflow:"hidden", width:"100%" }}>
      <div style={{ position:"absolute", bottom:"-30%", left:"50%", transform:"translateX(-50%)", width:"clamp(300px,60vw,700px)", height:"clamp(300px,60vw,700px)", background:"radial-gradient(ellipse,rgba(255,45,32,0.06) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div className="divider-red" style={{ position:"absolute", top:0 }} />
      <div className="section-inner" style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div className="sys-tag" style={{ justifyContent:"center" }}>Limited Edition — 499 Units</div>
        <div style={{ position:"relative", display:"inline-block" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(5rem,18vw,16rem)", letterSpacing:"0.01em", color:"var(--white)", lineHeight:0.82 }}>UMER</h2>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(5rem,18vw,16rem)", letterSpacing:"0.01em", color:"transparent", WebkitTextStroke:"1.5px rgba(255,45,32,0.3)", lineHeight:0.82, marginBottom:"clamp(32px,5vw,56px)" }}>WIRELESS</h2>
          <div style={{ position:"absolute", right:"-5%", top:"10%", width:3, height:"80%", background:"var(--red)", opacity:.35, transform:"skewY(-2deg)" }} />
        </div>
        <p style={{ fontFamily:"var(--font-ui)", fontWeight:300, fontSize:"clamp(.9rem,1.5vw,1.05rem)", color:"var(--white-mid)", maxWidth:280, margin:"0 auto clamp(28px,4vw,48px)", lineHeight:2.1 }}>
          499 units worldwide.<br />Once gone — gone forever.
        </p>
        <div style={{ display:"inline-flex", alignItems:"center", gap:16, border:"1px solid var(--border-hot)", padding:"14px 36px", marginBottom:32, background:"rgba(255,45,32,0.04)", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, width:20, height:2, background:"var(--red)" }} />
          <div style={{ position:"absolute", top:0, left:0, width:2, height:20, background:"var(--red)" }} />
          <p style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2.2rem)", color:"var(--white)", letterSpacing:"0.1em" }}>$299</p>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.8vw,9px)", letterSpacing:"0.3em", color:"var(--red)", textTransform:"uppercase" }}>USD</p>
        </div>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:"clamp(56px,9vw,96px)" }}>
          <button className="btn-kill">Order Now →</button>
          <button className="btn-ghost" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>// Watch Again</button>
        </div>
        <div className="divider" style={{ marginBottom:32, opacity:.4 }} />
        <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,.8vw,9px)", letterSpacing:"0.4em", color:"rgba(240,236,228,0.08)", textTransform:"uppercase" }}>© 2026 Umer Wireless. All Rights Reserved.</p>
      </div>
    </section>
  );
}

export default function AuraPage() {
  const [progress, setProgress] = useState(0);
  const [ready,    setReady]    = useState(false);
  const frame = Math.min(Math.floor(progress * (TOTAL - 1)), TOTAL - 1);
  const beat  = BEATS.find(b => progress >= b.from && progress <= b.to) || null;

  return (
    <div style={{ background:"var(--ink)", width:"100%", maxWidth:"100%", overflowX:"hidden", position:"relative" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ height: TOTAL * PX_PER_FRAME + "px", position:"relative", zIndex:1, pointerEvents:"none", width:"100%", overflowX:"hidden" }}>
        <AuraCanvas onProgress={(pct) => { setProgress(pct); if (!ready) setReady(true); }} />
      </div>
      {ready && (
        <>
          <Nav progress={progress} />
          <BeatText beat={beat} />
          {progress < 0.025 && <ScrollIndicator />}
          <div style={{ position:"fixed", bottom:20, right:"clamp(20px,4vw,48px)", zIndex:10, pointerEvents:"none", textAlign:"right" }}>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,.8vw,9px)", letterSpacing:"0.3em", color:"rgba(255,45,32,0.2)" }}>
              {String(frame+1).padStart(3,"0")}<span style={{opacity:.4}}> / {TOTAL}</span>
            </p>
          </div>
        </>
      )}
      <HeroSection />
      <SoundSection />
      <ComfortSection />
      <SpecsSection />
      <QuoteSection />
      <FinalCTA />
    </div>
  );
}