interface FollowUpQuestionsProps {
  questions: string[]
  onSelect: (q: string) => void
}

export default function FollowUpQuestions({
  questions,
  onSelect,
}: FollowUpQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <div className="mt-8 fade-in">
      <p className="text-text-secondary text-xs font-mono uppercase tracking-widest mb-3">
        Related
      </p>
      <div className="flex flex-col gap-0.5">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left text-text-secondary text-sm font-mono hover:text-accent transition-colors duration-150 py-1.5 flex items-center gap-2 group"
          >
            <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
              ›
            </span>
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
