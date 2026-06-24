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
import NavDots from "@/components/NavDots"

const slides = [
  { type: "hero" },
  { type: "section", id: "concept", number: "01", title: "Concept", desc: "Atmosphere before furniture. The direction is set before anything is built. Rooted in guest flow, emotion, and operating logic.", video: "/videos/1.webm", z: 1 },
  { type: "statement", id: "statement-1", z: 2, lines: ["We believe the best spaces", "begin not with materials,", "but with a point of view."] },
  { type: "section", id: "design", number: "02", title: "Design", desc: "Direction becomes detail. Materials, lighting, and joinery resolved into one complete visual system. Every surface aligned before execution begins.", video: "/videos/2.webm", z: 3, align: "right", delay: 2000 },
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
]

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
  const containerRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return
    setCurrent(index)
    containerRef.current?.scrollTo({ top: index * window.innerHeight, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !splashDone) return

    const onScroll = () => {
      const idx = Math.round(container.scrollTop / window.innerHeight)
      if (idx !== current) setCurrent(idx)
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [splashDone, current])

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <Navbar current={current} slides={slides} onClick={goTo} />
      {splashDone && (
        <div ref={containerRef} className="slide-container">
          {slides.map((slide, i) => (
            <div key={i} className="slide">
              {slide.type === "hero" ? (
                <HeroSection video="/videos/hero.webm" />
              ) : slide.type === "section" ? (
                <Section
                  id={slide.id!}
                  number={slide.number!}
                  title={slide.title!}
                  desc={slide.desc!}
                  video={slide.video!}
                  zIndex={slide.z!}
                  active={Math.abs(i - current) <= 1}
                  isCurrent={i === current}
                  align={slide.align as "left" | "right" | undefined}
                  delay={slide.delay}
                  loop={slide.loop}
                />
              ) : slide.type === "portfolio" ? (
                <PortfolioSection projects={projects} isCurrent={i === current} />
              ) : slide.type === "team" ? (
                <TeamSection members={team} isCurrent={i === current} />
              ) : slide.type === "contact" ? (
                <ContactSection isCurrent={i === current} />
              ) : (
                <StatementSection
                  id={slide.id!}
                  lines={slide.lines!}
                  zIndex={slide.z!}
                  active={i === current}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <NavDots current={current} slides={slides} onClick={goTo} />
    </>
  )
}
