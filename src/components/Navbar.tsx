"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

interface NavbarProps {
  current: number
  slides: { type: string; id?: string }[]
  onClick: (index: number) => void
  page: "home" | "about" | "portfolio"
}

const navItems = [
  { label: "Home", index: 0 },
  { label: "About Us", index: 1 },
  { label: "Portfolio", index: 13 },
  { label: "Contact", index: 16 },
]

const homeIndices: Record<string, number> = {
  Home: 0,
  Contact: 2,
}

export default function Navbar({ current, slides, onClick, page }: NavbarProps) {
  const router = useRouter()

  const handleClick = (label: string, origIdx: number) => {
    if (label === "About Us") {
      if (page === "home") {
        router.push("/about")
      } else if (page === "about") {
        onClick(0)
      } else {
        router.push("/about")
      }
    } else if (label === "Portfolio") {
      if (page === "home") {
        router.push("/portfolio")
      } else if (page === "portfolio") {
        onClick(0)
      } else {
        router.push("/portfolio")
      }
    } else {
      if (page === "home") {
        onClick(origIdx)
      } else {
        const homeIdx = homeIndices[label]
        router.push(homeIdx !== undefined ? `/?to=${homeIdx}` : "/")
      }
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => handleClick("Home", 0)}>
        <Image
          alt="Elevate"
          src="/ELEVATE.png"
          width={56}
          height={56}
          style={{ opacity: 0.9 }}
        />
        Elevate
      </div>

      <div className="navbar-links">
        {navItems.map((item, i) => (
          <button
            key={i}
            className={
              (page === "home" && current === item.index) ||
              (page === "about" && item.label === "About Us") ||
              (page === "portfolio" && item.label === "Portfolio")
                ? "active"
                : ""
            }
            onClick={() => handleClick(item.label, item.index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button className="navbar-mobile" onClick={() => {
        const next = navItems.find(item => item.index > current)
        handleClick(next ? next.label : "Home", next ? next.index : 0)
      }}>
        Menu
      </button>
    </nav>
  )
}
