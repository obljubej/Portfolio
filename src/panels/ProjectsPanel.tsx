import { projects, type Project } from '../data/projects';

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border border-paper-200 dark:border-paper-600 rounded-lg p-5 hover:border-accent-crane/60 hover:shadow-md transition-all duration-300 bg-white/40 dark:bg-paper-800/65">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-lg text-ink dark:text-paper-100 group-hover:text-accent-crane transition-colors">
          {project.title}
        </h3>
        <span className="text-xs text-ink-muted dark:text-paper-400 font-mono shrink-0 mt-1">{project.year}</span>
      </div>

      <p className="text-sm text-ink-muted dark:text-paper-300 leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-paper-100 text-ink-muted border border-paper-200 dark:bg-paper-700 dark:text-paper-200 dark:border-paper-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-crane hover:underline font-sans"
          >
            Visit →
          </a>
        )}
        {project.devpostUrl && (
          <a
            href={project.devpostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-crane hover:underline font-sans"
          >
            Devpost →
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-crane hover:underline font-sans"
          >
            GitHub →
          </a>
        )}
      </div>
    </article>
  );
}

export function ProjectsPanel() {
  const featured = projects.filter((p) => p.featured);
  const rest      = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm text-ink-muted dark:text-paper-300 leading-relaxed font-sans">
        Things I've built — from hackathon sprints to long-form explorations.
      </p>

      {featured.length > 0 && (
        <section>
          <h3 className="text-xs tracking-[0.2em] uppercase text-ink-muted dark:text-paper-500 font-sans mb-3">
            Featured
          </h3>
          <div className="space-y-3">
            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h3 className="text-xs tracking-[0.2em] uppercase text-ink-muted dark:text-paper-500 font-sans mb-3">
            More
          </h3>
          <div className="space-y-3">
            {rest.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      {/* Extensibility hint */}
      <p className="text-xs text-paper-400 dark:text-paper-600 font-mono text-center pt-2">
        // Add projects in src/data/projects.ts
      </p>
    </div>
  );
}
