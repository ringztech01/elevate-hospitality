"use client"

import Image from "next/image"

interface NavbarProps {
  current: number
  onClick: (index: number) => void
}

const navItems = [
  { label: "Home", index: 0 },
  { label: "Contact", index: 1 },
]

export default function Navbar({ current, onClick }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => onClick(0)}>
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
            className={current === item.index ? "active" : ""}
            onClick={() => onClick(item.index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button className="navbar-mobile" onClick={() => {
        const next = navItems.find(item => item.index > current)
        onClick(next ? next.index : navItems[0].index)
      }}>
        Menu
      </button>
    </nav>
  )
}
