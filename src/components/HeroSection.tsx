"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  isCurrent: boolean
  pinFrame: boolean
  replayArmed: boolean
  onComplete?: () => void
}

const COMPLETE_AT = 0.999

export default function HeroSection({ containerRef, isCurrent, pinFrame, replayArmed, onComplete }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const completedRef = useRef(false)
  const rawProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const touchStartRef = useRef(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [rightEntered, setRightEntered] = useState(false)
  const [rightExited, setRightExited] = useState(false)
  const [centerEntered, setCenterEntered] = useState(false)
  const [centerExited, setCenterExited] = useState(false)
  const [topRightEntered, setTopRightEntered] = useState(false)
  const rafIdRef = useRef(0)
  const pinFrameRef = useRef(pinFrame)
  pinFrameRef.current = pinFrame

  const resetHeroPlayback = () => {
    completedRef.current = false
    rawProgressRef.current = 0
    smoothProgressRef.current = 0
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
    if (rawProgressRef.current >= COMPLETE_AT && !completedRef.current) {
      rawProgressRef.current = 1
      smoothProgressRef.current = 1
      if (videoRef.current) videoRef.current.currentTime = videoRef.current.duration
      completedRef.current = true
      pinFrameRef.current = true
      onComplete?.()
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
      e.preventDefault()
      if (completedRef.current) return
      accumulateScroll(e.deltaY)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (completedRef.current) return
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
      e.preventDefault()
      if (completedRef.current) return
      const delta = e.touches[0].clientY - touchStartRef.current
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
    const el = containerRef?.current
    if (!el) return
    const video = videoRef.current
    if (!video) return

    const tick = () => {
      let target: number
      if (!completedRef.current) {
        target = rawProgressRef.current
      } else if (pinFrameRef.current) {
        target = 1
      } else {
        const vh = window.innerHeight
        target = Math.min(1, el.scrollTop / vh)
      }

      smoothProgressRef.current += (target - smoothProgressRef.current) * 0.1
      if (isCurrent) setDisplayProgress(smoothProgressRef.current)

      if (video.duration && isFinite(video.duration)) {
        video.currentTime = smoothProgressRef.current * video.duration
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafIdRef.current)
  }, [containerRef, isCurrent])

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
    <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src="/hero.webm"
        muted
        playsInline
        preload="auto"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div className="hero-overlay" />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.15) 85%, #000 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <div className="hero-text-left" style={{
        position: "absolute",
        bottom: "12vh",
        left: "2rem",
        zIndex: 2,
        maxWidth: "520px",
        pointerEvents: "none",
        opacity: Math.min(1, Math.max(0, (0.279 - displayProgress) / 0.1)),
        transition: "opacity 0.2s ease",
      }}>
        <p style={{
          fontSize: "36px",
          fontWeight: 300,
          textTransform: "capitalize",
          lineHeight: 1.6,
          color: "#fff",
          margin: 0,
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}>
          they build space,<br />we elevate experiences.
        </p>
      </div>
      <div className="hero-text-right" style={{
        position: "absolute",
        bottom: "42vh",
        right: "2rem",
        zIndex: 2,
        maxWidth: "520px",
        pointerEvents: "none",
        textAlign: "right",
        opacity: rightExited ? 0 : (rightEntered ? 1 : 0),
        transform: rightEntered ? "translateY(0)" : "translateY(20px)",
        transition: rightExited ? "opacity 0.4s ease" : "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        {["every surface tells a story,", "every corner holds intent.", "craft is the thread", "that ties vision to space."].map((line, i) => (
          <p key={i} style={{
            fontSize: "24px",
            fontWeight: 300,
            textTransform: "capitalize",
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
      </div>
      <div className="hero-text-center" style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 2,
        maxWidth: "360px",
        width: "20%",
        pointerEvents: "none",
        textAlign: "center",
        opacity: centerExited ? 0 : (centerEntered ? 1 : 0),
        transform: centerEntered ? "translate(-50%, -50%)" : "translate(-50%, calc(-50% + 20px))",
        transition: centerExited ? "opacity 0.4s ease" : "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        {["we design, build and operate", "luxury hospitality spaces."].map((line, i) => (
          <p key={i} style={{
            fontSize: "24px",
            fontWeight: 300,
            textTransform: "capitalize",
            lineHeight: 1.6,
            color: "#fff",
            margin: 0,
            textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            opacity: centerEntered ? 1 : 0,
            transform: centerEntered ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
          }}>
            {line}
          </p>
        ))}
      </div>
      <div className="hero-text-right" style={{
        position: "absolute",
        bottom: "48vh",
        right: "2rem",
        zIndex: 2,
        maxWidth: "520px",
        pointerEvents: "none",
        textAlign: "right",
        opacity: topRightEntered ? 1 : 0,
        transform: topRightEntered ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        <p style={{
          fontSize: "24px",
          fontWeight: 300,
          textTransform: "capitalize",
          lineHeight: 1.6,
          color: "#fff",
          margin: 0,
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}>
          from first concept to final handover,<br />every decision is intentional,<br />every detail deliberate.
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
