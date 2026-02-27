import { useState } from 'react';
import { projects, type Project } from '../data/projects';

interface ProjectsPanelProps {
  onSelectProject?: (projectId: string) => void;
  selectedProjectId?: string;
}

function ProjectCard({
  project,
  onSelectProject,
  selected,
}: {
  project: Project;
  onSelectProject?: (projectId: string) => void;
  selected: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = !onSelectProject && Boolean(project.longDescription);

  return (
    <article
      className={`group border rounded-lg p-5 hover:border-accent-crane/60 hover:shadow-md transition-all duration-300 bg-white/40 dark:bg-paper-800/65 ${selected
        ? 'border-accent-crane/60 shadow-md'
        : 'border-paper-200 dark:border-paper-600'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-lg text-ink dark:text-paper-100 group-hover:text-accent-crane transition-colors">
          {project.title}
        </h3>
        <span className="text-xs text-ink-muted dark:text-paper-400 font-mono shrink-0 mt-1">{project.year}</span>
      </div>

      <p className="text-sm text-ink-muted dark:text-paper-300 leading-relaxed mb-4">
        {project.description}
      </p>

      {canExpand && expanded && (
        <p className="text-sm text-ink-muted dark:text-paper-300 leading-relaxed mb-4 border-l-2 border-paper-200 dark:border-paper-600 pl-3">
          {project.longDescription}
        </p>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {canExpand && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-accent-crane hover:underline font-sans"
          >
            {expanded ? 'Hide details ↑' : 'Read more ↓'}
          </button>
        )}
        {onSelectProject && (
          <button
            onClick={() => onSelectProject(project.id)}
            className="text-xs text-accent-crane hover:underline font-sans"
          >
            View details ↓
          </button>
        )}
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

export function ProjectsPanel({ onSelectProject, selectedProjectId }: ProjectsPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onSelectProject={onSelectProject}
            selected={selectedProjectId === p.id}
          />
        ))}
      </div>
    </div>
  );
}
