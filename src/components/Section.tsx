"use client"

import { useEffect, useRef, useState } from "react"
import { registerTargets } from "@/lib/scrollAnimate"

interface SectionProps {
  id: string
  number: string
  title: string
  desc: string | string[]
  video: string
  image?: string
  zIndex: number
  active: boolean
  isCurrent: boolean
  align?: "left" | "right" | "right-block"
  delay?: number
  loop?: boolean
  exitDir?: "left" | "right"
}

export default function Section({ id, number, title, desc, video, image, zIndex, active, isCurrent, align, delay, exitDir = "left" }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const edgeRef = useRef<HTMLDivElement>(null)
  const videoRefA = useRef<HTMLVideoElement>(null)
  const videoRefB = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [showing, setShowing] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  const [entered, setEntered] = useState(false)
  const retryCount = useRef(0)
  const retryTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

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
      content: contentRef.current,
      edge: edgeRef.current,
      isStatement: false,
      slide: {
        el: videoWrapRef.current!,
        exitDir,
        offset: 600,
      },
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
        inactiveVid.play().catch(() => {})
        setShowing(showing === 0 ? 1 : 0)

        timerRef.current = setTimeout(() => {
          try { activeVid.pause() } catch {}
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

  useEffect(() => {
    return () => { clearTimeout(retryTimer.current) }
  }, [])

  return (
    <section id={id} ref={sectionRef} className="section" style={{ zIndex }}>
      <div className="section-video-wrap">
        <div ref={videoWrapRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
          {image ? (
            <img src={image} alt="" loading="eager" decoding="async" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <video
                ref={videoRefA}
                muted
                playsInline
                loop={false}
                preload={active ? "auto" : "metadata"}
                onError={() => {
                  retryCount.current++
                  if (retryCount.current < 3) {
                    retryTimer.current = setTimeout(() => {
                      videoRefA.current?.load()
                      videoRefB.current?.load()
                    }, 2000 * retryCount.current)
                  } else {
                    setVideoFailed(true)
                  }
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: showing === 0 ? 1 : 0, transition: "opacity 0.5s ease" }}
              >
                <source src={video} type="video/webm" />
              </video>
              <video
                ref={videoRefB}
                muted
                playsInline
                loop={false}
                preload={active ? "auto" : "metadata"}
                onError={() => {
                  retryCount.current++
                  if (retryCount.current < 3) {
                    retryTimer.current = setTimeout(() => {
                      videoRefA.current?.load()
                      videoRefB.current?.load()
                    }, 2000 * retryCount.current)
                  } else {
                    setVideoFailed(true)
                  }
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: showing === 1 ? 1 : 0, transition: "opacity 0.5s ease", position: "absolute", inset: 0 }}
              >
                <source src={video} type="video/webm" />
              </video>
            </>
          )}
        </div>
        {videoFailed && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "#0a0a0a", color: "#333", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {video}
          </div>
        )}
      </div>
      <div ref={edgeRef} style={{
        position: "absolute",
        inset: 0,
        background: [
          "linear-gradient(to right, black 0%, rgba(0,0,0,0.9) 6%, rgba(0,0,0,0.45) 18%, transparent 32%, transparent 68%, rgba(0,0,0,0.45) 82%, rgba(0,0,0,0.9) 94%, black 100%)",
          "linear-gradient(to bottom, black 0%, transparent 14%, transparent 86%, black 100%)",
        ].join(", "),
        opacity: 1,
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <div ref={revealRef} className="section-reveal" style={{ clipPath: "circle(0% at 50% 50%)", willChange: "clip-path" }}>
        <div className="section-reveal-overlay" />
      </div>
      <div ref={contentRef} className={`section-content${entered ? " entered" : ""}`} style={
        align === "right" ? { textAlign: "right", marginLeft: "30%" } :
        align === "right-block" ? { textAlign: "left", marginLeft: "auto", paddingRight: "2rem" } :
        align === "left" ? { textAlign: "left", marginRight: "auto", paddingLeft: "8rem" } :
        undefined
      }>
        <h2 className="section-title">{title}</h2>
        {Array.isArray(desc) ? desc.map((line, i) => <p key={i} className="section-desc">{line}</p>) : <p className="section-desc">{desc}</p>}
      </div>
    </section>
  )
}
