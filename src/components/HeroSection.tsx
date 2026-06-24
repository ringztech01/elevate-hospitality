"use client"

import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  video: string
}

export default function HeroSection({ video }: HeroSectionProps) {
  const videoRefA = useRef<HTMLVideoElement>(null)
  const videoRefB = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [showing, setShowing] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setRevealed(true), 50)
    const hide = setTimeout(() => setRevealed(false), 4000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  useEffect(() => {
    const active = showing === 0 ? videoRefA.current : videoRefB.current
    const inactive = showing === 0 ? videoRefB.current : videoRefA.current
    if (!active || !inactive) return

    const onTime = () => {
      if (timerRef.current) return
      if (active.duration && active.currentTime >= active.duration - 0.5) {
        inactive.currentTime = 0
        inactive.play()
        setShowing(showing === 0 ? 1 : 0)

        timerRef.current = setTimeout(() => {
          active.pause()
          active.currentTime = 0
          timerRef.current = undefined
        }, 600)
      }
    }

    active.addEventListener("timeupdate", onTime)
    return () => {
      active.removeEventListener("timeupdate", onTime)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [showing, video])

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <video
        ref={videoRefA}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="hero-video"
        style={{ opacity: showing === 0 ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <source src={video} type="video/webm" />
      </video>
      <video
        ref={videoRefB}
        muted
        playsInline
        preload="auto"
        className="hero-video"
        style={{ opacity: showing === 1 ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
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