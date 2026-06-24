"use client"

import Image from "next/image"

interface NavbarProps {
  current: number
  slides: { type: string; id?: string }[]
  onClick: (index: number) => void
}

const labels = ["Concept", "Design", "Build", "Completion", "Realization", "Operate", "Portfolio", "Team", "Contact"]

export default function Navbar({ current, slides, onClick }: NavbarProps) {
  const dotSlides = slides
    .map((s, i) => ({ index: i }))
    .filter((_, i) => slides[i].id && !slides[i].id!.startsWith("statement-"))

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => onClick(0)}>
        <Image
          alt="Elevate"
          src="/logo.png"
          width={40}
          height={40}
          style={{ borderRadius: "50%", opacity: 0.9 }}
        />
        Elevate
      </div>

      <div className="navbar-links">
        {dotSlides.map((s, i) => (
          <button
            key={i}
            className={current === s.index ? "active" : ""}
            onClick={() => onClick(s.index)}
          >
            {labels[i]}
          </button>
        ))}
      </div>

      <button className="navbar-mobile" onClick={() => {
        const next = dotSlides.find(s => s.index > current)
        onClick(next ? next.index : dotSlides[0].index)
      }}>
        Menu
      </button>
    </nav>
  )
}
