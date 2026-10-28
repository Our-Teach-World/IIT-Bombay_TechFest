import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Cloud,
  Fingerprint,
  Globe2,
  LockKeyhole,
  Menu,
  Radio,
  Radar,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

type ScanState = "ready" | "scanning" | "complete";

const capabilities = [
  {
    icon: Fingerprint,
    index: "01",
    title: "Identity, under watch",
    description:
      "Spot compromised credentials and unusual access before they become your next incident.",
    tag: "IDENTITY",
  },
  {
    icon: Cloud,
    index: "02",
    title: "Cloud, in context",
    description:
      "Connect activity across your cloud estate and surface the paths attackers could exploit.",
    tag: "CLOUD",
  },
  {
    icon: Radio,
    index: "03",
    title: "Endpoints, connected",
    description:
      "Bring device behavior into the same clear picture, without adding more noise to your day.",
    tag: "ENDPOINT",
  },
];

const principles = [
  "One view across your attack surface",
  "Clear, ranked signals instead of alert fatigue",
  "Actions your team can take right now",
];

function BrandMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 40 40" fill="none">
      <path d="M20 2.75 36.5 12v16L20 37.25 3.5 28V12L20 2.75Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="m12 26 7.2-14h4.7l-7.2 14H12Z" fill="currentColor" />
      <path d="M20.3 26 27 14h4.1l-6.8 12h-4Z" fill="currentColor" opacity=".56" />
      <circle cx="20" cy="20" r="2.3" fill="#101714" />
    </svg>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("ready");
  const [email, setEmail] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    if (scanState !== "scanning") return;
    const timer = window.setTimeout(() => setScanState("complete"), 1550);
    return () => window.clearTimeout(timer);
  }, [scanState]);

  const closeMenu = () => setMenuOpen(false);

  const handleRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setRequestSubmitted(true);
  };

  const scanLabel =
    scanState === "scanning"
      ? "Reading the signal…"
      : scanState === "complete"
        ? "Demo scan complete"
        : "Run a sample signal check";

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VEIL Security home" onClick={closeMenu}>
          <BrandMark />
          <span className="brand-wordmark">
            <strong>VEIL</strong>
            <span>SECURITY SYSTEMS</span>
          </span>
        </a>

        <button
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav id="primary-navigation" className={`nav-links${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
          <a href="#platform" onClick={closeMenu}>Platform</a>
          <a href="#approach" onClick={closeMenu}>Our approach</a>
          <a href="#proof" onClick={closeMenu}>Why VEIL</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>
            Talk to an operator <ArrowUpRight size={15} strokeWidth={1.8} />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.div
              className="eyebrow hero-eyebrow"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <span className="eyebrow-pulse" />
              DIGITAL DEFENSE, REWIRED
            </motion.div>
            <motion.h1
              id="hero-title"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              See the signal.<br />
              <span>Stop the breach.</span>
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Your world is always moving. VEIL connects identity, cloud and endpoint signals so your team can move first—with clarity, not noise.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
            >
              <a className="button button-primary" href="#contact">
                Request a threat briefing <ArrowUpRight size={17} />
              </a>
              <a className="button button-quiet" href="#platform">
                Explore the platform <ArrowDown size={15} />
              </a>
            </motion.div>
            <motion.div
              className="hero-footnote"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <span className="footnote-check"><Check size={11} /></span>
              Less noise. Earlier context. A clearer next move.
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.965, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="visual-coordinate coordinate-top">VEIL / NODE 001</div>
            <div className="visual-coordinate coordinate-bottom">LAT 37°46' / SECURE</div>
            <div className="visual-orbit orbit-outer" aria-hidden="true" />
            <div className="visual-orbit orbit-inner" aria-hidden="true" />
            <div className="visual-grid" aria-hidden="true" />
            <div className="visual-ring ring-one" aria-hidden="true" />
            <div className="visual-ring ring-two" aria-hidden="true" />
            <div className="visual-core-glow" aria-hidden="true" />
            <img
              className="sentinel-art"
              src="/manus-storage/async-images/Xbk8NVVLS9wyP2Sx1T8jt0/image-1.webp"
              alt="Luminous cyan cyber-defense core surrounded by fine signal arcs"
            />
            <div className="visual-heading">
              <span className="mini-label">NETWORK VISIBILITY</span>
              <span className="visual-heading-status"><i /> NOMINAL</span>
            </div>
            <div className="orbit-label label-left"><span className="orbit-dot" />IDENTITY</div>
            <div className="orbit-label label-right"><span className="orbit-dot" />CLOUD</div>
            <div className="orbit-label label-low"><span className="orbit-dot" />ENDPOINT</div>
            <div className="hero-data-chip chip-one">
              <div className="chip-icon"><ShieldCheck size={17} /></div>
              <div><span>THREAT POSTURE</span><strong>Resilient</strong></div>
              <span className="chip-spark">↗</span>
            </div>
            <div className="hero-data-chip chip-two">
              <span className="live-dot" />
              <div><span>LAST SIGNAL</span><strong>0.04s ago</strong></div>
            </div>
            <div className="visual-corner corner-tl" />
            <div className="visual-corner corner-br" />
          </motion.div>
        </section>

        <section className="signal-strip section-wrap" aria-label="VEIL protection summary">
          <div className="strip-label"><span className="tiny-grid-icon"><Globe2 size={15} /></span> ONE VIEW. EVERY ATTACK SURFACE.</div>
          <div className="strip-divider" />
          <div className="strip-items">
            <span>IDENTITY</span><i /><span>CLOUD</span><i /><span>ENDPOINT</span><i /><span>THREAT INTEL</span>
          </div>
          <div className="strip-index">[ 01 — 04 ]</div>
        </section>

        <section className="platform-section section-wrap" id="platform" aria-labelledby="platform-title">
          <Reveal className="section-intro">
            <span className="section-kicker"><span>01</span> / THE VEIL PLATFORM</span>
            <h2 id="platform-title">Your defenses, <em>in sync.</em></h2>
            <p>Attackers don’t stay in one lane. Your security picture shouldn’t either.</p>
          </Reveal>
          <div className="capability-grid">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.index} delay={index * 0.1} className="capability-card">
                  <div className="card-topline"><span>{item.index} / SIGNAL LAYER</span><Icon size={18} strokeWidth={1.5} /></div>
                  <div className="capability-icon"><Icon size={22} strokeWidth={1.45} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="card-footer"><span>{item.tag}</span><ArrowUpRight size={16} /></div>
                  <div className="card-edge" aria-hidden="true" />
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="approach-section section-wrap" id="approach" aria-labelledby="approach-title">
          <Reveal className="approach-panel">
            <div className="approach-copy">
              <span className="section-kicker"><span>02</span> / FROM NOISE TO KNOWING</span>
              <h2 id="approach-title">Context changes <em>everything.</em></h2>
              <p className="approach-lead">A single alert is a question. Connected evidence becomes an answer.</p>
              <p className="approach-body">VEIL brings unusual activity into focus, maps it to the systems that matter, and gives your team a clean path from first signal to informed action.</p>
              <ul className="principle-list">
                {principles.map((principle) => (
                  <li key={principle}><span><Check size={12} /></span>{principle}</li>
                ))}
              </ul>
              <a className="text-link" href="#proof">See how the signal comes together <ArrowRight size={16} /></a>
            </div>
            <div className="signal-console" aria-label="Interactive example of a simulated perimeter scan">
              <div className="console-topbar">
                <div className="console-window-dots"><i /><i /><i /></div>
                <span>VEIL / SIGNAL CONSOLE</span>
                <span className="console-lock"><LockKeyhole size={13} /> ENCRYPTED</span>
              </div>
              <div className="console-content">
                <div className="console-label"><span className="console-led" />PERIMETER OVERVIEW <span className="console-region">REGION / GLOBAL</span></div>
                <div className={`radar-graphic${scanState === "scanning" ? " is-scanning" : ""}${scanState === "complete" ? " scan-complete" : ""}`} aria-hidden="true">
                  <div className="radar-circle radar-circle-outer" />
                  <div className="radar-circle radar-circle-mid" />
                  <div className="radar-circle radar-circle-inner" />
                  <div className="radar-crosshair" />
                  <div className="radar-sweep" />
                  <span className="radar-node node-a" /><span className="radar-node node-b" /><span className="radar-node node-c" />
                  <div className="radar-center"><Shield size={25} strokeWidth={1.2} /></div>
                </div>
                <div className="console-result" aria-live="polite">
                  <div className={`result-indicator${scanState === "scanning" ? " indicator-scanning" : ""}`} />
                  <div><span>{scanState === "complete" ? "SAMPLE POSTURE" : "SYSTEM POSTURE"}</span><strong>{scanState === "complete" ? "Clear signal" : "All signals in view"}</strong></div>
                  <span className="result-count">{scanState === "complete" ? "01" : "03"} <small>LAYERS</small></span>
                </div>
                <button className="scan-button" type="button" onClick={() => setScanState("scanning")} disabled={scanState === "scanning"}>
                  {scanState === "complete" ? <Check size={15} /> : <Radar size={15} />}
                  {scanLabel}
                  {scanState === "ready" && <ChevronRight size={15} />}
                </button>
                <p className="console-disclaimer">Sample interaction only · Not a live infrastructure scan</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="proof-section section-wrap" id="proof" aria-labelledby="proof-title">
          <Reveal className="proof-heading">
            <span className="section-kicker"><span>03</span> / BUILT FOR THE MOMENT THAT MATTERS</span>
            <h2 id="proof-title">Always on. <em>Never guessing.</em></h2>
            <p>More useful context for the people protecting what’s next.</p>
          </Reveal>
          <div className="proof-layout">
            <Reveal className="proof-feature">
              <div className="proof-feature-head"><Sparkles size={17} /><span>THE VEIL ADVANTAGE</span><span className="feature-code">V—03</span></div>
              <div className="proof-feature-art" aria-hidden="true">
                <div className="proof-wave wave-a" /><div className="proof-wave wave-b" /><div className="proof-wave wave-c" />
                <div className="proof-wave-core"><ShieldCheck size={26} strokeWidth={1.25} /></div>
                <span className="wave-caption caption-a">DETECT</span><span className="wave-caption caption-b">CONNECT</span><span className="wave-caption caption-c">RESPOND</span>
              </div>
              <h3>Clarity, built into the flow.</h3>
              <p>Move from scattered events to a shared understanding your whole team can act on.</p>
              <a className="feature-link" href="#contact">See VEIL in action <ArrowUpRight size={15} /></a>
            </Reveal>
            <Reveal className="metric-stack" delay={0.12}>
              <div className="metric-note"><span className="live-dot" /> ILLUSTRATIVE PLATFORM BENCHMARKS <span className="metric-line" /></div>
              <div className="metric-card">
                <span className="metric-number">24<span>/7</span></span>
                <div><h3>Signal watch</h3><p>Always-on monitoring across the connected security picture.</p></div>
                <span className="metric-arrow"><ArrowUpRight size={16} /></span>
              </div>
              <div className="metric-card">
                <span className="metric-number">&lt;60<span>s</span></span>
                <div><h3>Signal to action</h3><p>An example response target for a team with the right context.</p></div>
                <span className="metric-arrow"><ArrowUpRight size={16} /></span>
              </div>
              <div className="metric-card metric-last">
                <span className="metric-number">03</span>
                <div><h3>Layers, one view</h3><p>Identity, cloud and endpoint context—connected.</p></div>
                <span className="metric-arrow"><ArrowUpRight size={16} /></span>
              </div>
              <p className="metric-disclaimer">Illustrative concept benchmarks; not customer results or service-level commitments.</p>
            </Reveal>
          </div>
        </section>

        <section className="contact-section section-wrap" id="contact" aria-labelledby="contact-title">
          <Reveal className="contact-panel">
            <div className="contact-grid" aria-hidden="true" />
            <div className="contact-copy">
              <span className="section-kicker"><span>04</span> / YOUR NEXT MOVE</span>
              <h2 id="contact-title">Be ready for<br /><em>what you can’t see.</em></h2>
              <p>Get a closer look at the signal—and the people and systems behind it.</p>
              <div className="contact-points"><span><Zap size={14} /> Built for what’s next</span><span><ShieldCheck size={14} /> Designed for defenders</span></div>
            </div>
            <div className="contact-form-wrap">
              {requestSubmitted ? (
                <div className="request-success" role="status">
                  <div className="success-icon"><Check size={22} /></div>
                  <span className="mini-label">SIGNAL RECEIVED</span>
                  <h3>Your request is staged.</h3>
                  <p>This preview keeps your details on this page only. Connect a secure CRM or form endpoint to receive live requests.</p>
                  <button type="button" className="text-link" onClick={() => { setRequestSubmitted(false); setEmail(""); }}>Submit another <ArrowRight size={15} /></button>
                </div>
              ) : (
                <form className="briefing-form" onSubmit={handleRequest}>
                  <span className="mini-label">START A CONVERSATION</span>
                  <h3>Get your threat briefing.</h3>
                  <label htmlFor="briefing-email">Work email</label>
                  <div className="email-control">
                    <input id="briefing-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <button type="submit" aria-label="Request a threat briefing"><ArrowRight size={18} /></button>
                  </div>
                  <p className="form-note"><LockKeyhole size={12} /> Your details stay in this preview; no request is sent.</p>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a className="brand footer-brand" href="#top" aria-label="VEIL Security home"><BrandMark /><span className="brand-wordmark"><strong>VEIL</strong><span>SECURITY SYSTEMS</span></span></a>
        <div className="footer-note"><span><span className="footer-led" /> SYSTEMS NOMINAL</span><span>DEFENSE IN EVERY DIRECTION.</span></div>
        <div className="footer-meta"><span>CONCEPT EXPERIENCE · 2026</span><a href="#top">BACK TO TOP <ArrowUpRight size={13} /></a></div>
      </footer>
    </div>
  );
}
