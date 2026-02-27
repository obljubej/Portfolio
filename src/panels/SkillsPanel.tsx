import { skillGroups } from '../data/skills';

export function SkillsPanel() {
  return (
    <div className="space-y-6 animate-fade-in">
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

    </div>
  );
}
