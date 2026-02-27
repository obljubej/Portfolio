import { personalInfo, origamiWorks, type OrigamiWork } from '../data/personal';

function OrigamiCard({ work }: { work: OrigamiWork }) {
  return (
    <article className="border border-paper-200 rounded-lg p-4 hover:border-accent-crane/60 transition-colors bg-white/40">
      {work.imageUrl && (
        <div className="w-full h-36 rounded-md overflow-hidden mb-3 bg-paper-100">
          <img
            src={work.imageUrl}
            alt={work.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="font-serif text-base text-ink mb-1">{work.title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed mb-2">{work.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {work.tags?.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-paper-100 text-ink-muted border border-paper-200">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-ink-muted font-mono">{work.year}</span>
      </div>
    </article>
  );
}

export function PersonalPanel() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bio */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-paper-200 flex items-center justify-center text-ink font-serif text-lg">
            {personalInfo.name[0]}
          </div>
          <div>
            <p className="font-serif text-ink">{personalInfo.name}</p>
            <p className="text-xs text-ink-muted font-sans">{personalInfo.location}</p>
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed font-sans">
          {personalInfo.bio}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {personalInfo.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-crane hover:underline font-sans"
            >
              GitHub →
            </a>
          )}
          {personalInfo.devpost && (
            <a
              href={personalInfo.devpost}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-crane hover:underline font-sans"
            >
              Devpost →
            </a>
          )}
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-crane hover:underline font-sans"
            >
              LinkedIn →
            </a>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-paper-200" />
        <span className="text-xs text-ink-muted font-sans tracking-widest">折り紙</span>
        <div className="flex-1 h-px bg-paper-200" />
      </div>

      {/* Origami works */}
      {origamiWorks.length === 0 ? (
        <div className="text-center py-8 text-ink-muted">
          <p className="font-serif text-lg mb-1">Origami works</p>
          <p className="text-sm text-ink-muted mb-4">
            A space for paper folding — crease patterns, models, and explorations.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {origamiWorks.map((work) => (
            <OrigamiCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  );
}
