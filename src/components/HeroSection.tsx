"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"

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
  const targetRef = useRef(0)
  const progressProxy = useRef({ value: 0 })
  const gsapTween = useRef<gsap.core.Tween | null>(null)
  const touchStartRef = useRef(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [scrubbing, setScrubbing] = useState(true)
  const [rightEntered, setRightEntered] = useState(false)
  const [rightExited, setRightExited] = useState(false)
  const [centerEntered, setCenterEntered] = useState(false)
  const [centerExited, setCenterExited] = useState(false)
  const [topRightEntered, setTopRightEntered] = useState(false)
  const pinFrameRef = useRef(pinFrame)
  const wasCurrentRef = useRef(false)
  const readyFiredRef = useRef(false)
  pinFrameRef.current = pinFrame

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
    if (isCurrent && completedRef.current && !wasCurrentRef.current) {
      resetHeroPlayback()
    }
    wasCurrentRef.current = isCurrent
  }, [isCurrent])

  const resetHeroPlayback = () => {
    completedRef.current = false
    setScrubbing(true)
    targetRef.current = 0
    progressProxy.current.value = 0
    if (gsapTween.current) { gsapTween.current.kill(); gsapTween.current = null }
    setRightEntered(false)
    setRightExited(false)
    setCenterEntered(false)
    setCenterExited(false)
    setTopRightEntered(false)
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  const animateTo = useCallback((target: number) => {
    targetRef.current = target
    if (gsapTween.current) { gsapTween.current.kill(); gsapTween.current = null }
    gsapTween.current = gsap.to(progressProxy.current, {
      value: target,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        const val = progressProxy.current.value
        setDisplayProgress(val)
        if (videoRef.current?.duration && isFinite(videoRef.current.duration)) {
          videoRef.current.currentTime = val * videoRef.current.duration
        }
      },
      onComplete: () => {
        gsapTween.current = null
        if (target >= COMPLETE_AT && !completedRef.current) {
          completedRef.current = true
          setScrubbing(false)
          pinFrameRef.current = true
          onComplete?.()
        }
      },
    })
  }, [onComplete])

  const accumulateScroll = useCallback((delta: number) => {
    if (completedRef.current) return
    const vh = window.innerHeight
    const raw = Math.max(0, Math.min(1, targetRef.current + delta / vh))
    animateTo(raw)
  }, [animateTo])

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
      if (e.deltaY < 0 && targetRef.current <= 0) return
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
      const delta = touchStartRef.current - e.touches[0].clientY
      if (delta < 0 && targetRef.current <= 0) return
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
        src="/hero.mp4"
        muted
        playsInline
        preload="auto"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
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
