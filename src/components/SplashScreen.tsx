"use client"

import { useEffect, useRef, useState } from "react"
import ParticleCanvas from "./ParticleCanvas"

export default function SplashScreen({ onDone, ready }: { onDone: () => void; ready: boolean }) {
  const [phase, setPhase] = useState<"loading" | "closing" | "hidden">("loading")
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const closeStartedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})

    const onEnd = () => {
      if (closeStartedRef.current) return
      closeStartedRef.current = true
      setPhase("closing")
      setTimeout(() => {
        setPhase("hidden")
        onDone()
      }, 800)
    }
    video.addEventListener("ended", onEnd)
    return () => video.removeEventListener("ended", onEnd)
  }, [onDone])

  useEffect(() => {
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
  }, [])

  if (phase === "hidden") return null

  return (
    <div className="splash" style={{ opacity: phase === "closing" ? 0 : 1, transition: "opacity 1.2s ease" }}>
      <div className="splash-canvas"><ParticleCanvas /></div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div className="splash-video-wrap">
          <video
            ref={videoRef}
            src="/splash-video.mp4"
            muted
            playsInline
            style={{
              width: "clamp(160px, 28vw, 340px)",
              height: "auto",
              display: "block",
            }}
          />
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
