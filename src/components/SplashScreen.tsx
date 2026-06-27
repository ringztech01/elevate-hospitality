"use client"

import { useEffect, useRef, useState } from "react"
import ParticleCanvas from "./ParticleCanvas"

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"loading" | "closing" | "hidden">("loading")
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {})
    }

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
    }, 400)

    let timeout: ReturnType<typeof setTimeout>
    if (video) {
      const onEnd = () => {
        timeout = setTimeout(() => {
          setPhase("closing")
          setTimeout(() => {
            setPhase("hidden")
            onDone()
          }, 800)
        }, 500)
      }
      video.addEventListener("ended", onEnd)
      // fallback if video doesn't end
      timeout = setTimeout(() => {
        setPhase("closing")
        setTimeout(() => {
          setPhase("hidden")
          onDone()
        }, 800)
      }, 5000)
      return () => {
        video.removeEventListener("ended", onEnd)
        clearTimeout(timeout)
      }
    } else {
      timeout = setTimeout(() => {
        setPhase("closing")
        setTimeout(() => {
          setPhase("hidden")
          onDone()
        }, 800)
      }, 3500)
      return () => clearTimeout(timeout)
    }
  }, [onDone])

  if (phase === "hidden") return null

  return (
    <div className="splash" style={{ opacity: phase === "closing" ? 0 : 1, transition: "opacity 0.8s ease" }}>
      <div className="splash-canvas"><ParticleCanvas /></div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <video
          ref={videoRef}
          src="/splash-logo.webm"
          muted
          playsInline
          style={{
            width: "clamp(180px, 30vw, 320px)",
            height: "auto",
            display: "block",
          }}
        />
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
