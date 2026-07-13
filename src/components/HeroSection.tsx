"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface HeroSectionProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  isCurrent: boolean
  pinFrame: boolean
  replayArmed: boolean
  onComplete?: () => void
  onReady?: () => void
}

const COMPLETE_AT = 0.999

export default function HeroSection({ containerRef, isCurrent, pinFrame, replayArmed, onComplete, onReady }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const completedRef = useRef(false)
  const rawProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const touchStartRef = useRef(0)
  const lastVideoTimeRef = useRef(-1)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [scrubbing, setScrubbing] = useState(true)
  const [rightEntered, setRightEntered] = useState(false)
  const [rightExited, setRightExited] = useState(false)
  const [centerEntered, setCenterEntered] = useState(false)
  const [centerExited, setCenterExited] = useState(false)
  const [topRightEntered, setTopRightEntered] = useState(false)
  const [videoSrc, setVideoSrc] = useState("/hero-desktop.mp4")
  const rafIdRef = useRef(0)
  const pinFrameRef = useRef(pinFrame)
  const wasCurrentRef = useRef(false)
  const readyFiredRef = useRef(false)
  const lastDisplayRef = useRef(-1)
  const completionPendingRef = useRef(false)
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  pinFrameRef.current = pinFrame

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const update = () => setVideoSrc(mql.matches ? "/hero-mobile.mp4" : "/hero-desktop.mp4")
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || readyFiredRef.current) return
    const fireReady = () => {
      if (readyFiredRef.current) return
      readyFiredRef.current = true
      onReady?.()
    }
    video.addEventListener("canplaythrough", fireReady)
    video.addEventListener("loadeddata", fireReady)
    if (video.readyState >= 3) fireReady()
    video.load()
    const fallbackTimer = setTimeout(fireReady, 5000)
    return () => {
      video.removeEventListener("canplaythrough", fireReady)
      video.removeEventListener("loadeddata", fireReady)
      clearTimeout(fallbackTimer)
    }
  }, [onReady])

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (isCurrent && completedRef.current && !wasCurrentRef.current) {
      resetHeroPlayback()
    }
    wasCurrentRef.current = isCurrent
  }, [isCurrent])

  const resetHeroPlayback = () => {
    completedRef.current = false
    completionPendingRef.current = false
    setScrubbing(true)
    rawProgressRef.current = 0
    smoothProgressRef.current = 0
    lastVideoTimeRef.current = -1
    setRightEntered(false)
    setRightExited(false)
    setCenterEntered(false)
    setCenterExited(false)
    setTopRightEntered(false)
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  const accumulateScroll = useCallback((delta: number) => {
    if (completedRef.current) return
    const vh = window.innerHeight
    rawProgressRef.current = Math.max(0, Math.min(1, rawProgressRef.current + delta / vh))
    if (rawProgressRef.current >= COMPLETE_AT && !completedRef.current && !completionPendingRef.current) {
      rawProgressRef.current = 1
      smoothProgressRef.current = 1
      completionPendingRef.current = true
      cooldownTimerRef.current = setTimeout(() => {
        lastVideoTimeRef.current = -1
        if (videoRef.current) videoRef.current.currentTime = videoRef.current.duration
        completedRef.current = true
        setScrubbing(false)
        pinFrameRef.current = true
        onComplete?.()
      }, 500)
      return
    }
  }, [onComplete])

  useEffect(() => {
    const el = containerRef?.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (replayArmed && completedRef.current && !pinFrameRef.current) {
        const atTop = containerRef.current ? containerRef.current.scrollTop <= 1 : false
        if (atTop && e.deltaY > 0) {
          resetHeroPlayback()
          e.preventDefault()
          return
        }
      }

      if (completedRef.current && !pinFrameRef.current) return
      if (completionPendingRef.current) { e.preventDefault(); return }
      if (e.deltaY < 0 && rawProgressRef.current <= 0) return
      e.preventDefault()
      if (completedRef.current) return
      accumulateScroll(e.deltaY)
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (replayArmed && completedRef.current && !pinFrameRef.current) {
        const atTop = containerRef.current ? containerRef.current.scrollTop <= 1 : false
        if (atTop && e.touches[0].clientY < touchStartRef.current) {
          resetHeroPlayback()
          e.preventDefault()
          touchStartRef.current = e.touches[0].clientY
          return
        }
      }

      if (completedRef.current && !pinFrameRef.current) return
      if (completionPendingRef.current) { e.preventDefault(); return }
      const delta = touchStartRef.current - e.touches[0].clientY
      if (delta < 0 && rawProgressRef.current <= 0) return
      e.preventDefault()
      if (completedRef.current) return
      touchStartRef.current = e.touches[0].clientY
      accumulateScroll(delta)
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
    }
  }, [containerRef, accumulateScroll])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const SEEK_DEADZONE = 0.015

    const tick = () => {
      const target = completedRef.current ? 1 : rawProgressRef.current

      smoothProgressRef.current += (target - smoothProgressRef.current) * 0.4
      if (isCurrent) {
        const val = smoothProgressRef.current
        if (Math.abs(val - lastDisplayRef.current) > 0.002) {
          setDisplayProgress(val)
          lastDisplayRef.current = val
        }
      }

      if (video.duration && isFinite(video.duration)) {
        const seekTo = target * video.duration
        if (Math.abs(seekTo - lastVideoTimeRef.current) > SEEK_DEADZONE) {
          video.currentTime = seekTo
          lastVideoTimeRef.current = seekTo
        }
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(rafIdRef.current); lastVideoTimeRef.current = -1 }
  }, [containerRef, isCurrent])

  const problemLines = useMemo(() => ["Most projects change hands three times.", "Architect to contractor. Contractor to operator.", "Something is lost at every handover."], [])
  const designLines = useMemo(() => ["A banquette is a seating plan.", "A service corridor is a labour cost.", "A ceiling height is an acoustic budget."], [])
  const processColumns = useMemo(() => [
    { title: "Design.", desc: "Concept, interior architecture, fit-out documentation." },
    { title: "Build.", desc: "Procurement, main works, MEP coordination, snagging, handover." },
    { title: "Operate.", desc: "Pre-opening, staffing, systems, launch, ongoing performance." },
  ], [])

  useEffect(() => {
    const shouldRightEnter = displayProgress >= 0.279 && displayProgress < 0.488
    const shouldRightExit = displayProgress >= 0.488
    if (shouldRightEnter && !rightEntered) setRightEntered(true)
    if (!shouldRightEnter && rightEntered) setRightEntered(false)
    if (shouldRightExit && !rightExited) setRightExited(true)
    if (!shouldRightExit && rightExited) setRightExited(false)

    const shouldCenterEnter = displayProgress >= 0.510 && displayProgress < 0.665
    const shouldCenterExit = displayProgress >= 0.665
    if (shouldCenterEnter && !centerEntered) setCenterEntered(true)
    if (!shouldCenterEnter && centerEntered) setCenterEntered(false)
    if (shouldCenterExit && !centerExited) setCenterExited(true)
    if (!shouldCenterExit && centerExited) setCenterExited(false)

    const shouldTopRightEnter = displayProgress >= 0.798
    if (shouldTopRightEnter && !topRightEntered) setTopRightEntered(true)
    if (!shouldTopRightEnter && topRightEntered) setTopRightEntered(false)
  }, [displayProgress])

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", touchAction: scrubbing ? "none" : "auto", background: "radial-gradient(ellipse at 50% 50%, #0a0a0a 0%, #050505 100%)" }}>
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
      />
      <div className="hero-overlay" />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <div className="hero-text-left" style={{
        position: "absolute",
        bottom: "12vh",
        left: "2rem",
        zIndex: 2,
        maxWidth: "580px",
        pointerEvents: "none",
        opacity: Math.min(1, Math.max(0, (0.279 - displayProgress) / 0.1)),
        transition: "opacity 0.2s ease",
      }}>
        <p style={{
          fontSize: "36px",
          fontWeight: 300,
          lineHeight: 1.4,
          color: "#fff",
          margin: "0 0 0.5rem 0",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}>
          We never hand over. Because we never leave.
        </p>
        <p style={{
          fontSize: "20px",
          fontWeight: 300,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.65)",
          margin: 0,
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}>
          Design, build and operate — one team from first sketch to first service and beyond.
        </p>
      </div>
      <div className="hero-text-right" style={{
        position: "absolute",
        bottom: "40vh",
        left: "2rem",
        zIndex: 2,
        maxWidth: "520px",
        pointerEvents: "none",
        textAlign: "left",
        opacity: rightExited ? 0 : (rightEntered ? 1 : 0),
        transform: rightEntered ? "translateY(0)" : "translateY(20px)",
        transition: rightExited ? "opacity 0.4s ease" : "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        <p style={{
          fontSize: "14px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          margin: "0 0 0.75rem 0",
        }}>
          The problem we solve
        </p>
        {problemLines.map((line, i) => (
          <p key={i} style={{
            fontSize: "22px",
            fontWeight: 300,
            lineHeight: 1.6,
            color: "#fff",
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            opacity: rightEntered ? 1 : 0,
            transform: rightEntered ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
          }}>
            {line}
          </p>
        ))}
        <p style={{
          fontSize: "22px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#fff",
          margin: "0.5rem 0 0 0",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          opacity: rightEntered ? 1 : 0,
          transform: rightEntered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}>
          We never hand over.
        </p>
      </div>
      <div className="hero-text-center" style={{
        position: "absolute",
        top: "50%",
        right: "2rem",
        zIndex: 2,
        maxWidth: "520px",
        pointerEvents: "none",
        textAlign: "left",
        opacity: centerExited ? 0 : (centerEntered ? 1 : 0),
        transform: centerEntered ? "translateY(-50%)" : "translateY(calc(-50% + 20px))",
        transition: centerExited ? "opacity 0.4s ease" : "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        <p style={{
          fontSize: "14px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          margin: "0 0 0.75rem 0",
          textShadow: "0 2px 12px rgba(0,0,0,0.95)",
        }}>
          Where design meets service
        </p>
        {designLines.map((line, i) => (
          <p key={i} style={{
            fontSize: "22px",
            fontWeight: 300,
            lineHeight: 1.6,
            color: "#fff",
            margin: 0,
            textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 4px 32px rgba(0,0,0,0.8)",
            opacity: centerEntered ? 1 : 0,
            transform: centerEntered ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
          }}>
            {line}
          </p>
        ))}
        <p style={{
          fontSize: "22px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#fff",
          margin: "0.5rem 0 0 0",
          textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 4px 32px rgba(0,0,0,0.8)",
          opacity: centerEntered ? 1 : 0,
          transform: centerEntered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}>
          We design spaces the way we run them.
        </p>
      </div>
      <div className="hero-text-right" style={{
        position: "absolute",
        bottom: "40vh",
        left: "0",
        right: "0",
        zIndex: 2,
        padding: "0 4rem",
        pointerEvents: "none",
        textAlign: "left",
        opacity: topRightEntered ? 1 : 0,
        transform: topRightEntered ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        <p style={{
          fontSize: "14px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          margin: "0 0 1.25rem 0",
        }}>
          Our process
        </p>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "4rem",
        }}>
          {processColumns.map((col, i) => (
            <div key={i} style={{
              flex: 1,
              opacity: topRightEntered ? 1 : 0,
              transform: topRightEntered ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
            }}>
              <p style={{
                fontSize: "22px",
                fontWeight: 500,
                color: "#fff",
                margin: "0 0 0.4rem 0",
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}>
                {col.title}
              </p>
              <p style={{
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}>
                {col.desc}
              </p>
            </div>
          ))}
        </div>
        <p style={{
          fontSize: "18px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.8)",
          margin: "1.5rem 0 0 0",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          opacity: topRightEntered ? 1 : 0,
          transform: topRightEntered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s",
        }}>
          One contract. One accountable party.
        </p>
      </div>
      <div style={{
        position: "absolute",
        bottom: "4vh",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        opacity: Math.max(0, 1 - displayProgress * 8),
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}>
        <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>scroll</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ animation: "bounce 2s ease-in-out infinite" }}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
