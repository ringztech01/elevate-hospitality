"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface HeroVideoSectionProps {
  id: string
  video: string
  zIndex: number
  active: boolean
  onComplete: () => void
}

export default function HeroVideoSection({ id, video, zIndex, active, onComplete }: HeroVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const doneRef = useRef(false)
  const [showHint, setShowHint] = useState(false)

  const handleEnded = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
    setShowHint(true)
    const el = videoRef.current
    if (el) {
      el.currentTime = 0
      el.play().catch(() => {})
    }
  }, [onComplete])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.loop = false
    if (active) {
      el.play().catch(() => {})
      doneRef.current = false
      setShowHint(false)
    } else {
      el.pause()
    }
  }, [active])

  return (
    <section id={id} className="section" style={{ zIndex }}>
      <div className="section-video-wrap">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>
      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        color: showHint ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
        fontSize: "0.7rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        transition: "color 0.6s ease",
      }}>
        {showHint ? "scroll to explore" : "playing..."}
      </div>
    </section>
  )
}
