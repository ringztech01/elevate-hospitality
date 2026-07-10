"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import PortfolioSection from "@/components/PortfolioSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import { smoothScrollTo } from "@/lib/scrollAnimate"

const projects = [
  { name: "The Cage", category: "Nightclub · Full Scope", desc: "A nightlife venue where raw steel cage architecture became the entire concept.", image: "/images/projects/cage.webp" },
  { name: "Sora", category: "Restaurant · Full Scope", desc: "An elevated dining experience blending Japanese precision with local soul.", image: "/images/projects/sora1.webp" },
  { name: "The Future", category: "Lounge · Full Scope", desc: "A forward-facing social venue where design anticipates what's next.", image: "/images/projects/FUTUREPresentation4.webp" },
  { name: "Tokyo", category: "Restaurant · Full Scope", desc: "Authentic Japanese cuisine in a space that balances energy and intimacy.", image: "/images/projects/tokyo.webp" },
  { name: "Klay", category: "Restaurant · Full Scope", desc: "A clay-fired concept built around earth, fire, and honest ingredients.", image: "/images/projects/klay.webp" },
  { name: "4Guys", category: "Casual Dining · Full Scope", desc: "A bold casual dining concept built for repeat visits and high energy.", image: "/images/projects/4guys.webp" },
  { name: "Fes", category: "Restaurant · Full Scope", desc: "North African hospitality reimagined through modern design and warm textures.", image: "/images/projects/fes.webp" },
  { name: "Wheatbaker Hotel", category: "Hotel · Hospitality", desc: "Luxury hotel hospitality refined through operational precision and design.", image: "/images/projects/whitebeaker1.webp" },
  { name: "Grey Lounge", category: "Lounge · Full Scope", desc: "A monochrome lounge concept where texture and tone create atmosphere.", image: "/images/projects/gray1.webp" },
]

const slides = [
  { type: "portfolio" },
  { type: "contact", id: "contact" },
  { type: "footer", id: "footer" },
]

export default function Portfolio() {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const router = useRouter()

  currentRef.current = current

  const goTo = useCallback((targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= slides.length) return
    setCurrent(targetIdx)
    const el = containerRef.current
    if (!el) return
    requestAnimationFrame(() => smoothScrollTo(el, targetIdx * window.innerHeight, 900))
  }, [])

  const footerGoTo = useCallback((targetIdx: number) => {
    router.push(targetIdx === 1 ? "/?to=1" : "/?to=2")
  }, [router])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const idx = Math.round(container.scrollTop / window.innerHeight)
      if (idx >= 0 && idx < slides.length && idx !== currentRef.current) {
        setCurrent(idx)
      }
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <Navbar current={current} slides={slides} onClick={goTo} page="portfolio" />
      <div ref={containerRef} className="slide-container entered">
        {slides.map((slide, i) => (
          <div key={i} className="slide">
            {slide.type === "portfolio" ? (
              <PortfolioSection projects={projects} isCurrent={i === current} />
            ) : slide.type === "contact" ? (
              <ContactSection active={Math.abs(i - current) <= 1} />
            ) : (
              <FooterSection active={Math.abs(i - current) <= 1} onClick={footerGoTo} slideCount={slides.length} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
