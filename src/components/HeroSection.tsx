"use client"

import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  video: string
}

const DURATION = 5.04

export default function HeroSection({ video }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), DURATION * 0.8 * 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <video ref={videoRef} autoPlay muted loop playsInline preload="auto" className="hero-video">
        <source src={video} type="video/webm" />
      </video>
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
