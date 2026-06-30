"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Section from "@/components/Section"
import StatementSection from "@/components/StatementSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import { smoothScrollTo } from "@/lib/scrollAnimate"

const slides = [
  { type: "section", id: "concept", number: "01", title: "Concept", desc: "Atmosphere before furniture. The direction is set before anything is built. Rooted in guest flow, emotion, and operating logic.", video: "/videos/1.webm", z: 2 },
  { type: "statement", id: "statement-1", z: 3, lines: ["We believe the best spaces", "begin not with materials,", "but with a point of view."] },
  { type: "section", id: "design", number: "02", title: "Design", desc: "Direction becomes detail. Materials, lighting, and joinery resolved into one complete visual system. Every surface aligned before execution begins.", video: "/videos/2.webm", z: 4, align: "right" },
  { type: "statement", id: "statement-2", z: 5, lines: ["Every element is a decision.", "Every decision shapes", "how a space feels."] },
  { type: "section", id: "build", number: "03", title: "Build", desc: "Drawings become real. Structure and finishes assembled with sequencing, precision, and control. Every install decision protects the final result.", video: "/videos/3.webm", z: 6, align: "left", loop: true },
  { type: "statement", id: "statement-3", z: 7, lines: ["Craft is not a detail.", "It is the entire process", "made visible."] },
  { type: "section", id: "completion", number: "04", title: "Completion", desc: "Precision in every joint, every edge, every finish. The space is refined until intention and execution are indistinguishable.", video: "/videos/4.webm", z: 8 },
  { type: "statement", id: "statement-4", z: 9, lines: ["We finish what we start.", "Not because we must,", "but because we care."] },
  { type: "section", id: "realization", number: "05", title: "Realization", desc: "The culmination of every decision made manifest. A space that stands as both statement and service to those who inhabit it.", video: "/videos/5.webm", z: 10 },
  { type: "statement", id: "statement-5", z: 11, lines: ["A great space is never complete.", "It evolves with every person", "who walks through it."] },
  { type: "section", id: "operate", number: "06", title: "Operate", desc: "Real becomes running. We stay to make it perform. We don't hand over the keys and walk away.", video: "/videos/6.webm", z: 12 },
  { type: "contact", id: "contact" },
  { type: "footer", id: "footer" },
]

export default function About() {
  useEffect(() => {
    const links = ["/videos/1.webm", "/videos/2.webm"].map(src => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "video"
      link.href = src
      link.setAttribute("fetchpriority", "high")
      document.head.appendChild(link)
      return link
    })
    return () => links.forEach(l => l.remove())
  }, [])

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
      <Navbar current={current} slides={slides} onClick={goTo} page="about" />
      <div ref={containerRef} className="slide-container entered">
        {slides.map((slide, i) => (
          <div key={i} className="slide">
            {slide.type === "section" ? (
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
                loop={(slide as any).loop}
              />
            ) : slide.type === "statement" ? (
              <StatementSection
                id={slide.id!}
                lines={slide.lines!}
                zIndex={slide.z!}
                active={i === current}
              />
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
