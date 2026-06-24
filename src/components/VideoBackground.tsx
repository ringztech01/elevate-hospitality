"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

interface VideoBackgroundProps {
  src: string
  active: boolean
}

export default function VideoBackground({ src, active }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const setup = () => {
    const video = videoRef.current
    if (!video) return

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      video.play().catch(() => {})
    } else if (Hls.isSupported()) {
      hlsRef.current = new Hls()
      hlsRef.current.loadSource(src)
      hlsRef.current.attachMedia(video)
    }
  }

  const teardown = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.removeAttribute("src")
    video.load()
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
  }

  useEffect(() => {
    if (active) setup()
    else teardown()
    return teardown
  }, [active, src])

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  )
}
