import { useCraneStore } from '../crane/useCraneStore';
import { CraneSection, SECTION_LABELS, SECTION_LABELS_JP } from '../crane/types';

interface HintConfig {
  section: CraneSection;
  position: string; // Tailwind absolute positioning classes
  align: 'left' | 'right' | 'center';
}

const HINTS: HintConfig[] = [
  // Cardinal mapping based on current crane section classification:
  // Head → left, RightWing → top, Tail → right, LeftWing → bottom
  { section: CraneSection.Head,      position: 'left-[8%]  top-1/2 -translate-y-1/2', align: 'left'   },
  { section: CraneSection.RightWing, position: 'left-1/2 top-[12%] -translate-x-1/2', align: 'center' },
  { section: CraneSection.Body,      position: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', align: 'center' },
  { section: CraneSection.Tail,      position: 'right-[8%] top-1/2 -translate-y-1/2', align: 'right'  },
  { section: CraneSection.LeftWing,  position: 'left-1/2 bottom-[18%] -translate-x-1/2', align: 'center' },
];

export function NavigationHints() {
  const hoveredSection = useCraneStore((s) => s.hoveredSection);
  const activeSection  = useCraneStore((s) => s.activeSection);
  const introComplete  = useCraneStore((s) => s.introComplete);

  if (!introComplete) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {HINTS.map(({ section, position, align }) => {
        const isHovered = hoveredSection === section;
        const isActive  = activeSection  === section;
        const isOther   = activeSection !== null && !isActive;

        return (
          <div
            key={section}
            className={`
              absolute ${position}
              transition-all duration-300
              ${isOther ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
          >
            <div
              className={`
                flex flex-col gap-0.5
                ${align === 'right' ? 'items-end' : align === 'center' ? 'items-center' : 'items-start'}
              `}
            >
              {/* Japanese label — always subtle */}
              <span
                className={`
                  text-[10px] tracking-[0.3em] font-sans
                  transition-all duration-300
                  ${isHovered ? 'text-ink-muted dark:text-paper-300 opacity-100' : 'text-paper-400 dark:text-paper-600 opacity-60'}
                `}
              >
                {SECTION_LABELS_JP[section]}
              </span>

              {/* English label — always visible (stronger on hover) */}
              <span
                className={`
                  text-xs tracking-[0.15em] uppercase font-sans
                  transition-all duration-300
                  ${isHovered
                    ? 'text-ink dark:text-paper-100 opacity-100 translate-y-0'
                    : 'text-ink-muted dark:text-paper-500 opacity-70 translate-y-0'
                  }
                `}
              >
                {SECTION_LABELS[section]}
              </span>

              {/* Hover indicator dot */}
              <div
                className={`
                  w-1 h-1 rounded-full mt-1
                  transition-all duration-300
                  ${isHovered ? 'bg-accent-crane opacity-100 scale-100' : 'bg-paper-300 dark:bg-paper-700 opacity-40 scale-75'}
                `}
              />
            </div>
          </div>
        );
      })}

      {/* Bottom hint — only when nothing is active */}
      {!activeSection && introComplete && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center animate-fade-in">
          <p className="text-xs text-paper-400 dark:text-paper-600 font-sans tracking-widest">
            click a section to unfold
          </p>
        </div>
      )}
    </div>
  );
}
