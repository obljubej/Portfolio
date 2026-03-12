// Resume PDF is served from the public directory.
// Copy Data/resume_updated.pdf → portfolio/public/resume.pdf
// Use BASE_URL so it works in GitHub Pages project paths.
const RESUME_PATH = `${import.meta.env.BASE_URL}resume.pdf`;

export function ResumePanel() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Inline PDF viewer */}
      <div className="rounded-lg overflow-hidden border border-paper-300 dark:border-paper-500 shadow-sm bg-white dark:bg-paper-100">
        <iframe
          src={`${RESUME_PATH}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`}
          title="Resume"
          className="w-full bg-white"
          style={{ height: '72vh', minHeight: '520px' }}
        />
      </div>

      {/* Download button */}
      <a
        href={RESUME_PATH}
        download="Joshua_Resume.pdf"
        className="
          inline-flex items-center gap-2
          px-5 py-2.5 rounded-lg
          bg-ink text-paper-50
          hover:bg-ink-light
          transition-colors duration-200
          font-sans text-sm
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PDF
      </a>

    </div>
  );
}
