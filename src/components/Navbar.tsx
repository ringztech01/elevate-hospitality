"use client"

import { useState } from "react"
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
]

const homeIndices: Record<string, number> = {
  Home: 0,
}

export default function Navbar({ current, slides, onClick, page }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleClick = (label: string, origIdx: number) => {
    setMenuOpen(false)
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
        <img
          alt="Elevate"
          src="/logo-nav.webp"
          style={{ width: "auto", height: "40px", opacity: 0.9 }}
        />
        <img
          alt="Elevate"
          src="/elevate_text.png"
          style={{ width: "auto",           height: "68px", opacity: 0.9 }}
        />
        <span style={{ display: "none" }}>Elevate</span>
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

      <button className="navbar-mobile" onClick={() => setMenuOpen(!menuOpen)}>
        <span style={{ opacity: menuOpen ? 0.4 : 1 }}>Menu</span>
      </button>

      {menuOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          top: "60px",
          zIndex: 999,
          background: "rgba(0,0,0,0.97)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
        }}>
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleClick(item.label, item.index)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "1.4rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0.5rem 1rem",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
