"use client"

interface NavDotsProps {
  current: number
  slides: { type: string; id?: string }[]
  onClick: (index: number) => void
  aboutMode?: boolean
}

const fullDots = [1, 3, 5, 7, 9, 11, 13, 15, 16, 17]
const aboutDots = [1, 3, 5, 7, 9, 11, 16, 17]

export default function NavDots({ current, slides, onClick, aboutMode }: NavDotsProps) {
  const dots = aboutMode ? aboutDots : fullDots
  return (
    <div className="nav-dots">
      {dots.map((idx, i) => (
        <button
          key={i}
          className={`nav-dot ${current === idx ? "active" : ""}`}
          onClick={() => onClick(idx)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  )
}
