"use client"

interface NavDotsProps {
  current: number
  slides: { type: string; id?: string }[]
  onClick: (index: number) => void
}

export default function NavDots({ current, slides, onClick }: NavDotsProps) {
  const dotSlides = slides
    .map((s, i) => ({ index: i, id: s.id }))
    .filter((s) => s.id && !s.id.startsWith("statement-"))

  return (
    <div className="nav-dots">
      {dotSlides.map((s, i) => (
        <button
          key={s.id}
          className={`nav-dot ${current === s.index ? "active" : ""}`}
          onClick={() => onClick(s.index)}
          aria-label={`Go to ${s.id}`}
        />
      ))}
    </div>
  )
}
