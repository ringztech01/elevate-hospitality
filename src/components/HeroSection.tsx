"use client"

import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  isCurrent: boolean
}

const TOTAL_FRAMES = 474
const ZERO_PAD = 4

function frameSrc(index: number) {
  const padded = String(index + 1).padStart(ZERO_PAD, "0")
  return `/hero-frames/frame_${padded}.webp`
}

export default function HeroSection({ containerRef, isCurrent }: HeroSectionProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const rafRef = useRef<number>(0)
  const currentFrameRef = useRef(-1)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isCurrent) {
      const show = setTimeout(() => setRevealed(true), 50)
      const hide = setTimeout(() => setRevealed(false), 4000)
      return () => { clearTimeout(show); clearTimeout(hide) }
    } else {
      setRevealed(false)
    }
  }, [isCurrent])

  useEffect(() => {
    const el = containerRef?.current
    if (!el) return

    const tick = () => {
      const vh = window.innerHeight
      const progress = Math.min(1, el.scrollTop / vh)
      const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES))

      if (frame !== currentFrameRef.current && imgRef.current) {
        currentFrameRef.current = frame
        imgRef.current.src = frameSrc(frame)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [containerRef])

  useEffect(() => {
    const preloadNext = () => {
      const base = currentFrameRef.current
      if (base < 0) return
      for (let i = -3; i <= 3; i++) {
        const idx = base + i
        if (idx >= 0 && idx < TOTAL_FRAMES) {
          const img = new Image()
          img.src = frameSrc(idx)
        }
      }
    }
    const id = setInterval(preloadNext, 500)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <img
        ref={imgRef}
        src={frameSrc(0)}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div className="hero-overlay" />
      <div className="hero-perspective">
        <h1
          className="hero-3d-text"
          style={{
            transform: revealed ? "rotateX(0deg) translateZ(0)" : "rotateX(90deg) translateZ(-80px)",
            opacity: revealed ? 1 : 0,
            transition: "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
          }}
        >
          They Build Space<br />We Elevate Experiences
        </h1>
      </div>
    </section>
  )
}