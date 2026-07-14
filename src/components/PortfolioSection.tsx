"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

interface Project {
  name: string
  category: string
  desc: string
  images: string[]
}

interface PortfolioSectionProps {
  projects: Project[]
  isCurrent: boolean
}

export default function PortfolioSection({ projects, isCurrent }: PortfolioSectionProps) {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState(0)
  const [projectImgIndex, setProjectImgIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [animating, setAnimating] = useState(false)
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
    setProjectImgIndex(0)
    setTimeout(() => setAnimating(false), 700)
  }, [active, animating, projects.length])

  const project = projects[active]
  const currentImages = project?.images || []
  const hasMultipleImages = currentImages.length > 1
  const imageUrl = project.images[projectImgIndex]

  // Track previous image for crossfade
  const prevUrlRef = useRef<string | null>(null)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)
  useEffect(() => {
    if (prevUrlRef.current && prevUrlRef.current !== imageUrl) {
      setPrevUrl(prevUrlRef.current)
    }
    prevUrlRef.current = imageUrl
  }, [imageUrl])

  const advance = useCallback(() => {
    if (hasMultipleImages && projectImgIndex < currentImages.length - 1) {
      setProjectImgIndex(prev => prev + 1)
    } else {
      setProjectImgIndex(0)
      const nextIdx = (active + 1) % projects.length
      if (animating || nextIdx === active) return
      setDirection(nextIdx > active ? 1 : -1)
      setAnimating(true)
      setActive(nextIdx)
      setTimeout(() => setAnimating(false), 700)
    }
  }, [hasMultipleImages, projectImgIndex, currentImages.length, active, projects.length, animating])

  const nextImage = useCallback(() => {
    if (!hasMultipleImages) return
    setProjectImgIndex(prev => (prev + 1) % currentImages.length)
  }, [hasMultipleImages, currentImages.length])

  const prevImage = useCallback(() => {
    if (!hasMultipleImages) return
    setProjectImgIndex(prev => (prev - 1 + currentImages.length) % currentImages.length)
  }, [hasMultipleImages, currentImages.length])

  useEffect(() => {
    if (!isCurrent) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(advance, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isCurrent, advance])

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      background: "#000",
    }}>
      {/* Background image with crossfade */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Previous image fading out */}
        {prevUrl && prevUrl !== imageUrl && (
          <div style={{
            position: "absolute",
            inset: 0,
            animation: "pfFadeOut 0.7s ease forwards",
          }}>
            <Image src={prevUrl} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
          </div>
        )}
        {/* Current image */}
        <Image
          src={imageUrl}
          alt={project.name}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)",
        }} />
      </div>

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

      {/* Project category (visible label) */}
      <div className="portfolio-category" style={{
        position: "absolute",
        bottom: "5rem",
        left: "4rem",
        zIndex: 3,
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease 0.4s",
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

      {/* Vertical thumbnail strip for multi-image projects */}
      {hasMultipleImages && (
        <div style={{
          position: "absolute",
          right: "3rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: entered ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          {currentImages.map((src, imgIdx) => (
            <button key={imgIdx} onClick={() => setProjectImgIndex(imgIdx)} style={{
              width: "100px",
              height: "65px",
              border: imgIdx === projectImgIndex ? "1.5px solid #fff" : "1.5px solid rgba(255,255,255,0.15)",
              borderRadius: "2px",
              padding: 0,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              background: "#111",
              opacity: imgIdx === projectImgIndex ? 1 : 0.5,
              transition: "opacity 0.3s, border-color 0.3s, transform 0.3s",
              transform: imgIdx === projectImgIndex ? "scale(1.1)" : "scale(1)",
              flexShrink: 0,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = imgIdx === projectImgIndex ? "1" : "0.5" }}>
              <Image src={src} alt="" fill sizes="100px" style={{ objectFit: "cover" }} />
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
            <Image src={p.images[0]} alt={p.name} fill sizes="60px" style={{ objectFit: "cover" }} loading="eager" />
          </button>
        ))}
      </div>
    </section>
  )
}
