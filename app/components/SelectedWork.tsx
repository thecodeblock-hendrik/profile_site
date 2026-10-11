"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import prelegalDraft from "../images/prelegal/draft-1920.png";
import prelegalLogin from "../images/prelegal/login-1366.png";
import prelegalDelete from "../images/prelegal/documents-delete-dialog-1366.png";
import prelegalDraftMobile from "../images/prelegal/draft-375.png";
import prelegalDocumentsMobile from "../images/prelegal/documents-375.png";
import fscHome from "../images/command-centre/1-command-centre.png";
import fscOnsite from "../images/command-centre/2-onsite-cases.png";
import fscRepeat from "../images/command-centre/3-repeat-cases.png";
import fscInstallations from "../images/command-centre/4-installations.png";
import fscKpis from "../images/command-centre/5-kpis.png";

const ArrowUpRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
);

const ArrowDown = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v13m0 0 5-5m-5 5-5-5" /></svg>
);

const projects = [
  {
    slug: "prelegal",
    name: "Prelegal",
    tag: "Featured project · AI legal drafting",
    pitch: "Prelegal turns a short AI chat into a ready-to-sign legal agreement. Describe what you need, and it picks the right Common Paper template, asks for the details and gives you a PDF.",
    facts: [
      {
        label: "Context",
        text: "Built during AI Coder, the second of six courses in The Complete AI Curriculum by Ed Donner. The UI design and application logic are my own and differ from the course reference project.",
      },
      {
        label: "Problem",
        text: "Drafting routine agreements such as NDAs, cloud service agreements, DPAs and pilot agreements is slow and costly. Small teams either pay a lawyer for standard paperwork or fill in templates by hand and risk mistakes.",
      },
      {
        label: "Solution",
        text: "Prelegal works out which of 11 supported agreements fits the request, asks for each open field one at a time, fills in a live preview and saves the draft to come back to later.",
      },
      {
        label: "Role",
        text: "Solo developer. I planned the work as Jira tickets and built each one with Claude Code through a feature branch, tests and a pull request.",
      },
    ],
    highlights: [
      { value: "11", label: "Agreement templates" },
      { value: "~1s", label: "Per AI reply" },
      { value: "1", label: "Docker container" },
    ],
    repo: "https://github.com/thecodeblock-hendrik/prelegal",
    stack: ["Next.js", "Tailwind CSS 4", "jsPDF", "FastAPI", "Python", "SQLite", "LiteLLM", "OpenRouter", "Cerebras", "Docker", "Vitest", "pytest"],
    hero: { src: prelegalDraft, alt: "Prelegal drafting a mutual NDA: AI chat on the left, live agreement preview on the right" },
    gallery: [
      { src: prelegalLogin, alt: "Prelegal sign-in page", kind: "desktop" },
      { src: prelegalDelete, alt: "Prelegal document list with a delete confirmation dialog", kind: "desktop" },
      { src: prelegalDraftMobile, alt: "Prelegal drafting chat on a phone", kind: "mobile" },
      { src: prelegalDocumentsMobile, alt: "Prelegal saved documents on a phone", kind: "mobile" },
    ],
  },
  {
    slug: "field-services-command-centre",
    name: "Field Services Command Centre",
    tag: "Project · Operations dashboards",
    pitch: "A set of live operations dashboards for a field services business, built with Claude Code and MCP connectors for Salesforce and Jira. One home page opens dashboards for cases, installations and KPIs.",
    facts: [
      {
        label: "Context",
        text: "Demo build for portfolio use. The company name, stores and figures shown are illustrative.",
      },
      {
        label: "Problem",
        text: "Field service managers need a current view of onsite cases, repeat visits, the installation schedule and service KPIs, without exporting reports by hand.",
      },
      {
        label: "Solution",
        text: "Claude Code reads live data through the Salesforce and Jira MCP connectors and builds each dashboard: filterable case views, a four-week installation schedule and five KPIs with targets.",
      },
      {
        label: "Role",
        text: "I defined the dashboards and metrics and built them with Claude Code.",
      },
    ],
    highlights: [
      { value: "3", label: "Dashboards" },
      { value: "5", label: "Service KPIs" },
      { value: "Live", label: "CRM data" },
    ],
    stack: ["Claude Code", "MCP connectors", "Salesforce", "Jira"],
    hero: { src: fscHome, alt: "Field Services Command Centre home page with tiles for the technical, installation and KPI dashboards" },
    gallery: [
      { src: fscOnsite, alt: "Onsite cases dashboard with daily counts, open cases and error types", kind: "dashboard" },
      { src: fscRepeat, alt: "Repeat cases dashboard showing repeat rate and stores with repeat cases", kind: "dashboard" },
      { src: fscInstallations, alt: "Installations dashboard with a four-week schedule and technician workload", kind: "dashboard" },
      { src: fscKpis, alt: "KPI dashboard showing customer satisfaction and its five drivers", kind: "dashboard" },
    ],
  },
];

/** Project tiles with the selected project's case study shown beneath. */
export default function SelectedWork() {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const fromHash = () => {
      const index = projects.findIndex((p) => `#${p.slug}` === window.location.hash);
      if (index >= 0) setSelected(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const select = (index: number) => {
    setSelected(index);
    window.history.replaceState(null, "", `#${projects[index].slug}`);
  };

  const project = projects[selected];

  return (
    <>
      <div className="work-tiles">
        {projects.map((item, index) => (
          <button
            type="button"
            className={`work-tile${index === selected ? " selected" : ""}`}
            aria-pressed={index === selected}
            onClick={() => select(index)}
            key={item.slug}
          >
            <Image src={item.hero.src} alt="" placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
            <div>
              <p className="eyebrow"><span /> {item.tag}</p>
              <h3>{item.name}</h3>
              <p>{item.pitch}</p>
              <span className="project-link">{index === selected ? "Showing below" : "View case study"} <ArrowDown /></span>
            </div>
          </button>
        ))}
      </div>
      <article className="project" id={project.slug} key={project.slug}>
        <div className="project-info">
          <p className="eyebrow"><span /> {project.tag}</p>
          <h3>{project.name}</h3>
          <p className="project-pitch">{project.pitch}</p>
          <dl className="project-facts">
            {project.facts.map((fact) => (
              <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.text}</dd></div>
            ))}
          </dl>
          <div className="project-highlights">
            {project.highlights.map((item) => (
              <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
            ))}
          </div>
          <div className="skills-row">
            {project.stack.map((tech) => <span key={tech}>{tech}</span>)}
          </div>
          {"repo" in project && (
            <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">View code on GitHub <ArrowUpRight /></a>
          )}
        </div>
        <div className="project-media">
          <a className="project-hero" href={project.hero.src.src} target="_blank" rel="noreferrer">
            <Image src={project.hero.src} alt={project.hero.alt} placeholder="blur" sizes="(max-width: 900px) 100vw, 60vw" />
          </a>
          <div className="project-gallery">
            {project.gallery.map((shot) => (
              <a className={shot.kind} href={shot.src.src} target="_blank" rel="noreferrer" key={shot.alt}>
                <Image src={shot.src} alt={shot.alt} placeholder="blur" sizes="(max-width: 600px) 50vw, 20vw" />
              </a>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
