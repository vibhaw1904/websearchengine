interface SourceCardProps {
  title: string
  url: string
  index: number
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function SourceCard({ title, url, index }: SourceCardProps) {
  const domain = getDomain(url)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 py-2.5 border-b border-border hover:border-border-accent group transition-colors duration-150 cursor-pointer"
    >
      <span className="text-text-secondary font-mono text-xs w-6 shrink-0">
        [{index}]
      </span>
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
        alt=""
        width={14}
        height={14}
        className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-150"
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
        }}
      />
      <span className="text-text-primary text-sm group-hover:text-accent transition-colors duration-150 truncate flex-1 leading-snug">
        {title}
      </span>
      <span className="text-text-secondary font-mono text-xs shrink-0 hidden sm:block">
        {domain}
      </span>
    </a>
  )
}
