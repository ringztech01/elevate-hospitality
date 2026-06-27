"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  isCurrent: boolean
  pinFrame: boolean
  replayArmed: boolean
  onComplete?: () => void
}

const TOTAL_FRAMES = 451
const ZERO_PAD = 4
const COMPLETE_AT = 0.999

function frameSrc(index: number) {
  const padded = String(index + 1).padStart(ZERO_PAD, "0")
  return `/hero-frames/frame_${padded}.webp`
}

export default function HeroSection({ containerRef, isCurrent, pinFrame, replayArmed, onComplete }: HeroSectionProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const currentFrameRef = useRef(-1)
  const completedRef = useRef(false)
  const rawProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const touchStartRef = useRef(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const rafIdRef = useRef(0)
  const pinFrameRef = useRef(pinFrame)
  pinFrameRef.current = pinFrame

  const resetHeroPlayback = () => {
    completedRef.current = false
    rawProgressRef.current = 0
    smoothProgressRef.current = 0
    currentFrameRef.current = 0
    if (imgRef.current) imgRef.current.src = frameSrc(0)
  }

  useEffect(() => {
    const imgs: HTMLImageElement[] = []
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      imgs.push(img)
    }
    return () => imgs.forEach(i => { i.src = "" })
  }, [])

  const accumulateScroll = useCallback((delta: number) => {
    if (completedRef.current) return
    const vh = window.innerHeight
    rawProgressRef.current = Math.max(0, Math.min(1, rawProgressRef.current + delta / vh))
    if (rawProgressRef.current >= COMPLETE_AT && !completedRef.current) {
      rawProgressRef.current = 1
      smoothProgressRef.current = 1
      currentFrameRef.current = TOTAL_FRAMES - 1
      if (imgRef.current) imgRef.current.src = frameSrc(TOTAL_FRAMES - 1)
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

      const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(smoothProgressRef.current * TOTAL_FRAMES))
      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame
        if (imgRef.current) imgRef.current.src = frameSrc(frame)
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafIdRef.current)
  }, [containerRef, isCurrent])

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <img
        ref={imgRef}
        src={frameSrc(0)}
        alt=""
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
      <div style={{
        position: "absolute",
        bottom: "25vh",
        left: "2rem",
        zIndex: 2,
        maxWidth: "520px",
        pointerEvents: "none",
      }}>
        <p style={{
          fontSize: "clamp(1rem, 1.8vw, 1.6rem)",
          fontWeight: 300,
          lineHeight: 1.6,
          color: "#fff",
          margin: 0,
          opacity: Math.min(1, displayProgress * 2),
          transform: `translateY(${Math.max(0, 20 - displayProgress * 40)}px)`,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}>
          We design, build, and operate luxury hospitality spaces — from first concept through every detail to the final handover.
        </p>
      </div>
    </section>
  )
}
