"use client"

import { useEffect, useState } from "react"

interface FooterSectionProps {
  isCurrent: boolean
  onClick: (index: number) => void
  slideCount: number
}

const links = [
  { label: "Home", index: 0 },
  { label: "Contact", index: 1 },
]

export default function FooterSection({ isCurrent, onClick, slideCount }: FooterSectionProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (isCurrent && !entered) {
      const t = setTimeout(() => setEntered(true), 300)
      return () => clearTimeout(t)
    }
  }, [isCurrent, entered])

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 4rem",
    }}>
      {/* Grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E)",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "900px",
        width: "100%",
        textAlign: "center",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(15px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
      }}>
        {/* Brand */}
        <p style={{
          fontSize: "clamp(1.2rem, 1.8vw, 1.8rem)",
          fontWeight: 200,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#fff",
          margin: "0 0 0.5rem 0",
        }}>
          Elevate
        </p>
        <p style={{
          fontSize: "clamp(0.55rem, 0.6vw, 0.65rem)",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          margin: "0 0 2.5rem 0",
        }}>
          Concept · Design · Build · Operate
        </p>

        {/* Divider */}
        <div style={{
          width: "40px",
          height: "1px",
          background: "rgba(255,255,255,0.1)",
          margin: "0 auto 2.5rem",
        }} />

        {/* Tagline */}
        <p style={{
          fontSize: "clamp(0.8rem, 0.9vw, 0.95rem)",
          fontWeight: 300,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.4)",
          margin: "0 auto 3rem",
          maxWidth: "520px",
        }}>
          A three-person team that takes hospitality projects from the first idea to the last table turned. Architecture, engineering, and 16 years of operations — under one roof.
        </p>

        {/* Nav links */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "2.5rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
        }}>
          {links.map((link, i) => (
            <button
              key={link.label}
              onClick={() => onClick(link.index)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.25)",
                fontSize: "clamp(0.65rem, 0.7vw, 0.75rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: "0.25rem 0",
                fontFamily: "inherit",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.5s ease ${0.3 + i * 0.06}s, transform 0.5s ease ${0.3 + i * 0.06}s, color 0.3s ease`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)" }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: "60px",
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          margin: "0 auto 1.5rem",
        }} />

        {/* Copyright */}
        <p style={{
          fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.15)",
          margin: 0,
        }}>
          © 2026 Elevate Hospitality. All rights reserved. Based locally. Working regionally.
        </p>
      </div>
    </section>
  )
}
