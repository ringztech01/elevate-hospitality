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

export default function Section({ id, number, title, desc, video, zIndex, active, isCurrent, align, delay }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoRefA = useRef<HTMLVideoElement>(null)
  const videoRefB = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [showing, setShowing] = useState(0)
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
    const a = videoRefA.current
    const b = videoRefB.current
    if (active) {
      if (showing === 0) a?.play().catch(() => {})
      else b?.play().catch(() => {})
    } else {
      a?.pause()
      b?.pause()
    }
  }, [active, showing])

  useEffect(() => {
    const activeVid = showing === 0 ? videoRefA.current : videoRefB.current
    const inactiveVid = showing === 0 ? videoRefB.current : videoRefA.current
    if (!activeVid || !inactiveVid) return

    const onTime = () => {
      if (timerRef.current) return
      if (activeVid.duration && activeVid.currentTime >= activeVid.duration - 0.5) {
        inactiveVid.currentTime = 0
        inactiveVid.play()
        setShowing(showing === 0 ? 1 : 0)

        timerRef.current = setTimeout(() => {
          activeVid.pause()
          activeVid.currentTime = 0
          timerRef.current = undefined
        }, 600)
      }
    }

    activeVid.addEventListener("timeupdate", onTime)
    return () => {
      activeVid.removeEventListener("timeupdate", onTime)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [showing, video, active])

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
              ref={videoRefA}
              muted
              playsInline
              loop={false}
              preload={active ? "auto" : "none"}
              onError={() => setVideoError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: showing === 0 ? 1 : 0, transition: "opacity 0.5s ease" }}
            >
              <source src={video} type="video/webm" />
            </video>
            <video
              ref={videoRefB}
              muted
              playsInline
              loop={false}
              preload={active ? "auto" : "none"}
              onError={() => setVideoError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: showing === 1 ? 1 : 0, transition: "opacity 0.5s ease", position: "absolute", inset: 0 }}
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
