"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import SplashScreen from "@/components/SplashScreen"
import HeroSection from "@/components/HeroSection"
import TeamMotionSection from "@/components/TeamMotionSection"
import ContactSection from "@/components/ContactSection"
import FooterSection from "@/components/FooterSection"
import gsap from "gsap"

let splashSeen = false

const slides = [
  { type: "hero" },
  { type: "team-motion", id: "team" },
  { type: "contact", id: "contact" },
  { type: "footer", id: "footer" },
]

const team = [
  { name: "Bachar Chazbek", role: "Director · Architect & Urban Planner", years: "10+ Years Design", desc: "Architect and entrepreneur with 10+ years in luxury design and project execution. Every project begins with understanding how a space will feel when it's full — not just how it looks in a render.", image: "https://elevateng.co/images/team/bashar.webp" },
  { name: "Bassem Fayad", role: "Director · Operations Manager", years: "15+ Years Ops", desc: "Hospitality executive with 15+ years managing elite venues across the Middle East and Africa. Co-Founder of 4Guys and Grey Lounge.", image: "https://elevateng.co/images/team/bassem.webp" },
  { name: "Rayan Abdulbaki", role: "Director · Project Manager", years: "10+ Years Build", desc: "Civil engineer with 10+ years in construction across Nigeria and Lebanon. Former COO of ReliaBuild Nigeria. The person who ensures what's designed gets built — precisely.", image: "https://elevateng.co/images/team/ryan.webp" },
]

function HomeContent() {
  const [splashDone, setSplashDone] = useState(splashSeen)
  const [current, setCurrent] = useState(0)
  const [heroDone, setHeroDone] = useState(false)
  const [pinFrame, setPinFrame] = useState(false)
  const [replayArmed, setReplayArmed] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const pinFrameRef = useRef(pinFrame)
  const searchParams = useSearchParams()

  currentRef.current = current
  pinFrameRef.current = pinFrame

  const handleHeroComplete = useCallback(() => {
    setReplayArmed(false)
    setHeroDone(true)
    setPinFrame(true)
    const el = containerRef.current
    if (el) {
      gsap.to(el, {
        scrollTop: window.innerHeight,
        duration: 1.15,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          setPinFrame(false)
        },
      })
    } else {
      setPinFrame(false)
    }
  }, [])

  const handleHeroReady = useCallback(() => setHeroReady(true), [])

  const goTo = useCallback((targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= slides.length) return
    setHeroDone(true)
    setPinFrame(false)
    setCurrent(targetIdx)
    const el = containerRef.current
    if (!el) return
    gsap.to(el, {
      scrollTop: targetIdx * window.innerHeight,
      duration: 1.2,
      ease: "power2.inOut",
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !splashDone) return

    const onScroll = () => {
      const idx = Math.floor(container.scrollTop / window.innerHeight)
      if (idx >= 0 && idx < slides.length && idx !== currentRef.current) {
        setCurrent(idx)
      }
      if (idx > 0) setReplayArmed(true)
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
        setHeroDone(true)
        setPinFrame(false)
        gsap.to(containerRef.current, {
          scrollTop: idx * window.innerHeight,
          duration: 1.2,
          ease: "power2.inOut",
        })
      }
    }
  }, [splashDone, searchParams])

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => { splashSeen = true; setSplashDone(true) }} ready={heroReady} />}
      <Navbar current={current} slides={slides} onClick={goTo} page="home" />
      <div ref={containerRef} className="slide-container">
        {slides.map((slide, i) => (
          <div key={i} className="slide">
            {slide.type === "hero" ? (
              <HeroSection containerRef={containerRef} isCurrent={i === current} pinFrame={pinFrame} replayArmed={replayArmed} onComplete={handleHeroComplete} onReady={handleHeroReady} />
            ) : slide.type === "team-motion" ? (
              <TeamMotionSection members={team} active={Math.abs(i - current) <= 1} />
            ) : slide.type === "contact" ? (
              <ContactSection active={Math.abs(i - current) <= 1} />
            ) : slide.type === "footer" ? (
              <FooterSection active={Math.abs(i - current) <= 1} onClick={goTo} slideCount={slides.length} />
            ) : null}
          </div>
        ))}
      </div>
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
