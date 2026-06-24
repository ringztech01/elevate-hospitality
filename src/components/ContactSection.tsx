"use client"

import { useEffect, useState } from "react"

interface ContactSectionProps {
  isCurrent: boolean
}

export default function ContactSection({ isCurrent }: ContactSectionProps) {
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
      alignItems: "center",
      justifyContent: "center",
      padding: "0 6rem",
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

      {/* Left — Info */}
      <div style={{
        flex: "0 0 45%",
        paddingRight: "5rem",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
      }}>
        <p style={{
          fontSize: "clamp(0.55rem, 0.6vw, 0.65rem)",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          marginBottom: "1rem",
        }}>
          Get in Touch
        </p>

        <h2 style={{
          fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
          fontWeight: 200,
          letterSpacing: "0.02em",
          color: "#fff",
          margin: "0 0 1rem 0",
          lineHeight: 1.2,
        }}>
          You have the vision.<br />We elevate it.
        </h2>

        <p style={{
          fontSize: "clamp(0.8rem, 0.9vw, 0.95rem)",
          fontWeight: 300,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.45)",
          margin: "0 0 2.5rem 0",
          maxWidth: "420px",
        }}>
          A finished concept or a first thought — we'd like to hear it. Every Elevate project starts with a conversation.
        </p>

        {/* Contact details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <p style={{
              fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              margin: "0 0 0.25rem 0",
            }}>
              Location
            </p>
            <p style={{
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}>
              Wuse 2, Abuja, Nigeria
            </p>
          </div>

          <div>
            <p style={{
              fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              margin: "0 0 0.25rem 0",
            }}>
              Phone
            </p>
            <p style={{
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}>
              +234 704 983 8383
            </p>
          </div>

          <div>
            <p style={{
              fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              margin: "0 0 0.25rem 0",
            }}>
              Email
            </p>
            <p style={{
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}>
              contact@elevateng.co
            </p>
          </div>

          <div>
            <p style={{
              fontSize: "clamp(0.5rem, 0.55vw, 0.6rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              margin: "0 0 0.25rem 0",
            }}>
              WhatsApp
            </p>
            <a
              href="https://wa.me/2347049838383?text=Hi%20Elevate%2C%20I'd%20like%20to%20discuss%20a%20hospitality%20project%20with%20your%20team."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: "2px",
                transition: "color 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)" }}
            >
              Start a conversation →
            </a>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        flex: "0 0 55%",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
      }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Your Name"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              padding: "0.9rem 1rem",
              color: "#fff",
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              outline: "none",
              transition: "border-color 0.3s ease",
              fontFamily: "inherit",
            }}
            onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)" }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)" }}
          />
          <input
            type="email"
            placeholder="Email Address"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              padding: "0.9rem 1rem",
              color: "#fff",
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              outline: "none",
              transition: "border-color 0.3s ease",
              fontFamily: "inherit",
            }}
            onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)" }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)" }}
          />
          <select
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              padding: "0.9rem 1rem",
              color: "rgba(255,255,255,0.3)",
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              outline: "none",
              transition: "border-color 0.3s ease",
              fontFamily: "inherit",
              appearance: "none",
              cursor: "pointer",
            }}
            defaultValue=""
            onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)" }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)" }}
          >
            <option value="" disabled style={{ background: "#111", color: "rgba(255,255,255,0.3)" }}>I am a...</option>
            <option value="investor" style={{ background: "#111", color: "#fff" }}>Investor / Developer with a concept</option>
            <option value="existing" style={{ background: "#111", color: "#fff" }}>Existing F&amp;B owner looking to expand</option>
            <option value="first-time" style={{ background: "#111", color: "#fff" }}>First-time hospitality entrepreneur</option>
            <option value="hotel" style={{ background: "#111", color: "#fff" }}>Hotel / Resort developer</option>
            <option value="other" style={{ background: "#111", color: "#fff" }}>Other</option>
          </select>
          <textarea
            placeholder="Tell us about your project"
            rows={4}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              padding: "0.9rem 1rem",
              color: "#fff",
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              outline: "none",
              transition: "border-color 0.3s ease",
              fontFamily: "inherit",
              resize: "vertical",
            }}
            onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)" }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)" }}
          />
          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              cursor: "pointer",
              textAlign: "left",
              padding: "0.5rem 0",
              transition: "color 0.3s ease",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)" }}
          >
            Send Message →
          </button>
        </form>
      </div>
    </section>
  )
}
