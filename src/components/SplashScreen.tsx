"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import ParticleCanvas from "./ParticleCanvas"

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"loading" | "closing" | "hidden">("loading")
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        logoRef.current.style.opacity = "1"
        logoRef.current.style.transform = "translateY(0)"
      }
    }, 100)

    setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.transition = "width 1.8s cubic-bezier(0.25, 0.1, 0.25, 1)"
        barRef.current.style.width = "120px"
      }
      if (labelRef.current) {
        labelRef.current.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        labelRef.current.style.opacity = "1"
        labelRef.current.style.transform = "translateY(0)"
      }
    }, 300)

    setTimeout(() => {
      setPhase("closing")
      setTimeout(() => {
        setPhase("hidden")
        onDone()
      }, 800)
    }, 2800)
  }, [onDone])

  if (phase === "hidden") return null

  return (
    <div
      className="splash"
      style={{ opacity: phase === "closing" ? 0 : 1, transition: "opacity 0.8s ease" }}
    >
      <div className="splash-canvas">
        <ParticleCanvas />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, zIndex: 1 }}>
        <div ref={logoRef} style={{ opacity: 0, transform: "translateY(8px)" }}>
          <Image alt="Elevate" src="/ELEVATE.png" width={260} height={260} style={{ opacity: 0.9 }} />
        </div>
        <div ref={barRef} className="splash-bar" style={{ width: 0 }} />
        <div
          ref={labelRef}
          className="splash-label"
          style={{ opacity: 0, transform: "translateY(8px)" }}
        >
          Hospitality&nbsp;&nbsp;·&nbsp;&nbsp;Design&nbsp;&nbsp;·&nbsp;&nbsp;Build&nbsp;&nbsp;·&nbsp;&nbsp;Operate
        </div>
      </div>
    </div>
  )
}
