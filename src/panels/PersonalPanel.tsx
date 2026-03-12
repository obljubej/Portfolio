import { origamiWorks, type OrigamiWork } from '../data/personal';

function OrigamiCard({ work }: { work: OrigamiWork }) {
  const allImages = work.images?.length ? work.images : work.imageUrl ? [work.imageUrl] : [];

  const displayImages = (() => {
    if (work.id === 'modular-wings-series') {
      const preferred = allImages.find((img) => img.includes('502720295'));
      const current = allImages.find((img) => img.includes('502303430')) ?? allImages[0];
      return [preferred, current].filter(Boolean) as string[];
    }

    return allImages.slice(0, 2);
  })();

  const isSingleImage = displayImages.length === 1;

  return (
    <article className="group border border-paper-200 dark:border-paper-600 rounded-lg p-4 hover:border-accent-crane/60 transition-all duration-300 bg-white/40 dark:bg-paper-800/65">
      {displayImages.length > 0 && (
        <div
          className={`w-full rounded-md overflow-hidden mb-3 border border-paper-200 dark:border-paper-600 bg-paper-100 dark:bg-paper-700/60 ${
            isSingleImage ? 'flex justify-center items-center p-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-1'
          }`}
        >
          {displayImages.map((image, index) => (
            <div
              key={`${work.id}-${index}`}
              className={`bg-paper-100 dark:bg-paper-700/60 ${
                isSingleImage ? 'h-[30rem] w-full max-w-3xl' : 'h-96 sm:h-[30rem]'
              }`}
            >
              <img
                src={image}
                alt={`${work.title} ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
      <h3 className="font-serif text-base text-ink dark:text-paper-100 mb-1 group-hover:text-accent-crane transition-colors">{work.title}</h3>
      <div className="flex items-center justify-between">
        <div />
        <span className="text-xs text-ink-muted dark:text-paper-400 font-mono">{work.year}</span>
      </div>
    </article>
  );
}

export function PersonalPanel() {
  return (
    <div className="space-y-6 animate-fade-in">
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
