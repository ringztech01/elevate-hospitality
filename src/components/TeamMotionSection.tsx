"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import ParticleCanvas from "./ParticleCanvas"

interface TeamMember {
  name: string
  role: string
  years: string
  desc: string
  image: string
}

interface TeamMotionSectionProps {
  members: TeamMember[]
  active: boolean
}

export default function TeamMotionSection({ members, active }: TeamMotionSectionProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (active && !entered) setEntered(true)
  }, [active, entered])

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
      <ParticleCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }} />

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
          Founders
        </p>
      </div>

      <div className="team-grid">
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
            <div style={{
              position: "relative",
              width: "150px",
              height: "150px",
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
                sizes="150px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <p style={{
              fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              margin: "0 0 0.5rem 0",
            }}>
              {m.years}
            </p>

            <h3 style={{
              fontSize: "clamp(1.3rem, 1.6vw, 1.8rem)",
              fontWeight: 600,
              color: "#fff",
              margin: "0 0 0.4rem 0",
              letterSpacing: "0.02em",
            }}>
              {m.name}
            </h3>

            <p style={{
              fontSize: "clamp(0.8rem, 0.85vw, 0.95rem)",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.6)",
              margin: "0 0 1rem 0",
            }}>
              {m.role}
            </p>

            <p style={{
              fontSize: "clamp(0.95rem, 1.05vw, 1.15rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              maxWidth: "320px",
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
