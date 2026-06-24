"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface TeamMember {
  name: string
  role: string
  years: string
  desc: string
  image: string
}

interface TeamSectionProps {
  members: TeamMember[]
  isCurrent: boolean
}

export default function TeamSection({ members, isCurrent }: TeamSectionProps) {
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
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.02) 0%, transparent 60%)",
      }} />

      {/* Subtle grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E)",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        pointerEvents: "none",
      }} />

      {/* Team label */}
      <div style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        marginBottom: "3.5rem",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
      }}>
        <p style={{
          fontSize: "clamp(0.65rem, 0.7vw, 0.75rem)",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          margin: "0 0 0.75rem 0",
        }}>
          Principals
        </p>

      </div>

      {/* Team grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "3rem",
        maxWidth: "1100px",
        width: "100%",
        position: "relative",
        zIndex: 2,
      }}>
        {members.map((m, i) => (
          <div
            key={m.name}
            style={{
              textAlign: "center",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
              transitionDelay: `${0.3 + i * 0.12}s`,
            }}
          >
            {/* Image */}
            <div style={{
              position: "relative",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto 1.25rem",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#111",
            }}>
              <Image
                src={m.image}
                alt={m.name}
                fill
                sizes="120px"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Years badge */}
            <p style={{
              fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              margin: "0 0 0.5rem 0",
            }}>
              {m.years}
            </p>

            {/* Name */}
            <h3 style={{
              fontSize: "clamp(1rem, 1.2vw, 1.2rem)",
              fontWeight: 400,
              color: "#fff",
              margin: "0 0 0.25rem 0",
              letterSpacing: "0.02em",
            }}>
              {m.name}
            </h3>

            {/* Role */}
            <p style={{
              fontSize: "clamp(0.6rem, 0.65vw, 0.7rem)",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.3)",
              margin: "0 0 0.75rem 0",
            }}>
              {m.role}
            </p>

            {/* Description */}
            <p style={{
              fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.45)",
              margin: 0,
              maxWidth: "280px",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
