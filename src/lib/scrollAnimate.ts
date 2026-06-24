"use client"

type AnimationTargets = {
  section: HTMLElement
  reveal: HTMLElement | null
  video: HTMLElement | null
  isStatement: boolean
}

const targets: AnimationTargets[] = []
let running = false

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
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
  }

  requestAnimationFrame(animate)
}

export function registerTargets(target: AnimationTargets) {
  targets.push(target)
  if (!running) {
    running = true
    requestAnimationFrame(animate)
  }

  return () => {
    const i = targets.indexOf(target)
    if (i !== -1) targets.splice(i, 1)
  }
}

export function smoothScrollTo(container: HTMLElement, targetY: number, duration = 800) {
  const startY = container.scrollTop
  const diff = targetY - startY
  if (Math.abs(diff) < 1) return
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    container.scrollTop = startY + diff * easeInOutCubic(progress)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}
