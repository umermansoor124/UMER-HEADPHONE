import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL = 208;
const PX_PER_FRAME = 12;
const getFrame = (i) => `imagess/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

export default function AuraCanvas({ onProgress }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef  = useRef(0);
  const rafRef    = useRef(null);
  const [ready,   setReady]   = useState(false);
  const [visible, setVisible] = useState(true);

  const fitCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width         = window.innerWidth  * devicePixelRatio;
    c.height        = window.innerHeight * devicePixelRatio;
    c.style.width   = window.innerWidth  + "px";
    c.style.height = window.innerHeight + "px";
  }, []);

  const paint = useCallback((fi, imgArr) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx  = c.getContext("2d");
    const imgs = imgArr || imagesRef.current;
    const img  = imgs[fi];
    if (!img?.complete || !img.naturalWidth) return;

    const cw = c.width, ch = c.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;

    const s  = Math.max(cw / iw, ch / ih);
    const dw = iw * s;
    const dh = ih * s;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    const vig = ctx.createRadialGradient(cw/2, ch/2, cw*0.2, cw/2, ch/2, cw*0.78);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(0.7, "rgba(0,0,0,0.1)");
    vig.addColorStop(1, "rgba(5,5,5,0.88)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, cw, ch);

    const btm = ctx.createLinearGradient(0, ch * 0.55, 0, ch);
    btm.addColorStop(0, "rgba(5,5,5,0)");
    btm.addColorStop(1, "rgba(5,5,5,0.88)");
    ctx.fillStyle = btm;
    ctx.fillRect(0, 0, cw, ch);
  }, []);

  useEffect(() => {
    fitCanvas();
    const imgs = [];
    let done = 0;
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.src = getFrame(i);
      img.onload = img.onerror = () => {
        done++;
        if (done === TOTAL) { 
          setReady(true); 
          paint(0, imgs); 
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    const onResize = () => { fitCanvas(); paint(frameRef.current); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitCanvas, paint]);

  useEffect(() => {
    if (!ready) return;
    const maxScroll = TOTAL * PX_PER_FRAME;
    const onScroll = () => {
      const pct = Math.min(window.scrollY / maxScroll, 1);
      const fi  = Math.min(Math.floor(pct * (TOTAL - 1)), TOTAL - 1);
      onProgress?.(pct);
      setVisible(pct < 1);
      if (fi === frameRef.current) return;
      frameRef.current = fi;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => paint(fi));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, onProgress, paint]);

  return (
    <canvas ref={canvasRef} style={{
      position:"fixed", top:0, left:0,
      width:"100vw", height:"100vh",
      display:"block",
      background:"#050505",
      opacity: ready && visible ? 1 : 0,
      transition:"opacity .5s ease",
      zIndex:0,
      pointerEvents:"none",
    }}/>
  );
}