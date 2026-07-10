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
  { type: "section", id: "who-we-are", number: "01", title: "Who we are", desc: "One team. One contract. Full accountability from first sketch to opening night — and beyond. We design, build and operate luxury hospitality spaces under a single agreement. No handovers. No excuses.", video: "/videos/1.webm", image: "/images/about-who-we-are.png", z: 2 },
  { type: "statement", id: "statement-1", z: 3, lines: ["We don't hand over drawings and walk away.", "We design what we build,", "build what we operate,", "and operate what we design."] },
  { type: "section", id: "design", number: "02", title: "Design", desc: "We design for the people who will work the space — not just the people who will photograph it. Every banquette is a seating plan. Every corridor is a labour cost. Every ceiling height is an acoustic budget.", video: "/videos/2.webm", z: 4, align: "right" },
  { type: "statement", id: "statement-2", z: 5, lines: ["A rendering is a promise.", "What we deliver", "is proof."] },
  { type: "section", id: "build", number: "03", title: "Build", desc: "Procurement and project management under one roof. Single-point accountability for timelines, budgets, and quality. We coordinate MEP, joinery, and finishes — everything required to turn a drawing into a standing asset.", video: "/videos/3.webm", z: 6, align: "left" },
  { type: "statement", id: "statement-3", z: 7, lines: ["Precision is not a detail.", "It is the entire process", "made visible."] },
  { type: "section", id: "operate", number: "04", title: "Operate", desc: "This is what makes us different. We run what we build. Pre-opening, staffing, systems, launch — and every service after. We don't hand over the keys and walk away.", video: "/videos/4.webm", z: 8 },
  { type: "statement", id: "statement-4", z: 9, lines: ["A space doesn't end at opening night.", "It begins."] },
  { type: "section", id: "founders", number: "05", title: "Founders", desc: "Bachar Chazbek — 10+ years delivering luxury interiors. Bassem Fayad — 15+ years operating elite venues across the region. Rayan Abdulbaki — 10+ years delivering construction on programme. One team, three disciplines, full coverage.", video: "/videos/5.webm", z: 10 },
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
                image={(slide as any).image}
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
