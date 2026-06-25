"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Navbar from "@/components/Navbar"
import SplashScreen from "@/components/SplashScreen"
import HeroSection from "@/components/HeroSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import { smoothScrollTo } from "@/lib/scrollAnimate"

const slides = [
  { type: "hero" },
  { type: "contact", id: "contact" },
  { type: "footer", id: "footer" },
]

export default function Home() {
  const [splashDone, setSplashDone] = useState(false)
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)

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

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <Navbar current={current} onClick={goTo} />
      {splashDone && (
        <div ref={containerRef} className="slide-container">
          {slides.map((slide, i) => (
            <div key={i} className="slide">
              {slide.type === "hero" ? (
                <HeroSection containerRef={containerRef} isCurrent={i === current} />
              ) : slide.type === "contact" ? (
                <ContactSection isCurrent={i === current} />
              ) : (
                <FooterSection isCurrent={i === current} onClick={goTo} slideCount={slides.length} />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
