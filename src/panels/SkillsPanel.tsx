import { skillGroups } from '../data/skills';

export function SkillsPanel() {
  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm text-ink-muted dark:text-paper-300 leading-relaxed font-sans">
        Tools and technologies I reach for when building things.
      </p>

      {skillGroups.map((group) => (
        <section key={group.category}>
          <h3 className="text-xs tracking-[0.2em] uppercase text-ink-muted dark:text-paper-500 font-sans mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-accent-fold inline-block" />
            {group.category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span
                key={skill}
                className="
                  text-sm px-3 py-1.5 rounded-md
                  bg-paper-100 text-ink
                  border border-paper-200
                  dark:bg-paper-800 dark:text-paper-100
                  dark:border-paper-600
                  hover:border-accent-crane/50 hover:bg-paper-50
                  dark:hover:bg-paper-700 dark:hover:border-accent-crane/60
                  transition-colors duration-200
                  font-sans cursor-default
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-paper-400 dark:text-paper-600 font-mono text-center pt-2">
        // Add skills in src/data/skills.ts
      </p>
    </div>
  );
}
