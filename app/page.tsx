import DigitalTwinChat from "./components/DigitalTwinChat";

const ArrowUpRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
);

const ArrowDown = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v13m0 0 5-5m-5 5-5-5" /></svg>
);

const impact = [
  { value: "700+", label: "SaaS implementations supported" },
  { value: "40+", label: "Cross-functional team members led" },
  { value: "25%", label: "Faster implementation timelines" },
  { value: "~700", label: "Active clients across the portfolio" },
];

const expertise = [
  {
    number: "01",
    title: "Operational leadership",
    text: "Building accountable, high-performing teams across multiple locations, functions, and service environments.",
  },
  {
    number: "02",
    title: "Enterprise delivery",
    text: "Leading complex SaaS implementations from discovery and configuration through go-live and long-term adoption.",
  },
  {
    number: "03",
    title: "Commercial performance",
    text: "Balancing customer outcomes with budgets, gross profit, forecasting, resource planning, and cost control.",
  },
  {
    number: "04",
    title: "Digital transformation",
    text: "Applying CRM insights, automation, AI tools, and data-led processes to create efficient, scalable operations.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Hendrik Oosthuizen, home">
          <span className="brand-mark">HO</span>
          <span className="brand-name">Hendrik Oosthuizen</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#expertise">Expertise</a>
        </nav>
        <a className="header-cta" href="mailto:thecodeblock.dev@gmail.com">
          Let&apos;s talk <ArrowUpRight />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy reveal">
          <p className="eyebrow"><span /> Operations &amp; SaaS delivery leader</p>
          <h1>Turning operational<br />complexity into<br /><em>measurable progress.</em></h1>
          <p className="hero-intro">
            I lead multi-site teams, enterprise implementations, and service operations—aligning people, process, and technology to deliver lasting customer outcomes.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#journey">Explore my journey <ArrowDown /></a>
            <a className="text-link" href="https://www.linkedin.com/in/henno-oosthuizen" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
          </div>
        </div>
        <aside className="hero-panel reveal delay-one">
          <div className="panel-top">
            <span>Leadership profile</span>
            <span className="status"><i /> Open to connect</span>
          </div>
          <div className="monogram">H<span>O</span></div>
          <div className="panel-content">
            <p>Based in South Africa</p>
            <h2>Regional Operations<br />&amp; Service Delivery</h2>
            <div className="panel-meta">
              <span>20 years in SaaS</span>
              <span>Enterprise · B2B</span>
            </div>
          </div>
        </aside>
        <div className="hero-foot">
          <span>GAAP Point-of-Sale · 2006—Present</span>
          <span>Scroll to discover <ArrowDown /></span>
        </div>
      </section>

      <section className="impact" aria-label="Career impact">
        {impact.map((item) => (
          <div className="impact-item" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section about" id="about">
        <div className="section-label"><span>01</span> About me</div>
        <div className="about-content">
          <p className="lead">I build operations that work <em>for people</em>—not the other way around.</p>
          <div className="about-columns">
            <p>For two decades, I&apos;ve worked at the intersection of enterprise technology, customer delivery, and regional operations. Today, I lead cross-functional teams across the Western and Eastern Cape, serving a portfolio of nearly 700 clients.</p>
            <p>My approach combines commercial discipline with genuine curiosity. I care about clear systems, capable teams, and using technology—from CRM intelligence to AI and workflow automation—to remove friction and create room for better work.</p>
          </div>
          <div className="principles">
            <span>Clarity over complexity</span>
            <span>People before process</span>
            <span>Progress through data</span>
          </div>
        </div>
      </section>

      <section className="section journey" id="journey">
        <div className="section-label light"><span>02</span> Career journey</div>
        <div className="journey-head">
          <p className="eyebrow"><span /> Two decades of continuous growth</p>
          <h2>From hands-on implementation<br />to regional leadership.</h2>
        </div>
        <div className="timeline">
          <article className="role current">
            <div className="role-date"><span>2013—Present</span><i>Current</i></div>
            <div className="role-main">
              <p>GAAP Point-of-Sale · B2B SaaS</p>
              <h3>Regional Operations Manager<br />&amp; Service Delivery Manager</h3>
              <p className="role-summary">Leading regional operations, enterprise service delivery, customer success, and cross-functional performance across multiple locations.</p>
            </div>
            <ul>
              <li>Lead 40+ people across support, implementation, consulting, cabling operations, and sales coordination</li>
              <li>Own workforce planning, operational budgets, profitability, escalation management, and regional resource allocation</li>
              <li>Use CRM reporting, Excel analysis, AI tools, and automation to improve decisions and delivery performance</li>
            </ul>
          </article>
          <article className="role">
            <div className="role-date"><span>2006—2013</span></div>
            <div className="role-main">
              <p>GAAP Point-of-Sale · B2B SaaS</p>
              <h3>Software Implementation<br />&amp; Support Specialist</h3>
              <p className="role-summary">Delivered end-to-end implementations and hands-on support in live customer environments during a period of regional growth.</p>
            </div>
            <ul>
              <li>Configured systems and databases, trained users, and supported go-lives</li>
              <li>Provided first- and second-line software and hardware support</li>
              <li>Helped standardise onboarding and channel customer insight back to product teams</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section expertise" id="expertise">
        <div className="section-label"><span>03</span> Areas of expertise</div>
        <div className="expertise-head">
          <h2>Built for the intersection of<br /><em>people, performance &amp; technology.</em></h2>
          <p>Broad operational experience, grounded in the practical realities of leading teams and delivering for customers.</p>
        </div>
        <div className="expertise-grid">
          {expertise.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="skills-row">
          {['Multi-site operations', 'Customer success', 'Agile operations', 'Project management', 'Risk management', 'Jira', 'n8n', 'AI productivity'].map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </section>

      <section className="section education">
        <div className="section-label"><span>04</span> Continuous learning</div>
        <div className="education-list">
          <div><span>Le Wagon</span><h3>Full-Stack Web Development</h3><p>SaaS &amp; web platforms</p></div>
          <div><span>Diploma</span><h3>Web Design &amp; Internet Development</h3><p>Digital foundations</p></div>
          <div><span>Diploma</span><h3>PC Support</h3><p>Technical foundations</p></div>
        </div>
      </section>

      <section className="portfolio-callout" id="portfolio">
        <div>
          <p className="eyebrow"><span /> Portfolio</p>
          <h2>Selected work and case studies<br />are coming soon.</h2>
        </div>
        <div className="soon-mark">In progress <span>↗</span></div>
      </section>

      <footer>
        <div className="footer-copy">
          <p className="eyebrow"><span /> Let&apos;s connect</p>
          <h2>Building what&apos;s next starts<br />with a <em>conversation.</em></h2>
          <a className="email-link" href="mailto:thecodeblock.dev@gmail.com">thecodeblock.dev@gmail.com <ArrowUpRight /></a>
        </div>
        <div className="footer-bottom">
          <a className="brand" href="#top"><span className="brand-mark">HO</span><span className="brand-name">Hendrik Oosthuizen</span></a>
          <div><a href="https://www.linkedin.com/in/henno-oosthuizen" target="_blank" rel="noreferrer">LinkedIn</a><a href="#portfolio">Portfolio</a></div>
          <span>© 2026 Hendrik Oosthuizen</span>
        </div>
      </footer>
      <DigitalTwinChat />
    </main>
  );
}
