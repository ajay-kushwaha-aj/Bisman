// ============================================================
// 💕 Valentine's Day & 1st Anniversary — Bisman Kaur
//    React 18 + TypeScript + Tailwind CSS + Framer Motion
// ============================================================

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";
import {
  motion, AnimatePresence, useAnimation,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type GameId = "catch" | "trap" | "quiz";

interface Photo {
  id: number;
  bg: string;
  emoji: string;
  label: string;
  hoverQuote: string;
  caption: string;
  date: string;
  loveNote: string;
  image?: string; 
}

interface QuizQ {
  q: string;
  opts: string[];
  correctIdx: number;
}

interface FallingHeart {
  id: number;
  x: number;
  size: number;
  dur: number;
  char: string;
}

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const PHOTOS: Photo[] = [
  { id:1, image: "/photo1.jpg", bg:"linear-gradient(135deg,#FADADD,#FFB6C1)", emoji:"🪯", label:"1st Meeting", hoverQuote:"Tune mujhe mara tha and i was like ye mujhe mar kaise di 😂", caption:"The day everything changed forever.", date:"August 28, 2023", loveNote:"Hamara 1st picture aur hamara pehla interaction and i pronounced your name wrongly - Bismaaan." },
  { id:2, image: "/photo2.jpg", bg:"linear-gradient(135deg,#E6E6FA,#C4B5FD)", emoji:"💕", label:"1st Date", hoverQuote:"Official CEO of my happiness. 💼", caption:"Our first month felt like a beautiful dream. - mere life ka pehla Date🌹", date:"February 14, 2025", loveNote:"Every single day with you is my favourite day." },
  { id:3, image: "/photo3.jpg", bg:"linear-gradient(135deg,#FFF8F0,#FCEABB)", emoji:"🌸", label:"Valentine's Day", hoverQuote:"My daily dopamine dose. ✨", caption:"You make ordinary days feel magical.", date:"February 14, 2025", loveNote:"I love to be around you, its like a pyase ko Pani." },
  { id:4, image: "/photo4.jpg", bg:"linear-gradient(135deg,#FFE4EC,#FFC2D4)", emoji:"🚂", label:"1st Trip", hoverQuote:"Turned my 'I' into 'We'. Best upgrade. 💕", caption:"Celebrating you, us, and everything in between.", date:"January 22, 2025", loveNote:"Hamara pehla trip, abhi to puri duniya baki hai" },
  { id:5, image: "/photo5.jpg", bg:"linear-gradient(135deg,#D4EDDA,#A8D5B5)", emoji:"😘", label:"Twilight memory", hoverQuote:"Stars are less bright than your smile. Fact. 🌟", caption:"Some evenings are too beautiful to forget.", date:"November 20, 2025", loveNote:"Chaotic, laughing, and completely in love — that's us." },
  { id:6, image: "/photo6.jpg", bg:"linear-gradient(135deg,#FDE8EE,#DC3C5A)", emoji:"🎉", label:"Anniversary photo", hoverQuote:"365 days of 'how am I this lucky?' 🍀", caption:"One full year of the best decision I ever made.", date:"January 17, 2026", loveNote:"Here's to forever, Bisman. You are my home. mai tumhara guru hu. Respect me." },
];

const QUIZ: QuizQ[] = [
  { q:"Where did we first meet? 🥺", opts:["Online 📱","Mutual friend's place 🏠","A coffee shop ☕","Fate pushed us together 🌌"], correctIdx:3 },
  { q:"Who said 'I love you' first? 😏", opts:["Me (I'm brave) 💪","You, after convincing 😅","We both said it together 🥹","Stars aligned — who's counting 💫"], correctIdx:3 },
  { q:"What's our favourite song? 🎵", opts:["Slow & romantic 🎻","An upbeat bop 🕺","It randomly became ours 🎶","Whichever plays when we're together 💕"], correctIdx:3 },
  { q:"What does Ajay do when Bisman is sad?", opts:["Terrible jokes until she laughs 😂","Irritate 😖","Snacks immediately 🍕","All of the above + 1000 more 💝"], correctIdx:3 },
  { q:"What's the best thing about us? 💞", opts:["We laugh at the same things 😄","Perfectly imperfect together 🌸","Make each other better daily 🌟","Everything. Literally everything. 💕"], correctIdx:3 },
];

const ROMANTIC_MSGS = [
  "You are the first thought every morning and the last one before sleep. That's not routine — that's love, Bisman. 🌹",
  "In a world full of noise, you are my favourite sound. Your laugh, your voice, your everything. 💕",
  "I didn't believe in soulmates until I noticed how perfectly you fit into every corner of my life. Now I'm a complete believer. ✨",
  "आप ही के बिना हु क्यों बेचैन ,आप ही क्यों मेरी जरूरत है, वहम इतना हसी नहीं होता , वाकई आप खूबशरूरत है 💫",
  "Loving you is the easiest thing I've ever done. And I plan to keep doing it forever. 💍",
  "If I could go back and choose again, I'd choose you. Every single time, without a second thought. 🌸",
  "Ki chandi sona ek taraf, aur tera hona ek taraf, ek taraf teri aankhe 👀, jaadu tona ek taraf. 🌻",
  "My favourite version of myself is the one that exists when I'm with you. 💝",
  "You didn't just change my life, Bisman — you became the reason it feels worth living fully. 🥹",
];

const HEART_CHARS = ["💕","💖","💗","💓","💝","🩷","❣️","🌸","✨"];

const WEDDING_ADJECTIVES = ["Magical","Starlit","Golden","Eternal","Dreamy","Radiant","Heavenly"];
const WEDDING_MONTHS = ["February","June","October","December","March","September"];
const WEDDING_VENUES = ["on a misty mountain top","by the ocean at sunset","in a garden of roses","under a canopy of fairy lights","in a quaint Italian villa","at a rooftop in Paris"];

/* ─────────────────────────────────────────────────────────
   WEB AUDIO AMBIENT MUSIC
───────────────────────────────────────────────────────── */
const MELODY = [261.63,293.66,329.63,349.23,392,440,493.88,523.25];
const PADS   = [130.81,164.81,196,261.63];

function createAmbientMusic() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 2);
  master.connect(ctx.destination);

  const dly = ctx.createDelay(2); dly.delayTime.value = 0.38;
  const dg  = ctx.createGain();   dg.gain.value = 0.25;
  dly.connect(dg); dg.connect(dly); dg.connect(master);

  PADS.forEach((f, i) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = f; o.detune.value = i%2===0?5:-5;
    g.gain.value = 0.045; o.connect(g); g.connect(master); g.connect(dly); o.start();
  });

  let ni = 0;
  const play = () => {
    const o = ctx.createOscillator(); const e = ctx.createGain();
    o.type = "triangle"; o.frequency.value = MELODY[ni % MELODY.length]; ni++;
    const t = ctx.currentTime;
    e.gain.setValueAtTime(0,t); e.gain.linearRampToValueAtTime(0.06,t+0.1);
    e.gain.exponentialRampToValueAtTime(0.001,t+2);
    o.connect(e); e.connect(master); e.connect(dly); o.start(t); o.stop(t+2);
  };
  play();
  const iv = setInterval(play, 950);
  return { ctx, iv, master };
}

/* ─────────────────────────────────────────────────────────
   CONFETTI CANVAS
───────────────────────────────────────────────────────── */
const ConfettiCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#D63384","#FFB6C1","#D4A24A","#FADADD","#9b1f3a","#ffffff","#E6E6FA","#FF6B9D"];
    const pieces = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width, y: -20,
      w: 5 + Math.random() * 10, h: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - .5) * 6, vy: 2 + Math.random() * 5,
      vr: (Math.random() - .5) * .3, alpha: 1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += .07;
        if (p.y > canvas.height * .75) p.alpha -= .018;
        if (p.alpha <= 0) return;
        ctx.save(); ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      if (pieces.some(p => p.alpha > 0)) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-[300]" />;
};

/* ─────────────────────────────────────────────────────────
   FIREWORKS CANVAS (Easter Egg)
───────────────────────────────────────────────────────── */
const FireworksCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ["#FF6B9D","#D63384","#FFB6C1","#D4A24A","#FADADD","#E6E6FA","#fff","#FF4081"];

    const burst = (cx: number, cy: number) => {
      for (let i = 0; i < 120; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const speed = 2 + Math.random() * 7;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1, r: 2 + Math.random() * 3,
        });
      }
    };

    // Multiple bursts at random positions
    const positions = [[0.5,0.3],[0.2,0.5],[0.8,0.4],[0.3,0.7],[0.7,0.6],[0.5,0.7]];
    positions.forEach(([x, y], i) =>
      setTimeout(() => burst(x * canvas.width, y * canvas.height), i * 300)
    );

    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)"; ctx.fillRect(0,0,canvas.width,canvas.height);
      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.alpha -= 0.012;
        if (p.alpha <= 0) { particles.splice(i,1); continue; }
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (particles.length > 0) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-[450]" />;
};

/* ─────────────────────────────────────────────────────────
   FLOATING HEARTS BACKGROUND
───────────────────────────────────────────────────────── */
const FloatingHeartsBg: React.FC = () => {
  const [hearts, setHearts] = useState<Array<{id:number;x:number;dur:number;size:number;char:string;delay:number}>>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const spawn = () => {
      const id = idRef.current++;
      const dur = 10 + Math.random() * 12;
      setHearts(h => [...h.slice(-40), { id, x: Math.random()*100, dur, size: 0.8+Math.random()*1.6, char: HEART_CHARS[Math.floor(Math.random()*HEART_CHARS.length)], delay: Math.random()*2 }]);
      setTimeout(() => setHearts(h => h.filter(x => x.id !== id)), (dur+3)*1000);
    };
    for(let i=0;i<16;i++) setTimeout(spawn, i*300);
    const iv = setInterval(spawn, 700);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(h => (
        <div key={h.id} className="heart-float absolute"
          style={{ left:`${h.x}%`, fontSize:`${h.size}rem`, animationDuration:`${h.dur}s`, animationDelay:`${h.delay}s` }}>
          {h.char}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────────────────── */
const LoadingScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setProgress(p => { if(p>=100){ clearInterval(iv); setTimeout(onDone,400); return 100; } return p+2; }), 60);
    return () => clearInterval(iv);
  }, [onDone]);

  const hearts = useMemo(() => Array.from({length:12},(_,i)=>i), []);

  return (
    <motion.div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background:"linear-gradient(135deg,#FADADD 0%,#FFF8F0 50%,#E6E6FA 100%)" }}
      exit={{ opacity:0, scale:1.05, transition:{ duration:0.6 } }}>

      {/* Orbiting hearts */}
      {hearts.map((i) => (
        <motion.div key={i} className="absolute text-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 4+(i%3), repeat:Infinity, ease:"linear" }}
          style={{ left:"50%", top:"50%", transformOrigin:`${50+30*Math.cos(i*30*Math.PI/180)}px ${50+30*Math.sin(i*30*Math.PI/180)}px` }}>
          <motion.span animate={{ scale:[0.7,1.1,0.7], opacity:[0.4,1,0.4] }}
            transition={{ duration:1.5+Math.random(), repeat:Infinity, delay:i*0.15 }}>
            {HEART_CHARS[i%HEART_CHARS.length]}
          </motion.span>
        </motion.div>
      ))}

      {/* Big pulsing heart */}
      <motion.div className="text-8xl mb-8"
        animate={{ scale:[1,1.15,1], filter:["drop-shadow(0 0 0px #D63384)","drop-shadow(0 0 30px #D63384)","drop-shadow(0 0 0px #D63384)"] }}
        transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}>
        💕
      </motion.div>

      <motion.h1 className="font-playfair text-4xl md:text-5xl font-bold text-deep-rose text-center mb-2"
        style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        Loading Your Love Story
      </motion.h1>

      <motion.p className="font-poppins text-lg text-pink-400 mb-10"
        style={{ fontFamily:"Poppins,sans-serif", color:"#EC4899" }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
        Made with 💕 for Bisman Kaur
      </motion.p>

      {/* Progress bar */}
      <div className="w-64 h-2 rounded-full overflow-hidden" style={{ background:"rgba(214,51,132,0.15)" }}>
        <motion.div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#D63384,#D4A24A)" }}
          animate={{ width:`${progress}%` }} transition={{ ease:"linear" }} />
      </div>
      <p className="font-poppins text-sm mt-3" style={{ fontFamily:"Poppins,sans-serif", color:"#D63384", opacity:0.7 }}>
        {progress}%
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   EASTER EGG
───────────────────────────────────────────────────────── */
const EasterEgg: React.FC = () => {
  const [triggered, setTriggered] = useState(false);
  const bufRef = useRef("");
  const TARGET = "i love you ajay";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      bufRef.current = (bufRef.current + e.key.toLowerCase()).slice(-TARGET.length);
      if (bufRef.current === TARGET) setTriggered(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div className="fixed inset-0 z-[600] flex items-center justify-center"
          style={{ background:"rgba(26,4,8,0.92)" }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
          <FireworksCanvas />
          <motion.div className="relative z-10 text-center px-8"
            initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", damping:12 }}>
            <motion.div className="text-8xl mb-6"
              animate={{ scale:[1,1.3,1], rotate:[0,10,-10,0] }} transition={{ duration:0.8, repeat:3 }}>
              ❤️
            </motion.div>
            <h1 className="font-playfair text-4xl md:text-6xl font-black text-white mb-4"
              style={{ fontFamily:'"Playfair Display",serif' }}>
              I love you more ❤️
            </h1>
            <p className="font-poppins text-xl text-pink-300 mb-8" style={{ fontFamily:"Poppins,sans-serif" }}>
              Always have. Always will. Forever and ever, Bisman. 💕
            </p>
            <motion.div className="flex justify-center gap-4 flex-wrap">
              {["💕","💖","💗","💓","💝","💘","❣️","💞"].map((c,i) => (
                <motion.span key={i} className="text-3xl"
                  animate={{ y:[0,-20,0], scale:[1,1.3,1] }}
                  transition={{ duration:1+Math.random(), repeat:Infinity, delay:i*0.15 }}>{c}</motion.span>
              ))}
            </motion.div>
            <button onClick={() => setTriggered(false)} className="mt-10 px-8 py-3 rounded-full font-poppins text-white font-semibold"
              style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)" }}>
              💕 Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
const NAV = [
  { id:"hero",    label:"Home"      },
  { id:"games",   label:"Games"     },
  { id:"gallery", label:"Gallery"   },
  { id:"surprise",label:"Surprise"  },
  { id:"letter",  label:"Letter"    },
  { id:"final",   label:"Anniversary"},
];

const Navbar: React.FC<{ midnightMode: boolean }> = ({ midnightMode }) => {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const ids = NAV.map(n => n.id);
      for(let i = ids.length-1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if(el && window.scrollY + 130 >= el.offsetTop) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMenuOpen(false);
  };

  const bg = midnightMode
    ? scrolled ? "rgba(26,4,8,0.96)" : "rgba(26,4,8,0.7)"
    : scrolled ? "rgba(255,248,240,0.96)" : "rgba(255,248,240,0.7)";

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-[200]"
      style={{ background:bg, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${scrolled?(midnightMode?"rgba(247,168,184,0.15)":"rgba(214,51,132,0.12)"):"transparent"}`, transition:"all .4s" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => go("hero")} className="flex items-center gap-2">
          <motion.span animate={{ scale:[1,1.2,1] }} transition={{ duration:2.5, repeat:Infinity }} className="text-2xl">💕</motion.span>
          <span className="font-playfair font-bold italic text-xl"
            style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>For Bisman</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)}
              className="relative font-poppins text-xs tracking-widest uppercase transition-colors"
              style={{ fontFamily:"Poppins,sans-serif", color: active===n.id?"#D63384": midnightMode?"rgba(255,255,255,0.7)":"#4a1825", background:"none", border:"none", cursor:"pointer" }}>
              {n.label}
              <motion.span className="absolute -bottom-1 left-0 h-0.5 rounded-full"
                style={{ background:"linear-gradient(90deg,#D63384,#D4A24A)" }}
                animate={{ width: active===n.id?"100%":"0%" }}
                transition={{ duration:0.3 }} />
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-2xl" style={{ background:"none", border:"none", cursor:"pointer", color:"#D63384" }}
          onClick={() => setMenuOpen(o=>!o)}>{menuOpen?"✕":"☰"}</button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            className="md:hidden overflow-hidden"
            style={{ background: midnightMode?"rgba(26,4,8,0.97)":"rgba(255,248,240,0.97)", borderTop:"1px solid rgba(214,51,132,0.12)" }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV.map(n => (
                <button key={n.id} onClick={() => go(n.id)}
                  className="text-left font-poppins text-sm tracking-wider uppercase"
                  style={{ fontFamily:"Poppins,sans-serif", color: active===n.id?"#D63384": midnightMode?"rgba(255,255,255,0.7)":"#4a1825", background:"none", border:"none", cursor:"pointer" }}>
                  {n.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* ─────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────── */
const Hero: React.FC<{ midnightMode: boolean }> = ({ midnightMode }) => {
  const bg = midnightMode
    ? "radial-gradient(ellipse at 50% 20%,#2d0a14 0%,#1a0408 60%,#0d0209 100%)"
    : "radial-gradient(ellipse at 50% 20%,#FADADD 0%,#FFF8F0 50%,#E6E6FA 100%)";

  const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.18 }}};
  const item = { hidden:{ opacity:0, y:36 }, show:{ opacity:1, y:0, transition:{ duration:0.8, ease:[0.22,1,0.36,1] as any }}};

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ background:bg, paddingTop:100 }}>
      {/* Decorative rings */}
      {[600,900,1200].map(s => (
        <div key={s} className="absolute rounded-full pointer-events-none"
          style={{ width:s, height:s, border:"1px solid rgba(214,51,132,0.06)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
      ))}

      {/* Anniversary ribbon tag */}
      <motion.div className="absolute top-24 right-8 md:right-16 text-center z-10"
        animate={{ y:[0,-6,0], rotate:[-2,-2,-2] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
        style={{ background:"linear-gradient(145deg,#e8b84b,#c8883a,#d4a24a)", borderRadius:"14px 14px 14px 0", padding:"14px 20px", boxShadow:"0 8px 32px rgba(212,162,74,.5)", border:"1px solid rgba(255,220,100,.25)" }}>
        <div style={{ position:"absolute", bottom:-10, left:0, width:0, height:0, borderLeft:"10px solid #8a5c1a", borderBottom:"10px solid transparent" }} />
        <div className="font-playfair font-black text-white" style={{ fontSize:"2.4rem", fontFamily:'"Playfair Display",serif', lineHeight:1 }}>1<span style={{ fontSize:"1rem" }}>st</span></div>
        <div className="font-poppins text-white/90 text-xs" style={{ fontFamily:"Poppins,sans-serif" }}>Anniversary 🥂</div>
      </motion.div>

      <motion.div className="relative z-10 px-6 pb-16" variants={stagger} initial="hidden" animate="show">
        <motion.p variants={item} className="font-poppins text-xs tracking-[0.3em] uppercase mb-5"
          style={{ fontFamily:"Poppins,sans-serif", color:"#D63384" }}>
          February 14, 2025 — February 14, 2026
        </motion.p>

        <motion.h1 variants={item} className="font-playfair font-black mb-2"
          style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(2.4rem,7vw,6rem)", color: midnightMode?"white":"#1a0408", lineHeight:1.05 }}>
          Happy Valentine's Day
        </motion.h1>

        <motion.h1 variants={item} className="font-playfair font-bold italic mb-4"
          style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(2rem,5.5vw,5rem)", color:"#D63384", lineHeight:1.1 }}>
          &amp; Anniversary
        </motion.h1>

        <motion.h2 variants={item} className="font-playfair font-bold italic shimmer-text mb-6"
          style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(1.8rem,4.5vw,4rem)", display:"inline-block" }}>
          Bisman Kaur
        </motion.h2>

        <motion.p variants={item} className="font-poppins text-lg md:text-xl italic max-w-xl mx-auto mb-10"
          style={{ fontFamily:"Poppins,sans-serif", color: midnightMode?"rgba(255,255,255,0.7)":"#6b3040", lineHeight:1.9 }}>
          "365 days of loving you. Infinite to go." 🌹
        </motion.p>

        <motion.div variants={item} className="flex gap-4 justify-center flex-wrap">
          <motion.button whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.96 }}
            onClick={() => document.getElementById("letter")?.scrollIntoView({ behavior:"smooth" })}
            className="font-playfair italic font-bold text-white px-10 py-4 rounded-full text-lg"
            style={{ fontFamily:'"Playfair Display",serif', background:"linear-gradient(135deg,#D63384,#9b1f3a)", boxShadow:"0 12px 40px rgba(214,51,132,0.4)", border:"none", cursor:"pointer" }}>
            Read My Letter 💌
          </motion.button>
          <motion.button whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.96 }}
            onClick={() => document.getElementById("games")?.scrollIntoView({ behavior:"smooth" })}
            className="font-playfair italic font-bold px-10 py-4 rounded-full text-lg"
            style={{ fontFamily:'"Playfair Display",serif', color:"#D63384", border:"2px solid #D63384", background:"transparent", cursor:"pointer" }}>
            Play Our Games 🎮
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl"
        animate={{ y:[0,-10,0] }} transition={{ duration:2.2, repeat:Infinity }}
        style={{ color:"rgba(214,51,132,0.5)", cursor:"pointer" }}
        onClick={() => document.getElementById("games")?.scrollIntoView({ behavior:"smooth" })}>↓</motion.div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────── */
const SecHead: React.FC<{ tag: string; title: string; accent: string; light?: boolean }> = ({ tag, title, accent, light }) => (
  <motion.div className="text-center mb-12"
    initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
    <p className="font-poppins text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily:"Poppins,sans-serif", color: light?"#f7a8b8":"#D63384" }}>{tag}</p>
    <h2 className="font-playfair font-bold" style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(1.9rem,4vw,3rem)", lineHeight:1.2, color: light?"white":"#1a0408" }}>
      {title}<br /><em style={{ color: light?"#f7a8b8":"#D63384" }}>{accent}</em>
    </h2>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────
   GAME 1: CATCH MY HEART
───────────────────────────────────────────────────────── */
const CatchHeartsGame: React.FC = () => {
  const [active, setActive] = useState(false);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const idRef = useRef(0);

  const start = () => { setActive(true); setScore(0); setTimeLeft(60); setWon(false); setGameOver(false); setHearts([]); };
  const reset = () => { setActive(false); setHearts([]); setScore(0); };

  useEffect(() => {
    if (!active || won) return;
    const iv = setInterval(() => {
      setHearts(h => [...h, {
        id: idRef.current++,
        x: 5 + Math.random() * 85,
        size: 1.2 + Math.random() * 1.4,
        dur: 3 + Math.random() * 2,
        char: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
      }]);
    }, 650);
    return () => clearInterval(iv);
  }, [active, won]);

  useEffect(() => {
    if (!active || won || gameOver) return;
    const iv = setInterval(() => setTimeLeft(t => { if(t<=1){ setGameOver(true); setActive(false); return 0; } return t-1; }), 1000);
    return () => clearInterval(iv);
  }, [active, won, gameOver]);

  useEffect(() => { if(score >= 20) setWon(true); }, [score]);

  const catchHeart = (id: number) => { setHearts(h => h.filter(x => x.id !== id)); setScore(s => s+1); };
  const missHeart  = (id: number) => { setHearts(h => h.filter(x => x.id !== id)); };

  return (
    <div className="text-center">
      <p className="font-poppins text-4xl mb-2" style={{ fontFamily:"Poppins,sans-serif" }}>💕 Catch My Heart</p>
      <p className="font-poppins text-sm text-pink-400 mb-6" style={{ fontFamily:"Poppins,sans-serif" }}>
        Click the falling hearts — collect 20 to win! ❤️
      </p>

      <AnimatePresence mode="wait">
        {!active && !won && !gameOver && (
          <motion.div key="start" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={start} className="font-poppins text-white font-semibold px-12 py-4 rounded-full text-lg"
              style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", boxShadow:"0 12px 40px rgba(214,51,132,0.4)", border:"none", cursor:"pointer" }}>
              ▶ Start Game
            </motion.button>
          </motion.div>
        )}

        {won && (
          <motion.div key="won" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ type:"spring" }}
            className="glass-card rounded-3xl p-10 max-w-md mx-auto">
            <ConfettiCanvas active />
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="font-playfair text-2xl font-bold italic text-deep-rose mb-3" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
              You did it!
            </h3>
            <p className="font-poppins text-gray-600 text-lg italic" style={{ fontFamily:"Poppins,sans-serif" }}>
              "You already caught my heart forever 💘"
            </p>
            {/* FIX: Changed onClick={reset} to onClick={start} so it actually restarts the game */}
            <motion.button whileHover={{ scale:1.05 }} onClick={start} className="mt-6 font-poppins px-8 py-3 rounded-full text-white font-semibold"
              style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", border:"none", cursor:"pointer" }}>
              Play Again 🔄
            </motion.button>
          </motion.div>
        )}

        {gameOver && !won && (
          <motion.div key="over" initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="glass-card rounded-3xl p-10 max-w-md mx-auto">
            <div className="text-5xl mb-4">😢</div>
            <p className="font-playfair text-xl font-bold italic mb-2" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
              You collected {score} hearts!
            </p>
            <p className="font-poppins text-sm text-gray-500 mb-6" style={{ fontFamily:"Poppins,sans-serif" }}>
              So close! Try again? 🥺
            </p>
            <motion.button whileHover={{ scale:1.05 }} onClick={start} className="font-poppins px-8 py-3 rounded-full text-white font-semibold"
              style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", border:"none", cursor:"pointer" }}>
              Try Again 🔄
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {active && !won && (
        <div>
          {/* HUD */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="glass-card rounded-2xl px-6 py-3 text-center">
              <div className="font-playfair font-bold text-2xl" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>{score}<span className="text-sm ml-1">/ 20</span></div>
              <div className="font-poppins text-xs text-gray-500" style={{ fontFamily:"Poppins,sans-serif" }}>Hearts Caught</div>
            </div>
            <div className="glass-card rounded-2xl px-6 py-3 text-center">
              <div className="font-playfair font-bold text-2xl" style={{ fontFamily:'"Playfair Display",serif', color: timeLeft<=10?"#ef4444":"#D63384" }}>{timeLeft}s</div>
              <div className="font-poppins text-xs text-gray-500" style={{ fontFamily:"Poppins,sans-serif" }}>Time Left</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto h-3 rounded-full overflow-hidden mb-4" style={{ background:"rgba(214,51,132,0.12)" }}>
            <motion.div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#D63384,#D4A24A)" }}
              animate={{ width:`${(score/20)*100}%` }} />
          </div>

          {/* Game arena */}
          <div className="relative mx-auto rounded-3xl overflow-hidden select-none"
            style={{ width:"min(480px,100%)", height:380, background:"linear-gradient(180deg,#fff0f5,#fde8ee)", border:"2px solid rgba(214,51,132,0.15)" }}>
            <AnimatePresence>
              {hearts.map(h => (
                <motion.button key={h.id}
                  className="absolute cursor-pointer select-none"
                  style={{ left:`${h.x}%`, top:0, fontSize:`${h.size}rem`, background:"none", border:"none", zIndex:10, lineHeight:1 }}
                  initial={{ y:-40, opacity:1 }}
                  animate={{ y:420 }}
                  transition={{ duration:h.dur, ease:"linear" }}
                  onAnimationComplete={() => missHeart(h.id)}
                  
                  /* FIX: Changed from onClick to onPointerDown so moving targets are caught instantly */
                  onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); catchHeart(h.id); }}
                  
                  whileHover={{ scale:1.4 }} whileTap={{ scale:0.6 }}>
                  {h.char}
                </motion.button>
              ))}
            </AnimatePresence>
            {hearts.length === 0 && <div className="absolute inset-0 flex items-center justify-center font-poppins text-pink-300 text-lg" style={{ fontFamily:"Poppins,sans-serif" }}>Hearts incoming... 💕</div>}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   GAME 2: NO BUTTON TRAP
───────────────────────────────────────────────────────── */
const NoButtonTrap: React.FC = () => {
  const [noPos, setNoPos] = useState({ x:0, y:0 });
  const [attempts, setAttempts] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noGone, setNoGone] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const evadeNo = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 8) { setNoGone(true); return; }
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 140;
    setNoPos({ x: Math.cos(angle)*dist, y: Math.sin(angle)*dist });
  };

  const pressYes = () => { setYesPressed(true); setConfetti(true); setTimeout(() => setConfetti(false), 5000); };

  const messages = [
    "Just kidding, you can't say no. 😏",
    "Hmm, that button seems to be running away... 🏃",
    "Maybe try the other one? 💕",
    "The NO button is scared of how much he loves you! 😂",
    "Still can't catch it? 👀",
    "It's almost like your heart knows the answer... 💖",
    "One more try? 😅",
    "The NO button has officially given up. 🤭",
  ];

  return (
    <div className="text-center py-6">
      <p className="font-poppins text-4xl mb-2" style={{ fontFamily:"Poppins,sans-serif" }}>💕 Are You Mine Forever?</p>
      <p className="font-poppins text-sm text-pink-400 mb-8" style={{ fontFamily:"Poppins,sans-serif" }}>
        A very important question... choose wisely! 😏
      </p>

      <ConfettiCanvas active={confetti} />

      {!yesPressed ? (
        <div className="relative inline-block" style={{ minHeight:240 }}>
          <h3 className="font-playfair text-3xl font-bold italic text-center mb-10" style={{ fontFamily:'"Playfair Display",serif', color:"#1a0408" }}>
            Will you be mine forever? 💍
          </h3>

          <div className="flex gap-8 justify-center items-center flex-wrap" style={{ minHeight:80 }}>
            {/* YES button */}
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={pressYes}
              className="font-poppins text-white font-bold px-12 py-4 rounded-full text-xl"
              style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", boxShadow:"0 12px 36px rgba(214,51,132,0.4)", border:"none", cursor:"pointer" }}>
              YES ❤️
            </motion.button>

            {/* NO button - teleports */}
            {!noGone ? (
              <motion.button
                animate={{ x:noPos.x, y:noPos.y }} transition={{ type:"spring", stiffness:180, damping:14 }}
                onHoverStart={evadeNo} onMouseEnter={evadeNo}
                className="font-poppins text-gray-500 font-medium px-10 py-4 rounded-full text-xl"
                style={{ fontFamily:"Poppins,sans-serif", background:"white", border:"2px solid #e5e7eb", cursor:"pointer", position:"relative" }}>
                NO 💔
              </motion.button>
            ) : (
              <motion.p initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                className="font-poppins text-pink-400 text-sm italic" style={{ fontFamily:"Poppins,sans-serif" }}>
                (The NO button ran away! 🏃💨)
              </motion.p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {attempts > 0 && !noGone && (
              <motion.p key={attempts} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="font-poppins text-sm text-pink-400 italic mt-6" style={{ fontFamily:"Poppins,sans-serif" }}>
                {messages[Math.min(attempts-1, messages.length-1)]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} transition={{ type:"spring" }}
          className="glass-card rounded-3xl p-12 max-w-md mx-auto">
          <motion.div className="text-6xl mb-4" animate={{ scale:[1,1.3,1] }} transition={{ duration:0.6, repeat:3 }}>💍</motion.div>
          <h3 className="font-playfair text-2xl font-bold italic mb-4" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
            She said YES! 🎊
          </h3>
          <p className="font-poppins text-gray-600 italic" style={{ fontFamily:"Poppins,sans-serif" }}>
            The only answer that was ever possible. You two are forever. 💕
          </p>
          <motion.button whileHover={{ scale:1.05 }} onClick={() => { setYesPressed(false); setNoPos({x:0,y:0}); setAttempts(0); setNoGone(false); }}
            className="mt-6 font-poppins px-8 py-3 rounded-full text-white font-semibold"
            style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", border:"none", cursor:"pointer" }}>
            Play Again 🔄
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   GAME 3: LOVE QUIZ
───────────────────────────────────────────────────────── */
const LoveQuiz: React.FC = () => {
  const [curr, setCurr] = useState(0);
  const [chosen, setChosen] = useState<number|null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[curr];

  const answer = (idx: number) => {
    if (answered) return;
    setChosen(idx); setAnswered(true);
    if (idx === q.correctIdx) setScore(s => s+1);
    if (curr === QUIZ.length-1) setTimeout(() => setDone(true), 1200);
  };
  const next = () => { setCurr(c=>c+1); setChosen(null); setAnswered(false); };
  const restart = () => { setCurr(0); setChosen(null); setAnswered(false); setScore(0); setDone(false); };

  return (
    <div className="max-w-lg mx-auto">
      <p className="font-poppins text-4xl text-center mb-2" style={{ fontFamily:"Poppins,sans-serif" }}>🧠 Love Quiz</p>
      <p className="font-poppins text-sm text-center text-pink-400 mb-6" style={{ fontFamily:"Poppins,sans-serif" }}>
        How well do you know your love story?
      </p>

      {!done ? (
        <motion.div key={curr} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} className="glass-card rounded-3xl p-8">
          {/* Progress */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-poppins text-xs text-gray-400 tracking-wider" style={{ fontFamily:"Poppins,sans-serif" }}>
              Q{curr+1} / {QUIZ.length}
            </span>
            <span className="font-poppins text-xs text-pink-500 font-semibold" style={{ fontFamily:"Poppins,sans-serif" }}>
              Score: {score}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full mb-6" style={{ background:"rgba(214,51,132,0.12)" }}>
            <div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#D63384,#D4A24A)", width:`${((curr+(answered?1:0))/QUIZ.length)*100}%`, transition:"width .5s" }} />
          </div>

          <h3 className="font-playfair font-bold italic text-xl text-center mb-6" style={{ fontFamily:'"Playfair Display",serif', color:"#1a0408" }}>{q.q}</h3>

          <div className="grid grid-cols-1 gap-3 mb-4">
            {q.opts.map((opt, i) => {
              let bg = "rgba(214,51,132,0.04)", border = "2px solid rgba(214,51,132,0.15)", col="#1a0408";
              if (answered) {
                if (i===q.correctIdx) { bg="#d4edda"; border="2px solid #28a745"; col="#155724"; }
                else if (i===chosen && i!==q.correctIdx) { bg="#f8d7da"; border="2px solid #dc3545"; col="#721c24"; }
              }
              return (
                <motion.button key={i} disabled={answered} onClick={() => answer(i)}
                  whileHover={!answered?{ scale:1.02, x:4 }:{}}
                  className="font-poppins text-left p-4 rounded-2xl text-sm font-medium transition-all"
                  style={{ fontFamily:"Poppins,sans-serif", background:bg, border, color:col, cursor:answered?"not-allowed":"pointer" }}>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {answered && curr < QUIZ.length-1 && (
            <div className="text-center">
              <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} whileHover={{ scale:1.05 }}
                onClick={next} className="font-poppins text-white font-semibold px-8 py-3 rounded-full"
                style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", border:"none", cursor:"pointer" }}>
                Next →
              </motion.button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ type:"spring" }}
          className="glass-card rounded-3xl p-10 text-center">
          <ConfettiCanvas active />
          <div className="text-6xl mb-4">💍</div>
          <h3 className="font-playfair text-2xl font-bold italic mb-3" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
            {score}/{QUIZ.length} — {score>=4?"Perfect!":score>=3?"Almost!":"Try Again!"}
          </h3>
          <p className="font-poppins italic text-gray-600 text-base leading-relaxed mb-6" style={{ fontFamily:"Poppins,sans-serif" }}>
            "You know us perfectly. Marry me someday? 😏"
          </p>
          <motion.button whileHover={{ scale:1.05 }} onClick={restart}
            className="font-poppins text-white font-semibold px-8 py-3 rounded-full"
            style={{ fontFamily:"Poppins,sans-serif", background:"linear-gradient(135deg,#D63384,#9b1f3a)", border:"none", cursor:"pointer" }}>
            Play Again 🔄
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   GAMES SECTION
───────────────────────────────────────────────────────── */
const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId>("catch");

  const tabs: { id: GameId; label: string; emoji: string; desc: string }[] = [
    { id:"catch", label:"Catch My Heart", emoji:"💕", desc:"Collect 20 hearts!" },
    { id:"trap",  label:"Are You Mine?",  emoji:"💍", desc:"The YES or NO game 😏" },
    { id:"quiz",  label:"Love Quiz",      emoji:"🧠", desc:"Test your knowledge!" },
  ];

  return (
    <section id="games" className="relative py-24 px-6" style={{ background:"linear-gradient(180deg,#FFF8F0,#FADADD20)" }}>
      <div className="max-w-3xl mx-auto">
        <SecHead tag="🎮 Fun & Games" title="Let's Play," accent="Bisman Kaur!" />

        {/* Game Tabs */}
        <div className="flex gap-3 justify-center flex-wrap mb-10">
          {tabs.map(t => (
            <motion.button key={t.id} whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
              onClick={() => setActiveGame(t.id)}
              className="font-poppins px-5 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={{
                fontFamily:"Poppins,sans-serif",
                background: activeGame===t.id ? "linear-gradient(135deg,#D63384,#9b1f3a)" : "white",
                color: activeGame===t.id ? "white" : "#4a1825",
                border: activeGame===t.id ? "none" : "2px solid rgba(214,51,132,0.2)",
                boxShadow: activeGame===t.id ? "0 8px 28px rgba(214,51,132,0.35)" : "0 2px 10px rgba(0,0,0,0.06)",
                cursor:"pointer",
              }}>
              {t.emoji} {t.label}
              {activeGame===t.id && <span className="block text-xs font-normal opacity-80 mt-0.5">{t.desc}</span>}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeGame} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}>
            {activeGame==="catch" && <CatchHeartsGame />}
            {activeGame==="trap"  && <NoButtonTrap />}
            {activeGame==="quiz"  && <LoveQuiz />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   PHOTO GALLERY (Polaroid Style + Modal)
───────────────────────────────────────────────────────── */
const PhotoGallery: React.FC = () => {
  const [modalPhoto, setModalPhoto] = useState<Photo|null>(null);

  return (
    <section id="gallery" className="py-24 px-6" style={{ background:"#FFF8F0" }}>
      <div className="max-w-5xl mx-auto">
        <SecHead tag="📸 Our Memories" title="Photo Gallery &" accent="Funny Moments" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PHOTOS.map((p, i) => (
            <motion.div key={p.id} className="group cursor-pointer"
              initial={{ opacity:0, y:40, rotate: i%2===0?-2:2 }}
              whileInView={{ opacity:1, y:0, rotate: i%2===0?-2:2 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              whileHover={{ scale:1.04, rotate:0, y:-8 }}
              onClick={() => setModalPhoto(p)}>
              <div className="polaroid rounded-sm relative overflow-hidden"
                style={{ boxShadow:"0 8px 30px rgba(0,0,0,0.14)" }}>
                {/* Photo placeholder */}
                <div className="relative overflow-hidden" style={{ height:220, background:p.bg }}>
                  {p.image ? (
                    <img src={p.image} alt={p.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <span style={{ fontSize:"3.5rem" }}>{p.emoji}</span>
                      <span className="font-poppins text-xs text-white/70 tracking-widest uppercase" style={{ fontFamily:"Poppins,sans-serif" }}>{p.label}</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <motion.div className="absolute inset-0 flex items-center justify-center p-4 text-center"
                    style={{ background:"rgba(214,51,132,0.88)" }}
                    initial={{ opacity:0 }} whileHover={{ opacity:1 }} transition={{ duration:0.3 }}>
                    <p className="font-playfair italic text-white font-semibold text-sm leading-relaxed"
                      style={{ fontFamily:'"Playfair Display",serif' }}>
                      "{p.hoverQuote}"
                    </p>
                  </motion.div>
                </div>
                <div className="pt-3 px-1 pb-1">
                  <p className="font-poppins text-xs text-gray-400 tracking-wider uppercase text-center" style={{ fontFamily:"Poppins,sans-serif" }}>{p.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="font-poppins text-center text-sm text-pink-400 mt-8 italic" style={{ fontFamily:"Poppins,sans-serif" }}>
          Click any photo to see the full memory 💕
        </motion.p>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {modalPhoto && (
          <motion.div className="fixed inset-0 z-[400] flex items-center justify-center p-6"
            style={{ background:"rgba(26,4,8,0.85)", backdropFilter:"blur(12px)" }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setModalPhoto(null)}>
            <motion.div className="relative max-w-md w-full rounded-3xl overflow-hidden"
              style={{ background:"white", boxShadow:"0 40px 100px rgba(0,0,0,0.3)" }}
              initial={{ scale:0.7, opacity:0, rotate:-5 }} animate={{ scale:1, opacity:1, rotate:0 }}
              exit={{ scale:0.7, opacity:0 }} transition={{ type:"spring", damping:16 }}
              onClick={e => e.stopPropagation()}>
              {/* Modal photo */}
              <div className="relative" style={{ height:260, background:modalPhoto.bg }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontSize:"5rem" }}>{modalPhoto.emoji}</span>
                </div>
                <button onClick={() => setModalPhoto(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background:"rgba(0,0,0,0.4)", border:"none", cursor:"pointer" }}>✕</button>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-poppins text-xs tracking-widest uppercase text-pink-400" style={{ fontFamily:"Poppins,sans-serif" }}>{modalPhoto.date}</span>
                  <span className="text-2xl">💕</span>
                </div>
                <h3 className="font-playfair font-bold text-xl italic mb-3" style={{ fontFamily:'"Playfair Display",serif', color:"#1a0408" }}>
                  {modalPhoto.caption}
                </h3>
                <p className="font-poppins text-sm text-gray-500 leading-relaxed italic mb-4" style={{ fontFamily:"Poppins,sans-serif" }}>
                  {modalPhoto.loveNote}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Memory","Love","2026","Ours 💕"].map(tag => (
                    <span key={tag} className="font-poppins text-xs px-3 py-1 rounded-full"
                      style={{ fontFamily:"Poppins,sans-serif", background:"rgba(214,51,132,0.1)", color:"#D63384" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SURPRISE SECTION
───────────────────────────────────────────────────────── */
const SurpriseSection: React.FC<{ onMidnight: () => void; midnightMode: boolean }> = ({ onMidnight, midnightMode }) => {
  const [current, setCurrent] = useState<null | {
    id: string; emoji: string; title: string; content: React.ReactNode
  }>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [confetti, setConfetti] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [musicState, setMusicState] = useState<null | { iv: ReturnType<typeof setInterval>; ctx: AudioContext }>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Countdown to next anniversary (Feb 14 2027)
  const getCountdown = () => {
    const target = new Date("2027-02-14T00:00:00");
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    const m = Math.floor((diff%(1000*60*60))/(1000*60));
    return { d, h, m };
  };

  const getWeddingPrediction = () => {
    const adj = WEDDING_ADJECTIVES[Math.floor(Math.random()*WEDDING_ADJECTIVES.length)];
    const mon = WEDDING_MONTHS[Math.floor(Math.random()*WEDDING_MONTHS.length)];
    const yr  = 2027 + Math.floor(Math.random()*3);
    const day = 14 + Math.floor(Math.random()*5);
    const venue = WEDDING_VENUES[Math.floor(Math.random()*WEDDING_VENUES.length)];
    return { adj, date:`${mon} ${day}, ${yr}`, venue };
  };

  const SURPRISE_POOL = [
    {
      id:"letter", emoji:"💌", title:"Secret Love Letter",
      make: () => (
        <div className="text-left space-y-4">
          <p className="font-playfair italic text-lg" style={{ fontFamily:'"Playfair Display",serif', color:"#1a0408" }}>My dearest Bisman,</p>
          <p className="font-poppins text-gray-600 leading-relaxed text-sm" style={{ fontFamily:"Poppins,sans-serif" }}>
            There are a thousand things I want to say to you, but none of them feel big enough. So I'll just say this: you changed everything. The way I see the world, the way I feel about things specially women, the way I smile at my phone at 2am — all because of you.
          </p>
          <p className="font-poppins text-gray-600 leading-relaxed text-sm" style={{ fontFamily:"Poppins,sans-serif" }}>
            You are best in the world 🌎. Happy Anniversary. ❤️
          </p>
          <p className="font-playfair italic text-deep-rose text-right" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>— Always yours, Ajay 🌹</p>
        </div>
      ),
    },
    {
      id:"confetti", emoji:"🎆", title:"Confetti Celebration!",
      make: () => {
        setConfetti(true); setTimeout(() => setConfetti(false), 5000);
        return <p className="font-poppins text-center text-lg text-gray-600" style={{ fontFamily:"Poppins,sans-serif" }}>🎉 Confetti just for you, Bisman! 🎊</p>;
      },
    },
    {
      id:"music", emoji:"🎵", title:"Our Special Song",
      make: () => (
        <div className="text-center space-y-4">
          <div className="text-5xl">🎵</div>
          <p className="font-playfair italic text-xl" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
            "Ye Tune Kya Kiya" — Javed Bashir
          </p>
          <p className="font-poppins text-sm text-gray-500" style={{ fontFamily:"Poppins,sans-serif" }}>
            Because Tere hone se Zindagi Razi lagti hain. 🎶
          </p>
          <p className="font-poppins text-xs italic text-pink-400" style={{ fontFamily:"Poppins,sans-serif" }}>
            (Background music is playing via the 🎶 button!)
          </p>
        </div>
      ),
    },
    {
      id:"wedding", emoji:"💍", title:"Wedding Date Prediction",
      make: () => {
        const pred = getWeddingPrediction();
        return (
          <div className="text-center space-y-4">
            <p className="font-poppins text-xs tracking-widest uppercase text-pink-400" style={{ fontFamily:"Poppins,sans-serif" }}>
              Based on cosmic alignment & your love energy...
            </p>
            <div className="p-6 rounded-2xl" style={{ background:"linear-gradient(135deg,#FADADD,#E6E6FA)" }}>
              <p className="font-playfair font-black text-2xl italic mb-2" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
                A {pred.adj} Ceremony
              </p>
              <p className="font-playfair font-bold text-3xl" style={{ fontFamily:'"Playfair Display",serif', color:"#1a0408" }}>{pred.date}</p>
              <p className="font-poppins text-sm text-gray-500 mt-2" style={{ fontFamily:"Poppins,sans-serif" }}>{pred.venue} 🌹</p>
            </div>
            <p className="font-poppins text-xs italic text-gray-400" style={{ fontFamily:"Poppins,sans-serif" }}>
              *Predictions guaranteed to be adorable but not legally binding 😏
            </p>
          </div>
        );
      },
    },
    {
      id:"countdown", emoji:"💕", title:"Countdown to Next Anniversary",
      make: () => {
        const { d, h, m } = getCountdown();
        return (
          <div className="text-center space-y-4">
            <p className="font-poppins text-sm text-gray-500" style={{ fontFamily:"Poppins,sans-serif" }}>Until your 2nd Anniversary (Feb 14, 2027) 🌹</p>
            <div className="flex justify-center gap-4">
              {[[d,"Days"],[h,"Hours"],[m,"Mins"]].map(([val,lbl]) => (
                <div key={String(lbl)} className="text-center">
                  <div className="font-playfair font-black text-4xl" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>{val}</div>
                  <div className="font-poppins text-xs text-gray-400 tracking-widest uppercase mt-1" style={{ fontFamily:"Poppins,sans-serif" }}>{lbl}</div>
                </div>
              ))}
            </div>
            <p className="font-poppins italic text-sm text-pink-400" style={{ fontFamily:"Poppins,sans-serif" }}>
              Every second is another second loving you. 💕
            </p>
          </div>
        );
      },
    },
    {
      id:"midnight", emoji:"🌙", title:"Midnight Mode Activated!",
      make: () => {
        onMidnight();
        return (
          <div className="text-center space-y-3">
            <div className="text-5xl">🌙✨</div>
            <p className="font-playfair italic text-xl" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>Midnight Mode!</p>
            <p className="font-poppins text-sm text-gray-500" style={{ fontFamily:"Poppins,sans-serif" }}>
              The website transformed into a midnight romance! 🌌
            </p>
          </div>
        );
      },
    },
    {
      id:"message", emoji:"💬", title:"A Romantic Message",
      make: () => {
        const msg = ROMANTIC_MSGS[msgIdx % ROMANTIC_MSGS.length];
        setMsgIdx(i => i+1);
        return (
          <div className="text-center space-y-4">
            <div className="text-4xl">💬</div>
            <blockquote className="font-playfair italic text-lg text-gray-700 leading-relaxed" style={{ fontFamily:'"Playfair Display",serif' }}>
              "{msg}"
            </blockquote>
            <p className="font-poppins text-xs text-pink-400" style={{ fontFamily:"Poppins,sans-serif" }}>— From Ajay, with all his heart 💕</p>
          </div>
        );
      },
    },
    {
      id:"video", emoji:"📹", title:"Video Message for You",
      make: () => (
        <div className="text-center space-y-4">
          <div className="rounded-2xl overflow-hidden relative flex items-center justify-center bg-black" style={{ height:240 }}>
            {/* FIX: Added playsInline, webkit-playsinline, and fixed the styling to ensure the video renders */}
            <video 
              src="/video.mp4" 
              controls 
              playsInline 
              webkit-playsinline="true"
              className="w-full h-full"
              style={{ objectFit: "contain" }}
            />
          </div>
          <p className="font-poppins text-sm text-gray-500 italic" style={{ fontFamily:"Poppins,sans-serif" }}>
            A special message just for you 💕
          </p>
        </div>
      ),
    },
    {
      id:"memory", emoji:"🧩", title:"Unlock A Memory",
      make: () => {
        const tiles = ["One year","of laughter","of adventures","of midnight","conversations","of growing","together with","you. Our story","is just beginning 💕"];
        return <MemoryPuzzle tiles={tiles} />;
      },
    },
  ];

  const trigger = () => {
    const pool = SURPRISE_POOL.filter(s => !used.has(s.id));
    const src = pool.length > 0 ? pool : SURPRISE_POOL;
    const pick = src[Math.floor(Math.random() * src.length)];
    setUsed(u => new Set([...u, pick.id]));
    setAnimKey(k => k+1);
    setCurrent({ id:pick.id, emoji:pick.emoji, title:pick.title, content:pick.make() });
  };

  return (
    <section id="surprise" className="py-24 px-6" style={{ background:"linear-gradient(180deg,#E6E6FA20,#FADADD30,#FFF8F0)" }}>
      {confetti && <ConfettiCanvas active />}
      <div className="max-w-lg mx-auto text-center">
        <SecHead tag="🎁 Just For You" title="Press For A" accent="Surprise, Bisman!" />
        <p className="font-poppins italic text-sm text-gray-500 mb-3" style={{ fontFamily:"Poppins,sans-serif" }}>
          Each click reveals something different. Keep pressing! 😉
        </p>
        {/* Discovery dots */}
        <div className="flex justify-center gap-2.5 flex-wrap mb-8">
          {SURPRISE_POOL.map(s => (
            <motion.div key={s.id} animate={{ scale: used.has(s.id)?1.2:1 }}
              className="w-3 h-3 rounded-full"
              style={{ background: used.has(s.id)?"linear-gradient(135deg,#D63384,#D4A24A)":"rgba(214,51,132,0.15)", transition:"all .4s" }} />
          ))}
        </div>
        <p className="font-poppins text-xs text-pink-400 mb-8" style={{ fontFamily:"Poppins,sans-serif" }}>
          {used.size}/{SURPRISE_POOL.length} surprises discovered
        </p>

        <motion.button whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.95 }} onClick={trigger}
          className="font-playfair italic font-bold text-white text-xl px-16 py-5 rounded-full mb-10"
          style={{ fontFamily:'"Playfair Display",serif', background:"linear-gradient(135deg,#D63384,#9b1f3a)", boxShadow:"0 16px 48px rgba(214,51,132,0.45)", border:"none", cursor:"pointer" }}>
          ✨ Surprise Me!
        </motion.button>

        <AnimatePresence>
          {current && (
            <motion.div key={animKey} initial={{ opacity:0, scale:0.6, rotate:-8 }} animate={{ opacity:1, scale:1, rotate:0 }}
              exit={{ opacity:0, scale:0.8 }} transition={{ type:"spring", damping:14 }}
              className="glass-card rounded-3xl p-8" style={{ boxShadow:"0 24px 80px rgba(214,51,132,0.14)" }}>
              <div className="text-5xl mb-4">{current.emoji}</div>
              <h3 className="font-playfair font-bold italic text-xl mb-5" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>{current.title}</h3>
              {current.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   MEMORY PUZZLE (Surprise #9)
───────────────────────────────────────────────────────── */
const MemoryPuzzle: React.FC<{ tiles: string[] }> = ({ tiles }) => {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const allDone = revealed.size === tiles.length;

  return (
    <div>
      <p className="font-poppins text-sm text-gray-500 mb-4" style={{ fontFamily:"Poppins,sans-serif" }}>
        Tap each tile to reveal a piece of our story 🧩
      </p>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((tile, i) => (
          <motion.button key={i} onClick={() => setRevealed(r => new Set([...r,i]))}
            className="h-16 rounded-xl font-poppins text-xs font-semibold"
            style={{ fontFamily:"Poppins,sans-serif", cursor:revealed.has(i)?"default":"pointer", border:"none" }}
            animate={{ background: revealed.has(i)?"linear-gradient(135deg,#FADADD,#FFB6C1)":"linear-gradient(135deg,#D63384,#9b1f3a)", color:revealed.has(i)?"#D63384":"rgba(255,255,255,0.3)" }}
            whileHover={!revealed.has(i)?{ scale:1.05 }:{}}>
            {revealed.has(i) ? tile : "💕"}
          </motion.button>
        ))}
      </div>
      {allDone && (
        <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          className="font-playfair italic text-deep-rose mt-4 font-semibold" style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
          Memory unlocked! 🔓💕
        </motion.p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LOVE LETTER SECTION
───────────────────────────────────────────────────────── */
const LoveLetterSection: React.FC<{ midnightMode: boolean }> = ({ midnightMode }) => {
  const bg = midnightMode
    ? "linear-gradient(140deg,#1a0408,#2d0a14)"
    : "linear-gradient(180deg,#FFF8F0,#fff5f7)";

  return (
    <section id="letter" className="py-24 px-6 relative overflow-hidden" style={{ background:bg }}>
      <div className="max-w-2xl mx-auto relative z-10">
        <SecHead tag="❤ From the Heart" title="A Letter For You," accent="Bisman" light={midnightMode} />

        <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="glass-card rounded-3xl relative overflow-hidden"
          style={{ boxShadow:"0 32px 80px rgba(214,51,132,0.12)", padding:"clamp(32px,5vw,64px)" }}>
          {/* Decorative giant quote */}
          <div className="absolute top-0 left-4 font-playfair text-9xl pointer-events-none select-none"
            style={{ fontFamily:'"Playfair Display",serif', color:"rgba(214,51,132,0.08)", lineHeight:1 }}>"</div>

          <div className="relative space-y-6">
            {[
              "My dearest Bisman,",
              "A year ago, I had absolutely no idea that someone would come along and completely ruin my peace — in the most wonderful way possible.",
              "You are the reason I smile at my phone like a complete fool. You are the reason I actually look forward to every single day. You are the chaos and the calm all at once — somehow you are both my favourite distraction and my biggest motivation.",
              "Today, on our 1st anniversary and Valentine's Day, I want you to know: you are everything. Completely, absolutely, ridiculously everything to me. 💕",
              "Thank you for choosing me, every single day.",
            ].map((para, i) => (
              <motion.p key={i} initial={{ opacity:0, x:i%2===0?-20:20 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.12 }}
                className="font-poppins leading-relaxed italic"
                style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(1rem,2vw,1.15rem)", color:"#4a1825", lineHeight:2 }}>
                {para}
              </motion.p>
            ))}
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.7 }}
              className="font-playfair italic text-xl text-right font-bold"
              style={{ fontFamily:'"Playfair Display",serif', color:"#D63384" }}>
              Forever yours, with all my love 🌹
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   FINAL ANNIVERSARY SECTION
───────────────────────────────────────────────────────── */
const FinalSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const stars = Array.from({length:120}, () => ({
      x: Math.random(), y: Math.random(),
      r: .4+Math.random()*1.8, speed:.002+Math.random()*.008, phase:Math.random()*Math.PI*2
    }));
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = (t: number) => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s => {
        const a = (Math.sin(t*s.speed+s.phase)+1)/2;
        ctx.beginPath(); ctx.arc(s.x*canvas.width,s.y*canvas.height,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${.07+a*.93})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);

  const REASONS = [
    { n:"01", t:"Koi Itna Pyara Kaise ho sakta hai - 2X, Wo bhi Sare ka sara kaise ho sakta hai, Tujhse milkar v agar udasi kam nahi hoti, tere bagair guzara kaise ho sakta hai." },
    { n:"02", t:"The way your eyes light up when you talk about something you love. It's the most beautiful thing I've seen." },
    { n:"03", t:"You make me want to be better — not because you ask, but because you deserve nothing less than my best. - pakka body bana lunga 😅" },
    { n:"04", t:"You're annoyingly right about most things. Extremely frustrating and I love you endlessly for it. 😅" },
    { n:"05", t:"You remember the tiniest details I mention once. That kind of love is rare, Bisman." },
    { n:"06", t:"Because even on the hardest days, one message from you turns everything around. You're my safe place." },
    { n:"07", t:"Your laugh is so infectious that I end up laughing even when I have no idea why — and I honestly don't care." },
    { n:"08", t:"Loving you feels like coming home. Peaceful, warm, and exactly where I'm supposed to be. Forever." },
  ];

  return (
    <section id="final" className="relative py-28 px-6 overflow-hidden text-center"
      style={{ background:"linear-gradient(140deg,#1a0408,#2d0a14,#1a0408)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {confetti && <ConfettiCanvas active />}

      <div className="relative z-10 max-w-4xl mx-auto">
        <SecHead tag="🌟 Our 1st Year" title="" accent="Happy 1st Anniversary, Bisman!" light />

        {/* Big 01 */}
        <motion.div className="font-playfair font-black italic select-none mb-10"
          style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(6rem,18vw,14rem)", color:"transparent", WebkitTextStroke:"2px #D4A24A", lineHeight:.9 }}
          animate={{ textShadow:["0 0 20px rgba(212,162,74,.4)","0 0 80px rgba(212,162,74,.9)","0 0 20px rgba(212,162,74,.4)"] }}
          transition={{ duration:3, repeat:Infinity }}>
          01
        </motion.div>

        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="font-poppins italic text-pink-300 text-xl mb-4" style={{ fontFamily:"Poppins,sans-serif" }}>
          365 days of you. And still not enough.
        </motion.p>
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.2 }}
          className="font-poppins text-white/55 max-w-lg mx-auto mb-16 leading-relaxed" style={{ fontFamily:"Poppins,sans-serif" }}>
          365 days of laughs, fights we forgot by lunch, late-night calls, random memes, and a love that keeps growing stronger every moment.
        </motion.p>

        {/* 8 Reasons */}
        <motion.h3 initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="font-playfair font-bold text-2xl italic text-pink-300 mb-10" style={{ fontFamily:'"Playfair Display",serif' }}>
          8 Reasons I Love Bisman Kaur
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {REASONS.map((r, i) => (
            <motion.div key={r.n} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.08 }}
              whileHover={{ y:-6, scale:1.02 }}
              className="rounded-2xl p-5 text-left relative overflow-hidden group"
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(247,168,184,0.15)" }}>
              <motion.div className="absolute inset-x-0 top-0 h-0.5 origin-left"
                style={{ background:"linear-gradient(90deg,#D63384,#D4A24A)" }}
                initial={{ scaleX:0 }} whileHover={{ scaleX:1 }} transition={{ duration:.4 }} />
              <div className="font-playfair font-black text-3xl mb-3 select-none"
                style={{ fontFamily:'"Playfair Display",serif', color:"rgba(247,168,184,0.25)" }}>{r.n}</div>
              <p className="font-poppins text-white/60 text-xs leading-relaxed italic" style={{ fontFamily:"Poppins,sans-serif" }}>{r.t}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 flex-wrap mb-14">
          {[["365","Days Together"],["∞","Moments of Love"],["1st","of Many Years"],["💕","Always Yours"]].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="font-playfair font-black text-3xl" style={{ fontFamily:'"Playfair Display",serif', color:"#D4A24A" }}>{n}</div>
              <div className="font-poppins text-xs tracking-widest uppercase mt-1" style={{ fontFamily:"Poppins,sans-serif", color:"rgba(255,255,255,.3)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Big final message */}
        <motion.div initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          className="rounded-3xl p-10 mb-10" style={{ background:"rgba(214,51,132,0.12)", border:"1px solid rgba(214,51,132,0.25)" }}>
          <motion.div className="text-5xl mb-4" animate={{ scale:[1,1.2,1] }} transition={{ duration:2.5, repeat:Infinity }}>💕</motion.div>
          <h2 className="font-playfair font-black italic text-white mb-4"
            style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(1.8rem,4vw,2.8rem)" }}>
            Happy Valentine's Day, Bisman Kaur
          </h2>
          <p className="font-poppins text-white/70 italic text-lg leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily:"Poppins,sans-serif" }}>
            "Give me a lifetime with you — and I'd still ask for more. You are my favourite chapter. Always." 🌹
          </p>
        </motion.div>

        <motion.button whileHover={{ scale:1.06, y:-3 }} whileTap={{ scale:0.95 }} onClick={() => setConfetti(true)}
          className="font-playfair italic font-bold text-white text-xl px-14 py-5 rounded-full"
          style={{ fontFamily:'"Playfair Display",serif', background:"linear-gradient(135deg,#D63384,#9b1f3a)", boxShadow:"0 16px 48px rgba(214,51,132,0.5)", border:"none", cursor:"pointer" }}>
          🎉 Celebrate Us!
        </motion.button>

        {/* Easter egg hint */}
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:1 }}
          className="font-poppins text-xs mt-10 italic" style={{ fontFamily:"Poppins,sans-serif", color:"rgba(255,255,255,0.2)" }}>
          🔮 psst... try typing something special on your keyboard
        </motion.p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   MUSIC BUTTON
───────────────────────────────────────────────────────── */
const MusicBtn: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize the audio element pointing to your file in the public folder
    audioRef.current = new Audio("/music.mp3"); 
    audioRef.current.loop = true; // Makes the song repeat when it ends
    audioRef.current.volume = 0.6; // Adjust volume here (0.0 to 1.0)

    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      // .play() returns a promise, handling it prevents browser console errors
      audioRef.current?.play().catch(err => console.error("Playback failed:", err));
      setPlaying(true);
    }
  };

  return (
    <motion.button onClick={toggle} whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
      className="fixed bottom-7 right-7 z-[300] w-14 h-14 rounded-full flex items-center justify-center text-2xl"
      style={{ background:"linear-gradient(135deg,#D63384,#9b1f3a)", boxShadow:"0 8px 32px rgba(214,51,132,0.45)", border:"none", cursor:"pointer" }}
      title={playing?"Pause music":"Play soothing music"}>
      {playing && (
        <motion.span className="absolute w-full h-full rounded-full"
          style={{ border:"2px solid rgba(214,51,132,0.5)" }}
          animate={{ scale:[1,2.5], opacity:[1,0] }} transition={{ duration:2, repeat:Infinity }} />
      )}
      <span style={{ zIndex:1 }}>{playing?"🎵":"🎶"}</span>
    </motion.button>
  );
};

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="py-16 px-6 text-center" style={{ background:"#1a0408" }}>
    <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:2.5, repeat:Infinity }} className="text-4xl mb-4">💕</motion.div>
    <h3 className="font-playfair italic font-bold text-pink-300 mb-4"
      style={{ fontFamily:'"Playfair Display",serif', fontSize:"clamp(1.5rem,3vw,2.2rem)" }}>
      Happy Valentine's Day, Bisman 💕
    </h3>
    <p className="font-poppins italic text-white/50 max-w-md mx-auto mb-8 leading-relaxed" style={{ fontFamily:"Poppins,sans-serif" }}>
      With every heartbeat, every laugh, every quiet moment — you are my favourite person in the entire universe.
    </p>
    <div className="flex justify-center gap-6 flex-wrap mb-8">
      {NAV.map(n => (
        <button key={n.id} onClick={() => document.getElementById(n.id)?.scrollIntoView({behavior:"smooth"})}
          className="font-poppins text-xs tracking-widest uppercase"
          style={{ fontFamily:"Poppins,sans-serif", color:"rgba(255,255,255,0.25)", background:"none", border:"none", cursor:"pointer", transition:"color .3s" }}
          onMouseEnter={e=>(e.currentTarget.style.color="#f7a8b8")}
          onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.25)")}>
          {n.label}
        </button>
      ))}
    </div>
    <div className="h-px max-w-xs mx-auto mb-6" style={{ background:"rgba(255,255,255,0.07)" }} />
    <p className="font-poppins text-xs" style={{ fontFamily:"Poppins,sans-serif", color:"rgba(255,255,255,0.18)" }}>
      Made with ♾️ love 💖· Feb 14, 2026 · 1st Anniversary 🌹
    </p>
    <p className="font-poppins text-xs mt-1" style={{ fontFamily:"Poppins,sans-serif", color:"rgba(255,255,255,0.1)" }}>
      🔮 type "i love you ajay" on your keyboard
    </p>
  </footer>
);

/* ─────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [midnight, setMidnight] = useState(false);

  const handleDoneLoading = useCallback(() => setLoading(false), []);
  const toggleMidnight = useCallback(() => setMidnight(m => !m), []);

  const bg = midnight
    ? "linear-gradient(to bottom,#1a0408,#0d0209)"
    : "linear-gradient(to bottom,#FFF8F0,#FADADD10)";

  return (
    <div style={{ background:bg, minHeight:"100vh" }}>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={handleDoneLoading} />}
      </AnimatePresence>

      {!loading && (
        <>
          <FloatingHeartsBg />
          <EasterEgg />
          <Navbar midnightMode={midnight} />
          <main>
            <Hero midnightMode={midnight} />
            <GamesSection />
            <PhotoGallery />
            <SurpriseSection onMidnight={toggleMidnight} midnightMode={midnight} />
            <LoveLetterSection midnightMode={midnight} />
            <FinalSection />
          </main>
          <Footer />
          <MusicBtn />
        </>
      )}
    </div>
  );
}
