"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

interface Project {
  name: string
  category: string
  desc: string
  images: string[]
  comingSoon?: boolean
}

interface PortfolioSectionProps {
  projects: Project[]
  isCurrent: boolean
}

export default function PortfolioSection({ projects, isCurrent }: PortfolioSectionProps) {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState(0)
  const [prevActive, setPrevActive] = useState(-1)
  const [projectImgIndex, setProjectImgIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [textPhase, setTextPhase] = useState<"visible" | "exit" | "enter">("visible")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isCurrent && !entered) {
      const t = setTimeout(() => setEntered(true), 300)
      return () => clearTimeout(t)
    }
  }, [isCurrent, entered])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
      if (textTimerRef.current) clearTimeout(textTimerRef.current)
    }
  }, [])

  const switchProject = useCallback((i: number) => {
    if (i < 0 || i >= projects.length || i === active) return

    setDirection(i > active ? 1 : -1)
    setPrevActive(active)
    setTransitioning(true)
    setTextPhase("exit")

    textTimerRef.current = setTimeout(() => {
      setActive(i)
      setProjectImgIndex(0)
      setTextPhase("enter")

      textTimerRef.current = setTimeout(() => {
        setTextPhase("visible")
      }, 60)
    }, 300)

    transitionTimerRef.current = setTimeout(() => {
      setTransitioning(false)
      setPrevActive(-1)
    }, 900)
  }, [active, projects.length])

  const goTo = useCallback((i: number) => {
    if (transitioning) return
    switchProject(i)
  }, [transitioning, switchProject])

  const project = projects[active]
  const prevProject = prevActive >= 0 ? projects[prevActive] : null
  const currentImages = project?.images || []
  const hasMultipleImages = currentImages.length > 1
  const imageUrl = currentImages[projectImgIndex] || currentImages[0]
  const prevImageUrl = prevProject ? (prevProject.images[0]) : ""

  useEffect(() => {
    setProjectImgIndex(0)
  }, [active])

  const advance = useCallback(() => {
    if (hasMultipleImages && projectImgIndex < currentImages.length - 1) {
      setProjectImgIndex(prev => prev + 1)
    } else {
      const nextIdx = (active + 1) % projects.length
      switchProject(nextIdx)
    }
  }, [hasMultipleImages, projectImgIndex, currentImages.length, active, projects.length, switchProject])

  useEffect(() => {
    if (!isCurrent) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(advance, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isCurrent, advance])

  const textTransform = () => {
    if (textPhase === "exit") return `translateY(${direction === 1 ? "-12px" : "12px"})`
    if (textPhase === "enter") return `translateY(${direction === 1 ? "12px" : "-12px"})`
    return "translateY(0)"
  }

  const textOpacity = () => {
    if (textPhase === "exit") return 0
    if (textPhase === "enter") return 0
    return 1
  }

  const categoryTransform = () => {
    if (textPhase === "exit") return `translateX(${direction === 1 ? "-20px" : "20px"})`
    if (textPhase === "enter") return `translateX(${direction === 1 ? "20px" : "-20px"})`
    return "translateX(0)"
  }

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      background: "#000",
    }}>
      {/* Outgoing background image (crossfade layer) */}
      {transitioning && prevImageUrl && (
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          animation: "portfolioCrossfadeOut 0.9s ease forwards",
        }}>
          <img
            src={prevImageUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Incoming background image */}
      <div
        key={imageUrl}
        style={{
          position: "absolute",
          inset: 0,
          opacity: transitioning ? 0 : 1,
          animation: transitioning ? "portfolioCrossfadeIn 0.9s ease forwards" : "portfolioKenBurns 12s ease-in-out infinite alternate",
        }}
      >
        <img
          src={imageUrl}
          alt={project.name}
          loading="eager"
          decoding="async"
          className="portfolio-bg-img"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Dark overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)",
        zIndex: 1,
      }} />

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

      {/* Project category */}
      <div className="portfolio-category" style={{
        position: "absolute",
        bottom: "5rem",
        left: "4rem",
        zIndex: 3,
        opacity: entered ? textOpacity() : 0,
        transform: categoryTransform(),
        transition: textPhase === "visible" ? "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s" : "opacity 0.3s ease, transform 0.3s ease",
      }}>
        <p style={{
          fontSize: "clamp(0.75rem, 0.9vw, 0.95rem)",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(212, 175, 55, 0.8)",
          margin: 0,
        }}>
          {project.category.split(" · ")[1].split(/[,&]\s*/).map(s => s.trim()).join(" · ")}
        </p>
      </div>

      {/* Project info */}
      <div className="portfolio-info" style={{
        position: "absolute",
        left: "4rem",
        top: "50%",
        transform: entered
          ? `translateY(-50%) ${textTransform()}`
          : "translateY(calc(-50% + 20px))",
        zIndex: 3,
        maxWidth: "520px",
        opacity: entered ? textOpacity() : 0,
        transition: textPhase === "visible"
          ? "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s"
          : "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "none",
      }}>
        <p style={{
          fontSize: "clamp(0.55rem, 0.6vw, 0.65rem)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          margin: "0 0 0.75rem 0",
        }}>
          {project.category.split(" · ")[0]}
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

      {/* Under Construction badge */}
      {project.comingSoon && (
        <div className="portfolio-under-construction" style={{
          position: "absolute",
          bottom: isMobile ? "10rem" : "8rem",
          left: isMobile ? "1.25rem" : "4rem",
          zIndex: 3,
          opacity: entered ? textOpacity() : 0,
          transition: textPhase === "visible"
            ? "opacity 0.5s ease 0.5s"
            : "opacity 0.3s ease",
          pointerEvents: "none",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(212, 175, 55, 0.12)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            borderRadius: "4px",
            padding: "0.45rem 0.85rem",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(212, 175, 55, 0.9)",
              fontWeight: 500,
            }}>
              Under Construction
            </span>
          </div>
        </div>
      )}

      {/* Vertical thumbnail strip for multi-image projects */}
      {hasMultipleImages && (
        <div style={{
          position: "absolute",
          ...(isMobile
            ? { top: "8rem", left: "50%", transform: "translateX(-50%)", flexDirection: "row" as const, gap: "0.5rem", maxWidth: "88vw", overflowX: "auto" as const, padding: "0.25rem" }
            : { right: "3rem", top: "50%", transform: "translateY(-50%)", flexDirection: "column" as const, gap: "0.5rem" }),
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          opacity: entered ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          {currentImages.map((src, imgIdx) => (
            <button key={imgIdx} onClick={() => setProjectImgIndex(imgIdx)} style={{
              width: isMobile ? "90px" : "100px",
              height: isMobile ? "60px" : "65px",
              border: imgIdx === projectImgIndex ? "1.5px solid #fff" : "1.5px solid rgba(255,255,255,0.15)",
              borderRadius: "2px",
              padding: 0,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              background: "#111",
              opacity: imgIdx === projectImgIndex ? 1 : 0.45,
              transition: "opacity 0.3s, border-color 0.3s, transform 0.3s",
              transform: imgIdx === projectImgIndex ? "scale(1.08)" : "scale(1)",
              flexShrink: 0,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = imgIdx === projectImgIndex ? "1" : "0.45" }}>
              <Image key={src} src={src} alt="" fill sizes="100px" style={{ objectFit: "cover" }} loading="eager" />
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      <div className="portfolio-thumbnails" style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 3,
        display: "flex",
        gap: "0.5rem",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease 0.5s",
        maxWidth: isMobile ? "88vw" : "80vw",
        overflowX: "auto",
        padding: "0.25rem",
      }}>
        {projects.map((p, i) => (
          <button
            key={p.name}
            onClick={() => goTo(i)}
            style={{
              flexShrink: 0,
              width: isMobile ? "78px" : "60px",
              height: isMobile ? "52px" : "40px",
              border: i === active ? "1.5px solid #fff" : "1.5px solid rgba(255,255,255,0.15)",
              borderRadius: "2px",
              padding: 0,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              background: "#111",
              opacity: i === active ? 1 : 0.45,
              transition: "opacity 0.4s ease, border-color 0.4s ease, transform 0.4s ease",
              transform: i === active ? "scale(1.08)" : "scale(1)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = i === active ? "1" : "0.45" }}
            aria-label={`Go to ${p.name}`}
          >
            <Image key={p.images[0]} src={p.images[0]} alt={p.name} fill sizes={isMobile ? "78px" : "60px"} style={{ objectFit: "cover" }} loading="eager" />
          </button>
        ))}
      </div>
    </section>
  )
}
