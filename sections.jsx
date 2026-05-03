/* global React */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

// ============================================================
// NAV
// ============================================================
function Nav() {
  const [open, setOpen] = useStateS(false);
  useEffectS(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  return (
    <nav className={`nav ${open ? 'open' : ''}`}>
      <div className="brand"><span className="dot" /> ARTYOM_ANANOV / PORTFOLIO ’26</div>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span /><span /><span />
      </button>
      <ul onClick={() => setOpen(false)}>
        <li><a href="#about">About</a></li>
        <li><a href="#timeline">Experience</a></li>
        <li><a href="#cases">Cases</a></li>
        <li><a href="#skills">Stack</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a className="nav-offer" href="offer.html" target="_blank" rel="noreferrer">Technogym Offer ↗</a></li>
      </ul>
      <Clock />
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({ variant }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <div className="wrap">
        <div className="hero-head">
          <div className="hero-meta">
            <span className="eyebrow">AVAILABLE · Q2 2026</span>
            <span className="loc">41°43′N · 44°47′E · TBILISI, GEORGIA</span>
          </div>
          <span className="mono" style={{fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.1em'}}>
            PORTFOLIO - v26.04
          </span>
        </div>

        <h1 className="hero-name">
          <span className="row"><span>ARTYOM</span></span>
          <span className="row"><span className="chrome-word">ANANOV</span></span>
        </h1>

        <div className="hero-sub">
          <p className="hero-tag">
            Marketer, AI trainer & co-founder. Eight years running data-driven campaigns for
            <b> McDonald’s</b>, <b>Coca-Cola</b>, <b>Bank of Georgia</b> & 45+ more. Scaled
            an AI SaaS to <b>25K MAU</b>. Today - teaching applied AI & shipping predictive
            analytics inside a marketing team.
          </p>
          <div className="hero-stats">
            {window.STATS.map(s => (
              <div className="hero-stat" key={s.lab}>
                <div className="val">{s.val}<span className="unit">{s.unit}</span></div>
                <div className="lab">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>

        {variant === 'constellation' && <Constellation />}
        {variant === 'particles' && <Particles />}
      </div>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================
function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>A marketer who ships - not a deck maker.</h2>
          <div className="meta">§ 01 · ABOUT<br/>3 MIN READ</div>
        </div>

        <div className="about reveal">
          <div>
            <p>
              I’ve been running <b>data-driven marketing</b> for eight years - from founding a
              small agency in Tbilisi that billed McDonald’s, Coca-Cola and Herbalife, to
              co-founding <b>uCraft</b> and scaling an AI translation tool to
              <span className="highlight"> 25,000 monthly active users</span>.
            </p>
            <p>
              These days my work lives at the seam between marketing and AI - I build
              <b> n8n pipelines</b>, ship predictive-analytics tools, and teach applied AI at
              two universities. I also still run the full marketing lifecycle for clients: strategy,
              paid, content, creative, measurement.
            </p>
            <p>
              If your growth feels like a guess, let’s change that.
            </p>
          </div>
          <div className="about-aside">
            <div className="kv"><span className="k">Based</span><span className="v">Tbilisi, Georgia</span></div>
            <div className="kv"><span className="k">Role</span><span className="v">Marketing · AI · Product</span></div>
            <div className="kv"><span className="k">Langs</span><span className="v">Georgian · English · Russian</span></div>
            <div className="kv"><span className="k">Degree</span><span className="v">BA, Tbilisi State University ’18</span></div>
            <div className="kv"><span className="k">Stack</span><span className="v">n8n · Claude · GPT · GA4 · Semrush</span></div>
            <div className="kv"><span className="k">Off-work</span><span className="v">Gym · Gaming · Travel</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE
// ============================================================
function Timeline() {
  return (
    <section className="section" id="timeline">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Eight years of compounding.</h2>
          <div className="meta">§ 02 · EXPERIENCE<br/>2017 → NOW</div>
        </div>

        <div className="timeline">
          <div className="timeline-track" />
          {window.CAREER.map((row, i) => (
            <div className={`t-row reveal`} style={{ '--i': i }} key={row.id}>
              <div className="t-date">{row.date}</div>
              <div className="t-node"><div className="t-dot" /></div>
              <div className="t-body">
                <div className="t-role">{row.role}</div>
                <div className="t-title">
                  {row.org} {row.current && <span className="t-current">ACTIVE</span>}
                </div>
                <div className="t-desc">{row.desc}</div>
                <div className="t-tags">
                  {row.tags.map(t => <span className="t-tag" key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CASE STUDIES
// ============================================================
function CaseSEO() {
  // months for SEO growth (300 → 175k over 6 months, exponential)
  const months = 6;
  const values = Array.from({ length: months }, (_, i) => {
    const p = (i + 1) / months;
    return Math.round(300 * Math.pow(175000 / 300, p));
  });
  const max = values[values.length - 1];
  return (
    <div className="case sz-7">
      <div className="case-bg" />
      <div className="case-top">
        <span className="case-id">CASE_01 / GLADUS</span>
        <span className="case-kind">SEO · Organic growth</span>
      </div>
      <div>
        <h3 className="case-headline">From 300 to 175K monthly organic visits - in six months.</h3>
        <p className="case-desc">
          Took a zero-traffic site, built content and technical SEO foundations, led link-building and
          on-page ops with a team of three. The graph sort of speaks for itself.
        </p>
        <div className="chart-bars">
          {values.map((v, i) => (
            <div key={i} className="bar" style={{ height: `${(v / max) * 100}%` }} />
          ))}
        </div>
        <div className="case-metric">
          <div className="mval">
            583<span style={{fontSize: '0.5em', color: 'var(--ink)'}}>×</span>
          </div>
          <div className="mlab">Traffic multiplier,<br/>6-month run</div>
        </div>
      </div>
    </div>
  );
}

function CaseUCraft() {
  return (
    <div className="case sz-5">
      <div className="case-bg" />
      <div className="case-top">
        <span className="case-id">CASE_02 / UCRAFT</span>
        <span className="case-kind">SaaS · Founder</span>
      </div>
      <div>
        <h3 className="case-headline">Scaled an AI translation tool to 25K MAU.</h3>
        <p className="case-desc">
          Co-founded, shipped, marketed. Operates on autopilot today - zero ongoing effort from me.
        </p>
        <div className="ring-wrap">
          <div className="ring" style={{ '--val': 82 }}>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line-strong)" strokeWidth="6" />
              <circle className="fill" cx="60" cy="60" r="50" fill="none" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <div className="center">25K</div>
          </div>
          <div>
            <div style={{fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10}}>MAU · AUTONOMOUS</div>
            <div style={{fontSize: 14, color: 'var(--ink-dim)', lineHeight: 1.5}}>
              Pivoted away from the hyper-competitive automation market to double down on translation - a high-growth wedge with sticky users.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseMSG() {
  return (
    <div className="case sz-12 chrome">
      <div className="case-bg" />
      <div className="case-top">
        <span className="case-id">CASE_03 / MARKETING SOLUTIONS GEORGIA</span>
        <span className="case-kind">Agency · CMO</span>
      </div>
      <div className="case-msg-grid" style={{display:'grid', gap:40, alignItems:'end', marginTop:30}}>
        <div>
          <h3 className="case-headline" style={{maxWidth:'22ch'}}>
            Ran my own agency. 45+ projects. <span style={{color:'var(--accent)'}}>$550,000</span> in ad spend. Fortune-scale logos.
          </h3>
          <p className="case-desc" style={{maxWidth:'60ch'}}>
            Six years managing Meta, Google & LinkedIn campaigns for clients ranging from local
            challengers to McDonald’s and Coca-Cola. Led a team of eight across marketing, design and
            dev. Built client acquisition, funnel strategy and performance ops from scratch.
          </p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:20}}>
          <Stat big="$550K" lab="AD SPEND MANAGED" />
          <Stat big="45+" lab="PROJECTS SHIPPED" />
          <Stat big="8" lab="TEAM MEMBERS LED" />
          <Stat big="6 yrs" lab="RUN TIME" />
        </div>
      </div>
    </div>
  );
}

function Stat({ big, lab }) {
  return (
    <div>
      <div style={{fontFamily:'var(--font-display)', fontSize:'clamp(36px, 4vw, 56px)', fontWeight:500, letterSpacing:'-0.03em', color:'var(--ink)', lineHeight:1}}>{big}</div>
      <div style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em', color:'var(--ink-faint)', textTransform:'uppercase', marginTop:6}}>{lab}</div>
    </div>
  );
}

function Cases() {
  return (
    <section className="section" id="cases">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Receipts, not résumé lines.</h2>
          <div className="meta">§ 03 · CASE STUDIES<br/>3 SELECTED</div>
        </div>
        <div className="cases">
          <div className="reveal" style={{gridColumn:'span 7'}}><CaseSEO /></div>
          <div className="reveal" style={{gridColumn:'span 5'}}><CaseUCraft /></div>
          <div className="reveal" style={{gridColumn:'span 12'}}><CaseMSG /></div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CLIENTS
// ============================================================
function Clients() {
  const loop = [...window.CLIENTS, ...window.CLIENTS]; // doubled for seamless scroll
  return (
    <section className="section" id="clients" style={{padding: '100px 0'}}>
      <div className="wrap">
        <div className="section-head reveal" style={{marginBottom: 40, padding: '28px 40px 0'}}>
          <h2>Logos that have paid the bills.</h2>
          <div className="meta">§ 04 · SELECTED CLIENTS<br/>2018 → 2026</div>
        </div>
      </div>
      <div className="clients-strip">
        <div className="marquee">
          {loop.map((c, i) => (
            <span key={i} className={`client-chip ${i % 3 === 1 ? 'italic' : ''}`}>
              <span className="dot" /> {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SKILLS
// ============================================================
function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>The stack I actually use.</h2>
          <div className="meta">§ 05 · TOOLS &amp; TECH<br/>30+ TOOLS</div>
        </div>
        {Object.entries(window.SKILLS).map(([cat, items]) => (
          <div className="skill-cat reveal" key={cat}>
            <div className="skill-cat-title">{cat} <span style={{color:'var(--ink-faint)', fontFamily:'var(--font-mono)'}}>· {items.length}</span></div>
            <div className="skills-grid">
              {items.map(s => (
                <div className="skill" key={s.name}>
                  <span>{s.name}</span>
                  <span className="badge">{s.badge}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// TEACHING + BOOK
// ============================================================
function TeachingBook() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head reveal">
          <h2>Teach what you ship.</h2>
          <div className="meta">§ 06 · TEACHING &amp; WRITING</div>
        </div>
        <div className="two-col">
          <div className="feature-card reveal">
            <div className="pattern" />
            <div style={{position:'relative'}}>
              <span className="eyebrow">INVITED AI TRAINER</span>
              <h3 className="feature-title">Teaching applied AI at two Georgian universities.</h3>
              <p className="feature-body">
                Designed and delivered continuing-education programs on real-world AI use for marketing,
                product and operations teams - moving beyond hype into pipelines people actually deploy.
              </p>
            </div>
            <div className="feature-links" style={{position:'relative'}}>
              <a className="feature-link" href="https://www.alte.edu.ge/en/ai-from-theory-to-practice" target="_blank" rel="noreferrer">
                <span>ALTE UNIVERSITY · AI FROM THEORY TO PRACTICE</span>
                <span className="arr">→</span>
              </a>
              <a className="feature-link" href="#">
                <span>BTU · INVITED AI TRAINER (2025 - PRESENT)</span>
                <span className="arr">→</span>
              </a>
            </div>
          </div>

          <div className="feature-card reveal">
            <div className="pattern" />
            <div style={{position:'relative'}}>
              <span className="eyebrow">CO-AUTHOR · BUSINESS 9-12</span>
              <h3 className="feature-title">A business textbook that’s taught in three countries.</h3>
              <p className="feature-body">
                Co-authored a business-oriented book for 9-12 grade students. Actively used in private
                schools across <b>Kazakhstan</b>, <b>Tajikistan</b> and <b>Moldova</b>.
              </p>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, position:'relative'}}>
              <Stat big="3" lab="COUNTRIES" />
              <Stat big="9-12" lab="GRADE LEVELS" />
              <Stat big="1" lab="PUBLISHED TITLE" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT
// ============================================================
function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-bg" />
      <div className="wrap">
        <div className="reveal" style={{display:'flex', justifyContent:'center', marginBottom:40}}>
          <span className="eyebrow">§ 07 · LET’S BUILD</span>
        </div>
        <h2 className="reveal">Got a <em>growth</em> problem worth solving?</h2>

        <div className="contact-cta reveal">
          <a className="btn primary" href="mailto:artyomananov@gmail.com">
            <span>artyomananov@gmail.com</span><span>→</span>
          </a>
          <a className="btn" href="tel:+995557470982">
            <span>+995 557 47 09 82</span>
          </a>
          <a className="btn" href="https://linkedin.com/in/artyom-ananov" target="_blank" rel="noreferrer">
            <span>LinkedIn</span><span>↗</span>
          </a>
        </div>

        <div className="wrap footer">
          <div>© 2026 · ARTYOM ANANOV · TBILISI, GE</div>
          <div>DESIGNED & BUILT - 2026 EDITION</div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Hero, About, Timeline, Cases, Clients, Skills, TeachingBook, Contact });
