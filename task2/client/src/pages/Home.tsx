import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, Check, ChevronRight, Menu, Orbit, X } from "lucide-react";

const OrbitalScene = lazy(() => import("@/components/OrbitalScene"));

type Category = {
  name: string;
  color: string;
};

const categories: Category[] = [
  { name: "Creatives", color: "#f15a38" },
  { name: "Event Management", color: "#c07820" },
  { name: "Web Development", color: "#315aff" },
  { name: "Marketing", color: "#d94d49" },
  { name: "Social Outreach", color: "#168c71" },
  { name: "Media and Publicity", color: "#5865c8" },
];

const tasks = [
  { title: "Cyber-Themed Landing Page Development", points: 50, status: "Verified", number: "01" },
  { title: "Build in 3D", points: 100, status: "Submit Task", number: "02" },
  { title: "Interactive Parallax Scrolling Page", points: 150, status: "Submit Task", number: "03" },
];

const TASK_COLORS = ["#f15a38", "#315aff", "#168c71"];

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Tasks", href: "#tasks" },
  { label: "Rewards", href: "#points" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
  { label: "Store", href: "#store" },
];

function TechfestMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <Orbit size={23} strokeWidth={1.6} />
      <span className="brand-mark-core" />
    </span>
  );
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Web Development");
  const [selectedTask, setSelectedTask] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const selectTask = (event: Event) => {
      const customEvent = event as CustomEvent<{ index: number }>;
      if (Number.isInteger(customEvent.detail?.index) && customEvent.detail.index >= 0 && customEvent.detail.index < tasks.length) {
        setSelectedTask(customEvent.detail.index);
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        document.getElementById("tasks")?.scrollIntoView({ behavior, block: "center" });
      }
    };
    window.addEventListener("techfest:select-task", selectTask);
    return () => window.removeEventListener("techfest:select-task", selectTask);
  }, []);

  const activeCategory = categories.find((category) => category.name === selectedCategory) ?? categories[2];

  return (
    <div className="site-shell">
      <Suspense fallback={<div className="orbital-scene scene-loading" aria-hidden="true"><div className="scene-fallback" /></div>}>
        <OrbitalScene selectedTask={selectedTask} color={activeCategory.color} />
      </Suspense>
      <div className="ambient-shade" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Techfest, IIT Bombay — home" onClick={() => setMenuOpen(false)}>
          <TechfestMark />
          <span className="brand-name">techfest<span className="brand-dot">.</span></span>
          <span className="brand-divider" />
          <span className="brand-campus">IIT<br />Bombay</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav id="primary-navigation" className={`primary-navigation${menuOpen ? " is-open" : ""}`} aria-label="Primary">
          {navItems.map((item, index) => (
            <a key={item.label} href={item.href} className={index === 0 ? "nav-link nav-link-home" : "nav-link"} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <span className="nav-orbit" aria-hidden="true" />
        </nav>
      </header>

      <main className="page-content">
        <section id="home" className="hero section-anchor" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow"><span className="eyebrow-line" /> IIT BOMBAY <span className="eyebrow-separator">/</span> ORBITAL BUILD LAB</p>
              <h1 id="hero-title" className="hero-title">TECHFEST<span className="hero-period">.</span></h1>
              <p className="hero-tagline">Asia’s Largest Science &amp;<br className="desktop-break" /> Technology Festival</p>
              <p className="hero-subtitle">Ideas take shape when you put them in motion.</p>
              <a className="hero-cta" href="#domains">
                <span>Explore the challenge fields</span>
                <span className="cta-icon"><ArrowDown size={17} /></span>
              </a>
            </div>
            <div className="hero-orbit-label" aria-hidden="true">
              <span className="orbit-label-dot" /> INTERACTIVE FIELD<br /><span className="orbit-label-muted">SCROLL TO SHIFT ORBIT</span>
            </div>
            <div className="hero-bottom-note" aria-hidden="true"><span>01</span><span className="note-rule" /><span>IN MOTION</span></div>
          </div>
        </section>

        <section id="domains" className="domains-section section-anchor" aria-labelledby="domains-title">
          <div className="section-inner">
            <div className="section-heading" data-reveal>
              <p className="section-kicker">THE BUILD LAB <span>—</span> FIND YOUR ORBIT</p>
              <div className="section-title-row">
                <h2 id="domains-title">Choose your<br /><em>discipline.</em></h2>
                <p className="section-aside">Six challenge fields.<br />One place to make things real.</p>
              </div>
            </div>

            <div className="category-layout" data-reveal>
              <div className="category-list" role="group" aria-label="Challenge categories">
                {categories.map((category, index) => (
                  <button
                    className={`category-option${selectedCategory === category.name ? " is-selected" : ""}`}
                    type="button"
                    key={category.name}
                    aria-pressed={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    style={{ "--category-color": category.color } as CSSProperties}
                  >
                    <span className="category-index">0{index + 1}</span>
                    <span>{category.name}</span>
                    <ChevronRight size={16} className="category-arrow" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className="category-detail" aria-live="polite" aria-atomic="true">
                <div className="detail-topline"><span className="detail-pulse" /> SELECTED FIELD</div>
                <h3>{selectedCategory}</h3>
                {selectedCategory === "Web Development" ? (
                  <p>Build and develop real web solutions. If coding and problem-solving is your thing, this domain puts your skills to actual use.</p>
                ) : (
                  <p className="detail-unavailable">The reference lists this challenge category but does not include a description.</p>
                )}
                <div className="detail-footer"><span>FIELD SIGNAL</span><span className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="tasks" className="tasks-section section-anchor" aria-labelledby="tasks-title">
          <div className="section-inner">
            <div className="section-heading tasks-heading" data-reveal>
              <p className="section-kicker">MISSION CONTROL <span>—</span> WEB DEVELOPMENT</p>
              <div className="section-title-row">
                <h2 id="tasks-title">Build it.<br /><em>Make it move.</em></h2>
                <p className="section-aside">Three challenges from the<br />Web Development field.</p>
              </div>
            </div>

            <div className="task-list" role="group" aria-label="Web Development tasks">
              {tasks.map((task, index) => (
                <button
                  className={`task-card${selectedTask === index ? " is-selected" : ""}`}
                  type="button"
                  key={task.number}
                  aria-pressed={selectedTask === index}
                  onClick={() => setSelectedTask(index)}
                  data-reveal
                  style={{ "--task-accent": TASK_COLORS[index] } as CSSProperties}
                >
                  <span className="task-number">{task.number}</span>
                  <span className="task-main">
                    <span className="task-kicker">TASK {index + 1}</span>
                    <span className="task-title">{task.title}</span>
                  </span>
                  <span className="task-points"><strong>{task.points}</strong><small>POINTS</small></span>
                  <span className={`task-status${task.status === "Verified" ? " is-verified" : ""}`}>
                    {task.status === "Verified" ? <Check size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
                    <span>{task.status}</span>
                  </span>
                </button>
              ))}
            </div>

            <div id="points" className="points-strip section-anchor" data-reveal>
              <span className="points-label">POINT VALUES SHOWN</span>
              <span className="points-value">50 <i>·</i> 100 <i>·</i> 150 <small>POINTS</small></span>
              <span className="points-note">Challenge values, not an account balance.</span>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-main">
            <a className="footer-brand" href="#home"><TechfestMark /><span>TECHFEST</span></a>
            <p className="footer-tagline">Asia’s Largest Science &amp; Technology Festival</p>
            <a className="back-top" href="#home">BACK TO THE TOP <ArrowRight size={14} /></a>
          </div>
          <div className="footer-bottom">
            <p id="projects" className="footer-note section-anchor"><span>PROJECTS</span> Project listings are not included in the source reference.</p>
            <p id="contact" className="footer-note section-anchor"><span>CONTACT</span> Contact details are not included in the source reference.</p>
            <p id="store" className="footer-note section-anchor"><span>STORE</span> Store details are not included in the source reference.</p>
            <p className="footer-endmark">IIT BOMBAY <span>·</span> TECHFEST</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
