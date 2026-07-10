"use client"

import { useEffect, useRef, useState } from "react"
import emailjs from "@emailjs/browser"

interface ContactSectionProps {
  active: boolean
}

type SubmitStatus = "idle" | "sending" | "success" | "error"

export default function ContactSection({ active }: ContactSectionProps) {
  const [entered, setEntered] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<SubmitStatus>("idle")

  useEffect(() => {
    if (active && !entered) setEntered(true)
  }, [active, entered])

  useEffect(() => {
    emailjs.init({
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setStatus("sending")

    try {
      const form = formRef.current!
      const data = new FormData(form)
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
        {
          from_name: data.get("from_name"),
          from_email: data.get("from_email"),
          role: data.get("role"),
          message: data.get("message"),
        }
      )
      setStatus("success")
      form.reset()
    } catch (err) {
      console.error("EmailJS error:", err)
      setStatus("error")
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "4px",
    padding: "0.9rem 1rem",
    color: "#fff",
    fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
    outline: "none",
    transition: "border-color 0.3s ease",
    fontFamily: "inherit",
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"
  }

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

      <div className="contact-inner" style={{ display: "flex", width: "100%", maxWidth: "1100px", gap: "0" }}>
        {/* Left — Info */}
        <div className="contact-info" style={{
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
          A finished concept or a first thought — we&apos;d like to hear it. Every Elevate project starts with a conversation.
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
      <div className="contact-form" style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
      }}>
        <form ref={formRef} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={handleSubmit}>
          <input
            type="text"
            name="from_name"
            placeholder="Your Name"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <input
            type="email"
            name="from_email"
            placeholder="Email Address"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <select
            name="role"
            required
            defaultValue=""
            style={{
              ...inputStyle,
              color: "rgba(255,255,255,0.3)",
              appearance: "none",
              cursor: "pointer",
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="" disabled style={{ background: "#111", color: "rgba(255,255,255,0.3)" }}>I am a...</option>
            <option value="Investor / Developer with a concept" style={{ background: "#111", color: "#fff" }}>Investor / Developer with a concept</option>
            <option value="Existing F&B owner looking to expand" style={{ background: "#111", color: "#fff" }}>Existing F&amp;B owner looking to expand</option>
            <option value="First-time hospitality entrepreneur" style={{ background: "#111", color: "#fff" }}>First-time hospitality entrepreneur</option>
            <option value="Hotel / Resort developer" style={{ background: "#111", color: "#fff" }}>Hotel / Resort developer</option>
            <option value="Other" style={{ background: "#111", color: "#fff" }}>Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Tell us about your project"
            rows={4}
            required
            style={{ ...inputStyle, resize: "vertical" as const }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {status === "success" && (
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.75rem, 0.8vw, 0.85rem)", margin: 0 }}>
              Message sent — we&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p style={{ color: "rgba(255,100,100,0.8)", fontSize: "clamp(0.75rem, 0.8vw, 0.85rem)", margin: 0 }}>
              Something went wrong — try again or email us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              background: "none",
              border: "none",
              color: status === "sending" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
              fontSize: "clamp(0.8rem, 0.85vw, 0.9rem)",
              cursor: status === "sending" ? "wait" : "pointer",
              textAlign: "left",
              padding: "0.5rem 0",
              transition: "color 0.3s ease",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={e => { if (status !== "sending") (e.currentTarget as HTMLElement).style.color = "#fff" }}
            onMouseLeave={e => { if (status !== "sending") (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)" }}
          >
            {status === "sending" ? "Sending…" : "Send Message →"}
          </button>
        </form>
      </div>
      </div>
    </section>
  )
}
