import { useEffect, useRef, useState } from 'react';
import { Scene } from './components/Scene';
import { ContentPanel } from './components/ContentPanel';
import { NavigationHints } from './components/NavigationHints';
import { MobileGestureHandler } from './components/MobileGestureHandler';
import { LoadingScreen } from './components/LoadingScreen';
import { ProjectsPanel } from './panels/ProjectsPanel';
import { ExperiencePanel } from './panels/ExperiencePanel';
import { SkillsPanel } from './panels/SkillsPanel';
import { PersonalPanel } from './panels/PersonalPanel';
import { ResumePanel } from './panels/ResumePanel';
import { projects } from './data/projects';
import { useCraneStore } from './crane/useCraneStore';

function StandardWebsiteView() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sections = [
    { id: 'section-experience', label: 'Experience' },
    { id: 'section-projects', label: 'Projects' },
    { id: 'section-personal', label: 'Personal' },
    { id: 'section-skills', label: 'Skills' },
    { id: 'section-resume', label: 'Resume' },
  ] as const;
  const [activeLegendId, setActiveLegendId] = useState<(typeof sections)[number]['id']>('section-projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? '');
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const marker = container.scrollTop + 180;
      let current: (typeof sections)[number]['id'] = sections[0].id;
      for (const section of sections) {
        const el = container.querySelector<HTMLElement>(`#${section.id}`);
        if (!el) continue;
        if (el.offsetTop <= marker) current = section.id;
      }
      setActiveLegendId(current);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollBySection = (dir: -1 | 1) => {
    const container = scrollRef.current;
    if (!container) return;

    const sectionElements = sections
      .map((section) => container.querySelector<HTMLElement>(`#${section.id}`))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const currentTop = container.scrollTop + 40;
    let currentIndex = sectionElements.findIndex((el, i) => {
      const start = el.offsetTop;
      const end = i < sectionElements.length - 1 ? sectionElements[i + 1].offsetTop : Number.POSITIVE_INFINITY;
      return currentTop >= start && currentTop < end;
    });

    if (currentIndex === -1) currentIndex = 0;

    const nextIndex = Math.max(0, Math.min(sectionElements.length - 1, currentIndex + dir));
    sectionElements[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToSection = (id: (typeof sections)[number]['id']) => {
    const container = scrollRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#${id}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setProjectDetailsOpen(true);
  };

  return (
    <div ref={scrollRef} className="absolute inset-0 z-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <div className="space-y-8 min-w-0">
          <header className="space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl text-ink dark:text-paper-100">Joshua Obljubek</h1>
            <p className="text-sm tracking-[0.2em] uppercase text-ink-muted dark:text-paper-400">Portfolio</p>
          </header>

          <section id="section-experience" className="rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50/90 dark:bg-paper-900/80 p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-4 text-ink dark:text-paper-100">Experience</h2>
            <ExperiencePanel />
          </section>

          <section id="section-projects" className="rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50/90 dark:bg-paper-900/80 p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-4 text-ink dark:text-paper-100">Projects</h2>
            <ProjectsPanel onSelectProject={handleSelectProject} selectedProjectId={selectedProject?.id} />
          </section>

          <section id="section-personal" className="rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50/90 dark:bg-paper-900/80 p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-4 text-ink dark:text-paper-100">Personal</h2>
            <PersonalPanel />
          </section>

          <section id="section-skills" className="rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50/90 dark:bg-paper-900/80 p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-4 text-ink dark:text-paper-100">Skills</h2>
            <SkillsPanel />
          </section>

          <section id="section-resume" className="rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50/90 dark:bg-paper-900/80 p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-4 text-ink dark:text-paper-100">Resume</h2>
            <ResumePanel />
          </section>

          {/* Quick scroll controls for long standard-page content */}
          <div className="sticky bottom-6 flex justify-end pointer-events-none">
            <div className="pointer-events-auto inline-flex rounded-xl border border-paper-300 dark:border-paper-600 bg-paper-50/95 dark:bg-paper-900/95 backdrop-blur-sm overflow-hidden shadow-lg">
              <button
                onClick={() => scrollBySection(-1)}
                className="px-3 py-2 text-xs font-mono text-ink-muted dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
                aria-label="Previous section"
              >
                ← Prev
              </button>
              <button
                onClick={() => scrollBySection(1)}
                className="px-3 py-2 text-xs font-mono text-ink-muted dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors border-l border-paper-300 dark:border-paper-600"
                aria-label="Next section"
              >
                Next →
              </button>
              <button
                onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-2 text-xs font-mono text-ink-muted dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors border-l border-paper-300 dark:border-paper-600"
                aria-label="Scroll to top"
              >
                ↑ Top
              </button>
              <button
                onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight ?? 0, behavior: 'smooth' })}
                className="px-3 py-2 text-xs font-mono text-ink-muted dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors border-l border-paper-300 dark:border-paper-600"
                aria-label="Scroll to bottom"
              >
                ↓ Bottom
              </button>
            </div>
          </div>
        </div>

        {/* Section legend / quick-jump (non-overlapping sidebar) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <section className="rounded-xl border border-paper-300 dark:border-paper-600 bg-paper-50/95 dark:bg-paper-900/95 backdrop-blur-sm shadow-lg p-2">
              <p className="px-2 pb-2 text-[10px] uppercase tracking-[0.18em] text-ink-muted dark:text-paper-400 font-sans">Legend</p>
              <div className="space-y-1">
                {sections.map((section) => {
                  const active = activeLegendId === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-sans transition-colors ${active
                        ? 'bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100'
                        : 'text-ink-muted dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800'}`}
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* Project details slide-over */}
      <>
        <button
          type="button"
          aria-label="Close project details"
          onClick={() => setProjectDetailsOpen(false)}
          className={`fixed inset-0 z-30 bg-ink/45 dark:bg-black/55 transition-opacity duration-300 ${projectDetailsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Project details"
          className={`
            fixed top-0 right-0 z-40 h-full w-full max-w-xl
            bg-paper-50/95 dark:bg-paper-900/95 backdrop-blur-sm
            border-l border-paper-300 dark:border-paper-600
            shadow-2xl shadow-ink/20 dark:shadow-black/40
            transition-transform duration-300 ease-out
            ${projectDetailsOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-full overflow-y-auto p-6 md:p-8">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h3 className="font-serif text-2xl text-ink dark:text-paper-100">Project Details</h3>
              <button
                onClick={() => setProjectDetailsOpen(false)}
                aria-label="Close project details"
                className="
                  w-9 h-9 rounded-full border border-paper-300 dark:border-paper-600
                  text-ink-muted dark:text-paper-300
                  hover:text-ink dark:hover:text-paper-100
                  hover:border-paper-400 dark:hover:border-paper-500
                  transition-colors
                "
              >
                ×
              </button>
            </div>

            {selectedProject ? (
              <article className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="font-serif text-xl text-ink dark:text-paper-100">{selectedProject.title}</h4>
                  <span className="text-xs text-ink-muted dark:text-paper-400 font-mono shrink-0 mt-1">{selectedProject.year}</span>
                </div>

                <p className="text-sm text-ink-muted dark:text-paper-300 leading-relaxed">
                  {selectedProject.longDescription ?? selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-paper-100 text-ink-muted border border-paper-200 dark:bg-paper-700 dark:text-paper-200 dark:border-paper-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  {selectedProject.url && (
                    <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-crane hover:underline font-sans">
                      Visit →
                    </a>
                  )}
                  {selectedProject.devpostUrl && (
                    <a href={selectedProject.devpostUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-crane hover:underline font-sans">
                      Devpost →
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-crane hover:underline font-sans">
                      GitHub →
                    </a>
                  )}
                </div>
              </article>
            ) : null}
          </div>
        </aside>
      </>
    </div>
  );
}

function AppShell() {
  const closePanel    = useCraneStore((s) => s.closePanel);
  const activeSection = useCraneStore((s) => s.activeSection);
  const isDark        = useCraneStore((s) => s.isDark);
  const setTheme      = useCraneStore((s) => s.setTheme);
  const [viewMode, setViewMode] = useState<'crane' | 'standard'>('standard');

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none transition-colors duration-300 ${isDark ? 'dark bg-paper-900' : 'bg-paper-200'}`}>
      {/* ── Background content: crane view or standard website view ── */}
      {viewMode === 'crane' ? (
        <div className="absolute inset-0">
          <Scene />
        </div>
      ) : (
        <StandardWebsiteView />
      )}

      {/* ── Navigation hint labels (HTML overlay) ── */}
      {viewMode === 'crane' && <NavigationHints />}

      {/* ── Backdrop — click outside panel to close ── */}
      {viewMode === 'crane' && activeSection && (
        <div
          className="absolute inset-0 z-10"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* ── Sliding content panel ── */}
      {viewMode === 'crane' && <ContentPanel />}

      {/* ── Mobile gesture support ── */}
      {viewMode === 'crane' && <MobileGestureHandler />}

      {/* ── Site name / logo ── */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <p className="font-serif text-ink dark:text-paper-100 text-lg tracking-wide">Joshua Obljubek</p>
        <p className="font-sans text-xs text-ink-muted dark:text-paper-400 tracking-[0.25em] uppercase">
          Portfolio
        </p>
      </div>

      {/* ── Quick controls (hidden while a section panel is open) ── */}
      {!activeSection && (
        <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
          <button
            onClick={() => setTheme(!isDark)}
            aria-label="Toggle theme"
            className="
              px-3 h-9 rounded-full border
              border-paper-300 dark:border-paper-700
              text-xs font-sans tracking-wide
              text-ink-muted dark:text-paper-300
              hover:text-ink dark:hover:text-paper-100
              hover:border-paper-400 dark:hover:border-paper-500
              bg-paper-50/80 dark:bg-paper-900/80
              backdrop-blur-sm
              transition-all duration-200
            "
          >
            {isDark ? 'Dark' : 'Light'}
          </button>

          <button
            onClick={() => {
              setViewMode((prev) => (prev === 'crane' ? 'standard' : 'crane'));
              closePanel();
            }}
            aria-label="Toggle layout"
            className="
              px-3 h-9 rounded-full border
              border-paper-300 dark:border-paper-700
              text-xs font-sans tracking-wide
              text-ink-muted dark:text-paper-300
              hover:text-ink dark:hover:text-paper-100
              hover:border-paper-400 dark:hover:border-paper-500
              bg-paper-50/80 dark:bg-paper-900/80
              backdrop-blur-sm
              transition-all duration-200
            "
          >
            {viewMode === 'crane' ? 'Crane' : 'Standard'}
          </button>
        </div>
      )}

      {/* ── Prompt users in standard mode to try crane mode ── */}
      {viewMode === 'standard' && (
        <div className="absolute top-20 right-8 z-20">
          <button
            onClick={() => {
              setViewMode('crane');
              closePanel();
            }}
            aria-label="Switch to crane mode"
            className="
              inline-flex items-center gap-2
              px-4 py-2 rounded-full border
              border-accent-crane/40
              text-xs md:text-sm font-sans tracking-wide
              text-accent-crane
              bg-paper-50/90 dark:bg-paper-900/90
              hover:bg-accent-crane/10
              shadow-md backdrop-blur-sm
              transition-all duration-200
            "
          >
            <span className="text-lg leading-none" aria-hidden="true">↗</span>
            <span>Try the interactive crane</span>
          </button>
        </div>
      )}

      {/* ── Keyboard shortcut hint ── */}
      <div className="absolute bottom-6 right-8 z-20 pointer-events-none hidden md:block">
        <p className="text-xs text-paper-400 dark:text-paper-600 font-mono">
          {viewMode === 'crane' && activeSection ? 'esc to close' : ''}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {/* Render AppShell immediately so Three.js starts loading in background */}
      <AppShell />
    </>
  );
}
