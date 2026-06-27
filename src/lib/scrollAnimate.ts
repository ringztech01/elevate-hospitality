"use client"

import gsap from "gsap"

type AnimationTargets = {
  section: HTMLElement
  reveal: HTMLElement | null
  video: HTMLElement | null
  isStatement: boolean
  slide?: { el: HTMLElement; exitDir: "left" | "right"; offset?: number }
}

const targets: AnimationTargets[] = []

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function animate() {
  const wh = window.innerHeight

  for (const t of targets) {
    const rect = t.section.getBoundingClientRect()
    const progress = clamp(1 - rect.top / wh, 0, 1)

    if (t.reveal) {
      t.reveal.style.clipPath = `circle(${clamp(progress * 150, 0, 100)}% at 50% 50%)`
    }

    if (t.video) {
      const scale = 1.08 - progress * 0.08
      t.video.style.transform = `scale(${scale})`
    }

    if (t.slide) {
      const wh = window.innerHeight
      const r = t.section.getBoundingClientRect()
      const exitP = clamp(-r.top / wh, 0, 1)
      const offset = t.slide.offset ?? 500
      const dir = t.slide.exitDir === "right" ? 1 : -1
      t.slide.el.style.transform = `translateX(${exitP * dir * offset}px)`
    }
  }
}

let tickerStarted = false

function startTicker() {
  if (!tickerStarted && typeof window !== "undefined") {
    tickerStarted = true
    gsap.ticker.add(animate)
  }
}

export function registerTargets(target: AnimationTargets) {
  targets.push(target)
  startTicker()

  return () => {
    const i = targets.indexOf(target)
    if (i !== -1) targets.splice(i, 1)
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function smoothScrollTo(container: HTMLElement, targetY: number, duration = 800): Promise<void> {
  return new Promise((resolve) => {
    const startY = container.scrollTop
    const diff = targetY - startY
    if (Math.abs(diff) < 1) { resolve(); return }
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      container.scrollTop = startY + diff * easeInOutCubic(progress)
      if (progress < 1) requestAnimationFrame(step)
      else resolve()
    }

    requestAnimationFrame(step)
  })
}
