"use client"

import { useEffect, useRef, useState } from "react"
import { registerTargets } from "@/lib/scrollAnimate"

interface SectionProps {
  id: string
  number: string
  title: string
  desc: string
  video: string
  zIndex: number
  active: boolean
  isCurrent: boolean
  align?: "left" | "right"
  delay?: number
  loop?: boolean
}

export default function Section({ id, number, title, desc, video, zIndex, active, isCurrent, align, delay, loop }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (isCurrent && !entered) {
      const timer = setTimeout(() => setEntered(true), delay || 0)
      return () => clearTimeout(timer)
    }
  }, [isCurrent, entered, delay])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const cleanup = registerTargets({
      section: el,
      reveal: revealRef.current,
      video: videoWrapRef.current,
      isStatement: false,
    })
    return cleanup
  }, [])

  useEffect(() => {
    if (!videoRef.current) return
    if (active) videoRef.current.play().catch(() => {})
    else videoRef.current.pause()
  }, [active])

  return (
    <section id={id} ref={sectionRef} className="section" style={{ zIndex }}>
      <div className="section-video-wrap">
        {videoError ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111",
              color: "#444",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Add Video: {video}
          </div>
        ) : (
          <div ref={videoWrapRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
            <video
              ref={videoRef}
              muted
              playsInline
              loop={loop !== false}
              preload={active ? "auto" : "none"}
              onError={() => setVideoError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={video} type="video/webm" />
            </video>
          </div>
        )}
      </div>
      <div ref={revealRef} className="section-reveal" style={{ clipPath: "circle(0% at 50% 50%)", willChange: "clip-path" }}>
        <div className="section-reveal-overlay" />
      </div>
      <div className={`section-content${entered ? " entered" : ""}`} style={
        align === "right" ? { textAlign: "right", marginLeft: "auto", paddingRight: "4rem" } :
        align === "left" ? { textAlign: "left", marginRight: "auto", paddingLeft: "8rem" } :
        undefined
      }>
        <h2 className="section-title">{title}</h2>
        <p className="section-desc">{desc}</p>
      </div>
    </section>
  )
}
