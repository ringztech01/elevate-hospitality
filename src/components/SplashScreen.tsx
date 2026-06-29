"use client"

import { useEffect, useRef, useState } from "react"
import ParticleCanvas from "./ParticleCanvas"

export default function SplashScreen({ onDone, ready }: { onDone: () => void; ready: boolean }) {
  const [phase, setPhase] = useState<"loading" | "closing" | "hidden">("loading")
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const closeStartedRef = useRef(false)
  const mountTime = useRef(Date.now())

  useEffect(() => {
    if (ready && !closeStartedRef.current) {
      const elapsed = Date.now() - mountTime.current
      const delay = Math.max(0, 3500 - elapsed)
      const t = setTimeout(() => {
        closeStartedRef.current = true
        setPhase("closing")
        setTimeout(() => {
          setPhase("hidden")
          onDone()
        }, 800)
      }, delay)
      return () => clearTimeout(t)
    }
  }, [ready, onDone])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})

    let rafId: number
    const tick = () => {
      if (video.readyState >= 2 && video.duration) {
        const nearEnd = video.currentTime >= video.duration - 0.12
        const nearStart = video.currentTime < 0.08
        if (nearEnd) {
          video.style.transition = "opacity 0.12s linear"
          video.style.opacity = "0"
        } else if (nearStart) {
          video.style.transition = "opacity 0.12s linear"
          video.style.opacity = "1"
        } else {
          video.style.opacity = "1"
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

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

    return () => cancelAnimationFrame(rafId)
  }, [])

  if (phase === "hidden") return null

  return (
    <div className="splash" style={{ opacity: phase === "closing" ? 0 : 1, transition: "opacity 0.8s ease" }}>
      <div className="splash-canvas"><ParticleCanvas /></div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <video
          ref={videoRef}
          src="/splash-video.mp4"
          muted
          playsInline
          loop
          style={{
            width: "clamp(160px, 28vw, 340px)",
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
