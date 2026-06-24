"use client"

import { useEffect, useRef, useState } from "react"
import { registerTargets } from "@/lib/scrollAnimate"
import ParticleCanvas from "./ParticleCanvas"

interface StatementSectionProps {
  id: string
  lines: string[]
  zIndex: number
  active: boolean
}

export default function StatementSection({ id, lines, zIndex, active }: StatementSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (active && !entered) {
      const raf = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(raf)
    }
  }, [active, entered])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const cleanup = registerTargets({
      section: el,
      reveal: bgRef.current,
      video: null,
      isStatement: true,
    })
    return cleanup
  }, [])

  return (
    <section id={id} ref={sectionRef} className={`statement${entered ? " entered" : ""}`} style={{ zIndex }}>
      <div ref={bgRef} className="statement-bg" style={{ clipPath: "circle(0% at 50% 50%)", willChange: "clip-path", background: "#000" }}>
        <ParticleCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>
      <div className="statement-content">
        {lines.map((line, i) => (
          <p key={i} className="statement-line">
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}
