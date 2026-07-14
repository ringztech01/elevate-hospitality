"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import PortfolioSection from "@/components/PortfolioSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import { smoothScrollTo } from "@/lib/scrollAnimate"

const projects = [
  { name: "The Cage", category: "Nightclub · Design, Execution & Operation", desc: "A nightlife venue where raw steel cage architecture became the entire concept.", images: ["/images/projects/cage.webp", "/images/projects/cage-2.webp", "/images/projects/cage-3.webp", "/images/projects/cage-4.webp"] },
  { name: "Grey Lounge", category: "Lounge · Operation & Design", desc: "A monochrome lounge concept where texture and tone create atmosphere.", images: ["/images/projects/gray-4.webp", "/images/projects/gray-2.webp", "/images/projects/gray-3.webp"] },
  { name: "Sora 2.0", category: "Restaurant · Design & Execution", desc: "Japanese precision meets local soul in a refined dining experience.", images: ["/images/projects/sora1.webp"] },
  { name: "The Future", category: "Lounge · Design, Execution & Consultancy", desc: "A social venue where design anticipates what's next.", images: ["/images/projects/FUTUREPresentation4.webp"] },
  { name: "Tokyo", category: "Nightclub · Renovation", desc: "A complete nightclub renovation reimagining the space for elevated nightlife.", images: ["/images/projects/tokyo.webp"] },
  { name: "Klay", category: "Restaurant · Design & Execution", desc: "A clay-fired concept built around earth, fire, and honest ingredients.", images: ["/images/projects/klay-1.webp", "/images/projects/klay-2.webp"] },
  { name: "4Guys", category: "Casual Dining · Operation", desc: "A bold casual dining concept built for repeat visits and high energy.", images: ["/images/projects/4guys.webp", "/images/projects/4guys-2.webp", "/images/projects/4guys-3.webp", "/images/projects/4guys-4.webp"] },
  { name: "Fes", category: "Commercial · Fasad Execution", desc: "A commercial building facade execution bringing bold architectural vision to life.", images: ["/images/projects/fes.webp"] },
  { name: "Wheatbaker Hotel", category: "Hotel · Design Model", desc: "A luxury hotel design model crafted to redefine hospitality standards.", images: ["/images/projects/whitebeaker1.webp"] },
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
