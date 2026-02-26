import { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { useCraneStore } from '../crane/useCraneStore';
import { CraneSection, SECTION_LABELS } from '../crane/types';

// Lazy-load each panel for code splitting
const ProjectsPanel  = lazy(() => import('../panels/ProjectsPanel').then((m) => ({ default: m.ProjectsPanel })));
const ExperiencePanel = lazy(() => import('../panels/ExperiencePanel').then((m) => ({ default: m.ExperiencePanel })));
const SkillsPanel    = lazy(() => import('../panels/SkillsPanel').then((m) => ({ default: m.SkillsPanel })));
const ResumePanel    = lazy(() => import('../panels/ResumePanel').then((m) => ({ default: m.ResumePanel })));
const PersonalPanel  = lazy(() => import('../panels/PersonalPanel').then((m) => ({ default: m.PersonalPanel })));

function PanelContent({ section }: { section: CraneSection }) {
  switch (section) {
    case CraneSection.LeftWing:  return <ExperiencePanel />;
    case CraneSection.RightWing: return <ProjectsPanel />;
    case CraneSection.Body:      return <SkillsPanel />;
    case CraneSection.Tail:      return <PersonalPanel />;
    case CraneSection.Head:      return <ResumePanel />;
    default:                     return null;
  }
}

export function ContentPanel() {
  const panelRef      = useRef<HTMLDivElement>(null);
  const activeSection = useCraneStore((s) => s.activeSection);
  const panelVisible  = useCraneStore((s) => s.panelVisible);
  const closePanel    = useCraneStore((s) => s.closePanel);

  // Animate in / out
  useEffect(() => {
    if (!panelRef.current) return;
    if (panelVisible) {
      gsap.fromTo(
        panelRef.current,
        { x: 60, opacity: 0, pointerEvents: 'none' },
        { x: 0, opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power3.out' },
      );
    } else {
      gsap.to(panelRef.current, {
        x: 60,
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.35,
        ease: 'power2.in',
      });
    }
  }, [panelVisible]);

  // Escape key closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closePanel]);

  return (
    <div
      ref={panelRef}
      className="
        fixed right-0 top-0 h-full w-full max-w-lg
        bg-paper-50/95 dark:bg-paper-900/95 backdrop-blur-sm
        border-l border-paper-200 dark:border-paper-700
        shadow-2xl shadow-ink/10 dark:shadow-black/30
        flex flex-col
        opacity-0 pointer-events-none
        z-20
        overflow-hidden
        transition-colors duration-300
      "
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-paper-200 dark:border-paper-700">
        <div>
          {activeSection && (
            <>
              <p className="text-xs tracking-[0.25em] text-ink-muted dark:text-paper-500 uppercase font-sans mb-1">
                {activeSection}
              </p>
              <h2 className="text-2xl font-serif text-ink dark:text-paper-100">
                {activeSection ? SECTION_LABELS[activeSection] : ''}
              </h2>
            </>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={closePanel}
          aria-label="Close panel"
          className="
            w-9 h-9 flex items-center justify-center
            rounded-full border border-paper-300 dark:border-paper-700
            text-ink-muted dark:text-paper-400
            hover:text-ink dark:hover:text-paper-100
            hover:border-paper-400 dark:hover:border-paper-500
            transition-colors duration-200
            font-sans text-lg leading-none
          "
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 scroll-smooth">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-paper-300 dark:border-paper-700 border-t-accent-crane rounded-full animate-spin" />
            </div>
          }
        >
          {activeSection && <PanelContent section={activeSection} />}
        </Suspense>
      </div>

      {/* Decorative fold crease line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-fold/30 to-transparent" />
    </div>
  );
}
