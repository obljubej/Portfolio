import { experience, type ExperienceItem } from '../data/experience';

function TimelineItem({ item, isLast }: { item: ExperienceItem; isLast: boolean }) {
  return (
    <div className="relative flex gap-5">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-accent-crane border-2 border-paper-50 mt-1.5 shrink-0" />
        {!isLast && <div className="w-px flex-1 bg-paper-200 mt-1" />}
      </div>

      {/* Content */}
      <div className={`pb-8 ${isLast ? '' : ''}`}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-1">
          <h3 className="font-serif text-base text-ink">{item.role}</h3>
          <span className="text-sm text-accent-crane font-sans">{item.company}</span>
        </div>

        <div className="flex gap-3 text-xs text-ink-muted font-mono mb-3">
          <span>{item.startDate} — {item.endDate}</span>
          {item.location && <span>· {item.location}</span>}
        </div>

        <ul className="space-y-1.5">
          {item.description.map((line, i) => (
            <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-2">
              <span className="text-paper-300 mt-1 shrink-0">—</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-paper-100 text-ink-muted border border-paper-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExperiencePanel() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-ink-muted leading-relaxed font-sans">
        Where I've worked and what I've built along the way.
      </p>

      {experience.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          <p className="font-serif text-lg mb-2">Coming soon</p>
          <p className="text-xs font-mono text-paper-400">// Add entries in src/data/experience.ts</p>
        </div>
      ) : (
        <div className="mt-4">
          {experience.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={i === experience.length - 1}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-paper-400 font-mono text-center pt-2">
        // Add experience in src/data/experience.ts
      </p>
    </div>
  );
}
