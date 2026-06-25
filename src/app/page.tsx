"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import SplashScreen from "@/components/SplashScreen"
import HeroSection from "@/components/HeroSection"
import StatementSection from "@/components/StatementSection"
import PortfolioSection from "@/components/PortfolioSection"
import TeamSection from "@/components/TeamSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import { smoothScrollTo } from "@/lib/scrollAnimate"

const slides = [
  { type: "hero" },
  { type: "statement", id: "statement-portfolio", z: 1, lines: ["Every project we take on", "becomes part of who we are."] },
  { type: "portfolio", id: "portfolio" },
  { type: "statement", id: "statement-team", z: 2, lines: ["The Same People From The First Conversation", "To The Final Handover."] },
  { type: "team", id: "team" },
  { type: "contact", id: "contact" },
  { type: "footer", id: "footer" },
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

function HomeContent() {
  const [splashDone, setSplashDone] = useState(false)
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const searchParams = useSearchParams()

  currentRef.current = current

  const goTo = useCallback((targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= slides.length) return
    setCurrent(targetIdx)
    const el = containerRef.current
    if (!el) return
    requestAnimationFrame(() => smoothScrollTo(el, targetIdx * window.innerHeight, 900))
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !splashDone) return

    const onScroll = () => {
      const idx = Math.round(container.scrollTop / window.innerHeight)
      if (idx >= 0 && idx < slides.length && idx !== currentRef.current) {
        setCurrent(idx)
      }
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [splashDone])

  useEffect(() => {
    if (!splashDone || !containerRef.current) return
    const to = searchParams.get("to")
    if (to !== null) {
      const idx = parseInt(to, 10)
      if (!isNaN(idx) && idx >= 0 && idx < slides.length) {
        requestAnimationFrame(() => {
          smoothScrollTo(containerRef.current!, idx * window.innerHeight, 900)
        })
      }
    }
  }, [splashDone, searchParams])

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <Navbar current={current} slides={slides} onClick={goTo} page="home" />
      {splashDone && (
        <div ref={containerRef} className="slide-container">
          {slides.map((slide, i) => (
            <div key={i} className="slide">
              {slide.type === "hero" ? (
                <HeroSection containerRef={containerRef} isCurrent={i === current} />
              ) : slide.type === "portfolio" ? (
                <PortfolioSection projects={projects} isCurrent={i === current} />
              ) : slide.type === "team" ? (
                <TeamSection members={team} isCurrent={i === current} />
              ) : slide.type === "contact" ? (
                <ContactSection isCurrent={i === current} />
              ) : slide.type === "footer" ? (
                <FooterSection isCurrent={i === current} onClick={goTo} slideCount={slides.length} />
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
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
