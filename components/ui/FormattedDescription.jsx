export default function FormattedDescription({ text }) {
  if (!text) return null

  const lines = String(text).split('\n')
  const listItems = []
  const paragraphs = []
  let currentParagraph = []

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('\u2022')) {
      if (currentParagraph.length) {
        paragraphs.push(currentParagraph.join(' '))
        currentParagraph = []
      }
      listItems.push(trimmed.replace(/^[-*\u2022]\s*/, ''))
    } else if (trimmed) {
      currentParagraph.push(trimmed)
    } else if (currentParagraph.length) {
      paragraphs.push(currentParagraph.join(' '))
      currentParagraph = []
    }
  })

  if (currentParagraph.length) {
    paragraphs.push(currentParagraph.join(' '))
  }

  return (
    <div className="text-secondary font-body text-sm leading-[1.7]">
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>{p}</p>
      ))}
      {listItems.length > 0 && (
        <ul className="mt-2 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 bg-secondary rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
