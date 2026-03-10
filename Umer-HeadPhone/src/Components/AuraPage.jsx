import { useState, useEffect, useRef } from "react";
import AuraCanvas from "./AuraCanvas";

const TOTAL = 208;
const PX_PER_FRAME = 12;

const BEATS = [
    { from: 0, to: 0.22, tag: "INTRODUCING", title: "UMER", sub: "Beyond Silence.\nInto Power.", align: "left" },
    { from: 0.25, to: 0.47, tag: "THE CORE", title: "40MM\nGRAPHENE", sub: "Raw metallic precision.\nEvery frequency sculpted.", align: "left" },
    { from: 0.50, to: 0.72, tag: "SMART ANC", title: "SILENCE\nREINVENTED", sub: "AI circuitry adapts\nto your world in real-time.", align: "right" },
    { from: 0.75, to: 0.97, tag: "LIMITED RUN", title: "EVOLVE\nYOUR SOUND", sub: "Umer Wireless Pro.\n499 units only.", align: "left", cta: true },
];

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
        <div style={{
            position: "fixed", bottom: "11vh",
            left: isRight ? "auto" : "6vw", right: isRight ? "6vw" : "auto",
            zIndex: 10, maxWidth: 500,
            pointerEvents: beat.cta ? "all" : "none",
            opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(26px)",
            transition: "opacity .5s ease, transform .5s ease",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 22, height: 1, background: "rgba(255,255,255,.5)" }} />
                <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.65em", color: "rgba(255,255,255,.45)", textTransform: "uppercase" }}>{beat.tag}</p>
            </div>
            <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,5.5vw,5rem)", letterSpacing: "-0.04em", color: "#fff", lineHeight: 0.95, marginBottom: 18, whiteSpace: "pre-line", textShadow: "0 2px 60px rgba(0,0,0,1)" }}>
                {beat.title}
            </h2>
            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(.88rem,1.4vw,1rem)", color: "rgba(255,255,255,.4)", lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: beat.cta ? 28 : 0 }}>
                {beat.sub}
            </p>
            {beat.cta && (
                <div style={{ display: "flex", gap: 12 }}>
                    <button style={{ background: "#fff", border: "none", color: "#050505", padding: "15px 40px", fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = ".9"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}>
                        Order Now →
                    </button>
                    <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "rgba(255,255,255,.4)", padding: "15px 28px", fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.5)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.2)"; e.currentTarget.style.color = "rgba(255,255,255,.4)"; }}>
                        Learn More
                    </button>
                </div>
            )}
        </div>
    );
}

function HeroSection() {
    return (
        <section style={{ position: "relative", zIndex: 5, background: "#050505", padding: "140px 5vw 120px", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent)" }} />
            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.7em", color: "rgba(255,255,255,.18)", textTransform: "uppercase", marginBottom: 24 }}>UMER WIRELESS</p>
            <h1 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(4rem,12vw,11rem)", letterSpacing: "-0.05em", color: "#fff", lineHeight: 0.92, marginBottom: 6 }}>SOUND</h1>
            <h1 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(4rem,12vw,11rem)", letterSpacing: "-0.05em", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,.2)", lineHeight: 0.92, marginBottom: 60 }}>EVOLVED</h1>
            <div style={{ display: "inline-flex", gap: 0, marginBottom: 56, border: "1px solid rgba(255,255,255,.06)" }}>
                {[{ val: "40H", label: "Battery" }, { val: "40MM", label: "Drivers" }, { val: "40dB", label: "ANC" }, { val: "32Ω", label: "Impedance" }].map((s, i, a) => (
                    <div key={s.label} style={{ padding: "22px 44px", textAlign: "center", borderRight: i < a.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: "#fff", letterSpacing: "-0.02em" }}>{s.val}</p>
                        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 8, letterSpacing: "0.45em", color: "rgba(255,255,255,.2)", textTransform: "uppercase", marginTop: 7 }}>{s.label}</p>
                    </div>
                ))}
            </div>
            <br />
            <div style={{ display: "inline-flex", gap: 12, marginTop: 8 }}>
                <button style={{ background: "#fff", border: "none", color: "#050505", padding: "16px 52px", fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = ".9"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}>
                    Order — $299
                </button>
                <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.35)", padding: "16px 40px", fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.color = "rgba(255,255,255,.35)"; }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Watch Again
                </button>
            </div>
        </section>
    );
}

function SoundSection() {
    const items = [
        { num: "01", title: "Graphene Diaphragm", body: "Ultra-thin graphene membrane — 200x stronger than steel, zero distortion at any volume." },
        { num: "02", title: "Neodymium Magnets", body: "N52 neodymium magnets generate a magnetic field 3x stronger than standard drivers." },
        { num: "03", title: "Acoustic Chamber", body: "Mathematically tuned ear cup geometry. Every Hz reaches your ear exactly as intended." },
        { num: "04", title: "Hybrid ANC Array", body: "3 feedforward + 2 feedback mics. AI samples noise 48,000 times per second." },
    ];
    return (
        <section style={{ background: "#f5f5f5", padding: "120px 5vw" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ marginBottom: 80 }}>
                    <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.7em", color: "rgba(0,0,0,.3)", textTransform: "uppercase", marginBottom: 18 }}>THE SCIENCE</p>
                    <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,6vw,5.5rem)", letterSpacing: "-0.04em", color: "#050505", lineHeight: 0.92 }}>
                        Sound isn't<br />
                        <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(0,0,0,.18)" }}>magic. It's physics.</span>
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 1, background: "rgba(0,0,0,.07)" }}>
                    {items.map(s => (
                        <div key={s.num}
                            style={{ background: "#f5f5f5", padding: "48px 36px", transition: "background .3s ease", cursor: "default" }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#050505";
                                e.currentTarget.querySelectorAll("p").forEach((el, i) => {
                                    if (i === 0) el.style.color = "rgba(255,255,255,.06)";
                                    if (i === 1) el.style.color = "rgba(255,255,255,.4)";
                                    if (i === 2) el.style.color = "#fff";
                                    if (i === 3) el.style.color = "rgba(255,255,255,.35)";
                                });
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "#f5f5f5";
                                e.currentTarget.querySelectorAll("p").forEach((el, i) => {
                                    if (i === 0) el.style.color = "rgba(0,0,0,.06)";
                                    if (i === 1) el.style.color = "rgba(0,0,0,.35)";
                                    if (i === 2) el.style.color = "#050505";
                                    if (i === 3) el.style.color = "rgba(0,0,0,.45)";
                                });
                            }}>
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 56, color: "rgba(0,0,0,.06)", lineHeight: 1, marginBottom: 20, transition: "color .3s ease" }}>{s.num}</p>
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.5em", color: "rgba(0,0,0,.35)", textTransform: "uppercase", marginBottom: 10, transition: "color .3s ease" }}>{s.title}</p>
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "clamp(1.1rem,2vw,1.4rem)", color: "#050505", letterSpacing: "-0.02em", marginBottom: 14, transition: "color .3s ease" }}>{s.title}</p>
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 13, color: "rgba(0,0,0,.45)", lineHeight: 1.8, transition: "color .3s ease" }}>{s.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ComfortSection() {
    const features = [
        { icon: "◎", label: "Memory Foam", desc: "3D-contoured protein leather cups with slow-rebound memory foam. Zero pressure points." },
        { icon: "◈", label: "Adjustable Fit", desc: "360° rotating ear cups + 40-step headband. Fits every head perfectly." },
        { icon: "◇", label: "248g Only", desc: "Lighter than a can of soda. Wear all day, forget it's there." },
        { icon: "⬡", label: "Foldable", desc: "Collapses flat in 2 seconds. Built for real life." },
    ];
    return (
        <section style={{ background: "#0a0a0a", padding: "120px 5vw", borderTop: "1px solid rgba(255,255,255,.03)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                <div>
                    <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.7em", color: "rgba(255,255,255,.2)", textTransform: "uppercase", marginBottom: 18 }}>COMFORT</p>
                    <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4.5rem)", letterSpacing: "-0.04em", color: "#fff", lineHeight: 0.95, marginBottom: 24 }}>
                        Wear it.<br />Forget it.<br />
                        <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,.2)" }}>Live in it.</span>
                    </h2>
                    <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(.9rem,1.4vw,1rem)", color: "rgba(255,255,255,.3)", lineHeight: 1.9, maxWidth: 380 }}>
                        We obsessed over every gram, every curve, every material. The result is a headphone that disappears on your head.
                    </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,.03)" }}>
                    {features.map(f => (
                        <div key={f.label}
                            style={{ background: "#0a0a0a", padding: "36px 28px", transition: "background .3s ease", cursor: "default" }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.querySelectorAll("p").forEach((el, i) => {
                                    if (i === 0) el.style.color = "#050505";
                                    if (i === 1) el.style.color = "#050505";
                                    if (i === 2) el.style.color = "rgba(0,0,0,.5)";
                                });
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "#0a0a0a";
                                e.currentTarget.querySelectorAll("p").forEach((el, i) => {
                                    if (i === 0) el.style.color = "rgba(255,255,255,.6)";
                                    if (i === 1) el.style.color = "rgba(255,255,255,.8)";
                                    if (i === 2) el.style.color = "rgba(255,255,255,.3)";
                                });
                            }}>
                            <p style={{ fontSize: 20, marginBottom: 14, color: "rgba(255,255,255,.6)", transition: "color .3s ease" }}>{f.icon}</p>
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: 12, color: "rgba(255,255,255,.8)", marginBottom: 10, transition: "color .3s ease" }}>{f.label}</p>
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.7, transition: "color .3s ease" }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function QuoteSection() {
    return (
        <section style={{ background: "#fff", padding: "130px 5vw", textAlign: "center" }}>
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
                <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 28, color: "rgba(0,0,0,.12)", marginBottom: 32 }}>"</p>
                <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4.5vw,3.8rem)", letterSpacing: "-0.035em", color: "#050505", lineHeight: 1.12, marginBottom: 40 }}>
                    The only headphones that made me forget I was wearing headphones.
                </h2>
                <div style={{ width: 28, height: 1, background: "rgba(0,0,0,.12)", margin: "0 auto 20px" }} />
                <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 400, fontSize: 10, letterSpacing: "0.4em", color: "rgba(0,0,0,.25)", textTransform: "uppercase" }}>
                    — Marcus T. — Senior Audio Engineer
                </p>
            </div>
        </section>
    );
}

function FinalCTA() {
    return (
        <section style={{ background: "#050505", padding: "140px 5vw", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.04)" }}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.7em", color: "rgba(255,255,255,.15)", textTransform: "uppercase", marginBottom: 24 }}>LIMITED EDITION</p>
                <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(3.5rem,12vw,10rem)", letterSpacing: "-0.05em", color: "#fff", lineHeight: 0.9, marginBottom: 4 }}>UMER</h2>
                <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(3.5rem,12vw,10rem)", letterSpacing: "-0.05em", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,.18)", lineHeight: 0.9, marginBottom: 56 }}>WIRELESS</h2>
                <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(.9rem,1.4vw,1rem)", color: "rgba(255,255,255,.2)", maxWidth: 300, margin: "0 auto 52px", lineHeight: 2.1 }}>
                    499 units worldwide.<br />Once gone, gone forever.
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 80 }}>
                    <button style={{ background: "#fff", border: "none", color: "#050505", padding: "18px 56px", fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                        Order Now — $299
                    </button>
                    <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.3)", padding: "18px 44px", fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; e.currentTarget.style.color = "rgba(255,255,255,.75)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.color = "rgba(255,255,255,.3)"; }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Watch Again
                    </button>
                </div>
                <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,.07)", textTransform: "uppercase" }}>
                    © 2026 UMER WIRELESS. ALL RIGHTS RESERVED.
                </p>
            </div>
        </section>
    );
}

export default function AuraPage() {
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const frame = Math.min(Math.floor(progress * (TOTAL - 1)), TOTAL - 1);
    const beat = BEATS.find(b => progress >= b.from && progress <= b.to) || null;

    return (
        <div style={{ background: "#050505" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:#050505; overflow-x:hidden; }
        ::-webkit-scrollbar { width:0; }
        @keyframes aura-bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(9px);} }
      `}</style>

            <div style={{ height: TOTAL * PX_PER_FRAME + "px", position: "relative", zIndex: 1, pointerEvents: "none" }}>
                <AuraCanvas onProgress={(pct) => { setProgress(pct); if (!ready) setReady(true); }} />
            </div>

            {ready && (
                <>
                    <div style={{ position: "fixed", top: 24, left: 40, zIndex: 10, pointerEvents: "none" }}>
                        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.3em", color: "rgba(255,255,255,.7)", textTransform: "uppercase" }}>UMER</p>
                    </div>
                    <div style={{ position: "fixed", top: 28, right: 40, zIndex: 10, pointerEvents: "none", textAlign: "right" }}>
                        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.35em", color: "rgba(255,255,255,.18)" }}>
                            {String(frame + 1).padStart(3, "0")}<span style={{ opacity: .3 }}> / {TOTAL}</span>
                        </p>
                        <div style={{ marginTop: 5, width: 52, height: 1, background: "rgba(255,255,255,.05)", marginLeft: "auto" }}>
                            <div style={{ height: "100%", width: progress * 100 + "%", background: "#fff", transition: "width .04s linear", opacity: .35 }} />
                        </div>
                    </div>

                    <BeatText beat={beat} />

                    {progress < 0.025 && (
                        <div style={{ position: "fixed", bottom: "5vh", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" }}>
                            <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom,transparent,rgba(255,255,255,.3))", margin: "0 auto 7px", animation: "aura-bounce 1.7s ease-in-out infinite" }} />
                            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: 8, letterSpacing: "0.65em", color: "rgba(255,255,255,.2)", textTransform: "uppercase" }}>SCROLL</p>
                        </div>
                    )}
                </>
            )}

            <HeroSection />
            <SoundSection />
            <ComfortSection />
            <QuoteSection />
            <FinalCTA />
        </div>
    );
}