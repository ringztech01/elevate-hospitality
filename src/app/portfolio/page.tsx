"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import PortfolioSection from "@/components/PortfolioSection"

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

export default function Portfolio() {
  const [current] = useState(0)
  const slides = [{ type: "portfolio" }]

  return (
    <>
      <Navbar current={current} slides={slides} onClick={() => {}} page="portfolio" />
      <div className="slide-container">
        <div className="slide">
          <PortfolioSection projects={projects} isCurrent={true} />
        </div>
      </div>
    </>
  )
}
