"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Navbar from "@/components/Navbar"
import SplashScreen from "@/components/SplashScreen"
import HeroSection from "@/components/HeroSection"
import Section from "@/components/Section"
import StatementSection from "@/components/StatementSection"
import PortfolioSection from "@/components/PortfolioSection"
import TeamSection from "@/components/TeamSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import NavDots from "@/components/NavDots"
import { smoothScrollTo } from "@/lib/scrollAnimate"

const slides = [
  { type: "hero" },
  { type: "section", id: "concept", number: "01", title: "Concept", desc: "Atmosphere before furniture. The direction is set before anything is built. Rooted in guest flow, emotion, and operating logic.", video: "/videos/1.webm", z: 1 },
  { type: "statement", id: "statement-1", z: 2, lines: ["We believe the best spaces", "begin not with materials,", "but with a point of view."] },
  { type: "section", id: "design", number: "02", title: "Design", desc: "Direction becomes detail. Materials, lighting, and joinery resolved into one complete visual system. Every surface aligned before execution begins.", video: "/videos/2.webm", z: 3, align: "right" },
  { type: "statement", id: "statement-2", z: 4, lines: ["Every element is a decision.", "Every decision shapes", "how a space feels."] },
  { type: "section", id: "build", number: "03", title: "Build", desc: "Drawings become real. Structure and finishes assembled with sequencing, precision, and control. Every install decision protects the final result.", video: "/videos/3.webm", z: 5, align: "left", loop: true },
  { type: "statement", id: "statement-3", z: 6, lines: ["Craft is not a detail.", "It is the entire process", "made visible."] },
  { type: "section", id: "completion", number: "04", title: "Completion", desc: "Precision in every joint, every edge, every finish. The space is refined until intention and execution are indistinguishable.", video: "/videos/4.webm", z: 7 },
  { type: "statement", id: "statement-4", z: 8, lines: ["We finish what we start.", "Not because we must,", "but because we care."] },
  { type: "section", id: "realization", number: "05", title: "Realization", desc: "The culmination of every decision made manifest. A space that stands as both statement and service to those who inhabit it.", video: "/videos/5.webm", z: 9 },
  { type: "statement", id: "statement-5", z: 10, lines: ["A great space is never complete.", "It evolves with every person", "who walks through it."] },
  { type: "section", id: "operate", number: "06", title: "Operate", desc: "Real becomes running. We stay to make it perform. We don't hand over the keys and walk away.", video: "/videos/6.webm", z: 11 },
  { type: "statement", id: "statement-portfolio", z: 12, lines: ["Every project we take on", "becomes part of who we are."] },
  { type: "portfolio", id: "portfolio" },
  { type: "statement", id: "statement-team", z: 13, lines: ["The Same People From The First Conversation", "To The Final Handover."] },
  { type: "team", id: "team" },
  { type: "contact", id: "contact" },
  { type: "footer", id: "footer" },
]

const aboutIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17]
const team = [
  { name: "Bachar Chazbek", role: "Director · Architect & Urban Planner", years: "10+ Years Design", desc: "Architect and entrepreneur with 10+ years in luxury design and project execution. Every project begins with understanding how a space will feel when it's full — not just how it looks in a render.", image: "https://elevateng.co/images/team/bashar.webp" },
  { name: "Bassem Fayad", role: "Director · Operations Manager", years: "15+ Years Ops", desc: "Hospitality executive with 15+ years managing elite venues across the Middle East and Africa. Co-Founder of 4Guys and Grey Lounge.", image: "https://elevateng.co/images/team/bassem.webp" },
  { name: "Rayan Abdulbaki", role: "Director · Project Manager", years: "10+ Years Build", desc: "Civil engineer with 10+ years in construction across Nigeria and Lebanon. Former COO of ReliaBuild Nigeria. The person who ensures what's designed gets built — precisely.", image: "https://elevateng.co/images/team/ryan.webp" },
]

const projects = [
  { name: "The Cage", category: "Nightclub · Full Scope", desc: "A nightlife venue where raw steel cage architecture became the entire concept.", image: "https://elevateng.co/images/projects/cage.jpg" },
  { name: "Sora", category: "Restaurant · Full Scope", desc: "An elevated dining experience blending Japanese precision with local soul.", image: "https://elevateng.co/images/projects/sora1.png" },
  { name: "The Future", category: "Lounge · Full Scope", desc: "A forward-facing social venue where design anticipates what's next.", image: "https://elevateng.co/images/projects/future/FUTURE%20Presentation4.webp" },
  { name: "Tokyo", category: "Restaurant · Full Scope", desc: "Authentic Japanese cuisine in a space that balances energy and intimacy.", image: "https://elevateng.co/images/projects/tokyo.webp" },
  { name: "Klay", category: "Restaurant · Full Scope", desc: "A clay-fired concept built around earth, fire, and honest ingredients.", image: "https://elevateng.co/images/projects/klay.webp" },
  { name: "4Guys", category: "Casual Dining · Full Scope", desc: "A bold casual dining concept built for repeat visits and high energy.", image: "https://elevateng.co/images/projects/4guys.webp" },
  { name: "Fes", category: "Restaurant · Full Scope", desc: "North African hospitality reimagined through modern design and warm textures.", image: "https://elevateng.co/images/projects/fes.webp" },
  { name: "Wheatbaker Hotel", category: "Hotel · Hospitality", desc: "Luxury hotel hospitality refined through operational precision and design.", image: "https://elevateng.co/images/projects/whitebeaker1.jpeg" },
  { name: "Grey Lounge", category: "Lounge · Full Scope", desc: "A monochrome lounge concept where texture and tone create atmosphere.", image: "https://elevateng.co/images/projects/gray1.png" },
]

export default function Home() {
  const [splashDone, setSplashDone] = useState(false)
  const [current, setCurrent] = useState(0)
  const [aboutMode, setAboutMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const aboutModeRef = useRef(false)

  currentRef.current = current
  aboutModeRef.current = aboutMode

  const goTo = useCallback((targetOrigIdx: number) => {
    if (targetOrigIdx < 0 || targetOrigIdx >= slides.length) return
    const wasAbout = aboutModeRef.current
    const entering = !wasAbout && aboutIndices.includes(targetOrigIdx)
    const exiting = wasAbout && !aboutIndices.includes(targetOrigIdx)
    setCurrent(targetOrigIdx)

    if (entering) {
      setAboutMode(true)
    } else if (exiting) {
      setAboutMode(false)
    }

    const el = containerRef.current
    if (!el) return
    if (entering) {
      const ri = aboutIndices.indexOf(targetOrigIdx)
      requestAnimationFrame(() => smoothScrollTo(el, ri * window.innerHeight, 900))
    } else {
      requestAnimationFrame(() => smoothScrollTo(el, targetOrigIdx * window.innerHeight, 900))
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !splashDone) return

    const onScroll = () => {
      const isAbout = aboutModeRef.current
      const renderedIdx = Math.round(container.scrollTop / window.innerHeight)

      if (isAbout) {
        if (renderedIdx >= 0 && renderedIdx < aboutIndices.length) {
          const origIdx = aboutIndices[renderedIdx]
          if (origIdx !== currentRef.current) setCurrent(origIdx)
        }
      } else {
        if (renderedIdx >= 0 && renderedIdx < slides.length && renderedIdx !== currentRef.current) {
          setCurrent(renderedIdx)
        }
      }
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [splashDone])

  const visibleSlides = aboutMode
    ? aboutIndices.map(i => slides[i])
    : slides

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <Navbar current={current} slides={slides} onClick={goTo} aboutMode={aboutMode} />
      {splashDone && (
        <div ref={containerRef} className="slide-container">
          {visibleSlides.map((slide, i) => {
            const origIdx = aboutMode ? aboutIndices[i] : i
            return (
              <div key={origIdx} className="slide">
                {slide.type === "hero" ? (
                  <HeroSection containerRef={containerRef} isCurrent={origIdx === current} />
                ) : slide.type === "section" ? (
                  <Section
                    id={slide.id!}
                    number={slide.number!}
                    title={slide.title!}
                    desc={slide.desc!}
                    video={slide.video!}
                    zIndex={slide.z!}
                    active={Math.abs(origIdx - current) <= 1}
                    isCurrent={origIdx === current}
                    align={slide.align as "left" | "right" | undefined}
                    delay={(slide as any).delay}
                    loop={(slide as any).loop}
                  />
                ) : slide.type === "portfolio" ? (
                  <PortfolioSection projects={projects} isCurrent={origIdx === current} />
                ) : slide.type === "team" ? (
                  <TeamSection members={team} isCurrent={origIdx === current} />
                ) : slide.type === "contact" ? (
                  <ContactSection isCurrent={origIdx === current} />
                ) : slide.type === "footer" ? (
                  <FooterSection isCurrent={origIdx === current} onClick={goTo} slideCount={slides.length} />
                ) : (
                  <StatementSection
                    id={slide.id!}
                    lines={slide.lines!}
                    zIndex={slide.z!}
                    active={origIdx === current}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
      <NavDots current={current} slides={slides} onClick={goTo} aboutMode={aboutMode} />

      <button
        onClick={() => goTo(0)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 100,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.6)",
          color: "rgba(255,255,255,0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: current >= slides.length - 3 ? 1 : 0,
          pointerEvents: current >= slides.length - 3 ? "auto" : "none",
          transition: "opacity 0.4s ease, color 0.3s ease",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)" }}
        aria-label="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}
