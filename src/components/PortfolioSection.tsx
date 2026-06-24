"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

interface Project {
  name: string
  category: string
  desc: string
  image: string
}

interface PortfolioSectionProps {
  projects: Project[]
  isCurrent: boolean
}

export default function PortfolioSection({ projects, isCurrent }: PortfolioSectionProps) {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [animating, setAnimating] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isCurrent && !entered) {
      const t = setTimeout(() => setEntered(true), 300)
      return () => clearTimeout(t)
    }
  }, [isCurrent, entered])

  const goTo = useCallback((i: number) => {
    if (animating || i === active || i < 0 || i >= projects.length) return
    setDirection(i > active ? 1 : -1)
    setAnimating(true)
    setActive(i)
    setTimeout(() => setAnimating(false), 700)
  }, [active, animating, projects.length])

  const next = useCallback(() => goTo((active + 1) % projects.length), [goTo, active, projects.length])

  useEffect(() => {
    if (!isCurrent) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(next, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isCurrent, next])

  const project = projects[active]

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      background: "#000",
    }}>
      {/* Background images with crossfade */}
      <div style={{ position: "absolute", inset: 0 }}>
        {projects.map((p, i) => (
          <div
            key={p.name}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 1 : 0,
              transform: i === active ? "scale(1)" : "scale(1.05)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              willChange: "opacity, transform",
            }}
          >
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="100vw"
              priority={i === 0}
              loading={i <= 1 ? undefined : "lazy"}
              onLoad={() => setImagesLoaded(prev => ({ ...prev, [i]: true }))}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)",
        }} />
      </div>

      {/* Loading skeleton for images not yet loaded */}
      {!imagesLoaded[active] && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "#0a0a0a",
          zIndex: 1,
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }} />
        </div>
      )}

      {/* Subtle grain overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E)",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Portfolio label */}
      <div style={{
        position: "absolute",
        top: "6rem",
        left: "4rem",
        zIndex: 3,
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
      }}>
        <p style={{
          fontSize: "clamp(0.65rem, 0.7vw, 0.75rem)",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          margin: 0,
        }}>
          Portfolio
        </p>
        <div style={{
          width: "24px",
          height: "1px",
          background: "rgba(255,255,255,0.2)",
          marginTop: "0.75rem",
        }} />
      </div>

      {/* Project counter */}
      <div style={{
        position: "absolute",
        bottom: "5rem",
        left: "4rem",
        zIndex: 3,
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease 0.4s",
      }}>
        <p style={{
          fontSize: "clamp(0.55rem, 0.6vw, 0.65rem)",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.25)",
          margin: 0,
          fontVariantNumeric: "tabular-nums",
        }}>
          {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      {/* Project info */}
      <div style={{
        position: "absolute",
        left: "4rem",
        top: "50%",
        transform: entered ? "translateY(-50%)" : "translateY(calc(-50% + 20px))",
        zIndex: 3,
        maxWidth: "520px",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
        pointerEvents: "none",
      }}>
        <p style={{
          fontSize: "clamp(0.55rem, 0.6vw, 0.65rem)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "0.75rem",
        }}>
          {project.category}
        </p>
        <h2 style={{
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: 200,
          letterSpacing: "0.02em",
          color: "#fff",
          margin: "0 0 1.25rem 0",
          lineHeight: 1.15,
        }}>
          {project.name}
        </h2>
        <p style={{
          fontSize: "clamp(0.85rem, 1vw, 1rem)",
          fontWeight: 300,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)",
          margin: 0,
          maxWidth: "400px",
        }}>
          {project.desc}
        </p>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        position: "absolute",
        bottom: "3rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 3,
        display: "flex",
        gap: "0.5rem",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease 0.5s",
        maxWidth: "80vw",
        overflowX: "auto",
        padding: "0.25rem",
      }}>
        {projects.map((p, i) => (
          <button
            key={p.name}
            onClick={() => goTo(i)}
            style={{
              flexShrink: 0,
              width: "60px",
              height: "40px",
              border: i === active ? "1.5px solid #fff" : "1.5px solid rgba(255,255,255,0.15)",
              borderRadius: "2px",
              padding: 0,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              background: "#111",
              opacity: i === active ? 1 : 0.35,
              transition: "opacity 0.4s ease, border-color 0.4s ease, transform 0.4s ease",
              transform: i === active ? "scale(1.05)" : "scale(1)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = i === active ? "1" : "0.35" }}
            aria-label={`Go to ${p.name}`}
          >
            <Image src={p.image} alt={p.name} fill sizes="60px" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </section>
  )
}
